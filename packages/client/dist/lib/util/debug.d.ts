import { Block } from '@ethereumjs/block';
import { VMExecution } from '../sync/execution';
/**
 * Generates a code snippet which can be used to replay an erraneous block
 * locally in the VM
 *
 * @param block
 */
export declare function debugCodeReplayBlock(execution: VMExecution, block: Block): Promise<void>;
