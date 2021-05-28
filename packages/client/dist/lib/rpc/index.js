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
exports.RPCManager = void 0;
const modules = __importStar(require("./modules"));
/**
 * @module rpc
 */
/**
 * get all methods. e.g., getBlockByNumber in eth module
 * @private
 * @param Object mod
 * @returns string[]
 */
function getMethodNames(mod) {
    return Object.getOwnPropertyNames(mod.prototype);
}
/**
 * RPC server manager
 * @memberof module:rpc
 */
class RPCManager {
    constructor(client, config) {
        this._config = config;
        this._client = client;
    }
    /**
     * gets methods for all modules which concat with underscore "_"
     * e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }
     * @return {Object} methods
     */
    getMethods() {
        const methods = {};
        modules.list.forEach((modName) => {
            this._config.logger.debug(`Initialize ${modName} module`);
            const mod = new modules[modName](this._client);
            getMethodNames(modules[modName])
                .filter((methodName) => methodName !== 'constructor')
                .forEach((methodName) => {
                const concatedMethodName = `${modName.toLowerCase()}_${methodName}`;
                this._config.logger.debug(`Setup module method '${concatedMethodName}' to RPC`);
                methods[concatedMethodName] = mod[methodName].bind(mod);
            });
        });
        return methods;
    }
}
exports.RPCManager = RPCManager;
//# sourceMappingURL=index.js.map