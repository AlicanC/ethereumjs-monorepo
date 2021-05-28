#!/usr/bin/env client
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("jayson/promise");
const common_1 = __importDefault(require("@ethereumjs/common"));
const util_1 = require("../lib/util");
const client_1 = __importDefault(require("../lib/client"));
const config_1 = require("../lib/config");
const rpc_1 = require("../lib/rpc");
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const chains = require('@ethereumjs/common/dist/chains').chains;
const level = require('level');
const networks = Object.entries(chains.names);
const args = require('yargs')
    .options({
    network: {
        describe: `Network`,
        choices: networks.map((n) => n[1]),
        default: 'mainnet',
    },
    'network-id': {
        describe: `Network ID`,
        choices: networks.map((n) => parseInt(n[0])),
        default: undefined,
    },
    syncmode: {
        describe: 'Blockchain sync mode',
        choices: ['light', 'full'],
        default: config_1.Config.SYNCMODE_DEFAULT,
    },
    lightserv: {
        describe: 'Serve light peer requests',
        boolean: true,
        default: config_1.Config.LIGHTSERV_DEFAULT,
    },
    datadir: {
        describe: 'Data directory for the blockchain',
        default: `${os.homedir()}/Library/Ethereum/ethereumjs`,
    },
    transports: {
        describe: 'Network transports',
        default: config_1.Config.TRANSPORTS_DEFAULT,
        array: true,
    },
    bootnodes: {
        describe: 'Network bootnodes',
        array: true,
    },
    port: {
        describe: 'RLPx listening port',
        default: config_1.Config.PORT_DEFAULT,
    },
    multiaddrs: {
        describe: 'Network multiaddrs',
        array: true,
    },
    rpc: {
        describe: 'Enable the JSON-RPC server',
        boolean: true,
        default: config_1.Config.RPC_DEFAULT,
    },
    rpcport: {
        describe: 'HTTP-RPC server listening port',
        number: true,
        default: config_1.Config.RPCPORT_DEFAULT,
    },
    rpcaddr: {
        describe: 'HTTP-RPC server listening interface',
        default: config_1.Config.RPCADDR_DEFAULT,
    },
    loglevel: {
        describe: 'Logging verbosity',
        choices: ['error', 'warn', 'info', 'debug'],
        default: config_1.Config.LOGLEVEL_DEFAULT,
    },
    minPeers: {
        describe: 'Peers needed before syncing',
        number: true,
        default: config_1.Config.MINPEERS_DEFAULT,
    },
    maxPeers: {
        describe: 'Maximum peers to sync with',
        number: true,
        default: config_1.Config.MAXPEERS_DEFAULT,
    },
    params: {
        describe: 'Path to chain parameters json file',
        coerce: path.resolve,
    },
    dnsAddr: {
        describe: 'IPv4 address of DNS server to use when acquiring peer discovery targets',
        string: true,
        default: config_1.Config.DNSADDR_DEFAULT,
    },
    dnsNetworks: {
        describe: 'EIP-1459 ENR tree urls to query for peer discovery targets',
        array: true,
    },
    debugCode: {
        describe: 'Generate code for local debugging (internal usage mostly)',
        boolean: true,
        default: config_1.Config.DEBUGCODE_DEFAULT,
    },
    discDns: {
        describe: 'Query EIP-1459 DNS TXT records for peer discovery',
        boolean: true,
    },
    discV4: {
        describe: 'Use v4 ("findneighbour" node requests) for peer discovery',
        boolean: true,
    },
})
    .locale('en_EN').argv;
let logger = null;
/**
 * Initializes and starts a Node and reacts on the
 * main client lifecycle events
 *
 * @param config
 */
async function runNode(config) {
    const chainDataDir = config.getChainDataDirectory();
    fs.ensureDirSync(chainDataDir);
    const stateDataDir = config.getStateDataDirectory();
    fs.ensureDirSync(stateDataDir);
    config.logger.info(`Data directory: ${config.datadir}`);
    config.logger.info('Initializing Ethereumjs client...');
    if (config.lightserv) {
        config.logger.info(`Serving light peer requests`);
    }
    const client = new client_1.default({
        config,
        chainDB: level(chainDataDir),
        stateDB: level(stateDataDir),
    });
    client.on('error', (err) => config.logger.error(err));
    client.on('listening', (details) => {
        config.logger.info(`Listener up transport=${details.transport} url=${details.url}`);
    });
    client.on('synchronized', () => {
        config.logger.info('Synchronized');
    });
    config.logger.info(`Connecting to network: ${config.chainCommon.chainName()}`);
    await client.open();
    config.logger.info('Synchronizing blockchain...');
    await client.start();
    return client;
}
function runRpcServer(client, config) {
    const { rpcport, rpcaddr } = config;
    const manager = new rpc_1.RPCManager(client, config);
    const server = new promise_1.Server(manager.getMethods());
    config.logger.info(`RPC HTTP endpoint opened: http://${rpcaddr}:${rpcport}`);
    server.http().listen(rpcport);
    return server;
}
/**
 * Main entry point to start a client
 */
async function run() {
    var _a;
    // give network id precedence over network name
    let chain;
    if (args.networkId) {
        chain = args.networkId;
    }
    else {
        chain = args.network;
    }
    const common = new common_1.default({ chain, hardfork: 'chainstart' });
    const datadir = (_a = args.datadir) !== null && _a !== void 0 ? _a : config_1.Config.DATADIR_DEFAULT;
    const configDirectory = `${datadir}/${common.chainName()}/config`;
    fs.ensureDirSync(configDirectory);
    const key = await config_1.Config.getClientKey(datadir, common);
    const config = new config_1.Config({
        common,
        syncmode: args.syncmode,
        lightserv: args.lightserv,
        datadir,
        key,
        transports: args.transports,
        bootnodes: args.bootnodes ? util_1.parseMultiaddrs(args.bootnodes) : undefined,
        port: args.port,
        multiaddrs: args.multiaddrs ? util_1.parseMultiaddrs(args.multiaddrs) : undefined,
        rpc: args.rpc,
        rpcport: args.rpcport,
        rpcaddr: args.rpcaddr,
        loglevel: args.loglevel,
        minPeers: args.minPeers,
        maxPeers: args.maxPeers,
        dnsAddr: args.dnsAddr,
        dnsNetworks: args.dnsNetworks,
        debugCode: args.debugCode,
        discDns: args.discDns,
        discV4: args.discV4,
    });
    logger = config.logger;
    // TODO: see todo below wrt resolving chain param parsing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chainParams = args.params ? await util_1.parseParams(args.params) : args.network;
    const client = await runNode(config);
    const server = config.rpc ? runRpcServer(client, config) : null;
    process.on('SIGINT', async () => {
        config.logger.info('Caught interrupt signal. Shutting down...');
        if (server)
            server.http().close();
        await client.stop();
        config.logger.info('Exiting.');
        process.exit();
    });
}
// eslint-disable-next-line no-console
run().catch((err) => { var _a; return (_a = logger === null || logger === void 0 ? void 0 : logger.error(err)) !== null && _a !== void 0 ? _a : console.error(err); });
//# sourceMappingURL=cli.js.map