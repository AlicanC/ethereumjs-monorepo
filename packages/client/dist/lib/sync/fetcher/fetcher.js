"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const stream_1 = require("stream");
const Heap = require('qheap');
/**
 * Base class for fetchers that retrieve various data from peers. Subclasses must
 * request(), process() and store() methods. Tasks can be arbitrary objects whose structure
 * is defined by subclasses. A priority queue is used to ensure tasks are fetched
 * inorder. Three types need to be provided: the JobTask, which describes a task the job should perform,
 * a JobResult, which is the direct result when a Peer replies to a Task, and a StorageItem, which
 * represents the to-be-stored items.
 * @memberof module:sync/fetcher
 */
class Fetcher extends stream_1.Readable {
    /**
     * Create new fetcher
     * @param {FetcherOptions}
     */
    constructor(options) {
        var _a, _b, _c, _d, _e;
        super(Object.assign(Object.assign({}, options), { objectMode: true }));
        this.config = options.config;
        this.pool = options.pool;
        this.timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : 8000;
        this.interval = (_b = options.interval) !== null && _b !== void 0 ? _b : 1000;
        this.banTime = (_c = options.banTime) !== null && _c !== void 0 ? _c : 60000;
        this.maxQueue = (_d = options.maxQueue) !== null && _d !== void 0 ? _d : 16;
        this.maxPerRequest = (_e = options.maxPerRequest) !== null && _e !== void 0 ? _e : 50;
        this.in = new Heap({
            comparBefore: (a, b) => a.index < b.index,
        });
        this.out = new Heap({
            comparBefore: (a, b) => a.index < b.index,
        });
        this.total = 0;
        this.processed = 0;
        this.finished = 0;
        this.running = false;
        this.reading = false;
    }
    /**
     * Generate list of tasks to fetch
     * @return {Object[]} tasks
     */
    tasks() {
        return [];
    }
    /**
     * Enqueue job
     * @param job
     */
    enqueue(job) {
        if (this.running) {
            this.in.insert(Object.assign(Object.assign({}, job), { time: Date.now(), state: 'idle' }));
        }
    }
    /**
     * Dequeue all done tasks that completed in order
     */
    dequeue() {
        for (let f = this.out.peek(); f && f.index === this.processed;) {
            this.processed++;
            const { result } = this.out.remove();
            if (!this.push(result)) {
                return;
            }
            f = this.out.peek();
        }
    }
    /**
     * Implements Readable._read() by pushing completed tasks to the read queue
     */
    _read() {
        this.dequeue();
    }
    /**
     * handle successful job completion
     * @private
     * @param  job successful job
     * @param  result job result
     */
    success(job, result) {
        if (job.state !== 'active')
            return;
        if (result === undefined) {
            this.enqueue(job);
            // TODO: should this promise actually float?
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.wait().then(() => {
                job.peer.idle = true;
            });
        }
        else {
            job.peer.idle = true;
            job.result = this.process(job, result);
            if (job.result) {
                this.out.insert(job);
                this.dequeue();
            }
            else {
                this.enqueue(job);
            }
        }
        this.next();
    }
    /**
     * handle failed job completion
     * @private
     * @param  job failed job
     * @param  [error] error
     */
    failure(job, error) {
        if (job.state !== 'active')
            return;
        job.peer.idle = true;
        this.pool.ban(job.peer, this.banTime);
        this.enqueue(job);
        if (error) {
            this.error(error, job);
        }
        this.next();
    }
    /**
     * Process next task
     */
    next() {
        const job = this.in.peek();
        if (!job ||
            this._readableState.length > this.maxQueue ||
            job.index > this.processed + this.maxQueue ||
            this.processed === this.total) {
            return false;
        }
        const peer = this.peer();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (peer) {
            peer.idle = false;
            this.in.remove();
            job.peer = peer;
            job.state = 'active';
            const timeout = setTimeout(() => {
                this.expire(job);
            }, this.timeout);
            this.request(job, peer)
                .then((result) => this.success(job, result))
                .catch((error) => this.failure(job, error))
                .finally(() => clearTimeout(timeout));
            return job;
        }
    }
    /**
     * Handle error
     * @param  {Error}  error error object
     * @param  {Object} job  task
     */
    error(error, job) {
        if (this.running) {
            this.emit('error', error, job && job.task, job && job.peer);
        }
    }
    /**
     * Setup writer pipe and start writing fetch results. A pipe is used in order
     * to support backpressure from storing results.
     */
    write() {
        const _write = async (result, encoding, cb) => {
            try {
                await this.store(result);
                this.finished++;
                this.emit('fetched', result);
                cb();
            }
            catch (error) {
                cb(error);
            }
        };
        const writer = new stream_1.Writable({
            objectMode: true,
            write: _write,
            writev: (many, cb) => _write([].concat(...many.map((x) => x.chunk)), null, cb),
        });
        this.on('close', () => {
            this.running = false;
            writer.destroy();
        })
            .pipe(writer)
            .on('finish', () => {
            this.running = false;
        })
            .on('error', (error) => {
            this.error(error);
            this.running = false;
            writer.destroy();
        });
    }
    /**
     * Run the fetcher. Returns a promise that resolves once all tasks are completed.
     * @return {Promise}
     */
    async fetch() {
        if (this.running) {
            return false;
        }
        this.write();
        this.tasks().forEach((task) => {
            const job = {
                task,
                time: Date.now(),
                index: this.total++,
                state: 'idle',
                peer: null,
            };
            this.in.insert(job);
        });
        this.running = true;
        while (this.running) {
            if (!this.next()) {
                if (this.finished === this.total) {
                    this.push(null);
                }
                await this.wait();
            }
        }
        this.destroy();
    }
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    // TODO: what is job supposed to be?
    peer(_job) {
        return this.pool.idle();
    }
    /**
     * Expire job that has timed out and ban associated peer. Timed out tasks will
     * be re-inserted into the queue.
     */
    expire(job) {
        job.state = 'expired';
        if (this.pool.contains(job.peer)) {
            this.config.logger.debug(`Task timed out for peer (banning) ${JSON.stringify(job.task)} ${job.peer}`);
            this.pool.ban(job.peer, this.banTime);
        }
        else {
            this.config.logger.debug(`Peer disconnected while performing task ${JSON.stringify(job.task)} ${job.peer}`);
        }
        this.enqueue(job);
    }
    async wait(delay) {
        await new Promise((resolve) => setTimeout(resolve, delay || this.interval));
    }
}
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map