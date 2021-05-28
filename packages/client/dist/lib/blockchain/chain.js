"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const events_1 = require("events");
const block_1 = require("@ethereumjs/block");
const blockchain_1 = __importDefault(require("@ethereumjs/blockchain"));
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * Blockchain
 * @memberof module:blockchain
 */
class Chain extends events_1.EventEmitter {
    /**
     * Create new chain
     * @param {ChainOptions} options
     */
    constructor(options) {
        super();
        this._headers = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
        this._blocks = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
        this.config = options.config;
        let validateConsensus = false;
        if (this.config.chainCommon.consensusAlgorithm() === 'clique') {
            validateConsensus = true;
        }
        this.blockchain =
            options.blockchain ??
                new blockchain_1.default({
                    db: options.chainDB,
                    common: this.config.chainCommon,
                    hardforkByHeadBlockNumber: true,
                    validateBlocks: true,
                    validateConsensus,
                });
        this.chainDB = this.blockchain.db;
        this.opened = false;
    }
    /**
     * Resets _header, _blocks
     */
    reset() {
        this._headers = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
        this._blocks = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
    }
    /**
     * Network ID
     */
    get networkId() {
        return this.config.chainCommon.networkIdBN();
    }
    /**
     * Genesis block parameters
     */
    get genesis() {
        const genesis = this.config.chainCommon.genesis();
        Object.entries(genesis).forEach(([k, v]) => {
            genesis[k] = ethereumjs_util_1.toBuffer(v);
        });
        return genesis;
    }
    /**
     * Returns properties of the canonical headerchain.
     * @return {ChainHeaders}
     */
    get headers() {
        return { ...this._headers };
    }
    /**
     * Returns properties of the canonical blockchain.
     * @return {ChainBlocks}
     */
    get blocks() {
        return { ...this._blocks };
    }
    /**
     * Open blockchain and wait for database to load
     * @return {Promise<boolean|void>} Returns false if chain is already open
     */
    async open() {
        if (this.opened) {
            return false;
        }
        await this.blockchain.db.open();
        this.opened = true;
        await this.update();
    }
    /**
     * Closes chain
     * @return {Promise<boolean|void>} Returns false if chain is closed
     */
    async close() {
        if (!this.opened) {
            return false;
        }
        this.reset();
        await this.blockchain.db.close();
        this.opened = false;
    }
    /**
     * Update blockchain properties (latest block, td, height, etc...)
     * @return {Promise<boolean|void>} Returns false if chain is closed
     */
    async update() {
        if (!this.opened) {
            return false;
        }
        const headers = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
        const blocks = {
            latest: null,
            td: new ethereumjs_util_1.BN(0),
            height: new ethereumjs_util_1.BN(0),
        };
        headers.latest = await this.getLatestHeader();
        blocks.latest = await this.getLatestBlock();
        headers.height = headers.latest.number;
        blocks.height = blocks.latest.header.number;
        headers.td = await this.getTd(headers.latest.hash(), headers.height);
        blocks.td = await this.getTd(blocks.latest.hash(), blocks.height);
        this._headers = headers;
        this._blocks = blocks;
        this.emit('updated');
    }
    /**
     * Get blocks from blockchain
     * @param  {Buffer | BN}      block   hash or number to start from
     * @param  {number = 1}       max     maximum number of blocks to get
     * @param  {number = 0}       skip    number of blocks to skip
     * @param  {boolean = false}  reverse get blocks in reverse
     * @return {Promise<Block[]>}
     */
    async getBlocks(block, max = 1, skip = 0, reverse = false) {
        await this.open();
        return this.blockchain.getBlocks(block, max, skip, reverse);
    }
    /**
     * Gets a block by its hash or number
     * @param  {Buffer|BN}        block
     * @return {Promise<Block>}
     */
    async getBlock(block) {
        await this.open();
        return this.blockchain.getBlock(block);
    }
    /**
     * Insert new blocks into blockchain
     * @param {Block[]} blocks list of blocks to add
     */
    async putBlocks(blocks) {
        if (blocks.length === 0) {
            return;
        }
        await this.open();
        blocks = blocks.map((b) => block_1.Block.fromValuesArray(b.raw(), {
            common: this.config.chainCommon,
            hardforkByBlockNumber: true,
        }));
        await this.blockchain.putBlocks(blocks);
        await this.update();
    }
    /**
     * Get headers from blockchain
     * @param  {Buffer|BN}  block   block hash or number to start from
     * @param  {number}     max     maximum number of headers to get
     * @param  {number}     skip    number of headers to skip
     * @param  {boolean}    reverse get headers in reverse
     * @return {Promise<BlockHeader[]>}
     */
    async getHeaders(block, max, skip, reverse) {
        const blocks = await this.getBlocks(block, max, skip, reverse);
        return blocks.map((b) => b.header);
    }
    /**
     * Insert new headers into blockchain
     * @param  {BlockHeader[]} headers
     * @return {Promise<void>}
     */
    async putHeaders(headers) {
        if (headers.length === 0) {
            return;
        }
        await this.open();
        headers = headers.map((h) => block_1.BlockHeader.fromValuesArray(h.raw(), {
            common: this.config.chainCommon,
            hardforkByBlockNumber: true,
        }));
        await this.blockchain.putHeaders(headers);
        await this.update();
    }
    /**
     * Gets the latest header in the canonical chain
     * @return {Promise<BlockHeader>}
     */
    async getLatestHeader() {
        await this.open();
        return this.blockchain.getLatestHeader();
    }
    /**
     * Gets the latest block in the canonical chain
     * @return {Promise<Block>}
     */
    async getLatestBlock() {
        await this.open();
        return this.blockchain.getLatestBlock();
    }
    /**
     * Gets total difficulty for a block
     * @param  {Buffer}      hash
     * @param  {BN}          num
     * @return {Promise<BN>}
     */
    async getTd(hash, num) {
        await this.open();
        return this.blockchain.getTotalDifficulty(hash, num);
    }
}
exports.Chain = Chain;
//# sourceMappingURL=chain.js.map