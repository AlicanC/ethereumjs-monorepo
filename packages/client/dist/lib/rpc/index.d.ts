import { Config } from '../config';
import EthereumClient from '../client';
/**
 * RPC server manager
 * @memberof module:rpc
 */
export declare class RPCManager {
    private _config;
    private _client;
    constructor(client: EthereumClient, config: Config);
    /**
     * gets methods for all modules which concat with underscore "_"
     * e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }
     * @return {Object} methods
     */
    getMethods(): any;
}
