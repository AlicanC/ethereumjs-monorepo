/// <reference types="node" />
import { EventEmitter } from 'events';
import { PeerPool } from '../net/peerpool';
import { Peer } from '../net/peer/peer';
import { FlowControl } from '../net/protocol';
import { Config } from '../config';
import { Chain } from '../blockchain';
import { LevelUp } from 'levelup';
export interface SynchronizerOptions {
    config: Config;
    pool: PeerPool;
    chain: Chain;
    stateDB?: LevelUp;
    flow?: FlowControl;
    interval?: number;
}
/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
export declare abstract class Synchronizer extends EventEmitter {
    config: Config;
    protected pool: PeerPool;
    protected chain: Chain;
    protected flow: FlowControl;
    protected interval: number;
    running: boolean;
    protected forceSync: boolean;
    /**
     * Create new node
     * @param {SynchronizerOptions}
     */
    constructor(options: SynchronizerOptions);
    abstract sync(): Promise<boolean>;
    /**
     * Returns synchronizer type
     */
    get type(): string;
    /**
     * Open synchronizer. Must be called before sync() is called
     * @return {Promise}
     */
    open(): Promise<void>;
    /**
     * Returns true if peer can be used for syncing
     * @return {boolean}
     */
    syncable(_peer: Peer): boolean;
    /**
     * Start synchronization
     */
    start(): Promise<void | boolean>;
    /**
     * Stop synchronization. Returns a promise that resolves once stopped.
     */
    stop(): Promise<boolean>;
}
