/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */
import multiaddr from 'multiaddr';
import LibP2p from 'libp2p';
import PeerId from 'peer-id';
export interface Libp2pNodeOptions {
    peerId: PeerId;
    addresses?: {
        listen?: string[];
        announce?: string[];
        announceFilter?: (ma: multiaddr[]) => multiaddr[];
    };
    bootnodes?: multiaddr[];
}
export declare class Libp2pNode extends LibP2p {
    constructor(options: Libp2pNodeOptions);
}
