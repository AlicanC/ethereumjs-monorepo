/// <reference types="node" />
import multiaddr from 'multiaddr';
import type Connection from '../../../node_modules/libp2p-interfaces/dist/src/connection/connection';
import type { MuxedStream } from '../../../node_modules/libp2p-interfaces/dist/src/stream-muxer/types';
export declare type Key = Buffer;
export declare type KeyLike = string | Key;
export declare type MultiaddrLike = string | string[] | multiaddr | multiaddr[];
export declare type DnsNetwork = string;
export declare type Libp2pConnection = Connection;
export declare type Libp2pMuxedStream = MuxedStream;
/**
 * QHeap types.
 * @types/qheap does not exist, so we define a custom interface here.
 */
declare type QHeapOptions = {
    comparBefore(a: any, b: any): boolean;
    compar(a: any, b: any): number;
    freeSpace: number;
    size: number;
};
export interface QHeap<T> {
    new (opts: QHeapOptions): QHeap<T>;
    insert(item: T): void;
    push(item: T): void;
    enqueue(item: T): void;
    remove(): T | undefined;
    shift(): T | undefined;
    dequeue(): T | undefined;
    peek(): T | undefined;
    length: number;
    gc(opts: {
        minLength: number;
        maxLength: number;
    }): void;
}
export {};
