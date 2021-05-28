import { Peer } from '../net/peer/peer';
import { Synchronizer, SynchronizerOptions } from './sync';
/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
export declare class LightSynchronizer extends Synchronizer {
    private headerFetcher;
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
     * Sync all headers and state from peer starting from current height.
     * @param  peer remote peer to sync with
     * @return Resolves when sync completed
     */
    syncWithPeer(peer?: Peer): Promise<boolean>;
    /**
     * Fetch all headers from current height up to highest found amongst peers
     * @return Resolves with true if sync successful
     */
    sync(): Promise<boolean>;
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
