import { Logger as WinstonLogger } from 'winston';
export declare type Logger = WinstonLogger;
export declare function getLogger(options?: {
    loglevel: string;
}): WinstonLogger;
