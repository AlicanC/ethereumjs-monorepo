/// <reference types="node" />
import { Readable } from 'stream';
import { PeerPool } from '../../net/peerpool';
import { Config } from '../../config';
import { QHeap } from '../../types';
import { Job } from './types';
import { Peer } from '../../net/peer';
export interface FetcherOptions {
    config: Config;
    pool: PeerPool;
    timeout?: number;
    banTime?: number;
    maxQueue?: number;
    maxPerRequest?: number;
    interval?: number;
}
/**
 * Base class for fetchers that retrieve various data from peers. Subclasses must
 * request(), process() and store() methods. Tasks can be arbitrary objects whose structure
 * is defined by subclasses. A priority queue is used to ensure tasks are fetched
 * inorder. Three types need to be provided: the JobTask, which describes a task the job should perform,
 * a JobResult, which is the direct result when a Peer replies to a Task, and a StorageItem, which
 * represents the to-be-stored items.
 * @memberof module:sync/fetcher
 */
export declare abstract class Fetcher<JobTask, JobResult, StorageItem> extends Readable {
    config: Config;
    protected pool: PeerPool;
    protected timeout: number;
    protected interval: number;
    protected banTime: number;
    protected maxQueue: number;
    protected maxPerRequest: number;
    protected in: QHeap<Job<JobTask, JobResult, StorageItem>>;
    protected out: QHeap<Job<JobTask, JobResult, StorageItem>>;
    protected total: number;
    protected processed: number;
    protected finished: number;
    protected running: boolean;
    protected reading: boolean;
    private _readableState?;
    /**
     * Create new fetcher
     * @param {FetcherOptions}
     */
    constructor(options: FetcherOptions);
    /**
     * Request results from peer for the given job. Resolves with the raw result. If `undefined` is returned,
     * re-queue the job.
     * @param  job
     * @param  peer
     * @return {Promise}
     */
    abstract request(_job?: Job<JobTask, JobResult, StorageItem>, _peer?: Peer): Promise<JobResult | undefined>;
    /**
     * Process the reply for the given job. If the reply contains unexpected data, return `undefined`, this
     * re-queues the job.
     * @param  job fetch job
     * @param  result result data
     */
    abstract process(_job?: Job<JobTask, JobResult, StorageItem>, _result?: JobResult): StorageItem[] | undefined;
    /**
     * Store fetch result. Resolves once store operation is complete.
     * @param result fetch result
     * @return {Promise}
     */
    abstract store(_result: StorageItem[]): Promise<void>;
    /**
     * Generate list of tasks to fetch
     * @return {Object[]} tasks
     */
    tasks(): JobTask[];
    /**
     * Enqueue job
     * @param job
     */
    enqueue(job: Job<JobTask, JobResult, StorageItem>): void;
    /**
     * Dequeue all done tasks that completed in order
     */
    dequeue(): void;
    /**
     * Implements Readable._read() by pushing completed tasks to the read queue
     */
    _read(): void;
    /**
     * handle successful job completion
     * @private
     * @param  job successful job
     * @param  result job result
     */
    success(job: Job<JobTask, JobResult, StorageItem>, result?: JobResult): void;
    /**
     * handle failed job completion
     * @private
     * @param  job failed job
     * @param  [error] error
     */
    failure(job: Job<JobTask, JobResult, StorageItem>, error?: Error): void;
    /**
     * Process next task
     */
    next(): false | Job<JobTask, JobResult, StorageItem> | undefined;
    /**
     * Handle error
     * @param  {Error}  error error object
     * @param  {Object} job  task
     */
    error(error: Error, job?: Job<JobTask, JobResult, StorageItem>): void;
    /**
     * Setup writer pipe and start writing fetch results. A pipe is used in order
     * to support backpressure from storing results.
     */
    write(): void;
    /**
     * Run the fetcher. Returns a promise that resolves once all tasks are completed.
     * @return {Promise}
     */
    fetch(): Promise<false | undefined>;
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    peer(_job?: Job<JobTask, JobResult, StorageItem>): Peer;
    /**
     * Expire job that has timed out and ban associated peer. Timed out tasks will
     * be re-inserted into the queue.
     */
    expire(job: Job<JobTask, JobResult, StorageItem>): void;
    wait(delay?: number): Promise<void>;
}
