"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderFetcher = void 0;
const blockfetcherbase_1 = require("./blockfetcherbase");
/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync/fetcher
 */
class HeaderFetcher extends blockfetcherbase_1.BlockFetcherBase {
    /**
     * Create new header fetcher
     * @param {HeaderFetcherOptions}
     */
    constructor(options) {
        super(options);
        this.flow = options.flow;
    }
    /**
     * Requests block headers for the given task
     * @param job
     */
    async request(job) {
        const { task, peer } = job;
        if (this.flow.maxRequestCount(peer, 'GetBlockHeaders') < this.maxPerRequest) {
            // we reached our request limit. try with a different peer.
            return;
        }
        const response = await peer.les.getBlockHeaders({
            block: task.first,
            max: task.count,
        });
        return response;
    }
    /**
     * Process fetch result
     * @param  job fetch job
     * @param  result fetch result
     * @return {*} results of processing job or undefined if job not finished
     */
    process(job, result) {
        this.flow.handleReply(job.peer, result.bv.toNumber());
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (result.headers && result.headers.length === job.task.count) {
            return result.headers;
        }
        return;
    }
    /**
     * Store fetch result. Resolves once store operation is complete.
     * @param {Header[]} headers fetch result
     * @return {Promise}
     */
    async store(headers) {
        await this.chain.putHeaders(headers);
    }
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    // TODO: what is job supposed to be?
    peer(_job) {
        return this.pool.idle((p) => p.les && p.les.status.serveHeaders);
    }
}
exports.HeaderFetcher = HeaderFetcher;
//# sourceMappingURL=headerfetcher.js.map