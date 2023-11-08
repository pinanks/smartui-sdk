import { ListrTask, ListrRendererFactory } from 'listr2';
import { Context } from '../types.js'
import chalk from 'chalk';
import spawn from 'cross-spawn'
// import { spawnSync } from 'child_process';


export default (ctx: Context): ListrTask<Context, ListrRendererFactory, ListrRendererFactory>  =>  {
    return {
        title: `Executing '${ctx.args.execCommand.join(' ')}'`,
        task: async (ctx, task): Promise<void> => {
            const child = spawn(ctx.args.execCommand[0], ctx.args.execCommand.slice(1), { stdio: 'inherit' });

            // if (result.error) {
            //     console.log(`spawnSync error: ${result.error.message}`);
            // }
            
            return new Promise((resolve, reject) => {
                child.on('error', (error) => {
                    task.output = chalk.gray(`error: ${error.message}`)
                    throw new Error(`Failed to start subprocess`);
                });

                child.on('close', async (code, signal) => {
                    if (code !== null) {
                        task.output = chalk.gray(`Child process exited with code ${code}`);
                    } else if (signal !== null) {
                        throw new Error(`Child process killed with signal ${signal}`);
                    }``

                    resolve();
                });
            });
        },
        rendererOptions: { persistentOutput: true }
    }
}