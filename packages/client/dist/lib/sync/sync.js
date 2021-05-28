"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Synchronizer = void 0;
const events_1 = require("events");
const protocol_1 = require("../net/protocol");
/**
 * Base class for blockchain synchronizers
 * @memberof module:sync
 */
class Synchronizer extends events_1.EventEmitter {
    /**
     * Create new node
     * @param {SynchronizerOptions}
     */
    constructor(options) {
        var _a, _b;
        super();
        this.config = options.config;
        this.pool = options.pool;
        this.chain = options.chain;
        this.flow = (_a = options.flow) !== null && _a !== void 0 ? _a : new protocol_1.FlowControl();
        this.interval = (_b = options.interval) !== null && _b !== void 0 ? _b : 1000;
        this.running = false;
        this.forceSync = false;
        this.pool.on('added', (peer) => {
            if (this.syncable(peer)) {
                this.config.logger.debug(`Found ${this.type} peer: ${peer}`);
            }
        });
    }
    /**
     * Returns synchronizer type
     */
    get type() {
        return 'sync';
    }
    /**
     * Open synchronizer. Must be called before sync() is called
     * @return {Promise}
     */
    async open() { }
    /**
     * Returns true if peer can be used for syncing
     * @return {boolean}
     */
    // TODO: evaluate syncability of peer
    syncable(_peer) {
        return true;
    }
    /**
     * Start synchronization
     */
    async start() {
        if (this.running) {
            return false;
        }
        this.running = true;
        const timeout = setTimeout(() => {
            this.forceSync = true;
        }, this.interval * 30);
        while (this.running) {
            try {
                if (await this.sync())
                    this.emit('synchronized');
            }
            catch (error) {
                this.emit('error', error);
            }
            await new Promise((resolve) => setTimeout(resolve, this.interval));
        }
        this.running = false;
        clearTimeout(timeout);
    }
    /**
     * Stop synchronization. Returns a promise that resolves once stopped.
     */
    async stop() {
        if (!this.running) {
            return false;
        }
        await new Promise((resolve) => setTimeout(resolve, this.interval));
        this.running = false;
        this.config.logger.info('Stopped synchronization.');
        return true;
    }
}
exports.Synchronizer = Synchronizer;
//# sourceMappingURL=sync.js.map