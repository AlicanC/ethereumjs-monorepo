"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const util_1 = require("../../util");
const validation_1 = require("../validation");
/**
 * admin_* RPC module
 * @memberof module:rpc/modules
 */
class Admin {
    /**
     * Create admin_* RPC module
     * @param client Client to which the module binds
     */
    constructor(client) {
        const service = client.services.find((s) => s.name === 'eth');
        this._chain = service.chain;
        this._client = client;
        this._ethProtocol = service.protocols.find((p) => p.name === 'eth');
        this.nodeInfo = validation_1.middleware(this.nodeInfo.bind(this), 0, []);
    }
    /**
     * Returns information about the currently running node.
     * see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo
     * @param params An empty array
     */
    async nodeInfo(_params) {
        const rlpxInfo = this._client.server('rlpx').getRlpxInfo();
        const { enode, id, ip, listenAddr, ports } = rlpxInfo;
        const { discovery, listener } = ports;
        const clientName = util_1.getClientVersion();
        // TODO version not present in reference..
        // const ethVersion = Math.max.apply(Math, this._ethProtocol.versions)
        const latestHeader = await this._chain.getLatestHeader();
        const difficulty = latestHeader.difficulty.toString();
        const genesis = ethereumjs_util_1.bufferToHex(this._chain.genesis.hash);
        const head = ethereumjs_util_1.bufferToHex(latestHeader.mixHash);
        const network = this._chain.networkId.toString();
        const nodeInfo = {
            name: clientName,
            enode,
            id,
            ip,
            listenAddr,
            ports: {
                discovery,
                listener,
            },
            protocols: {
                eth: {
                    difficulty,
                    genesis,
                    head,
                    network,
                },
            },
        };
        return nodeInfo;
    }
}
exports.Admin = Admin;
//# sourceMappingURL=admin.js.map