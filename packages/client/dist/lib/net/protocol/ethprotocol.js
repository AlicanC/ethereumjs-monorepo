"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthProtocol = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const block_1 = require("@ethereumjs/block");
const protocol_1 = require("./protocol");
/**
 * Implements eth/62 and eth/63 protocols
 * @memberof module:net/protocol
 */
class EthProtocol extends protocol_1.Protocol {
    /**
     * Create eth protocol
     * @param {EthProtocolOptions}
     */
    constructor(options) {
        super(options);
        this.protocolMessages = [
            {
                name: 'NewBlockHashes',
                code: 0x01,
                encode: (hashes) => hashes.map((hn) => [hn[0], hn[1].toArrayLike(Buffer)]),
                decode: (hashes) => hashes.map((hn) => [hn[0], new ethereumjs_util_1.BN(hn[1])]),
            },
            {
                name: 'Transactions',
                code: 0x02,
            },
            {
                name: 'GetBlockHeaders',
                code: 0x03,
                response: 0x04,
                encode: ({ block, max, skip = 0, reverse = false }) => [
                    ethereumjs_util_1.BN.isBN(block) ? block.toArrayLike(Buffer) : block,
                    max,
                    skip,
                    !reverse ? 0 : 1,
                ],
                decode: ([block, max, skip, reverse]) => ({
                    block: block.length === 32 ? block : new ethereumjs_util_1.BN(block),
                    max: ethereumjs_util_1.bufferToInt(max),
                    skip: ethereumjs_util_1.bufferToInt(skip),
                    reverse: ethereumjs_util_1.bufferToInt(reverse) === 0 ? false : true,
                }),
            },
            {
                name: 'BlockHeaders',
                code: 0x04,
                encode: (headers) => headers.map((h) => h.raw()),
                decode: (headers) => {
                    return headers.map((h) => block_1.BlockHeader.fromValuesArray(h, {
                        hardforkByBlockNumber: true,
                        common: this.config.chainCommon,
                    }));
                },
            },
            {
                name: 'GetBlockBodies',
                code: 0x05,
                response: 0x06,
            },
            {
                name: 'BlockBodies',
                code: 0x06,
            },
        ];
        this.chain = options.chain;
    }
    /**
     * Name of protocol
     * @type {string}
     */
    get name() {
        return 'eth';
    }
    /**
     * Protocol versions supported
     * @type {number[]}
     */
    get versions() {
        return [65, 64, 63];
    }
    /**
     * Messages defined by this protocol
     * @type {Protocol~Message[]}
     */
    get messages() {
        return this.protocolMessages;
    }
    /**
     * Opens protocol and any associated dependencies
     * @return {Promise}
     */
    async open() {
        if (this.opened) {
            return false;
        }
        await this.chain.open();
        this.opened = true;
    }
    /**
     * Encodes status into ETH status message payload
     * @return {Object}
     */
    encodeStatus() {
        // TODO: add latestBlock for more precise ETH/64 forkhash switch
        return {
            networkId: this.chain.networkId.toArrayLike(Buffer),
            td: this.chain.blocks.td.toArrayLike(Buffer),
            bestHash: this.chain.blocks.latest.hash(),
            genesisHash: this.chain.genesis.hash,
        };
    }
    /**
     * Decodes ETH status message payload into a status object
     * @param {Object} status status message payload
     * @return {Object}
     */
    decodeStatus(status) {
        return {
            networkId: new ethereumjs_util_1.BN(status.networkId),
            td: new ethereumjs_util_1.BN(status.td),
            bestHash: status.bestHash,
            genesisHash: status.genesisHash,
        };
    }
}
exports.EthProtocol = EthProtocol;
//# sourceMappingURL=ethprotocol.js.map