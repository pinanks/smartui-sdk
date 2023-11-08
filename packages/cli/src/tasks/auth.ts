import { ListrTask, ListrRendererFactory } from 'listr2';
import { Context } from '../types.js'
import chalk from 'chalk';
// import startServer from '../lib/server.js'

export default (ctx: Context): ListrTask<Context, ListrRendererFactory, ListrRendererFactory>  =>  {
    return {
        title: `Authenticating with SmartUI`,
        task: async (ctx, task): Promise<void> => {
            try {
                await ctx.client.auth();
                task.output = chalk.gray(`using project token '******#${ctx.env.PROJECT_TOKEN.split('#').pop()}'`);
                task.title = 'Authenticated with SmartUI'
            } catch (error) {
                // log.debug(error)
                throw new Error('Authentication failed')
            }
        },
        rendererOptions: { persistentOutput: true }
    }
}