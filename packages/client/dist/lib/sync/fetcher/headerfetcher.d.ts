/// <reference types="bn.js" />
import { BlockFetcherBase, BlockFetcherOptions, JobTask } from './blockfetcherbase';
import { Peer } from '../../net/peer';
import { FlowControl } from '../../net/protocol';
import { BlockHeader } from '@ethereumjs/block';
import { Job } from './types';
import { BN } from 'ethereumjs-util';
export interface HeaderFetcherOptions extends BlockFetcherOptions {
    flow: FlowControl;
}
declare type BlockHeaderResult = {
    reqId: BN;
    bv: BN;
    headers: BlockHeader[];
};
/**
 * Implements an les/1 based header fetcher
 * @memberof module:sync/fetcher
 */
export declare class HeaderFetcher extends BlockFetcherBase<BlockHeaderResult, BlockHeader> {
    private flow;
    /**
     * Create new header fetcher
     * @param {HeaderFetcherOptions}
     */
    constructor(options: any);
    /**
     * Requests block headers for the given task
     * @param job
     */
    request(job: Job<JobTask, BlockHeaderResult, BlockHeader>): Promise<{
        reqId: BN;
        bv: BN;
        headers: BlockHeader[];
    } | undefined>;
    /**
     * Process fetch result
     * @param  job fetch job
     * @param  result fetch result
     * @return {*} results of processing job or undefined if job not finished
     */
    process(job: Job<JobTask, BlockHeaderResult, BlockHeader>, result: BlockHeaderResult): BlockHeader[] | undefined;
    /**
     * Store fetch result. Resolves once store operation is complete.
     * @param {Header[]} headers fetch result
     * @return {Promise}
     */
    store(headers: BlockHeader[]): Promise<void>;
    /**
     * Returns a peer that can process the given job
     * @param  job job
     * @return {Peer}
     */
    peer(_job: Job<JobTask, BlockHeaderResult, BlockHeader>): Peer;
}
export {};
