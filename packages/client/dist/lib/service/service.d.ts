/// <reference types="node" />
import * as events from 'events';
import { Config } from '../config';
import { PeerPool } from '../net/peerpool';
import { Peer } from '../net/peer/peer';
import { Protocol } from '../net/protocol';
export interface ServiceOptions {
    config: Config;
}
/**
 * Base class for all services
 * @memberof module:service
 */
export declare class Service extends events.EventEmitter {
    config: Config;
    opened: boolean;
    running: boolean;
    pool: PeerPool;
    /**
     * Create new service and associated peer pool
     * @param {ServiceOptions}
     */
    constructor(options: ServiceOptions);
    /**
     * Service name
     * @protected
     * @type {string}
     */
    get name(): any;
    /**
     * Returns all protocols required by this service
     * @type {Protocol[]} required protocols
     */
    get protocols(): Protocol[];
    /**
     * Open service. Must be called before service is running
     * @return {Promise}
     */
    open(): Promise<false | undefined>;
    /**
     * Close service.
     * @return {Promise}
     */
    close(): Promise<void>;
    /**
     * Start service
     * @return {Promise}
     */
    start(): Promise<void | boolean>;
    /**
     * Stop service
     * @return {Promise}
     */
    stop(): Promise<void | boolean>;
    /**
     * Handles incoming request from connected peer
     * @param  {Object}  message message object
     * @param  {string}  protocol protocol name
     * @param  {Peer}    peer peer
     * @return {Promise}
     */
    handle(_message: any, _protocol: string, _peer: Peer): Promise<any>;
}
