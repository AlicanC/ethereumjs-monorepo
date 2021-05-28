/// <reference types="node" />
import { EventEmitter } from 'events';
import { Config } from '../config';
import { Peer } from './peer/peer';
export interface PeerPoolOptions {
    config: Config;
}
/**
 * @module net
 */
/**
 * Pool of connected peers
 * @memberof module:net
 * @emits connected
 * @emits disconnected
 * @emits banned
 * @emits added
 * @emits removed
 * @emits message
 * @emits message:{protocol}
 * @emits error
 */
export declare class PeerPool extends EventEmitter {
    config: Config;
    private pool;
    private noPeerPeriods;
    private opened;
    private _statusCheckInterval;
    /**
     * Create new peer pool
     * @param {Object}   options constructor parameters
     */
    constructor(options: PeerPoolOptions);
    init(): void;
    /**
     * Open pool
     * @return {Promise}
     */
    open(): Promise<boolean | void>;
    /**
     * Close pool
     * @return {Promise}
     */
    close(): Promise<void>;
    /**
     * Connected peers
     */
    get peers(): Peer[];
    /**
     * Number of peers in pool
     * @type {number}
     */
    get size(): number;
    /**
     * Return true if pool contains the specified peer
     * @param peer object or peer id
     */
    contains(peer: Peer | string): boolean;
    /**
     * Returns a random idle peer from the pool
     * @param [filterFn] filter function to apply before finding idle peers
     * @return {Peer}
     */
    idle(filterFn?: (_peer: Peer) => boolean): Peer;
    /**
     * Handler for peer connections
     * @private
     * @param  {Peer} peer
     */
    connected(peer: Peer): void;
    /**
     * Handler for peer disconnections
     * @private
     * @param  {Peer} peer
     */
    disconnected(peer: Peer): void;
    /**
     * Ban peer from being added to the pool for a period of time
     * @param  {Peer} peer
     * @param  maxAge ban period in milliseconds
     * @emits  banned
     */
    ban(peer: Peer, maxAge?: number): void;
    /**
     * Add peer to pool
     * @param  {Peer} peer
     * @emits added
     * @emits message
     * @emits message:{protocol}
     */
    add(peer?: Peer): void;
    /**
     * Remove peer from pool
     * @param  {Peer} peer
     * @emits removed
     */
    remove(peer?: Peer): void;
    /**
     * Peer pool status check on a repeated interval
     */
    _statusCheck(): Promise<void>;
}
