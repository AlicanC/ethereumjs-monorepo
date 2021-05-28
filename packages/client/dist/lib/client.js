"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const service_1 = require("./service");
/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
class EthereumClient extends events_1.default.EventEmitter {
    /**
     * Create new node
     * @param {EthereumClientOptions}
     */
    constructor(options) {
        super();
        this.config = options.config;
        this.services = [
            this.config.syncmode === 'full'
                ? new service_1.FullEthereumService({
                    config: this.config,
                    chainDB: options.chainDB,
                    stateDB: options.stateDB,
                })
                : new service_1.LightEthereumService({
                    config: this.config,
                    chainDB: options.chainDB,
                }),
        ];
        this.opened = false;
        this.started = false;
    }
    /**
     * Open node. Must be called before node is started
     * @return {Promise}
     */
    async open() {
        if (this.opened) {
            return false;
        }
        this.config.servers.map((s) => {
            s.on('error', (error) => {
                this.emit('error', error);
            });
            s.on('listening', (details) => {
                this.emit('listening', details);
            });
        });
        this.services.map((s) => {
            s.on('error', (error) => {
                this.emit('error', error);
            });
            s.on('synchronized', () => {
                this.emit('synchronized');
            });
        });
        await Promise.all(this.services.map((s) => s.open()));
        this.opened = true;
    }
    /**
     * Starts node and all services and network servers.
     * @return {Promise}
     */
    async start() {
        if (this.started) {
            return false;
        }
        await Promise.all(this.services.map((s) => s.start()));
        await Promise.all(this.config.servers.map((s) => s.start()));
        await Promise.all(this.config.servers.map((s) => s.bootstrap()));
        this.started = true;
    }
    /**
     * Stops node and all services and network servers.
     * @return {Promise}
     */
    async stop() {
        if (!this.started) {
            return false;
        }
        await Promise.all(this.services.map((s) => s.stop()));
        await Promise.all(this.config.servers.map((s) => s.stop()));
        this.started = false;
    }
    /**
     * Returns the service with the specified name.
     * @param {string} name name of service
     * @return {Service}
     */
    service(name) {
        return this.services.find((s) => s.name === name);
    }
    /**
     * Returns the server with the specified name.
     * @param {string} name name of server
     * @return {Server}
     */
    server(name) {
        return this.config.servers.find((s) => s.name === name);
    }
}
exports.default = EthereumClient;
//# sourceMappingURL=client.js.map