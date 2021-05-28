import { Capabilities as Devp2pCapabilities, Peer as Devp2pRlpxPeer, RLPx as Devp2pRLPx } from '@ethereumjs/devp2p';
import { Protocol } from '../protocol';
import { Peer, PeerOptions } from './peer';
import { RlpxServer } from '../server';
export interface RlpxPeerOptions extends Omit<PeerOptions, 'address' | 'transport'> {
    host: string;
    port: number;
}
/**
 * Devp2p/RLPx peer
 * @memberof module:net/peer
 * @example
 *
 * import { RlpxPeer } from './lib/net/peer'
 * import { Chain } from './lib/blockchain'
 * import { EthProtocol } from './lib/net/protocol'
 *
 * const chain = new Chain()
 * const protocols = [ new EthProtocol({ chain })]
 * const id = '70180a7fcca96aa013a3609fe7c23cc5c349ba82652c077be6f05b8419040560a622a4fc197a450e5e2f5f28fe6227637ccdbb3f9ba19220d1fb607505ffb455'
 * const host = '192.0.2.1'
 * const port = 12345
 *
 * new RlpxPeer({ id, host, port, protocols })
 *   .on('error', (err) => console.log('Error:', err))
 *   .on('connected', () => console.log('Connected'))
 *   .on('disconnected', (reason) => console.log('Disconnected:', reason))
 *   .connect()
 */
export declare class RlpxPeer extends Peer {
    private host;
    private port;
    rlpx: Devp2pRLPx | null;
    rlpxPeer: Devp2pRlpxPeer | null;
    connected: boolean;
    /**
     * Create new devp2p/rlpx peer
     * @param {RlpxPeerOptions}
     */
    constructor(options: RlpxPeerOptions);
    /**
     * Return devp2p/rlpx capabilities for the specified protocols
     * @param  {Protocols[]} protocols protocol instances
     * @return {Object[]} capabilities
     */
    static capabilities(protocols: Protocol[]): Devp2pCapabilities[];
    /**
     * Initiate peer connection
     * @return {Promise}
     */
    connect(): Promise<void>;
    /**
     * Accept new peer connection from an rlpx server
     * @private
     * @return {Promise}
     */
    accept(rlpxPeer: Devp2pRlpxPeer, server: RlpxServer): Promise<void>;
    /**
     * Adds protocols to this peer given an rlpx native peer instance.
     * @private
     * @param  {Object}  rlpxPeer rlpx native peer
     * @return {Promise}
     */
    bindProtocols(rlpxPeer: Devp2pRlpxPeer): Promise<void>;
}
