import type { EthereumClient } from '../..';
/**
 * web3_* RPC module
 * @memberof module:rpc/modules
 */
export declare class Web3 {
    private _chain?;
    /**
     * Create web3_* RPC module
     * @param client Client to which the module binds
     */
    constructor(client: EthereumClient);
    /**
     * Returns the current client version
     * @param params An empty array
     */
    clientVersion(_params?: never[]): string;
    /**
     * Returns Keccak-256 (not the standardized SHA3-256) of the given data
     * @param params The data to convert into a SHA3 hash
     */
    sha3(params: string[]): string;
}
