import { Command } from 'commander'
import which from 'which'
import { Context } from '../types.js'
import { color, Listr, ListrDefaultRendererLogLevels } from 'listr2';
import startServer from '../tasks/startServer.js'
import auth from '../tasks/auth.js'
import ctxInit from '../lib/ctx.js'
import getGitInfo from '../tasks/getGitInfo.js';
import createBuild from '../tasks/createBuild.js'
import exec from '../tasks/exec.js'

const command = new Command();

command
    .name('exec')
    .description('Run test commands around SmartUI')
    .argument('<command...>', 'Command supplied for running tests')
    .action(async function(execCommand, _, command) {
        // print package version and check for update
        // logger and linter
        let ctx: Context = ctxInit(command.optsWithGlobals());

        if (!which.sync(execCommand[0], { nothrow: true })) {
            console.log(`Error: Command not found "${execCommand[0]}"`);
            return
        }
        ctx.args.execCommand = execCommand

        // listr2
        let tasks = new Listr<Context>(
            [
                auth(ctx),
                startServer(ctx),
                getGitInfo(ctx),
                createBuild(ctx),
                exec(ctx),
                // showResults(ctx)
            ],
            {
                rendererOptions: {
                    icon: {
                        // [ListrDefaultRendererLogLevels.COMPLETED]: 'hey completed!'
                        [ListrDefaultRendererLogLevels.OUTPUT]: `→`
                      },
                      color: {
                        // [ListrDefaultRendererLogLevels.COMPLETED]: (data): string => color.bgGreen(color.black(data)),
                        [ListrDefaultRendererLogLevels.OUTPUT]: color.gray
                      }
                }
            }
        )

        try {
            await tasks.run(ctx)
            // await ctx.client.finalizeBuild(ctx.build.id);
        } catch (error) {
            // console.error(error);
            console.log('\nRefer docs: https://www.lambdatest.com/support/docs/smart-visual-regression-testing/')
        }

        // await new Promise(resolve => setTimeout(resolve, 60000));
        await ctx.server?.close();
        await ctx.client.finalizeBuild(ctx.build.id);
    })

export default command;