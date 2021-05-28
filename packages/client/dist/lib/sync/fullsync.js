"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullSynchronizer = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const util_1 = require("../util");
const sync_1 = require("./sync");
const fetcher_1 = require("./fetcher");
const vmexecution_1 = require("./execution/vmexecution");
/**
 * Implements an ethereum full sync synchronizer
 * @memberof module:sync
 */
class FullSynchronizer extends sync_1.Synchronizer {
    constructor(options) {
        super(options);
        this.blockFetcher = null;
        this.execution = new vmexecution_1.VMExecution({
            config: options.config,
            stateDB: options.stateDB,
            chain: options.chain,
        });
        const self = this;
        this.execution.on('error', async (error) => {
            self.emit('error', error);
            await self.stop();
        });
        this.chain.on('updated', async function () {
            // for some reason, if we use .on('updated', this.runBlocks)
            // it runs in the context of the Chain and not in the FullSync context..?
            if (self.running) {
                await self.execution.run();
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.chain.update();
    }
    /**
     * Returns synchronizer type
     * @return {string} type
     */
    get type() {
        return 'full';
    }
    /**
     * Returns true if peer can be used for syncing
     * @return {boolean}
     */
    syncable(peer) {
        return peer.eth !== undefined;
    }
    /**
     * Finds the best peer to sync with. We will synchronize to this peer's
     * blockchain. Returns null if no valid peer is found
     */
    best() {
        var _a;
        let best;
        const peers = this.pool.peers.filter(this.syncable.bind(this));
        if (peers.length < this.config.minPeers && !this.forceSync)
            return;
        for (const peer of peers) {
            if ((_a = peer.eth) === null || _a === void 0 ? void 0 : _a.status) {
                const td = peer.eth.status.td;
                if ((!best && td.gte(this.chain.blocks.td)) ||
                    (best && best.eth && best.eth.status.td.lt(td))) {
                    best = peer;
                }
            }
        }
        return best;
    }
    /**
     * Get latest header of peer
     * @return {Promise} Resolves with header
     */
    async latest(peer) {
        var _a;
        const headers = await ((_a = peer.eth) === null || _a === void 0 ? void 0 : _a.getBlockHeaders({
            block: peer.eth.status.bestHash,
            max: 1,
        }));
        return headers === null || headers === void 0 ? void 0 : headers[0];
    }
    /**
     * Sync all blocks and state from peer starting from current height.
     * @param  peer remote peer to sync with
     * @return Resolves when sync completed
     */
    async syncWithPeer(peer) {
        if (!peer)
            return false;
        const latest = await this.latest(peer);
        if (!latest)
            return false;
        const height = new ethereumjs_util_1.BN(latest.number);
        const first = this.chain.blocks.height.addn(1);
        const count = height.sub(first).addn(1);
        if (count.lten(0))
            return false;
        this.config.logger.debug(`Syncing with peer: ${peer.toString(true)} height=${height.toString(10)}`);
        this.blockFetcher = new fetcher_1.BlockFetcher({
            config: this.config,
            pool: this.pool,
            chain: this.chain,
            interval: this.interval,
            first,
            count,
        });
        this.blockFetcher
            .on('error', (error) => {
            this.emit('error', error);
        })
            .on('fetched', (blocks) => {
            const first = new ethereumjs_util_1.BN(blocks[0].header.number);
            const hash = util_1.short(blocks[0].hash());
            this.config.logger.info(`Imported blocks count=${blocks.length} number=${first.toString(10)} hash=${hash} hardfork=${this.config.chainCommon.hardfork()} peers=${this.pool.size}`);
        });
        await this.blockFetcher.fetch();
        // TODO: Should this be deleted?
        // @ts-ignore: error: The operand of a 'delete' operator must be optional
        delete this.blockFetcher;
        return true;
    }
    /**
     * Fetch all blocks from current height up to highest found amongst peers
     * @return Resolves with true if sync successful
     */
    async sync() {
        const peer = this.best();
        return this.syncWithPeer(peer);
    }
    /**
     * Chain was updated
     * @param  {Object[]} announcements new block hash announcements
     * @param  {Peer}     peer peer
     * @return {Promise}
     */
    async announced(announcements, _peer) {
        if (announcements.length) {
            const [hash, height] = announcements[announcements.length - 1];
            this.config.logger.debug(`New height: number=${height.toString(10)} hash=${util_1.short(hash)}`);
            // TO DO: download new blocks
        }
    }
    /**
     * Open synchronizer. Must be called before sync() is called
     */
    async open() {
        await this.chain.open();
        await this.execution.open();
        await this.pool.open();
        this.execution.syncing = true;
        const number = this.chain.blocks.height.toNumber();
        const td = this.chain.blocks.td.toString(10);
        const hash = this.chain.blocks.latest.hash();
        this.config.chainCommon.setHardforkByBlockNumber(number);
        this.config.logger.info(`Latest local block: number=${number} td=${td} hash=${util_1.short(hash)} hardfork=${this.config.chainCommon.hardfork()}`);
    }
    /**
     * Stop synchronization. Returns a promise that resolves once its stopped.
     * @return {Promise}
     */
    async stop() {
        this.execution.syncing = false;
        await this.execution.stop();
        if (!this.running) {
            return false;
        }
        if (this.blockFetcher) {
            this.blockFetcher.destroy();
            // TODO: Should this be deleted?
            // @ts-ignore: error: The operand of a 'delete' operator must be optional
            delete this.blockFetcher;
        }
        await super.stop();
        return true;
    }
}
exports.FullSynchronizer = FullSynchronizer;
//# sourceMappingURL=fullsync.js.map