"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const events = __importStar(require("events"));
const peerpool_1 = require("../net/peerpool");
/**
 * Base class for all services
 * @memberof module:service
 */
class Service extends events.EventEmitter {
    /**
     * Create new service and associated peer pool
     * @param {ServiceOptions}
     */
    constructor(options) {
        super();
        this.config = options.config;
        this.opened = false;
        this.running = false;
        this.pool = new peerpool_1.PeerPool({
            config: this.config,
        });
        this.pool.on('message', async (message, protocol, peer) => {
            if (this.running) {
                try {
                    await this.handle(message, protocol, peer);
                }
                catch (error) {
                    this.config.logger.debug(`Error handling message (${protocol}:${message.name}): ${error.message}`);
                }
            }
        });
        this.opened = false;
        this.running = false;
    }
    /**
     * Service name
     * @protected
     * @type {string}
     */
    get name() {
        return '';
        //throw new Error('Unimplemented')
    }
    /**
     * Returns all protocols required by this service
     * @type {Protocol[]} required protocols
     */
    get protocols() {
        return [];
    }
    /**
     * Open service. Must be called before service is running
     * @return {Promise}
     */
    async open() {
        if (this.opened) {
            return false;
        }
        const protocols = this.protocols;
        this.config.servers.map((s) => s.addProtocols(protocols));
        this.pool.on('banned', (peer) => this.config.logger.debug(`Peer banned: ${peer}`));
        this.pool.on('error', (error) => this.emit('error', error));
        this.pool.on('added', (peer) => this.config.logger.debug(`Peer added: ${peer}`));
        this.pool.on('removed', (peer) => this.config.logger.debug(`Peer removed: ${peer}`));
        await this.pool.open();
        this.opened = true;
    }
    /**
     * Close service.
     * @return {Promise}
     */
    async close() {
        if (this.running) {
            this.pool.removeAllListeners();
            await this.pool.close();
        }
        this.opened = false;
    }
    /**
     * Start service
     * @return {Promise}
     */
    async start() {
        if (this.running) {
            return false;
        }
        this.running = true;
        this.config.logger.info(`Started ${this.name} service.`);
    }
    /**
     * Stop service
     * @return {Promise}
     */
    async stop() {
        if (this.opened) {
            await this.close();
        }
        this.running = false;
        this.config.logger.info(`Stopped ${this.name} service.`);
    }
    /**
     * Handles incoming request from connected peer
     * @param  {Object}  message message object
     * @param  {string}  protocol protocol name
     * @param  {Peer}    peer peer
     * @return {Promise}
     */
    async handle(_message, _protocol, _peer) { }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map