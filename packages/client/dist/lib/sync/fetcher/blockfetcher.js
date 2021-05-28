"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockFetcher = void 0;
const block_1 = require("@ethereumjs/block");
const blockfetcherbase_1 = require("./blockfetcherbase");
/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
class BlockFetcher extends blockfetcherbase_1.BlockFetcherBase {
    /**
     * Create new block fetcher
     * @param {BlockFetcherOptions}
     */
    constructor(options) {
        super(options);
    }
    /**
     * Generate list of tasks to fetch
     * @return {Object[]} tasks
     */
    tasks() {
        const { first, count } = this;
        const max = this.maxPerRequest;
        const tasks = [];
        while (count.gten(max)) {
            tasks.push({ first: first.clone(), count: max });
            first.iaddn(max);
            count.isubn(max);
        }
        if (count.gtn(0)) {
            tasks.push({ first: first.clone(), count: count.toNumber() });
        }
        return tasks;
    }
    /**
     * Requests blocks associated with this job
     * @param job
     */
    async request(job) {
        const { task, peer } = job;
        const { first, count } = task;
        const headers = await peer.eth.getBlockHeaders({
            block: first,
            max: count,
        });
        const bodies = (await peer.eth.getBlockBodies(headers.map((h) => h.hash())));
        const blocks = bodies.map(([txsData, unclesData], i) => {
            const opts = {
                common: this.config.chainCommon,
                hardforkByBlockNumber: true,
            };
            const values = [headers[i].raw(), txsData, unclesData];
            return block_1.Block.fromValuesArray(values, opts);
        });
        return blocks;
    }
    /**
     * Process fetch result
     * @param  job fetch job
     * @param  result fetch result
     * @return {*} results of processing job or undefined if job not finished
     */
    process(job, result) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (result && result.length === job.task.count) {
            return result;
        }
        return;
    }
    /**
     * Store fetch result. Resolves once store operation is complete.
     * @param {Block[]} blocks fetch result
     * @return {Promise}
     */
    async store(blocks) {
        await this.chain.putBlocks(blocks);
    }
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    // TODO: find out what _job is supposed to be doing here...
    peer() {
        return this.pool.idle((p) => p.eth);
    }
}
exports.BlockFetcher = BlockFetcher;
//# sourceMappingURL=blockfetcher.js.map