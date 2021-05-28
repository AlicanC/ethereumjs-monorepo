import { EthereumService, EthereumServiceOptions } from './ethereumservice';
import { Peer } from '../net/peer/peer';
import { LightSynchronizer } from '../sync/lightsync';
import { LesProtocol } from '../net/protocol/lesprotocol';
/**
 * Ethereum service
 * @memberof module:service
 */
export declare class LightEthereumService extends EthereumService {
    synchronizer: LightSynchronizer;
    /**
     * Create new ETH service
     * @param {Object}   options constructor parameters
     */
    constructor(options: EthereumServiceOptions);
    /**
     * Returns all protocols required by this service
     */
    get protocols(): LesProtocol[];
    /**
     * Handles incoming message from connected peer
     * @param  {Object}  message message object
     * @param  {string}  protocol protocol name
     * @param  {Peer}    peer peer
     * @return {Promise}
     */
    handle(_message: any, _protocol: string, _peer: Peer): Promise<void>;
}
