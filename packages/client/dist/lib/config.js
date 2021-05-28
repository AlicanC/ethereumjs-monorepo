"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const common_1 = __importDefault(require("@ethereumjs/common"));
const devp2p_1 = require("@ethereumjs/devp2p");
const logging_1 = require("./logging");
const server_1 = require("./net/server");
const util_1 = require("./util");
const level = require('level');
class Config {
    constructor(options = {}) {
        this.servers = [];
        this.syncmode = options.syncmode ?? Config.SYNCMODE_DEFAULT;
        this.vm = options.vm;
        this.lightserv = options.lightserv ?? Config.LIGHTSERV_DEFAULT;
        this.transports = options.transports ?? Config.TRANSPORTS_DEFAULT;
        this.bootnodes = options.bootnodes;
        this.port = options.port ?? Config.PORT_DEFAULT;
        this.multiaddrs = options.multiaddrs;
        this.datadir = options.datadir ?? Config.DATADIR_DEFAULT;
        this.key = options.key ?? devp2p_1.genPrivateKey();
        this.rpc = options.rpc ?? Config.RPC_DEFAULT;
        this.rpcport = options.rpcport ?? Config.RPCPORT_DEFAULT;
        this.rpcaddr = options.rpcaddr ?? Config.RPCADDR_DEFAULT;
        this.loglevel = options.loglevel ?? Config.LOGLEVEL_DEFAULT;
        this.minPeers = options.minPeers ?? Config.MINPEERS_DEFAULT;
        this.maxPeers = options.maxPeers ?? Config.MAXPEERS_DEFAULT;
        this.dnsAddr = options.dnsAddr ?? Config.DNSADDR_DEFAULT;
        this.debugCode = options.debugCode ?? Config.DEBUGCODE_DEFAULT;
        // TODO: map chainParams (and lib/util.parseParams) to new Common format
        const common = options.common ?? new common_1.default({ chain: Config.CHAIN_DEFAULT, hardfork: 'chainstart' });
        this.chainCommon = common.copy();
        this.execCommon = common.copy();
        this.discDns = this.getDnsDiscovery(options.discDns);
        this.discV4 = this.getV4Discovery(options.discV4);
        if (options.logger) {
            if (options.loglevel) {
                throw new Error('Config initialization with both logger and loglevel options not allowed');
            }
            // Logger option takes precedence
            this.logger = options.logger;
        }
        else {
            this.logger = logging_1.getLogger({ loglevel: this.loglevel });
        }
        if (options.servers) {
            if (options.transports) {
                throw new Error('Config initialization with both servers and transports options not allowed');
            }
            // Servers option takes precedence
            this.servers = options.servers;
        }
        else {
            // Otherwise parse transports from transports option
            this.servers = util_1.parseTransports(this.transports).map((t) => {
                if (t.name === 'rlpx') {
                    const bootnodes = this.bootnodes ?? this.chainCommon.bootstrapNodes();
                    const dnsNetworks = options.dnsNetworks ?? this.chainCommon.dnsNetworks();
                    return new server_1.RlpxServer({ config: this, bootnodes, dnsNetworks });
                }
                else if (t.name === 'libp2p') {
                    const multiaddrs = this.multiaddrs;
                    const bootnodes = this.bootnodes;
                    return new server_1.Libp2pServer({ config: this, multiaddrs, bootnodes });
                }
                else {
                    throw new Error(`unknown transport: ${t.name}`);
                }
            });
        }
    }
    /**
     * Returns the network directory for the chain.
     */
    getNetworkDirectory() {
        const networkDirName = this.chainCommon.chainName();
        const dataDir = `${this.datadir}/${networkDirName}`;
        return dataDir;
    }
    /**
     * Returns the directory for storing the client chain data
     * based on syncmode and selected chain (subdirectory of 'datadir')
     */
    getChainDataDirectory() {
        const chainDataDirName = this.syncmode === 'light' ? 'lightchain' : 'chain';
        const dataDir = `${this.getNetworkDirectory()}/${chainDataDirName}`;
        return dataDir;
    }
    /**
     * Returns the directory for storing the client state data
     * based selected chain (subdirectory of 'datadir')
     */
    getStateDataDirectory() {
        return `${this.getNetworkDirectory()}/state`;
    }
    /**
     * Returns the config level db.
     */
    static getConfigDB(networkDir) {
        const db = level(`${networkDir}/config`);
        return db;
    }
    /**
     * Gets the client private key from the config db.
     */
    static async getClientKey(datadir, common) {
        const networkDir = `${datadir}/${common.chainName()}`;
        const db = this.getConfigDB(networkDir);
        const encodingOpts = { keyEncoding: 'utf8', valueEncoding: 'binary' };
        const dbKey = 'config:client_key';
        let key;
        try {
            key = await db.get(dbKey, encodingOpts);
        }
        catch (error) {
            if (error.type === 'NotFoundError') {
                // generate and save a new key
                key = devp2p_1.genPrivateKey();
                await db.put(dbKey, key, encodingOpts);
            }
        }
        return key;
    }
    /**
     * Returns specified option or the default setting for whether DNS-based peer discovery
     * is enabled based on chainName. `true` for ropsten, rinkeby, and goerli
     */
    getDnsDiscovery(option) {
        if (option !== undefined)
            return option;
        const dnsNets = ['ropsten', 'rinkeby', 'goerli'];
        return dnsNets.includes(this.chainCommon.chainName());
    }
    /**
     * Returns specified option or the default setting for whether v4 peer discovery
     * is enabled based on chainName. `true` for `mainnet`
     */
    getV4Discovery(option) {
        if (option !== undefined)
            return option;
        return this.chainCommon.chainName() === 'mainnet';
    }
}
exports.Config = Config;
Config.CHAIN_DEFAULT = 'mainnet';
Config.SYNCMODE_DEFAULT = 'full';
Config.LIGHTSERV_DEFAULT = false;
Config.DATADIR_DEFAULT = `./datadir`;
Config.TRANSPORTS_DEFAULT = ['rlpx', 'libp2p'];
Config.PORT_DEFAULT = 30303;
Config.RPC_DEFAULT = false;
Config.RPCPORT_DEFAULT = 8545;
Config.RPCADDR_DEFAULT = 'localhost';
Config.LOGLEVEL_DEFAULT = 'info';
Config.MINPEERS_DEFAULT = 1;
Config.MAXPEERS_DEFAULT = 25;
Config.DNSADDR_DEFAULT = '8.8.8.8';
Config.DEBUGCODE_DEFAULT = false;
//# sourceMappingURL=config.js.map