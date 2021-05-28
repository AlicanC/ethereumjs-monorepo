/// <reference types="node" />
import BN from 'bn.js';
import { BNLike } from './types';
export interface ECDSASignature {
    v: number;
    r: Buffer;
    s: Buffer;
}
export interface ECDSASignatureBuffer {
    v: Buffer;
    r: Buffer;
    s: Buffer;
}
/**
 * Returns the ECDSA signature of a message hash.
 */
export declare function ecsign(msgHash: Buffer, privateKey: Buffer, chainId?: number): ECDSASignature;
export declare function ecsign(msgHash: Buffer, privateKey: Buffer, chainId: BNLike): ECDSASignatureBuffer;
/**
 * ECDSA public key recovery from signature.
 * @returns Recovered public key
 */
export declare const ecrecover: (msgHash: Buffer, v: BNLike, r: Buffer, s: Buffer, chainId?: string | number | Buffer | BN | undefined) => Buffer;
/**
 * Convert signature parameters into the format of `eth_sign` RPC method.
 * @returns Signature
 */
export declare const toRpcSig: (v: BNLike, r: Buffer, s: Buffer, chainId?: string | number | Buffer | BN | undefined) => string;
/**
 * Convert signature format of the `eth_sign` RPC method to signature parameters
 * NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053
 */
export declare const fromRpcSig: (sig: string) => ECDSASignature;
/**
 * Validate a ECDSA signature.
 * @param homesteadOrLater Indicates whether this is being used on either the homestead hardfork or a later one
 */
export declare const isValidSignature: (v: BNLike, r: Buffer, s: Buffer, homesteadOrLater?: boolean, chainId?: string | number | Buffer | BN | undefined) => boolean;
/**
 * Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
 * The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
 * call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
 * used to produce the signature.
 */
export declare const hashPersonalMessage: (message: Buffer) => Buffer;
