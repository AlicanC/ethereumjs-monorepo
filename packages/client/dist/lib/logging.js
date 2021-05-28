"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const winston_1 = require("winston");
const levelColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'white',
};
const { combine, timestamp, label, printf } = winston_1.format;
const errorFormat = winston_1.format((info) => {
    if (info.message instanceof Error && info.message.stack) {
        info.message = info.message.stack;
    }
    if (info instanceof Error && info.stack) {
        return Object.assign({}, info, { message: info.stack });
    }
    return info;
});
function logFormat() {
    return printf((info) => {
        // @ts-ignore: implicitly has an 'any' TODO
        const color = chalk_1.default[levelColors[info.level]].bind(chalk_1.default);
        const level = color(info.level.toUpperCase());
        const re = /(\w+)=(.+?)(?:\s|$)/g;
        info.message = info.message.replace(re, (_, tag, char) => `${color(tag)}=${char} `);
        return `${level} [${info.timestamp}] ${info.message}`;
    });
}
function getLogger(options = { loglevel: 'info' }) {
    const loggerOptions = {
        format: combine(errorFormat(), winston_1.format.splat(), label({ label: 'ethereumjs' }), timestamp({ format: 'MM-DD|HH:mm:ss' }), logFormat()),
        level: options.loglevel,
        silent: options.loglevel === 'off',
        transports: [new winston_1.transports.Console()],
    };
    const logger = winston_1.createLogger(loggerOptions);
    return logger;
}
exports.getLogger = getLogger;
//# sourceMappingURL=logging.js.map