"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libp2pPeer = void 0;
const multiaddr_1 = __importDefault(require("multiaddr"));
const peer_id_1 = __importDefault(require("peer-id"));
const libp2psender_1 = require("../protocol/libp2psender");
const peer_1 = require("./peer");
const libp2pnode_1 = require("./libp2pnode");
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
class Libp2pPeer extends peer_1.Peer {
    /**
     * Create new libp2p peer
     * @param {Libp2pPeerOptions}
     */
    constructor(options) {
        var _a;
        const multiaddrs = (_a = options.multiaddrs) !== null && _a !== void 0 ? _a : [multiaddr_1.default('/ip4/0.0.0.0/tcp/0')];
        const address = multiaddrs.map((ma) => ma.toString().split('/p2p')[0]).join(',');
        super(Object.assign(Object.assign({}, options), { transport: 'libp2p', address }));
        this.multiaddrs = multiaddrs;
        this.connected = false;
    }
    /**
     * Initiate peer connection
     * @return {Promise}
     */
    async connect() {
        if (this.connected) {
            return;
        }
        const peerId = peer_id_1.default.createFromB58String(this.id);
        const addresses = { listen: ['/ip4/0.0.0.0/tcp/0'] };
        const node = new libp2pnode_1.Libp2pNode({ peerId, addresses });
        await node.start();
        for (const ma of this.multiaddrs) {
            await node.dial(ma);
            await this.bindProtocols(node, ma);
        }
        this.emit('connected');
    }
    /**
     * Accept new peer connection from a libp2p server
     * @private
     * @return {Promise}
     */
    async accept(protocol, stream, server) {
        await this.bindProtocol(protocol, new libp2psender_1.Libp2pSender(stream));
        this.inbound = true;
        this.server = server;
    }
    /**
     * Adds protocols to the peer given a libp2p node and peerId or multiaddr
     * @private
     * @param node libp2p node
     * @param peer libp2p peerId or mutliaddr
     * @param server server that initiated connection
     */
    async bindProtocols(node, peer, server) {
        await Promise.all(this.protocols.map(async (p) => {
            await p.open();
            const protocol = `/${p.name}/${p.versions[0]}`;
            try {
                const { stream } = await node.dialProtocol(peer, protocol);
                await this.bindProtocol(p, new libp2psender_1.Libp2pSender(stream));
            }
            catch (err) {
                const peerInfo = peer instanceof peer_id_1.default ? `id=${peer.toB58String()}` : `multiaddr=${peer.toString()}`;
                this.config.logger.debug(`Peer doesn't support protocol=${protocol} ${peerInfo} ${err.stack}`);
            }
        }));
        this.server = server;
        this.connected = true;
    }
}
exports.Libp2pPeer = Libp2pPeer;
//# sourceMappingURL=libp2ppeer.js.map