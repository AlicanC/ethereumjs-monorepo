import { EthereumService, EthereumServiceOptions } from './ethereumservice';
import { FullSynchronizer } from '../sync/fullsync';
import { Peer } from '../net/peer/peer';
import { Protocol } from '../net/protocol';
interface FullEthereumServiceOptions extends EthereumServiceOptions {
    lightserv?: boolean;
}
/**
 * Ethereum service
 * @memberof module:service
 */
export declare class FullEthereumService extends EthereumService {
    synchronizer: FullSynchronizer;
    lightserv: boolean;
    /**
     * Create new ETH service
     * @param {FullEthereumServiceOptions}
     */
    constructor(options: FullEthereumServiceOptions);
    /**
     * Returns all protocols required by this service
     * @type {Protocol[]} required protocols
     */
    get protocols(): Protocol[];
    /**
     * Handles incoming message from connected peer
     * @param  {Object}  message message object
     * @param  protocol protocol name
     * @param  peer peer
     */
    handle(message: any, protocol: string, peer: Peer): Promise<any>;
    /**
     * Handles incoming ETH message from connected peer
     * @param  {Object}  message message object
     * @param  peer peer
     */
    handleEth(message: any, peer: Peer): Promise<void>;
    /**
     * Handles incoming LES message from connected peer
     * @param  {Object}  message message object
     * @param  peer peer
     */
    handleLes(message: any, peer: Peer): Promise<void>;
}
export {};
