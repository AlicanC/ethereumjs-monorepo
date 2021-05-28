import { RLPx as Devp2pRLPx, DPT as Devp2pDPT } from '@ethereumjs/devp2p';
import { RlpxPeer } from '../peer/rlpxpeer';
import { Server, ServerOptions } from './server';
export interface RlpxServerOptions extends ServerOptions {
    clientFilter?: string[];
}
/**
 * DevP2P/RLPx server
 * @emits connected
 * @emits disconnected
 * @emits error
 * @memberof module:net/server
 */
export declare class RlpxServer extends Server {
    private peers;
    discovery: boolean;
    private clientFilter;
    rlpx: Devp2pRLPx | null;
    dpt: Devp2pDPT | null;
    ip: string;
    /**
     * Create new DevP2P/RLPx server
     * @param {RlpxServerOptions}
     */
    constructor(options: RlpxServerOptions);
    /**
     * Server name
     * @type {string}
     */
    get name(): string;
    /**
     * Return Rlpx info
     */
    getRlpxInfo(): {
        enode: undefined;
        id: undefined;
        ip: string;
        listenAddr: string;
        ports: {
            discovery: number | undefined;
            listener: number | undefined;
        };
    } | {
        enode: string;
        id: string;
        ip: string;
        listenAddr: string;
        ports: {
            discovery: number | undefined;
            listener: number | undefined;
        };
    };
    /**
     * Start Devp2p/RLPx server. Returns a promise that resolves once server has been started.
     * @return Resolves with true if server successfully started
     */
    start(): Promise<boolean>;
    /**
     * Bootstrap bootnode and DNS mapped peers from the network
     */
    bootstrap(): Promise<void>;
    /**
     * Stop Devp2p/RLPx server. Returns a promise that resolves once server has been stopped.
     */
    stop(): Promise<boolean>;
    /**
     * Ban peer for a specified time
     * @param  peerId id of peer
     * @param  [maxAge] how long to ban peer
     * @return True if ban was successfully executed
     */
    ban(peerId: string, maxAge?: number): boolean;
    /**
     * Handles errors from server and peers
     * @private
     * @param  error
     * @param  {Peer} peer
     * @emits  error
     */
    error(error: Error, peer?: RlpxPeer): void;
    /**
     * Initializes DPT for peer discovery
     * @private
     */
    initDpt(): Promise<void>;
    /**
     * Initializes RLPx instance for peer management
     * @private
     */
    initRlpx(): Promise<void>;
}
