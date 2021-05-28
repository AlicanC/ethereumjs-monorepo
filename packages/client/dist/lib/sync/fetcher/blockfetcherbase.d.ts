/// <reference types="bn.js" />
import { Fetcher, FetcherOptions } from './fetcher';
import { BN } from 'ethereumjs-util';
import { Chain } from '../../blockchain';
export interface BlockFetcherOptions extends FetcherOptions {
    chain: Chain;
    first: BN;
    count: BN;
}
export declare type JobTask = {
    first: BN;
    count: number;
};
export declare abstract class BlockFetcherBase<JobResult, StorageItem> extends Fetcher<JobTask, JobResult, StorageItem> {
    protected chain: Chain;
    protected first: BN;
    protected count: BN;
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
}
