import { Execution, ExecutionOptions } from './execution';
import VM from '@ethereumjs/vm';
export declare class VMExecution extends Execution {
    vm: VM;
    hardfork: string;
    syncing: boolean;
    private vmPromise?;
    private NUM_BLOCKS_PER_ITERATION;
    /**
     * Create new VM excution module
     */
    constructor(options: ExecutionOptions);
    /**
     * Initializes VM execution. Must be called before run() is called
     */
    open(): Promise<void>;
    /**
     * Runs the VM execution
     *
     * @returns number of blocks executed
     */
    run(): Promise<number>;
    /**
     * Stop VM execution. Returns a promise that resolves once its stopped.
     * @returns {Promise}
     */
    stop(): Promise<boolean>;
}
