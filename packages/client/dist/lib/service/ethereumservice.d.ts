import { LevelUp } from 'levelup';
import { FlowControl } from '../net/protocol/flowcontrol';
import { Chain } from '../blockchain';
import { Service, ServiceOptions } from './service';
import { Synchronizer } from '../sync';
export interface EthereumServiceOptions extends ServiceOptions {
    chain?: Chain;
    chainDB?: LevelUp;
    stateDB?: LevelUp;
    interval?: number;
    timeout?: number;
}
/**
 * Ethereum service
 * @memberof module:service
 */
export declare class EthereumService extends Service {
    flow: FlowControl;
    chain: Chain;
    interval: number;
    timeout: number;
    synchronizer: Synchronizer;
    /**
     * Create new ETH service
     * @param {EthereumServiceOptions}
     */
    constructor(options: EthereumServiceOptions);
    /**
     * Service name
     * @protected
     * @type {string}
     */
    get name(): string;
    /**
     * Open eth service. Must be called before service is started
     * @return {Promise}
     */
    open(): Promise<false | undefined>;
    /**
     * Starts service and ensures blockchain is synchronized. Returns a promise
     * that resolves once the service is started and blockchain is in sync.
     * @return {Promise}
     */
    start(): Promise<void | boolean>;
    /**
     * Stop service. Interrupts blockchain synchronization if its in progress.
     * @return {Promise}
     */
    stop(): Promise<void | boolean>;
}
