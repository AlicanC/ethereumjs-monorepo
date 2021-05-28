"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libp2pServer = void 0;
const peer_id_1 = __importDefault(require("peer-id"));
const libp2p_crypto_1 = __importDefault(require("libp2p-crypto"));
const multiaddr_1 = __importDefault(require("multiaddr"));
const libp2pnode_1 = require("../peer/libp2pnode");
const peer_1 = require("../peer");
const server_1 = require("./server");
/**
 * Libp2p server
 * @emits connected
 * @emits disconnected
 * @emits error
 * @memberof module:net/server
 */
class Libp2pServer extends server_1.Server {
    /**
     * Create new DevP2P/RLPx server
     * @param {Libp2pServerOptions}
     */
    constructor(options) {
        var _a;
        super(options);
        this.peers = new Map();
        this.banned = new Map();
        this.multiaddrs = (_a = options.multiaddrs) !== null && _a !== void 0 ? _a : [multiaddr_1.default('/ip4/127.0.0.1/tcp/50580/ws')];
        this.node = null;
        this.banned = new Map();
    }
    /**
     * Server name
     * @type {string}
     */
    get name() {
        return 'libp2p';
    }
    /**
     * Start Libp2p server. Returns a promise that resolves once server has been started.
     * @return Resolves with true if server successfully started
     */
    async start() {
        if (this.started) {
            return false;
        }
        let peerId;
        await super.start();
        if (!this.node) {
            peerId = await this.getPeerId();
            const addresses = { listen: this.multiaddrs.map((ma) => ma.toString()) };
            this.node = new libp2pnode_1.Libp2pNode({
                peerId,
                addresses,
                bootnodes: this.bootnodes,
            });
            this.protocols.forEach(async (p) => {
                const protocol = `/${p.name}/${p.versions[0]}`;
                this.node.handle(protocol, async ({ connection, stream }) => {
                    const [peerId] = this.getPeerInfo(connection);
                    const peer = this.peers.get(peerId.toB58String());
                    if (peer) {
                        await peer.accept(p, stream, this);
                        this.emit('connected', peer);
                    }
                });
            });
        }
        this.node.on('peer:discovery', async (peerId) => {
            const id = peerId.toB58String();
            if (this.peers.get(id) || this.isBanned(id)) {
                return;
            }
            const peer = this.createPeer(peerId);
            await peer.bindProtocols(this.node, peerId, this);
            this.config.logger.debug(`Peer discovered: ${peer}`);
            this.emit('connected', peer);
        });
        this.node.connectionManager.on('peer:connect', (connection) => {
            const [peerId, multiaddr] = this.getPeerInfo(connection);
            const peer = this.createPeer(peerId, [multiaddr]);
            this.config.logger.debug(`Peer connected: ${peer}`);
        });
        this.node.connectionManager.on('peer:disconnect', (_connection) => {
            // TODO: do anything here on disconnect?
        });
        this.node.on('error', (error) => this.error(error));
        await this.node.start();
        this.node.addressManager.getListenAddrs().map(async (ma) => {
            this.emit('listening', {
                transport: this.name,
                url: `${ma.toString()}/p2p/${peerId.toB58String()}`,
            });
        });
        this.started = true;
        return true;
    }
    /**
     * Stop Libp2p server. Returns a promise that resolves once server has been stopped.
     */
    async stop() {
        if (this.started) {
            await this.node.stop();
            await super.stop();
            this.started = false;
        }
        return this.started;
    }
    /**
     * Ban peer for a specified time
     * @param peerId id of peer
     * @param maxAge how long to ban peer (default: 60s)
     */
    ban(peerId, maxAge = 60000) {
        if (!this.started) {
            return false;
        }
        this.banned.set(peerId, Date.now() + maxAge);
        return true;
    }
    /**
     * Check if peer is currently banned
     * @param  peerId id of peer
     * @return true if banned
     */
    isBanned(peerId) {
        const expireTime = this.banned.get(peerId);
        if (expireTime && expireTime > Date.now()) {
            return true;
        }
        this.banned.delete(peerId);
        return false;
    }
    /**
     * Handles errors from server and peers
     * @private
     * @param  error
     * @emits  error
     */
    error(error) {
        this.emit('error', error);
    }
    async getPeerId() {
        const privKey = await libp2p_crypto_1.default.keys.generateKeyPairFromSeed('ed25519', this.key, 512);
        const protoBuf = libp2p_crypto_1.default.keys.marshalPrivateKey(privKey);
        return peer_id_1.default.createFromPrivKey(protoBuf);
    }
    getPeerInfo(connection) {
        return [connection.remotePeer, connection.remoteAddr];
    }
    createPeer(peerId, multiaddrs) {
        const peer = new peer_1.Libp2pPeer({
            config: this.config,
            id: peerId.toB58String(),
            multiaddrs,
            protocols: Array.from(this.protocols),
        });
        this.peers.set(peer.id, peer);
        return peer;
    }
}
exports.Libp2pServer = Libp2pServer;
//# sourceMappingURL=libp2pserver.js.map