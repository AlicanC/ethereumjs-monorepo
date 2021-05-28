import { Peer } from '../net/peer/peer';
import { Synchronizer, SynchronizerOptions } from './sync';
import { VMExecution } from './execution/vmexecution';
/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
export declare class FullSynchronizer extends Synchronizer {
    private blockFetcher;
    execution: VMExecution;
    constructor(options: SynchronizerOptions);
    /**
     * Returns synchronizer type
     * @return {string} type
     */
    get type(): string;
    /**
     * Returns true if peer can be used for syncing
     * @return {boolean}
     */
    syncable(peer: Peer): boolean;
    /**
     * Finds the best peer to sync with. We will synchronize to this peer's
     * blockchain. Returns null if no valid peer is found
     */
    best(): Peer | undefined;
    /**
     * Get latest header of peer
     * @return {Promise} Resolves with header
     */
    latest(peer: Peer): Promise<import("@ethereumjs/block").BlockHeader | undefined>;
    /**
     * Sync all blocks and state from peer starting from current height.
     * @param  peer remote peer to sync with
     * @return Resolves when sync completed
     */
    syncWithPeer(peer?: Peer): Promise<boolean>;
    /**
     * Fetch all blocks from current height up to highest found amongst peers
     * @return Resolves with true if sync successful
     */
    sync(): Promise<boolean>;
    /**
     * Chain was updated
     * @param  {Object[]} announcements new block hash announcements
     * @param  {Peer}     peer peer
     * @return {Promise}
     */
    announced(announcements: any[], _peer: Peer): Promise<void>;
    /**
     * Open synchronizer. Must be called before sync() is called
     */
    open(): Promise<void>;
    /**
     * Stop synchronization. Returns a promise that resolves once its stopped.
     * @return {Promise}
     */
    stop(): Promise<boolean>;
}
