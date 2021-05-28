/// <reference types="node" />
import BN from 'bn.js';
import { Address } from './address';
import { ToBufferInputTypes } from './bytes';
export declare type BNLike = BN | PrefixedHexString | number | Buffer;
export declare type BufferLike = Buffer | Uint8Array | number[] | number | BN | TransformableToBuffer | PrefixedHexString;
export declare type PrefixedHexString = string;
/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))`
 */
export declare type AddressLike = Address | Buffer | PrefixedHexString;
export interface TransformableToArray {
    toArray(): Uint8Array;
    toBuffer?(): Buffer;
}
export interface TransformableToBuffer {
    toBuffer(): Buffer;
    toArray?(): Uint8Array;
}
/**
 * Convert BN to 0x-prefixed hex string.
 */
export declare function bnToHex(value: BN): PrefixedHexString;
/**
 * Convert value from BN to RLP (unpadded buffer)
 * @param value value to convert
 */
export declare function bnToRlp(value: BN): Buffer;
/**
 * Type output options
 */
export declare enum TypeOutput {
    Number = 0,
    BN = 1,
    Buffer = 2,
    PrefixedHexString = 3
}
export declare type TypeOutputReturnType = {
    [TypeOutput.Number]: number;
    [TypeOutput.BN]: BN;
    [TypeOutput.Buffer]: Buffer;
    [TypeOutput.PrefixedHexString]: PrefixedHexString;
};
/**
 * Convert an input to a specified type
 * @param input value to convert
 * @param outputType type to output
 */
export declare function toType<T extends TypeOutput>(input: ToBufferInputTypes, outputType: T): TypeOutputReturnType[T];
