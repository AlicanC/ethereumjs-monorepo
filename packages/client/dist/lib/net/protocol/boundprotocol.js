"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundProtocol = void 0;
const events_1 = require("events");
/**
 * Binds a protocol implementation to the specified peer
 * @memberof module:net/protocol
 */
class BoundProtocol extends events_1.EventEmitter {
    /**
     * Create bound protocol
     * @param {BoundProtocolOptions}
     */
    constructor(options) {
        super();
        this.messageQueue = [];
        this.config = options.config;
        this.protocol = options.protocol;
        this.peer = options.peer;
        this.sender = options.sender;
        this.name = this.protocol.name;
        this.versions = this.protocol.versions;
        this.timeout = this.protocol.timeout;
        this._status = {};
        this.resolvers = new Map();
        this.sender.on('message', (message) => {
            try {
                if (this.peer.pooled) {
                    this.handle(message);
                }
                else {
                    this.messageQueue.push(message);
                }
            }
            catch (error) {
                this.emit('error', error);
            }
        });
        this.sender.on('error', (error) => this.emit('error', error));
        this.addMethods();
    }
    get status() {
        return this._status;
    }
    set status(status) {
        Object.assign(this._status, status);
    }
    async handshake(sender) {
        this._status = await this.protocol.handshake(sender);
    }
    /**
     * Handle incoming message
     * @private
     * @param  {Object} message message object
     * @emits  message
     */
    handle(incoming) {
        const messages = this.protocol.messages;
        const message = messages.find((m) => m.code === incoming.code);
        if (!message) {
            return;
        }
        let data;
        let error;
        try {
            data = this.protocol.decode(message, incoming.payload);
        }
        catch (e) {
            error = new Error(`Could not decode message ${message.name}: ${e}`);
        }
        const resolver = this.resolvers.get(incoming.code);
        if (resolver) {
            clearTimeout(resolver.timeout);
            this.resolvers.delete(incoming.code);
            if (error) {
                resolver.reject(error);
            }
            else {
                resolver.resolve(data);
            }
        }
        else {
            if (error) {
                this.emit('error', error);
            }
            else {
                this.emit('message', { name: message.name, data: data });
            }
        }
    }
    /**
     * Handle unhandled messages along handshake
     */
    handleMessageQueue() {
        for (const message of this.messageQueue) {
            this.handle(message);
        }
    }
    /**
     * Send message with name and the specified args
     * @param  name message name
     * @param  args message arguments
     */
    send(name, args) {
        const messages = this.protocol.messages;
        const message = messages.find((m) => m.name === name);
        if (message) {
            const encoded = this.protocol.encode(message, args);
            this.sender.sendMessage(message.code, encoded);
        }
        else {
            throw new Error(`Unknown message: ${name}`);
        }
        return message;
    }
    /**
     * Returns a promise that resolves with the message payload when a response
     * to the specified message is received
     * @param  name message to wait for
     * @param  args message arguments
     * @return {Promise}
     */
    async request(name, args) {
        const message = this.send(name, args);
        const resolver = {
            timeout: null,
            resolve: null,
            reject: null,
        };
        if (this.resolvers.get(message.response)) {
            throw new Error(`Only one active request allowed per message type (${name})`);
        }
        this.resolvers.set(message.response, resolver);
        return new Promise((resolve, reject) => {
            resolver.timeout = setTimeout(() => {
                resolver.timeout = null;
                this.resolvers.delete(message.response);
                reject(new Error(`Request timed out after ${this.timeout}ms`));
            }, this.timeout);
            resolver.resolve = resolve;
            resolver.reject = reject;
        });
    }
    /**
     * Add methods to the bound protocol for each protocol message that has a
     * corresponding response message.
     */
    addMethods() {
        const messages = this.protocol.messages.filter((m) => m.response);
        for (const message of messages) {
            const name = message.name;
            const camel = name[0].toLowerCase() + name.slice(1);
            this[camel] = async (args) => this.request(name, args).catch((error) => {
                this.emit('error', error);
                return [];
            });
        }
    }
}
exports.BoundProtocol = BoundProtocol;
//# sourceMappingURL=boundprotocol.js.map