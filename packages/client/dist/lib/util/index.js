"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientVersion = exports.short = void 0;
/**
 * @module util
 */
const os_1 = require("os");
const package_json_1 = require("../../package.json");
__exportStar(require("./parse"), exports);
function short(buffer) {
    return buffer.toString('hex').slice(0, 8) + '...';
}
exports.short = short;
function getClientVersion() {
    const { version } = process;
    return `EthereumJS/${package_json_1.version}/${os_1.platform()}/node${version.substring(1)}`;
}
exports.getClientVersion = getClientVersion;
//# sourceMappingURL=index.js.map