import spawn from 'cross-spawn';
import type { SpawnSyncOptions } from 'child_process';

export function spawnSync(cmd: string, opts: SpawnSyncOptions) {
    const result = spawn.sync(cmd, {
        shell: true,
        stdio: 'inherit',
        ...opts,
    });
    if (result.status !== 0) {
        console.error(`Execute command error (${cmd})`);
        process.exit(1);
    }
    return result;
}
