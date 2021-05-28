"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execution = void 0;
const events_1 = require("events");
class Execution extends events_1.EventEmitter {
    /**
     * Create new excution module
     * @memberof module:sync/execution
     */
    constructor(options) {
        super();
        this.running = false;
        this.config = options.config;
        this.chain = options.chain;
        this.stateDB = options.stateDB;
    }
    /**
     * Stop execution. Returns a promise that resolves once stopped.
     */
    async stop() {
        this.running = false;
        this.config.logger.info('Stopped execution.');
        return true;
    }
}
exports.Execution = Execution;
//# sourceMappingURL=execution.js.map