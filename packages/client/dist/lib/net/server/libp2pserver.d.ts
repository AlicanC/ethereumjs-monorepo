import PeerId from 'peer-id';
import multiaddr from 'multiaddr';
import { Libp2pConnection as Connection } from '../../types';
import { Libp2pPeer } from '../peer';
import { Server, ServerOptions } from './server';
export interface Libp2pServerOptions extends ServerOptions {
    multiaddrs?: multiaddr[];
}
/**
 * Libp2p server
 * @emits connected
 * @emits disconnected
 * @emits error
 * @memberof module:net/server
 */
export declare class Libp2pServer extends Server {
    private peers;
    private banned;
    private multiaddrs;
    private node;
    /**
     * Create new DevP2P/RLPx server
     * @param {Libp2pServerOptions}
     */
    constructor(options: Libp2pServerOptions);
    /**
     * Server name
     * @type {string}
     */
    get name(): string;
    /**
     * Start Libp2p server. Returns a promise that resolves once server has been started.
     * @return Resolves with true if server successfully started
     */
    start(): Promise<boolean>;
    /**
     * Stop Libp2p server. Returns a promise that resolves once server has been stopped.
     */
    stop(): Promise<boolean>;
    /**
     * Ban peer for a specified time
     * @param peerId id of peer
     * @param maxAge how long to ban peer (default: 60s)
     */
    ban(peerId: string, maxAge?: number): boolean;
    /**
     * Check if peer is currently banned
     * @param  peerId id of peer
     * @return true if banned
     */
    isBanned(peerId: string): boolean;
    /**
     * Handles errors from server and peers
     * @private
     * @param  error
     * @emits  error
     */
    error(error: Error): void;
    getPeerId(): Promise<PeerId>;
    getPeerInfo(connection: Connection): [PeerId, multiaddr];
    createPeer(peerId: PeerId, multiaddrs?: multiaddr[]): Libp2pPeer;
}
