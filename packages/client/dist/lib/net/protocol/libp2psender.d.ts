import { Libp2pMuxedStream as MuxedStream } from '../../types';
import { Sender } from './sender';
/**
 * Libp2p protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
export declare class Libp2pSender extends Sender {
    private stream;
    private pushable;
    /**
     * Creates a new Libp2p protocol sender
     * @param {MuxedStream} stream stream to libp2p peer
     */
    constructor(stream: MuxedStream);
    init(): void;
    /**
     * Send a status to peer
     * @param {Object} status
     */
    sendStatus(status: any): void;
    /**
     * Send a message to peer
     * @param  {number} code message code
     * @param  {*}      data message payload
     */
    sendMessage(code: number, data: any): void;
}
