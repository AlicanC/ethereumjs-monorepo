"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullEthereumService = void 0;
const ethereumservice_1 = require("./ethereumservice");
const fullsync_1 = require("../sync/fullsync");
const ethprotocol_1 = require("../net/protocol/ethprotocol");
const lesprotocol_1 = require("../net/protocol/lesprotocol");
/**
 * Ethereum service
 * @memberof module:service
 */
class FullEthereumService extends ethereumservice_1.EthereumService {
    /**
     * Create new ETH service
     * @param {FullEthereumServiceOptions}
     */
    constructor(options) {
        var _a;
        super(options);
        this.lightserv = (_a = options.lightserv) !== null && _a !== void 0 ? _a : false;
        this.config.logger.info('Full sync mode');
        this.synchronizer = new fullsync_1.FullSynchronizer({
            config: this.config,
            pool: this.pool,
            chain: this.chain,
            stateDB: options.stateDB,
            interval: this.interval,
        });
    }
    /**
     * Returns all protocols required by this service
     * @type {Protocol[]} required protocols
     */
    get protocols() {
        const protocols = [
            new ethprotocol_1.EthProtocol({
                config: this.config,
                chain: this.chain,
                timeout: this.timeout,
            }),
        ];
        if (this.config.lightserv) {
            protocols.push(new lesprotocol_1.LesProtocol({
                config: this.config,
                chain: this.chain,
                flow: this.flow,
                timeout: this.timeout,
            }));
        }
        return protocols;
    }
    /**
     * Handles incoming message from connected peer
     * @param  {Object}  message message object
     * @param  protocol protocol name
     * @param  peer peer
     */
    async handle(message, protocol, peer) {
        if (protocol === 'eth') {
            return this.handleEth(message, peer);
        }
        else {
            return this.handleLes(message, peer);
        }
    }
    /**
     * Handles incoming ETH message from connected peer
     * @param  {Object}  message message object
     * @param  peer peer
     */
    async handleEth(message, peer) {
        if (message.name === 'GetBlockHeaders') {
            const { block, max, skip, reverse } = message.data;
            const headers = await this.chain.getHeaders(block, max, skip, reverse);
            peer.eth.send('BlockHeaders', headers);
        }
        else if (message.name === 'GetBlockBodies') {
            const hashes = message.data;
            const blocks = await Promise.all(hashes.map((hash) => this.chain.getBlock(hash)));
            const bodies = blocks.map((block) => block.raw().slice(1));
            peer.eth.send('BlockBodies', bodies);
        }
        else if (message.name === 'NewBlockHashes') {
            await this.synchronizer.announced(message.data, peer);
        }
    }
    /**
     * Handles incoming LES message from connected peer
     * @param  {Object}  message message object
     * @param  peer peer
     */
    async handleLes(message, peer) {
        if (message.name === 'GetBlockHeaders' && this.config.lightserv) {
            const { reqId, block, max, skip, reverse } = message.data;
            const bv = this.flow.handleRequest(peer, message.name, max);
            if (bv < 0) {
                this.pool.ban(peer, 300000);
                this.config.logger.debug(`Dropping peer for violating flow control ${peer}`);
            }
            else {
                const headers = await this.chain.getHeaders(block, max, skip, reverse);
                peer.les.send('BlockHeaders', { reqId, bv, headers });
            }
        }
    }
}
exports.FullEthereumService = FullEthereumService;
//# sourceMappingURL=fullethereumservice.js.map