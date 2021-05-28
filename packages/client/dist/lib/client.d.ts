/// <reference types="node" />
import events from 'events';
import { LevelUp } from 'levelup';
import { MultiaddrLike } from './types';
import { Config } from './config';
import { FullEthereumService, LightEthereumService } from './service';
export interface EthereumClientOptions {
    config: Config;
    /**
     * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
     *
     * Default: Database created by the Blockchain class
     */
    chainDB?: LevelUp;
    /**
     * Database to store the state. Should be an abstract-leveldown compliant store.
     *
     * Default: Database created by the Trie class
     */
    stateDB?: LevelUp;
    bootnodes?: MultiaddrLike[];
    clientFilter?: string[];
    refreshInterval?: number;
}
/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
export default class EthereumClient extends events.EventEmitter {
    config: Config;
    services: (FullEthereumService | LightEthereumService)[];
    opened: boolean;
    started: boolean;
    /**
     * Create new node
     * @param {EthereumClientOptions}
     */
    constructor(options: EthereumClientOptions);
    /**
     * Open node. Must be called before node is started
     * @return {Promise}
     */
    open(): Promise<false | undefined>;
    /**
     * Starts node and all services and network servers.
     * @return {Promise}
     */
    start(): Promise<false | undefined>;
    /**
     * Stops node and all services and network servers.
     * @return {Promise}
     */
    stop(): Promise<false | undefined>;
    /**
     * Returns the service with the specified name.
     * @param {string} name name of service
     * @return {Service}
     */
    service(name: string): FullEthereumService | LightEthereumService | undefined;
    /**
     * Returns the server with the specified name.
     * @param {string} name name of server
     * @return {Server}
     */
    server(name: string): import("./net/server").RlpxServer | import("./net/server").Libp2pServer | undefined;
}
