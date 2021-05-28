/// <reference types="node" />
import * as events from 'events';
import { Protocol, BoundProtocol, EthProtocolMethods, LesProtocolMethods, Sender } from '../protocol';
import { Server } from '../server';
import { Config } from '../../config';
export interface PeerOptions {
    config: Config;
    id?: string;
    address: string;
    transport: string;
    inbound?: boolean;
    protocols?: Protocol[];
    server?: Server;
}
/**
 * Network peer
 * @memberof module:net/peer
 */
export declare class Peer extends events.EventEmitter {
    config: Config;
    id: string;
    address: string;
    inbound: boolean;
    server: Server | undefined;
    bound: Map<string, BoundProtocol>;
    protected transport: string;
    protected protocols: Protocol[];
    private _idle;
    pooled: boolean;
    eth: (BoundProtocol & EthProtocolMethods) | undefined;
    les: (BoundProtocol & LesProtocolMethods) | undefined;
    /**
     * Create new peer
     * @param {PeerOptions}
     */
    constructor(options: PeerOptions);
    /**
     * Get idle state of peer
     * @type {boolean}
     */
    get idle(): boolean;
    /**
     * Set idle state of peer
     * @type {boolean}
     */
    set idle(value: boolean);
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
    bindProtocol(protocol: Protocol, sender: Sender): Promise<void>;
    /**
     * Return true if peer understand the specified protocol name
     * @param protocolName
     */
    understands(protocolName: string): boolean;
    /**
     * Handle unhandled messages along handshake
     */
    handleMessageQueue(): void;
    toString(withFullId?: boolean): string;
}
