/// <reference types="bn.js" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Block, BlockHeader } from '@ethereumjs/block';
import Blockchain from '@ethereumjs/blockchain';
import { BN } from 'ethereumjs-util';
import type { LevelUp } from 'levelup';
import { Config } from '../config';
/**
 * The options that the Blockchain constructor can receive.
 */
export interface ChainOptions {
    /**
     * Client configuration instance
     */
    config: Config;
    /**
     * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
     */
    chainDB?: LevelUp;
    /**
     * Specify a blockchain which implements the Chain interface
     */
    blockchain?: Blockchain;
}
/**
 * Returns properties of the canonical blockchain.
 */
export interface ChainBlocks {
    /**
     * The latest block in the chain
     */
    latest: Block | null;
    /**
     * The total difficulty of the blockchain
     */
    td: BN;
    /**
     * The height of the blockchain
     */
    height: BN;
}
/**
 * Returns properties of the canonical headerchain.
 */
export interface ChainHeaders {
    /**
     * The latest header in the chain
     */
    latest: BlockHeader | null;
    /**
     * The total difficulty of the headerchain
     */
    td: BN;
    /**
     * The height of the headerchain
     */
    height: BN;
}
/**
 * common.genesis() <any> with all values converted to Buffer
 */
export interface GenesisBlockParams {
    [key: string]: Buffer;
}
/**
 * Blockchain
 * @memberof module:blockchain
 */
export declare class Chain extends EventEmitter {
    config: Config;
    chainDB: LevelUp;
    blockchain: Blockchain;
    opened: boolean;
    private _headers;
    private _blocks;
    /**
     * Create new chain
     * @param {ChainOptions} options
     */
    constructor(options: ChainOptions);
    /**
     * Resets _header, _blocks
     */
    private reset;
    /**
     * Network ID
     */
    get networkId(): BN;
    /**
     * Genesis block parameters
     */
    get genesis(): GenesisBlockParams;
    /**
     * Returns properties of the canonical headerchain.
     * @return {ChainHeaders}
     */
    get headers(): ChainHeaders;
    /**
     * Returns properties of the canonical blockchain.
     * @return {ChainBlocks}
     */
    get blocks(): ChainBlocks;
    /**
     * Open blockchain and wait for database to load
     * @return {Promise<boolean|void>} Returns false if chain is already open
     */
    open(): Promise<boolean | void>;
    /**
     * Closes chain
     * @return {Promise<boolean|void>} Returns false if chain is closed
     */
    close(): Promise<boolean | void>;
    /**
     * Update blockchain properties (latest block, td, height, etc...)
     * @return {Promise<boolean|void>} Returns false if chain is closed
     */
    update(): Promise<boolean | void>;
    /**
     * Get blocks from blockchain
     * @param  {Buffer | BN}      block   hash or number to start from
     * @param  {number = 1}       max     maximum number of blocks to get
     * @param  {number = 0}       skip    number of blocks to skip
     * @param  {boolean = false}  reverse get blocks in reverse
     * @return {Promise<Block[]>}
     */
    getBlocks(block: Buffer | BN, max?: number, skip?: number, reverse?: boolean): Promise<Block[]>;
    /**
     * Gets a block by its hash or number
     * @param  {Buffer|BN}        block
     * @return {Promise<Block>}
     */
    getBlock(block: Buffer | BN): Promise<Block>;
    /**
     * Insert new blocks into blockchain
     * @param {Block[]} blocks list of blocks to add
     */
    putBlocks(blocks: Block[]): Promise<void>;
    /**
     * Get headers from blockchain
     * @param  {Buffer|BN}  block   block hash or number to start from
     * @param  {number}     max     maximum number of headers to get
     * @param  {number}     skip    number of headers to skip
     * @param  {boolean}    reverse get headers in reverse
     * @return {Promise<BlockHeader[]>}
     */
    getHeaders(block: Buffer | BN, max: number, skip: number, reverse: boolean): Promise<BlockHeader[]>;
    /**
     * Insert new headers into blockchain
     * @param  {BlockHeader[]} headers
     * @return {Promise<void>}
     */
    putHeaders(headers: BlockHeader[]): Promise<void>;
    /**
     * Gets the latest header in the canonical chain
     * @return {Promise<BlockHeader>}
     */
    getLatestHeader(): Promise<BlockHeader>;
    /**
     * Gets the latest block in the canonical chain
     * @return {Promise<Block>}
     */
    getLatestBlock(): Promise<Block>;
    /**
     * Gets total difficulty for a block
     * @param  {Buffer}      hash
     * @param  {BN}          num
     * @return {Promise<BN>}
     */
    getTd(hash: Buffer, num: BN): Promise<BN>;
}
