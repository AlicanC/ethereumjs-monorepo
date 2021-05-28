"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumService = void 0;
const flowcontrol_1 = require("../net/protocol/flowcontrol");
const blockchain_1 = require("../blockchain");
const service_1 = require("./service");
/**
 * Ethereum service
 * @memberof module:service
 */
class EthereumService extends service_1.Service {
    /**
     * Create new ETH service
     * @param {EthereumServiceOptions}
     */
    constructor(options) {
        var _a, _b, _c;
        super(options);
        this.flow = new flowcontrol_1.FlowControl();
        this.chain = (_a = options.chain) !== null && _a !== void 0 ? _a : new blockchain_1.Chain(options);
        this.interval = (_b = options.interval) !== null && _b !== void 0 ? _b : 8000;
        this.timeout = (_c = options.timeout) !== null && _c !== void 0 ? _c : 6000;
    }
    /**
     * Service name
     * @protected
     * @type {string}
     */
    get name() {
        return 'eth';
    }
    /**
     * Open eth service. Must be called before service is started
     * @return {Promise}
     */
    async open() {
        if (this.opened) {
            return false;
        }
        await super.open();
        this.synchronizer.on('synchronized', () => this.emit('synchronized'));
        this.synchronizer.on('error', (error) => this.emit('error', error));
        await this.chain.open();
        await this.synchronizer.open();
    }
    /**
     * Starts service and ensures blockchain is synchronized. Returns a promise
     * that resolves once the service is started and blockchain is in sync.
     * @return {Promise}
     */
    async start() {
        if (this.running) {
            return false;
        }
        await super.start();
        this.synchronizer.start(); // eslint-disable-line @typescript-eslint/no-floating-promises
    }
    /**
     * Stop service. Interrupts blockchain synchronization if its in progress.
     * @return {Promise}
     */
    async stop() {
        if (!this.running) {
            return false;
        }
        await this.synchronizer.stop();
        await super.stop();
    }
}
exports.EthereumService = EthereumService;
//# sourceMappingURL=ethereumservice.js.map