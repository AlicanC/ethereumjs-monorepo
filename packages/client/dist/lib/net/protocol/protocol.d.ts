/// <reference types="node" />
import { EventEmitter } from 'events';
import { Config } from '../../config';
import { Peer } from '../peer/peer';
import { BoundProtocol } from './boundprotocol';
import { Sender } from './sender';
export interface ProtocolOptions {
    config: Config;
    timeout?: number;
}
export declare type Message = {
    name: string;
    code: number;
    payload?: any;
    response?: number;
    encode?: Function;
    decode?: Function;
};
/**
 * Protocol message
 * @typedef {Object} Protocol~Message
 * @property {string} name message name
 * @property {number} code message code
 * @property {response} response code of response message
 * @property {boolean} flow true if message includes flow control
 * @property {function(...*): *} encode encode message arguments
 * @property {function(*): *} decode decodes message payload
 */
/**
 * Base class for all wire protocols
 * @memberof module:net/protocol
 */
export declare class Protocol extends EventEmitter {
    config: Config;
    timeout: number;
    opened: boolean;
    /**
     * Create new protocol
     * @param {ProtocolOptions}
     */
    constructor(options: ProtocolOptions);
    /**
     * Opens protocol and any associated dependencies
     * @return {Promise}
     */
    open(): Promise<boolean | void>;
    /**
     * Perform handshake given a sender from subclass.
     * @private
     * @return {Promise}
     */
    handshake(sender: Sender): Promise<unknown>;
    /**
     * Abstract getter for name of protocol
     * @type {string}
     */
    get name(): string;
    /**
     * Protocol versions supported
     * @type {number[]}
     */
    get versions(): number[];
    /**
     * Messages defined by this protocol
     * @type {Protocol~Message[]}
     */
    get messages(): Message[];
    /**
     * Encodes status into status message payload. Must be implemented by subclass.
     * @return {Object}
     */
    encodeStatus(): any;
    /**
     * Decodes status message payload into a status object.  Must be implemented
     * by subclass.
     * @param {Object} status status message payload
     * @return {Object}
     */
    decodeStatus(_status: any): any;
    /**
     * Encodes message into proper format before sending
     * @protected
     * @param message message definition
     * @param {*} args message arguments
     * @return {*}
     */
    encode(message: Message, args: any): any;
    /**
     * Decodes message payload
     * @protected
     * @param message message definition
     * @param {*} payload message payload
     * @param {BoundProtocol} bound reference to bound protocol
     * @return {*}
     */
    decode(message: Message, payload: any): any;
    /**
     * Binds this protocol to a given peer using the specified sender to handle
     * message communication.
     * @param  {Peer}    peer peer
     * @param  {Sender}  sender sender
     * @return {Promise}
     */
    bind(peer: Peer, sender: Sender): Promise<BoundProtocol>;
}
