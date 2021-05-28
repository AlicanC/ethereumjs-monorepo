"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightEthereumService = void 0;
const ethereumservice_1 = require("./ethereumservice");
const lightsync_1 = require("../sync/lightsync");
const lesprotocol_1 = require("../net/protocol/lesprotocol");
/**
 * Ethereum service
 * @memberof module:service
 */
class LightEthereumService extends ethereumservice_1.EthereumService {
    /**
     * Create new ETH service
     * @param {Object}   options constructor parameters
     */
    constructor(options) {
        super(options);
        this.config.logger.info('Light sync mode');
        this.synchronizer = new lightsync_1.LightSynchronizer({
            config: this.config,
            pool: this.pool,
            chain: this.chain,
            flow: this.flow,
            interval: this.interval,
        });
    }
    /**
     * Returns all protocols required by this service
     */
    get protocols() {
        return [
            new lesprotocol_1.LesProtocol({
                config: this.config,
                chain: this.chain,
                flow: this.flow,
                timeout: this.timeout,
            }),
        ];
    }
    /**
     * Handles incoming message from connected peer
     * @param  {Object}  message message object
     * @param  {string}  protocol protocol name
     * @param  {Peer}    peer peer
     * @return {Promise}
     */
    async handle(_message, _protocol, _peer) { }
}
exports.LightEthereumService = LightEthereumService;
//# sourceMappingURL=lightethereumservice.js.map