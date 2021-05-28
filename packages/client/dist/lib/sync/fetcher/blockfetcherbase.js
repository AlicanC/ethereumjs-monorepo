"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockFetcherBase = void 0;
const fetcher_1 = require("./fetcher");
class BlockFetcherBase extends fetcher_1.Fetcher {
    /**
     * Create new block fetcher
     * @param {BlockFetcherOptions}
     */
    constructor(options) {
        super(options);
        this.chain = options.chain;
        this.maxPerRequest = options.maxPerRequest ?? 50;
        this.first = options.first;
        this.count = options.count;
    }
    /**
     * Generate list of tasks to fetch
     * @return {Object[]} tasks
     */
    tasks() {
        const { first, count } = this;
        const max = this.maxPerRequest;
        const tasks = [];
        while (count.gten(max)) {
            tasks.push({ first: first.clone(), count: max });
            first.iaddn(max);
            count.isubn(max);
        }
        if (count.gtn(0)) {
            tasks.push({ first: first.clone(), count: count.toNumber() });
        }
        return tasks;
    }
}
exports.BlockFetcherBase = BlockFetcherBase;
//# sourceMappingURL=blockfetcherbase.js.map