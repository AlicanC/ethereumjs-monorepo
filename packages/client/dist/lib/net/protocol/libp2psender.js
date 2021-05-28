"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libp2pSender = void 0;
const it_pipe_1 = __importDefault(require("it-pipe"));
const it_pushable_1 = __importDefault(require("it-pushable"));
const ethereumjs_util_1 = require("ethereumjs-util");
const sender_1 = require("./sender");
// TypeScript doesn't have support yet for ReturnType
// with generic types, so this wrapper is used as a helper.
const wrapperPushable = () => it_pushable_1.default();
/**
 * Libp2p protocol sender
 * @emits message
 * @emits status
 * @memberof module:net/protocol
 */
class Libp2pSender extends sender_1.Sender {
    /**
     * Creates a new Libp2p protocol sender
     * @param {MuxedStream} stream stream to libp2p peer
     */
    constructor(stream) {
        super();
        this.stream = stream;
        this.pushable = it_pushable_1.default();
        this.init();
    }
    init() {
        // outgoing stream
        it_pipe_1.default(this.pushable, this.stream);
        // incoming stream
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        it_pipe_1.default(this.stream, async (source) => {
            var e_1, _a;
            try {
                for (var source_1 = __asyncValues(source), source_1_1; source_1_1 = await source_1.next(), !source_1_1.done;) {
                    const bl = source_1_1.value;
                    // convert BufferList to Buffer
                    const data = bl.slice();
                    try {
                        const [codeBuf, payload] = ethereumjs_util_1.rlp.decode(data);
                        const code = ethereumjs_util_1.bufferToInt(codeBuf);
                        if (code === 0) {
                            const status = {};
                            payload.forEach(([k, v]) => {
                                status[k.toString()] = v;
                            });
                            this.status = status;
                        }
                        else {
                            this.emit('message', { code, payload });
                        }
                    }
                    catch (error) {
                        this.emit('error', error);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (source_1_1 && !source_1_1.done && (_a = source_1.return)) await _a.call(source_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    /**
     * Send a status to peer
     * @param {Object} status
     */
    sendStatus(status) {
        const payload = Object.entries(status).map(([k, v]) => [k, v]);
        this.pushable.push(ethereumjs_util_1.rlp.encode([0, payload]));
    }
    /**
     * Send a message to peer
     * @param  {number} code message code
     * @param  {*}      data message payload
     */
    sendMessage(code, data) {
        this.pushable.push(ethereumjs_util_1.rlp.encode([code, data]));
    }
}
exports.Libp2pSender = Libp2pSender;
//# sourceMappingURL=libp2psender.js.map