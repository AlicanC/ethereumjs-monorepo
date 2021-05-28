/// <reference types="node" />
import { EventEmitter } from 'events';
import { Message, Protocol } from '../protocol/protocol';
import { Peer } from '../peer/peer';
import { Sender } from './sender';
import { Config } from '../../config';
export interface BoundProtocolOptions {
    config: Config;
    protocol: Protocol;
    peer: Peer;
    sender: Sender;
}
/**
 * Binds a protocol implementation to the specified peer
 * @memberof module:net/protocol
 */
export declare class BoundProtocol extends EventEmitter {
    config: Config;
    name: string;
    private protocol;
    private peer;
    private sender;
    private versions;
    private timeout;
    private _status;
    private resolvers;
    private messageQueue;
    /**
     * Create bound protocol
     * @param {BoundProtocolOptions}
     */
    constructor(options: BoundProtocolOptions);
    get status(): any;
    set status(status: any);
    handshake(sender: Sender): Promise<void>;
    /**
     * Handle incoming message
     * @private
     * @param  {Object} message message object
     * @emits  message
     */
    handle(incoming: Message): void;
    /**
     * Handle unhandled messages along handshake
     */
    handleMessageQueue(): void;
    /**
     * Send message with name and the specified args
     * @param  name message name
     * @param  args message arguments
     */
    send(name: string, args?: any): Message;
    /**
     * Returns a promise that resolves with the message payload when a response
     * to the specified message is received
     * @param  name message to wait for
     * @param  args message arguments
     * @return {Promise}
     */
    request(name: string, args: any[]): Promise<any>;
    /**
     * Add methods to the bound protocol for each protocol message that has a
     * corresponding response message.
     */
    addMethods(): void;
}
