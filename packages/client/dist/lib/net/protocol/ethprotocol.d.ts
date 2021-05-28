/// <reference types="node" />
/// <reference types="bn.js" />
import { BN } from 'ethereumjs-util';
import { BlockHeader } from '@ethereumjs/block';
import { Chain } from './../../blockchain';
import { Message, Protocol, ProtocolOptions } from './protocol';
import { BlockBodyBuffer } from '@ethereumjs/block';
interface EthProtocolOptions extends ProtocolOptions {
    chain: Chain;
}
declare type GetBlockHeadersOpts = {
    block: BN | Buffer;
    max: number;
    skip?: number;
    reverse?: boolean;
};
export interface EthProtocolMethods {
    getBlockHeaders: (opts: GetBlockHeadersOpts) => Promise<BlockHeader[]>;
    getBlockBodies: (hashes: Buffer[]) => Promise<BlockBodyBuffer[]>;
}
/**
 * Implements eth/62 and eth/63 protocols
 * @memberof module:net/protocol
 */
export declare class EthProtocol extends Protocol {
    private chain;
    private protocolMessages;
    /**
     * Create eth protocol
     * @param {EthProtocolOptions}
     */
    constructor(options: EthProtocolOptions);
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
     * Encodes status into ETH status message payload
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
