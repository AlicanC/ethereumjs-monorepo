"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowControl = void 0;
/**
 * LES flow control manager
 * @memberof module:net/protocol
 */
class FlowControl {
    constructor(options) {
        var _a, _b, _c;
        this.bl = (_a = options === null || options === void 0 ? void 0 : options.bl) !== null && _a !== void 0 ? _a : 300000000;
        this.mrc = (_b = options === null || options === void 0 ? void 0 : options.mrc) !== null && _b !== void 0 ? _b : {
            GetBlockHeaders: { base: 1000, req: 1000 },
        };
        this.mrr = (_c = options === null || options === void 0 ? void 0 : options.mrr) !== null && _c !== void 0 ? _c : 10000;
        this.out = new Map();
        this.in = new Map();
    }
    /**
     * Process reply message from an LES peer by updating its BLE value
     * @param  {Peer}   peer LES peer
     * @param  {number} bv latest buffer value
     */
    handleReply(peer, bv) {
        var _a;
        const params = (_a = this.in.get(peer.id)) !== null && _a !== void 0 ? _a : {};
        params.ble = bv;
        params.last = Date.now();
        this.in.set(peer.id, params);
    }
    /**
     * Calculate maximum items that can be requested from an LES peer
     * @param  {Peer}   peer LES peer
     * @param  messageName message name
     * @return maximum count
     */
    maxRequestCount(peer, messageName) {
        var _a;
        const now = Date.now();
        const mrcBase = peer.les.status.mrc[messageName].base;
        const mrcReq = peer.les.status.mrc[messageName].req;
        const mrr = peer.les.status.mrr;
        const bl = peer.les.status.bl;
        const params = (_a = this.in.get(peer.id)) !== null && _a !== void 0 ? _a : { ble: bl };
        if (params.last) {
            // recharge BLE at rate of MRR when less than BL
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            params.ble = Math.min(params.ble + mrr * (now - params.last), bl);
        }
        params.last = now;
        this.in.set(peer.id, params);
        // calculate how many messages we can request from peer
        return Math.max(Math.floor((params.ble - mrcBase) / mrcReq), 0);
    }
    /**
     * Calculate new buffer value for an LES peer after an incoming request is
     * processed. If the new value is negative, the peer should be dropped by the
     * caller.
     * @param  {Peer}   peer LES peer
     * @param  messageName message name
     * @param  count number of items to request from peer
     * @return new buffer value after request is sent (if negative, drop peer)
     */
    handleRequest(peer, messageName, count) {
        var _a;
        const now = Date.now();
        const params = (_a = this.out.get(peer.id)) !== null && _a !== void 0 ? _a : {};
        if (params.bv && params.last) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            params.bv = Math.min(params.bv + this.mrr * (now - params.last), this.bl);
        }
        else {
            params.bv = this.bl;
        }
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        params.bv -= this.mrc[messageName].base + this.mrc[messageName].req * count;
        params.last = now;
        if (params.bv < 0) {
            this.out.delete(peer.id);
        }
        else {
            this.out.set(peer.id, params);
        }
        return params.bv;
    }
}
exports.FlowControl = FlowControl;
//# sourceMappingURL=flowcontrol.js.map