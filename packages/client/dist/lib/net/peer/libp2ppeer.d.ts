import multiaddr from 'multiaddr';
import PeerId from 'peer-id';
import { Libp2pMuxedStream as MuxedStream } from '../../types';
import { Peer, PeerOptions } from './peer';
import { Libp2pNode } from './libp2pnode';
import { Protocol } from '../protocol';
import { Libp2pServer } from '../server';
export interface Libp2pPeerOptions extends Omit<PeerOptions, 'address' | 'transport'> {
    multiaddrs?: multiaddr[];
}
/**
 * Libp2p peer
 * @memberof module:net/peer
 * @example
 *
 * import multiaddr from 'multiaddr'
 * import { Libp2pPeer } from './lib/net/peer'
 * import { Chain } from './lib/blockchain'
 * import { EthProtocol } from './lib/net/protocol'
 *
 * const chain = new Chain()
 * const protocols = [new EthProtocol({ chain })]
 * const id = 'QmWYhkpLFDhQBwHCMSWzEebbJ5JzXWBKLJxjEuiL8wGzUu'
 * const multiaddrs = [multiaddr('/ip4/192.0.2.1/tcp/12345')]
 *
 * new Libp2pPeer({ id, multiaddrs, protocols })
 *   .on('error', (err) => console.log('Error: ', err))
 *   .on('connected', () => console.log('Connected'))
 *   .on('disconnected', (reason) => console.log('Disconnected: ', reason))
 *   .connect()
 */
export declare class Libp2pPeer extends Peer {
    private multiaddrs;
    private connected;
    /**
     * Create new libp2p peer
     * @param {Libp2pPeerOptions}
     */
    constructor(options: Libp2pPeerOptions);
    /**
     * Initiate peer connection
     * @return {Promise}
     */
    connect(): Promise<void>;
    /**
     * Accept new peer connection from a libp2p server
     * @private
     * @return {Promise}
     */
    accept(protocol: Protocol, stream: MuxedStream, server: Libp2pServer): Promise<void>;
    /**
     * Adds protocols to the peer given a libp2p node and peerId or multiaddr
     * @private
     * @param node libp2p node
     * @param peer libp2p peerId or mutliaddr
     * @param server server that initiated connection
     */
    bindProtocols(node: Libp2pNode, peer: PeerId | multiaddr, server?: Libp2pServer): Promise<void>;
}
