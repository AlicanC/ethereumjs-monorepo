"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
const events_1 = require("events");
const boundprotocol_1 = require("./boundprotocol");
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
class Protocol extends events_1.EventEmitter {
    /**
     * Create new protocol
     * @param {ProtocolOptions}
     */
    constructor(options) {
        var _a;
        super();
        this.config = options.config;
        this.timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : 8000;
        this.opened = false;
    }
    /**
     * Opens protocol and any associated dependencies
     * @return {Promise}
     */
    async open() {
        this.opened = true;
    }
    /**
     * Perform handshake given a sender from subclass.
     * @private
     * @return {Promise}
     */
    async handshake(sender) {
        const status = this.encodeStatus();
        sender.sendStatus(status);
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                timeout = null;
                reject(new Error(`Handshake timed out after ${this.timeout}ms`));
            }, this.timeout);
            const handleStatus = (status) => {
                if (timeout) {
                    clearTimeout(timeout);
                    resolve(this.decodeStatus(status));
                }
            };
            if (sender.status) {
                handleStatus(sender.status);
            }
            else {
                sender.once('status', handleStatus);
            }
        });
    }
    /**
     * Abstract getter for name of protocol
     * @type {string}
     */
    get name() {
        return 'protocol';
    }
    /**
     * Protocol versions supported
     * @type {number[]}
     */
    get versions() {
        throw new Error('Unimplemented');
    }
    /**
     * Messages defined by this protocol
     * @type {Protocol~Message[]}
     */
    get messages() {
        throw new Error('Unimplemented');
    }
    /**
     * Encodes status into status message payload. Must be implemented by subclass.
     * @return {Object}
     */
    encodeStatus() {
        throw new Error('Unimplemented');
    }
    /**
     * Decodes status message payload into a status object.  Must be implemented
     * by subclass.
     * @param {Object} status status message payload
     * @return {Object}
     */
    decodeStatus(_status) {
        throw new Error('Unimplemented');
    }
    /**
     * Encodes message into proper format before sending
     * @protected
     * @param message message definition
     * @param {*} args message arguments
     * @return {*}
     */
    encode(message, args) {
        if (message.encode) {
            return message.encode(args);
        }
        return args;
    }
    /**
     * Decodes message payload
     * @protected
     * @param message message definition
     * @param {*} payload message payload
     * @param {BoundProtocol} bound reference to bound protocol
     * @return {*}
     */
    decode(message, payload) {
        if (message.decode) {
            return message.decode(payload);
        }
        return payload;
    }
    /**
     * Binds this protocol to a given peer using the specified sender to handle
     * message communication.
     * @param  {Peer}    peer peer
     * @param  {Sender}  sender sender
     * @return {Promise}
     */
    async bind(peer, sender) {
        const bound = new boundprotocol_1.BoundProtocol({
            config: this.config,
            protocol: this,
            peer: peer,
            sender: sender,
        });
        await bound.handshake(sender);
        //@ts-ignore TODO: evaluate this line
        peer[this.name] = bound;
        return bound;
    }
}
exports.Protocol = Protocol;
//# sourceMappingURL=protocol.js.map