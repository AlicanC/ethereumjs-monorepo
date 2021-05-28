import { RpcTx } from '../types';
import type { EthereumClient } from '../..';
/**
 * eth_* RPC module
 * @memberof module:rpc/modules
 */
export declare class Eth {
    private client;
    private service;
    private _chain;
    private _vm;
    ethVersion: number;
    /**
     * Create eth_* RPC module
     * @param client Client to which the module binds
     */
    constructor(client: EthereumClient);
    /**
     * Returns number of the most recent block.
     * @param params An empty array
     */
    blockNumber(_params?: never[]): Promise<string>;
    /**
     * Executes a new message call immediately without creating a transaction on the block chain.
     * Currently only "latest" block is supported.
     * @param params An array of two parameters:
     *   1. The transaction object
     *       * from (optional) - The address the transaction is sent from
     *       * to - The address the transaction is directed to
     *       * gas (optional) - Integer of the gas provided for the transaction execution
     *       * gasPrice (optional) - Integer of the gasPrice used for each paid gas
     *       * value (optional) - Integer of the value sent with this transaction
     *       * data (optional) - Hash of the method signature and encoded parameters.
     *   2. integer block number, or the string "latest", "earliest" or "pending"
     * @returns The return value of the executed contract.
     */
    call(params: [RpcTx, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
     * The transaction will not be added to the blockchain.
     * Note that the estimate may be significantly more than the amount of gas actually used by the transaction,
     * for a variety of reasons including EVM mechanics and node performance.
     * Currently only "latest" block is supported.
     * @param params An array of two parameters:
     *   1. The transaction object
     *       * from (optional) - The address the transaction is sent from
     *       * to - The address the transaction is directed to
     *       * gas (optional) - Integer of the gas provided for the transaction execution
     *       * gasPrice (optional) - Integer of the gasPrice used for each paid gas
     *       * value (optional) - Integer of the value sent with this transaction
     *       * data (optional) - Hash of the method signature and encoded parameters.
     *   2. integer block number, or the string "latest", "earliest" or "pending"
     * @returns The amount of gas used.
     */
    estimateGas(params: [RpcTx, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Returns the balance of the account at the given address.
     * Currently only "latest" block is supported.
     * @param params An array of two parameters:
     *   1. address of the account
     *   2. integer block number, or the string "latest", "earliest" or "pending"
     */
    getBalance(params: [string, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Returns information about a block by block number.
     * @param params An array of two parameters:
     *   1. integer of a block number
     *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
     */
    getBlockByNumber(params: [string, boolean]): Promise<import("@ethereumjs/block").JsonBlock>;
    /**
     * Returns information about a block by hash.
     * @param params An array of two parameters:
     *   1. a block hash
     *   2. boolean - if true returns the full transaction objects, if false only the hashes of the transactions.
     */
    getBlockByHash(params: [string, boolean]): Promise<import("@ethereumjs/block").JsonBlock>;
    /**
     * Returns the transaction count for a block given by the block hash.
     * @param params An array of one parameter: A block hash
     */
    getBlockTransactionCountByHash(params: [string]): Promise<string>;
    /**
     * Returns code of the account at the given address.
     * Currently only "latest" block is supported.
     * @param params An array of two parameters:
     *   1. address of the account
     *   2. integer block number, or the string "latest", "earliest" or "pending"
     */
    getCode(params: [string, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Returns the value from a storage position at a given address.
     * Currently only "latest" block is supported.
     * @param params An array of three parameters:
     *   1. address of the storage
     *   2. integer of the position in the storage
     *   3. integer block number, or the string "latest", "earliest" or "pending"
     */
    getStorageAt(params: [string, string, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Returns the number of transactions sent from an address.
     * Currently only "latest" block is supported.
     * @param params An array of two parameters:
     *   1. address of the account
     *   2. integer block number, or the string "latest", "earliest" or "pending"
     */
    getTransactionCount(params: [string, string]): Promise<string | {
        code: number;
        message: string;
    }>;
    /**
     * Returns the current ethereum protocol version as a hex-encoded string
     * @param params An empty array
     */
    protocolVersion(_params?: never[]): string;
    /**
     * Returns the number of uncles in a block from a block matching the given block number
     * @param params An array of one parameter:
     *   1: hexidecimal representation of a block number
     */
    getUncleCountByBlockNumber(params: [string]): Promise<number | {
        code: number;
        message: string;
    }>;
    /**
     * Creates new message call transaction or a contract creation for signed transactions.
     * @param params An array of one parameter:
     *   1. the signed transaction data
     * @returns a 32-byte tx hash or the zero hash if the tx is not yet available.
     */
    sendRawTransaction(params: [string]): Promise<string | {
        code: number;
        message: string;
    }>;
}
