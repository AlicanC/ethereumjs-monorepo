import { Peer } from '../peer/peer';
interface Mrc {
    [key: string]: {
        base: number;
        req: number;
    };
}
interface FlowParams {
    bv?: number;
    ble?: number;
    last?: number;
}
export interface FlowControlOptions {
    bl?: number;
    mrc?: Mrc;
    mrr?: number;
}
/**
 * LES flow control manager
 * @memberof module:net/protocol
 */
export declare class FlowControl {
    readonly bl: number;
    readonly mrc: Mrc;
    readonly mrr: number;
    readonly out: Map<string, FlowParams>;
    readonly in: Map<string, FlowParams>;
    constructor(options?: FlowControlOptions);
    /**
     * Process reply message from an LES peer by updating its BLE value
     * @param  {Peer}   peer LES peer
     * @param  {number} bv latest buffer value
     */
    handleReply(peer: Peer, bv: number): void;
    /**
     * Calculate maximum items that can be requested from an LES peer
     * @param  {Peer}   peer LES peer
     * @param  messageName message name
     * @return maximum count
     */
    maxRequestCount(peer: Peer, messageName: string): number;
    /**
     * Calculate new buffer value for an LES peer after an incoming request is
     * processed. If the new value is negative, the peer should be dropped by the
     * caller.
     * @param  {Peer}   peer LES peer
     * @param  messageName message name
     * @param  count number of items to request from peer
     * @return new buffer value after request is sent (if negative, drop peer)
     */
    handleRequest(peer: Peer, messageName: string, count: number): number;
}
export {};
