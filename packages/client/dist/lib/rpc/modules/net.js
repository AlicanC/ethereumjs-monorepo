"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Net = void 0;
const validation_1 = require("../validation");
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * net_* RPC module
 * @memberof module:rpc/modules
 */
class Net {
    /**
     * Create net_* RPC module
     * @param client Client to which the module binds
     */
    constructor(client) {
        const service = client.services.find((s) => s.name === 'eth');
        this._chain = service.chain;
        this._client = client;
        this._peerPool = service.pool;
        this.version = validation_1.middleware(this.version.bind(this), 0, []);
        this.listening = validation_1.middleware(this.listening.bind(this), 0, []);
        this.peerCount = validation_1.middleware(this.peerCount.bind(this), 0, []);
    }
    /**
     * Returns the current network id
     * @param params An empty array
     */
    version(_params = []) {
        return this._chain.config.chainCommon.chainIdBN().toString();
    }
    /**
     * Returns true if client is actively listening for network connections
     * @param params An empty array
     */
    listening(_params = []) {
        return this._client.opened;
    }
    /**
     * Returns number of peers currently connected to the client
     * @param params An empty array
     */
    peerCount(_params = []) {
        return ethereumjs_util_1.addHexPrefix(this._peerPool.peers.length.toString(16));
    }
}
exports.Net = Net;
//# sourceMappingURL=net.js.map