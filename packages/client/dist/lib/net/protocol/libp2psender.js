"use strict";
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
            for await (const bl of source) {
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