"use strict";
/**
 * Libp2p Bundle
 * @memberof module:net/peer
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libp2pNode = void 0;
const libp2p_1 = __importDefault(require("libp2p"));
const libp2p_noise_1 = require("libp2p-noise");
// types currently unavailable for below libp2p deps,
// tracking issue: https://github.com/libp2p/js-libp2p/issues/659
const LibP2pTcp = require('libp2p-tcp');
const LibP2pWebsockets = require('libp2p-websockets');
const filters = require('libp2p-websockets/src/filters');
const LibP2pBootstrap = require('libp2p-bootstrap');
const LibP2pKadDht = require('libp2p-kad-dht');
const mplex = require('libp2p-mplex');
class Libp2pNode extends libp2p_1.default {
    constructor(options) {
        var _a;
        const wsTransportKey = LibP2pWebsockets.prototype[Symbol.toStringTag];
        options.bootnodes = (_a = options.bootnodes) !== null && _a !== void 0 ? _a : [];
        super({
            peerId: options.peerId,
            addresses: options.addresses,
            modules: {
                transport: [LibP2pTcp, LibP2pWebsockets],
                streamMuxer: [mplex],
                connEncryption: [libp2p_noise_1.NOISE],
                ['peerDiscovery']: [LibP2pBootstrap],
                ['dht']: LibP2pKadDht,
            },
            config: {
                transport: {
                    [wsTransportKey]: {
                        filter: filters.all,
                    },
                },
                peerDiscovery: {
                    autoDial: false,
                    [LibP2pBootstrap.tag]: {
                        interval: 2000,
                        enabled: options.bootnodes.length > 0,
                        list: options.bootnodes,
                    },
                },
                dht: {
                    kBucketSize: 20,
                },
            },
        });
    }
}
exports.Libp2pNode = Libp2pNode;
//# sourceMappingURL=libp2pnode.js.map