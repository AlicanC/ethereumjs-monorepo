/// <reference types="node" />
import multiaddr from 'multiaddr';
import { MultiaddrLike } from '../types';
/**
 * Parses multiaddrs and bootnodes to multiaddr format.
 */
export declare function parseMultiaddrs(input: MultiaddrLike): multiaddr[];
export declare function parseTransports(transports: string[]): {
    name: string;
    options: {
        [key: string]: string;
    };
}[];
export declare function parseParams(json: any, name?: string): Promise<any>;
export declare function parseKey(input: string | Buffer): Buffer;
