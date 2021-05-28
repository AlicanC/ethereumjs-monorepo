import { Block } from '@ethereumjs/block';
import { Peer } from '../../net/peer';
import { Job } from './types';
import { BlockFetcherBase, JobTask, BlockFetcherOptions } from './blockfetcherbase';
/**
 * Implements an eth/62 based block fetcher
 * @memberof module:sync/fetcher
 */
export declare class BlockFetcher extends BlockFetcherBase<Block[], Block> {
    /**
     * Create new block fetcher
     * @param {BlockFetcherOptions}
     */
    constructor(options: BlockFetcherOptions);
    /**
     * Generate list of tasks to fetch
     * @return {Object[]} tasks
     */
    tasks(): JobTask[];
    /**
     * Requests blocks associated with this job
     * @param job
     */
    request(job: Job<JobTask, Block[], Block>): Promise<Block[]>;
    /**
     * Process fetch result
     * @param  job fetch job
     * @param  result fetch result
     * @return {*} results of processing job or undefined if job not finished
     */
    process(job: Job<JobTask, Block[], Block>, result: Block[]): Block[] | undefined;
    /**
     * Store fetch result. Resolves once store operation is complete.
     * @param {Block[]} blocks fetch result
     * @return {Promise}
     */
    store(blocks: Block[]): Promise<void>;
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    peer(): Peer;
}
