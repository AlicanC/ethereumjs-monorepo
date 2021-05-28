"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RlpxPeer = void 0;
const crypto_1 = require("crypto");
const devp2p_1 = require("@ethereumjs/devp2p");
const protocol_1 = require("../protocol");
const peer_1 = require("./peer");
const devp2pCapabilities = {
    eth63: devp2p_1.ETH.eth63,
    eth64: devp2p_1.ETH.eth64,
    eth65: devp2p_1.ETH.eth65,
    les2: devp2p_1.LES.les2,
};
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
class RlpxPeer extends peer_1.Peer {
    /**
     * Create new devp2p/rlpx peer
     * @param {RlpxPeerOptions}
     */
    constructor(options) {
        const address = `${options.host}:${options.port}`;
        super({
            ...options,
            transport: 'rlpx',
            address,
        });
        this.host = options.host;
        this.port = options.port;
        this.rlpx = null;
        this.rlpxPeer = null;
        this.connected = false;
    }
    /**
     * Return devp2p/rlpx capabilities for the specified protocols
     * @param  {Protocols[]} protocols protocol instances
     * @return {Object[]} capabilities
     */
    static capabilities(protocols) {
        const capabilities = [];
        protocols.forEach((protocol) => {
            const { name, versions } = protocol;
            const keys = versions.map((v) => name + String(v));
            keys.forEach((key) => {
                const capability = devp2pCapabilities[key];
                if (capability) {
                    capabilities.push(capability);
                }
            });
        });
        return capabilities;
    }
    /**
     * Initiate peer connection
     * @return {Promise}
     */
    async connect() {
        if (this.connected) {
            return;
        }
        const key = crypto_1.randomBytes(32);
        await Promise.all(this.protocols.map((p) => p.open()));
        this.rlpx = new devp2p_1.RLPx(key, {
            capabilities: RlpxPeer.capabilities(this.protocols),
            common: this.config.chainCommon,
        });
        await this.rlpx.connect({
            id: Buffer.from(this.id, 'hex'),
            address: this.host,
            tcpPort: this.port,
        });
        this.rlpx.on('peer:error', (rlpxPeer, error) => {
            this.emit('error', error);
        });
        this.rlpx.once('peer:added', async (rlpxPeer) => {
            try {
                await this.bindProtocols(rlpxPeer);
                this.emit('connected');
            }
            catch (error) {
                this.emit('error', error);
            }
        });
        this.rlpx.once('peer:removed', (rlpxPeer, reason) => {
            try {
                if (rlpxPeer !== this.rlpxPeer) {
                    return;
                }
                reason = rlpxPeer.getDisconnectPrefix(reason);
                this.rlpxPeer = null;
                this.connected = false;
                this.emit('disconnected', reason);
            }
            catch (error) {
                this.emit('error', error);
            }
        });
    }
    /**
     * Accept new peer connection from an rlpx server
     * @private
     * @return {Promise}
     */
    async accept(rlpxPeer, server) {
        if (this.connected) {
            return;
        }
        await this.bindProtocols(rlpxPeer);
        this.server = server;
    }
    /**
     * Adds protocols to this peer given an rlpx native peer instance.
     * @private
     * @param  {Object}  rlpxPeer rlpx native peer
     * @return {Promise}
     */
    async bindProtocols(rlpxPeer) {
        this.rlpxPeer = rlpxPeer;
        await Promise.all(rlpxPeer.getProtocols().map((rlpxProtocol) => {
            const name = rlpxProtocol.constructor.name.toLowerCase();
            const protocol = this.protocols.find((p) => p.name === name);
            if (protocol) {
                return this.bindProtocol(protocol, new protocol_1.RlpxSender(rlpxProtocol));
            }
        }));
        this.connected = true;
    }
}
exports.RlpxPeer = RlpxPeer;
//# sourceMappingURL=rlpxpeer.js.map