"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = void 0;
const events = __importStar(require("events"));
/**
 * Network peer
 * @memberof module:net/peer
 */
class Peer extends events.EventEmitter {
    /**
     * Create new peer
     * @param {PeerOptions}
     */
    constructor(options) {
        var _a, _b, _c;
        super();
        /*
          If the peer is in the PeerPool.
          If true, messages are handled immediately.
          If false, adds incoming messages to handleMessageQueue,
          which are handled after the peer is added to the pool.
        */
        this.pooled = false;
        this.config = options.config;
        this.id = (_a = options.id) !== null && _a !== void 0 ? _a : '';
        this.address = options.address;
        this.transport = options.transport;
        this.inbound = (_b = options.inbound) !== null && _b !== void 0 ? _b : false;
        this.protocols = (_c = options.protocols) !== null && _c !== void 0 ? _c : [];
        this.bound = new Map();
        this._idle = true;
    }
    /**
     * Get idle state of peer
     * @type {boolean}
     */
    get idle() {
        return this._idle;
    }
    /**
     * Set idle state of peer
     * @type {boolean}
     */
    set idle(value) {
        this._idle = value;
    }
    /**
     * Adds a protocol to this peer given a sender instance. Protocol methods
     * will be accessible via a field with the same name as protocol. New methods
     * will be added corresponding to each message defined by the protocol, in
     * addition to send() and request() methods that takes a message name and message
     * arguments. send() only sends a message without waiting for a response, whereas
     * request() also sends the message but will return a promise that resolves with
     * the response payload.
     * @protected
     * @param  {Protocol}  protocol protocol instance
     * @param  {Sender}    sender Sender instance provided by subclass
     * @return {Promise}
     * @example
     * await peer.bindProtocol(ethProtocol, sender)
     * // Example: Directly call message name as a method on the bound protocol
     * const headers1 = await peer.eth.getBlockHeaders({ block: new BN(1), max: 100 })
     * // Example: Call request() method with message name as first parameter
     * const headers2 = await peer.eth.request('getBlockHeaders', { block: new BN(1), max: 100 })
     * // Example: Call send() method with message name as first parameter and
     * // wait for response message as an event
     * peer.eth.send('getBlockHeaders', { block: new BN(1), max: 100 })
     * peer.eth.on('message', ({ data }) => console.log(`Received ${data.length} headers`))
     */
    async bindProtocol(protocol, sender) {
        const bound = await protocol.bind(this, sender);
        bound.on('message', (message) => {
            this.emit('message', message, protocol.name);
        });
        bound.on('error', (error) => {
            this.emit('error', error, protocol.name);
        });
        this.bound.set(bound.name, bound);
    }
    /**
     * Return true if peer understand the specified protocol name
     * @param protocolName
     */
    understands(protocolName) {
        return !!this.bound.get(protocolName);
    }
    /**
     * Handle unhandled messages along handshake
     */
    handleMessageQueue() {
        this.bound.forEach(async (bound) => {
            bound.handleMessageQueue();
        });
    }
    toString(withFullId = false) {
        const properties = {
            id: withFullId ? this.id : this.id.substr(0, 8),
            address: this.address,
            transport: this.transport,
            protocols: Array.from(this.bound.keys()),
            inbound: this.inbound,
        };
        return Object.entries(properties)
            .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
            .map((keyValue) => keyValue.join('='))
            .join(' ');
    }
}
exports.Peer = Peer;
//# sourceMappingURL=peer.js.map