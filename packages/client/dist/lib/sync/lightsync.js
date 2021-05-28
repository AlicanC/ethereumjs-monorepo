"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightSynchronizer = void 0;
const sync_1 = require("./sync");
const headerfetcher_1 = require("./fetcher/headerfetcher");
const ethereumjs_util_1 = require("ethereumjs-util");
const util_1 = require("../util");
/**
 * Implements an ethereum light sync synchronizer
 * @memberof module:sync
 */
class LightSynchronizer extends sync_1.Synchronizer {
    constructor(options) {
        super(options);
        this.headerFetcher = null;
    }
    /**
     * Returns synchronizer type
     * @return {string} type
     */
    get type() {
        return 'light';
    }
    /**
     * Returns true if peer can be used for syncing
     * @return {boolean}
     */
    syncable(peer) {
        return peer.les?.status.serveHeaders;
    }
    /**
     * Finds the best peer to sync with. We will synchronize to this peer's
     * blockchain. Returns null if no valid peer is found
     */
    best() {
        let best;
        const peers = this.pool.peers.filter(this.syncable.bind(this));
        if (peers.length < this.config.minPeers && !this.forceSync)
            return;
        for (const peer of peers) {
            if (peer.les) {
                const td = peer.les.status.headTd;
                if ((!best && td.gte(this.chain.headers.td)) ||
                    (best && best.les && best.les.status.headTd.lt(td))) {
                    best = peer;
                }
            }
        }
        return best;
    }
    /**
     * Sync all headers and state from peer starting from current height.
     * @param  peer remote peer to sync with
     * @return Resolves when sync completed
     */
    async syncWithPeer(peer) {
        if (!peer)
            return false;
        const height = new ethereumjs_util_1.BN(peer.les.status.headNum);
        const first = this.chain.headers.height.addn(1);
        const count = height.sub(first).addn(1);
        if (count.lten(0))
            return false;
        this.config.logger.debug(`Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`);
        this.headerFetcher = new headerfetcher_1.HeaderFetcher({
            config: this.config,
            pool: this.pool,
            chain: this.chain,
            flow: this.flow,
            interval: this.interval,
            first,
            count,
        });
        this.headerFetcher
            .on('error', (error) => {
            this.emit('error', error);
        })
            .on('fetched', (headers) => {
            const first = new ethereumjs_util_1.BN(headers[0].number);
            const hash = util_1.short(headers[0].hash());
            this.config.logger.info(`Imported headers count=${headers.length} number=${first.toString(10)} hash=${hash} peers=${this.pool.size}`);
        });
        await this.headerFetcher.fetch();
        // TODO: Should this be deleted?
        // @ts-ignore: error: The operand of a 'delete' operator must be optional
        delete this.headerFetcher;
        return true;
    }
    /**
     * Fetch all headers from current height up to highest found amongst peers
     * @return Resolves with true if sync successful
     */
    async sync() {
        const peer = this.best();
        return this.syncWithPeer(peer);
    }
    /**
     * Open synchronizer. Must be called before sync() is called
     */
    async open() {
        await this.chain.open();
        await this.pool.open();
        const number = this.chain.headers.height.toString(10);
        const td = this.chain.headers.td.toString(10);
        const hash = this.chain.blocks.latest.hash();
        this.config.logger.info(`Latest local header: number=${number} td=${td} hash=${util_1.short(hash)}`);
    }
    /**
     * Stop synchronization. Returns a promise that resolves once its stopped.
     * @return {Promise}
     */
    async stop() {
        if (!this.running) {
            return false;
        }
        if (this.headerFetcher) {
            this.headerFetcher.destroy();
            // TODO: Should this be deleted?
            // @ts-ignore: error: The operand of a 'delete' operator must be optional
            delete this.headerFetcher;
        }
        await super.stop();
        return true;
    }
}
exports.LightSynchronizer = LightSynchronizer;
//# sourceMappingURL=lightsync.js.map