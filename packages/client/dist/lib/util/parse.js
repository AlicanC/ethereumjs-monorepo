"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKey = exports.parseParams = exports.parseTransports = exports.parseMultiaddrs = void 0;
const url_1 = require("url");
const multiaddr_1 = __importDefault(require("multiaddr"));
const block_1 = require("@ethereumjs/block");
const merkle_patricia_tree_1 = require("merkle-patricia-tree");
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * Parses multiaddrs and bootnodes to multiaddr format.
 */
function parseMultiaddrs(input) {
    if (!input) {
        return [];
    }
    if (!Array.isArray(input) && typeof input === 'object') {
        return [input];
    }
    if (!Array.isArray(input)) {
        input = input.split(',');
    }
    try {
        return input.map((s) => {
            if (multiaddr_1.default.isMultiaddr(s)) {
                return s;
            }
            // parse as multiaddr
            if (s[0] === '/') {
                return multiaddr_1.default(s);
            }
            // parse as object
            if (typeof s === 'object') {
                const { ip, port } = s;
                if (ip && port) {
                    return multiaddr_1.default(`/ip4/${ip}/tcp/${port}`);
                }
            }
            // parse as ip:port
            const match = s.match(/^(\d+\.\d+\.\d+\.\d+):([0-9]+)$/);
            if (match) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_, ip, port] = match;
                return multiaddr_1.default(`/ip4/${ip}/tcp/${port}`);
            }
            // parse using WHATWG URL API
            const { hostname: ip, port } = new url_1.URL(s);
            if (ip && port) {
                return multiaddr_1.default(`/ip4/${ip}/tcp/${port}`);
            }
            throw new Error(`Unable to parse bootnode URL: ${s}`);
        });
    }
    catch (e) {
        throw new Error(`Invalid bootnode URLs: ${e.message}`);
    }
}
exports.parseMultiaddrs = parseMultiaddrs;
function parseTransports(transports) {
    return transports.map((t) => {
        const options = {};
        const [name, ...pairs] = t.split(':');
        if (pairs.length) {
            pairs
                .join(':')
                .split(',')
                .forEach((p) => {
                const [key, value] = p.split('=');
                options[key] = value;
            });
        }
        return { name, options };
    });
}
exports.parseTransports = parseTransports;
async function parseStorage(storage) {
    const trie = new merkle_patricia_tree_1.SecureTrie();
    for (const [address, value] of Object.entries(storage)) {
        const key = Buffer.from(address, 'hex');
        const val = ethereumjs_util_1.rlp.encode(ethereumjs_util_1.unpadBuffer(Buffer.from(value, 'hex')));
        await trie.put(key, val);
    }
    return trie;
}
async function parseGethState(alloc) {
    const trie = new merkle_patricia_tree_1.SecureTrie();
    for (const [key, value] of Object.entries(alloc)) {
        const address = ethereumjs_util_1.isHexPrefixed(key) ? ethereumjs_util_1.toBuffer(key) : Buffer.from(key, 'hex');
        const { balance, code, storage } = value;
        const account = new ethereumjs_util_1.Account();
        if (balance) {
            // note: balance is a Buffer
            account.balance = new ethereumjs_util_1.BN(ethereumjs_util_1.toBuffer(balance));
        }
        if (code) {
            account.codeHash = ethereumjs_util_1.keccak(ethereumjs_util_1.toBuffer(code));
        }
        if (storage) {
            const storageTrie = await parseStorage(storage);
            account.stateRoot = storageTrie.root;
        }
        await trie.put(address, account.serialize());
    }
    return trie;
}
async function parseGethHeader(json) {
    const { gasLimit, difficulty, extraData, number, nonce, timestamp, mixHash, alloc } = json;
    const storageTrie = await parseGethState(alloc);
    const stateRoot = storageTrie.root;
    const headerData = {
        gasLimit,
        difficulty,
        extraData,
        number,
        nonce,
        timestamp,
        mixHash,
        stateRoot,
    };
    return block_1.BlockHeader.fromHeaderData(headerData); // TODO: Pass in common?
}
async function parseGethParams(json) {
    const { name, config, timestamp, gasLimit, difficulty, nonce, extraData, mixHash, coinbase } = json;
    const { chainId } = config;
    const header = await parseGethHeader(json);
    const { stateRoot } = header;
    const hash = header.hash();
    const params = {
        name,
        chainId,
        networkId: chainId,
        genesis: {
            hash,
            timestamp,
            gasLimit,
            difficulty,
            nonce,
            extraData,
            mixHash,
            coinbase,
            stateRoot,
        },
        bootstrapNodes: [],
    };
    const hardforks = [
        'chainstart',
        'homestead',
        'dao',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'hybridCasper',
    ];
    const forkMap = {
        homestead: 'homesteadBlock',
        dao: 'daoForkBlock',
        tangerineWhistle: 'eip150Block',
        spuriousDragon: 'eip155Block',
        byzantium: 'byzantiumBlock',
    };
    params.hardforks = hardforks.map((name) => ({
        name: name,
        block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
    }));
    return params;
}
async function parseParams(json, name) {
    try {
        if (json.config && json.difficulty && json.gasLimit && json.alloc) {
            json.name = json.name || name;
            if (json.nonce === undefined || json.nonce === '0x0') {
                json.nonce = '0x0000000000000000';
            }
            return parseGethParams(json);
        }
        else {
            throw new Error('Invalid format');
        }
    }
    catch (e) {
        throw new Error(`Error parsing parameters file: ${e.message}`);
    }
}
exports.parseParams = parseParams;
function parseKey(input) {
    if (Buffer.isBuffer(input)) {
        return input;
    }
    return Buffer.from(input, 'hex');
}
exports.parseKey = parseKey;
//# sourceMappingURL=parse.js.map