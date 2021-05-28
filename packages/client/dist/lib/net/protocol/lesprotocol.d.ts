/// <reference types="bn.js" />
/// <reference types="node" />
import { BN } from 'ethereumjs-util';
import { BlockHeader } from '@ethereumjs/block';
import { Chain } from './../../blockchain';
import { Message, Protocol, ProtocolOptions } from './protocol';
import { FlowControl } from './flowcontrol';
export interface LesProtocolOptions extends ProtocolOptions {
    chain: Chain;
    flow?: FlowControl;
}
declare type GetBlockHeadersOpts = {
    reqId?: BN;
    block: BN | Buffer;
    max: number;
    skip?: number;
    reverse?: boolean;
};
export interface LesProtocolMethods {
    getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<{
        reqId: BN;
        bv: BN;
        headers: BlockHeader[];
    }>;
}
/**
 * Implements les/1 and les/2 protocols
 * @memberof module:net/protocol
 */
export declare class LesProtocol extends Protocol {
    private chain;
    private flow;
    private isServer;
    private protocolMessages;
    /**
     * Create les protocol
     * @param {LesProtocolOptions}
     */
    constructor(options: LesProtocolOptions);
    /**
     * Name of protocol
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
     * Opens protocol and any associated dependencies
     * @return {Promise}
     */
    open(): Promise<boolean | void>;
    /**
     * Encodes status into LES status message payload
     * @return {Object}
     */
    encodeStatus(): any;
    /**
     * Decodes ETH status message payload into a status object
     * @param {Object} status status message payload
     * @return {Object}
     */
    decodeStatus(status: any): any;
}
export {};
