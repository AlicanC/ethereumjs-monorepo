/// <reference types="node" />
import Common from '@ethereumjs/common';
import VM from '@ethereumjs/vm';
import Multiaddr from 'multiaddr';
import { Logger } from './logging';
import { Libp2pServer, RlpxServer } from './net/server';
import type { LevelUp } from 'levelup';
export interface ConfigOptions {
    /**
     * Specify the chain by providing a common instance,
     * common instance will not be modified by client
     *
     * Default: 'mainnet' Common
     */
    common?: Common;
    /**
     * Synchronization mode ('full' or 'light')
     *
     * Default: 'full'
     */
    syncmode?: string;
    /**
     * Provide a custom VM instance to process blocks
     *
     * Default: VM instance created by client
     */
    vm?: VM;
    /**
     * Serve light peer requests
     *
     * Default: `false`
     */
    lightserv?: boolean;
    /**
     * Root data directory for the blockchain
     */
    datadir?: string;
    /**
     * Private key for the client.
     * Use return value of `await Config.getClientKey(datadir, common)`
     * If left blank, a random key will be generated and used.
     */
    key?: Buffer;
    /**
     * Network transports ('rlpx' and/or 'libp2p')
     *
     * Default: `['rlpx', 'libp2p']`
     */
    transports?: string[];
    /**
     * Network bootnodes
     * (e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)
     */
    bootnodes?: Multiaddr[];
    /**
     * RLPx listening port
     *
     * Default: `30303`
     */
    port?: number;
    /**
     * Network multiaddrs for libp2p
     * (e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)
     */
    multiaddrs?: Multiaddr[];
    /**
     * Transport servers (RLPx or Libp2p)
     * Use `transports` option, only used for testing purposes
     *
     * Default: servers created from `transports` option
     */
    servers?: (RlpxServer | Libp2pServer)[];
    /**
     * Enable the JSON-RPC server
     *
     * Default: false
     */
    rpc?: boolean;
    /**
     * HTTP-RPC server listening port
     *
     * Default: 8545
     */
    rpcport?: number;
    /**
     * HTTP-RPC server listening interface
     */
    rpcaddr?: string;
    /**
     * Logging verbosity
     *
     * Choices: ['debug', 'info', 'warn', 'error', 'off']
     * Default: 'info'
     */
    loglevel?: string;
    /**
     * A custom winston logger can be provided
     * if setting logging verbosity is not sufficient
     *
     * Default: Logger with loglevel 'info'
     */
    logger?: Logger;
    /**
     * Number of peers needed before syncing
     *
     * Default: `2`
     */
    minPeers?: number;
    /**
     * Maximum peers allowed
     *
     * Default: `25`
     */
    maxPeers?: number;
    /**
     * DNS server to query DNS TXT records from for peer discovery
     *
     * Default `8.8.8.8` (Google)
     */
    dnsAddr?: string;
    /**
     * EIP-1459 ENR Tree urls to query via DNS for peer discovery
     */
    dnsNetworks?: string[];
    /**
     * Generate code for local debugging, currently providing a
     * code snippet which can be used to run blocks on the
     * EthereumJS VM on execution errors
     *
     * (meant to be used internally for the most part)
     */
    debugCode?: boolean;
    /**
     * Query EIP-1459 DNS TXT records for peer discovery
     *
     * Default: `true` for testnets, false for mainnet
     */
    discDns?: boolean;
    /**
     * Use v4 ("findneighbour" node requests) for peer discovery
     *
     * Default: `false` for testnets, true for mainnet
     */
    discV4?: boolean;
}
export declare class Config {
    static readonly CHAIN_DEFAULT = "mainnet";
    static readonly SYNCMODE_DEFAULT = "full";
    static readonly LIGHTSERV_DEFAULT = false;
    static readonly DATADIR_DEFAULT = "./datadir";
    static readonly TRANSPORTS_DEFAULT: string[];
    static readonly PORT_DEFAULT = 30303;
    static readonly RPC_DEFAULT = false;
    static readonly RPCPORT_DEFAULT = 8545;
    static readonly RPCADDR_DEFAULT = "localhost";
    static readonly LOGLEVEL_DEFAULT = "info";
    static readonly MINPEERS_DEFAULT = 1;
    static readonly MAXPEERS_DEFAULT = 25;
    static readonly DNSADDR_DEFAULT = "8.8.8.8";
    static readonly DEBUGCODE_DEFAULT = false;
    readonly logger: Logger;
    readonly syncmode: string;
    readonly vm?: VM;
    readonly lightserv: boolean;
    readonly datadir: string;
    readonly key: Buffer;
    readonly transports: string[];
    readonly bootnodes?: Multiaddr[];
    readonly port?: number;
    readonly multiaddrs?: Multiaddr[];
    readonly rpc: boolean;
    readonly rpcport: number;
    readonly rpcaddr: string;
    readonly loglevel: string;
    readonly minPeers: number;
    readonly maxPeers: number;
    readonly dnsAddr: string;
    readonly debugCode: boolean;
    readonly discDns: boolean;
    readonly discV4: boolean;
    readonly chainCommon: Common;
    readonly execCommon: Common;
    readonly servers: (RlpxServer | Libp2pServer)[];
    constructor(options?: ConfigOptions);
    /**
     * Returns the network directory for the chain.
     */
    getNetworkDirectory(): string;
    /**
     * Returns the directory for storing the client chain data
     * based on syncmode and selected chain (subdirectory of 'datadir')
     */
    getChainDataDirectory(): string;
    /**
     * Returns the directory for storing the client state data
     * based selected chain (subdirectory of 'datadir')
     */
    getStateDataDirectory(): string;
    /**
     * Returns the config level db.
     */
    static getConfigDB(networkDir: string): LevelUp;
    /**
     * Gets the client private key from the config db.
     */
    static getClientKey(datadir: string, common: Common): Promise<any>;
    /**
     * Returns specified option or the default setting for whether DNS-based peer discovery
     * is enabled based on chainName. `true` for ropsten, rinkeby, and goerli
     */
    getDnsDiscovery(option: boolean | undefined): boolean;
    /**
     * Returns specified option or the default setting for whether v4 peer discovery
     * is enabled based on chainName. `true` for `mainnet`
     */
    getV4Discovery(option: boolean | undefined): boolean;
}
