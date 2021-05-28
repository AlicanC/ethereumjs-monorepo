import { Sender } from './sender';
import { ETH as Devp2pETH, LES as Devp2pLES } from '@ethereumjs/devp2p';
/**
 * DevP2P/RLPx protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export declare class RlpxSender extends Sender {
    private sender;
    /**
     * Creates a new DevP2P/Rlpx protocol sender
     * @param {Object} rlpxProtocol protocol object from @ethereumjs/devp2p
     */
    constructor(rlpxProtocol: Devp2pETH | Devp2pLES);
    /**
     * Send a status to peer
     * @param  {Object} status
     */
    sendStatus(status: any): void;
    /**
     * Send a message to peer
     * @param  {number} code message code
     * @param  {*}      data message payload
     */
    sendMessage(code: number, data: any): void;
}
