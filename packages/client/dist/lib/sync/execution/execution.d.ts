/// <reference types="node" />
import { EventEmitter } from 'events';
import { Config } from '../../config';
import { LevelUp } from 'levelup';
import { Chain } from '../../blockchain';
export interface ExecutionOptions {
    config: Config;
    stateDB?: LevelUp;
    /** Chain */
    chain: Chain;
}
export declare abstract class Execution extends EventEmitter {
    config: Config;
    protected stateDB?: LevelUp;
    protected chain: Chain;
    running: boolean;
    /**
     * Create new excution module
     * @memberof module:sync/execution
     */
    constructor(options: ExecutionOptions);
    /**
     * Runs an execution
     *
     * @returns number quantifying execution run
     */
    abstract run(): Promise<number>;
    /**
     * Stop execution. Returns a promise that resolves once stopped.
     */
    stop(): Promise<boolean>;
}
