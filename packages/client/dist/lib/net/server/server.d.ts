/// <reference types="node" />
import { EventEmitter } from 'events';
import multiaddr from 'multiaddr';
import { Config } from '../../config';
import { MultiaddrLike, KeyLike, DnsNetwork } from '../../types';
import { Protocol } from '../protocol/protocol';
export interface ServerOptions {
    config: Config;
    refreshInterval?: number;
    key?: KeyLike;
    bootnodes?: MultiaddrLike;
    dnsNetworks?: DnsNetwork[];
}
/**
 * Base class for transport specific server implementations.
 * @memberof module:net/server
 */
export declare class Server extends EventEmitter {
    config: Config;
    key: Buffer;
    bootnodes: multiaddr[];
    dnsNetworks: DnsNetwork[];
    protected refreshInterval: number;
    protected protocols: Set<Protocol>;
    started: boolean;
    /**
     * Create new server
     * @param {ServerOptions}
     */
    constructor(options: ServerOptions);
    get name(): string;
    /**
     * Check if server is running
     */
    get running(): boolean;
    /**
     * Start server. Returns a promise that resolves once server has been started.
     * @return Resolves with true if server successfully started
     */
    start(): Promise<boolean>;
    /**
     * Server bootstrap.
     * In Libp2p this is done during server start.
     */
    bootstrap(): Promise<void>;
    /**
     * Stop server. Returns a promise that resolves once server has been stopped.
     */
    stop(): Promise<boolean>;
    /**
     * Specify which protocols the server must support
     * @param protocols protocol classes
     * @return True if protocol added successfully
     */
    addProtocols(protocols: Protocol[]): boolean;
    /**
     * Ban peer for a specified time
     * @protected
     * @param  peerId id of peer
     * @param  maxAge how long to ban peer
     * @return {Promise}
     */
    ban(_peerId: string, _maxAge: number): void;
}
