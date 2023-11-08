import { Command } from 'commander'
import { Context } from '../types.js'
import fs from 'fs'
import { color, Listr, ListrDefaultRendererLogLevels } from 'listr2';
import startServer from '../tasks/startServer.js'
import auth from '../tasks/auth.js'
import ctxInit from '../lib/ctx.js'
import getGitInfo from '../tasks/getGitInfo.js';
import createBuild from '../tasks/createBuild.js'
import exec from '../tasks/exec.js'

const command = new Command();

command
    .name('capture')
    .description('Capture screenshots of static sites')
    .argument('<file>', 'Web static config file')
    .action(async function(file, _, command) {
        try {
            let ctx: Context = ctxInit(command.optsWithGlobals());

            // parse arguments
            if (!fs.existsSync(file)) {
                console.log(`Error: Config file ${file} not found.`);
                return;
            }
            ctx.staticConfig = JSON.parse(fs.readFileSync(file, 'utf8'));

            // tasks list
            let tasks = new Listr<Context>(
                [
                    auth(ctx),
                    getGitInfo(ctx),
                    createBuild(ctx),
                    // captureScreenshots(ctx),
                    // showResults(ctx)
                ],
                {
                    rendererOptions: {
                        icon: {
                            [ListrDefaultRendererLogLevels.OUTPUT]: `→`
                        },
                        color: {
                            [ListrDefaultRendererLogLevels.OUTPUT]: color.gray
                        }
                    }
                }
            )

            await tasks.run(ctx)
        } catch (error) {
            console.log(error);
        }

    })

export default command;