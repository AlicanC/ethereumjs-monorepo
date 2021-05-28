"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerPool = void 0;
const events_1 = require("events");
const server_1 = require("./server");
/**
 * @module net
 */
/**
 * Pool of connected peers
 * @memberof module:net
 * @emits connected
 * @emits disconnected
 * @emits banned
 * @emits added
 * @emits removed
 * @emits message
 * @emits message:{protocol}
 * @emits error
 */
class PeerPool extends events_1.EventEmitter {
    /**
     * Create new peer pool
     * @param {Object}   options constructor parameters
     */
    constructor(options) {
        super();
        this.config = options.config;
        this.pool = new Map();
        this.noPeerPeriods = 0;
        this.opened = false;
        this._statusCheckInterval = null;
        this.init();
    }
    init() {
        this.opened = false;
    }
    /**
     * Open pool
     * @return {Promise}
     */
    async open() {
        if (this.opened) {
            return false;
        }
        this.config.servers.map((s) => {
            s.on('connected', (peer) => {
                this.connected(peer);
            });
            s.on('disconnected', (peer) => {
                this.disconnected(peer);
            });
        });
        this.opened = true;
        // eslint-disable-next-line @typescript-eslint/await-thenable
        this._statusCheckInterval = setInterval(await this._statusCheck.bind(this), 20000);
    }
    /**
     * Close pool
     * @return {Promise}
     */
    async close() {
        this.pool.clear();
        this.opened = false;
        clearInterval(this._statusCheckInterval);
    }
    /**
     * Connected peers
     */
    get peers() {
        const connectedPeers = Array.from(this.pool.values());
        return connectedPeers;
    }
    /**
     * Number of peers in pool
     * @type {number}
     */
    get size() {
        return this.peers.length;
    }
    /**
     * Return true if pool contains the specified peer
     * @param peer object or peer id
     */
    contains(peer) {
        if (typeof peer !== 'string') {
            peer = peer.id;
        }
        return !!this.pool.get(peer);
    }
    /**
     * Returns a random idle peer from the pool
     * @param [filterFn] filter function to apply before finding idle peers
     * @return {Peer}
     */
    idle(filterFn = (_peer) => true) {
        const idle = this.peers.filter((p) => p.idle && filterFn(p));
        const index = Math.floor(Math.random() * idle.length);
        return idle[index];
    }
    /**
     * Handler for peer connections
     * @private
     * @param  {Peer} peer
     */
    connected(peer) {
        if (this.size >= this.config.maxPeers)
            return;
        peer.on('message', (message, protocol) => {
            if (this.pool.get(peer.id)) {
                this.emit('message', message, protocol, peer);
                this.emit(`message:${protocol}`, message, peer);
            }
        });
        peer.on('error', (error) => {
            if (this.pool.get(peer.id)) {
                this.config.logger.warn(`Peer error: ${error} ${peer}`);
                this.ban(peer);
            }
        });
        this.add(peer);
        peer.handleMessageQueue();
    }
    /**
     * Handler for peer disconnections
     * @private
     * @param  {Peer} peer
     */
    disconnected(peer) {
        this.remove(peer);
    }
    /**
     * Ban peer from being added to the pool for a period of time
     * @param  {Peer} peer
     * @param  maxAge ban period in milliseconds
     * @emits  banned
     */
    ban(peer, maxAge = 60000) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!peer.server) {
            return;
        }
        peer.server.ban(peer.id, maxAge);
        this.remove(peer);
        this.emit('banned', peer);
    }
    /**
     * Add peer to pool
     * @param  {Peer} peer
     * @emits added
     * @emits message
     * @emits message:{protocol}
     */
    add(peer) {
        if (peer && peer.id && !this.pool.get(peer.id)) {
            this.pool.set(peer.id, peer);
            peer.pooled = true;
            this.emit('added', peer);
        }
    }
    /**
     * Remove peer from pool
     * @param  {Peer} peer
     * @emits removed
     */
    remove(peer) {
        if (peer && peer.id) {
            if (this.pool.delete(peer.id)) {
                peer.pooled = false;
                this.emit('removed', peer);
            }
        }
    }
    /**
     * Peer pool status check on a repeated interval
     */
    async _statusCheck() {
        if (this.size === 0) {
            this.noPeerPeriods += 1;
            if (this.noPeerPeriods >= 3) {
                const promises = this.config.servers.map(async (server) => {
                    if (server instanceof server_1.RlpxServer && server.discovery) {
                        this.config.logger.info('Restarting RLPx server: bootstrap');
                        await server.stop();
                        await server.start();
                    }
                });
                await Promise.all(promises);
                this.noPeerPeriods = 0;
            }
            else {
                let tablesize = 0;
                this.config.servers.forEach((server) => {
                    var _a;
                    if (server instanceof server_1.RlpxServer && server.discovery) {
                        tablesize = (_a = server.dpt) === null || _a === void 0 ? void 0 : _a.getPeers().length;
                        this.config.logger.info(`Looking for suited peers: peertablesize=${tablesize}`);
                    }
                });
            }
        }
        else {
            this.noPeerPeriods = 0;
        }
    }
}
exports.PeerPool = PeerPool;
//# sourceMappingURL=peerpool.js.map