import { ListrTask, ListrRendererFactory } from 'listr2';
import { Context } from '../types.js'
import chalk from 'chalk';

export default (ctx: Context): ListrTask<Context, ListrRendererFactory, ListrRendererFactory>  =>  {
    return {
        title: `Creating SmartUI build`,
        task: async (ctx, task): Promise<void> => {
            try {
                let resp = await ctx.client.createBuild(ctx.git, ctx.config);
                let buildDetails = new URLSearchParams(new URL(resp.buildURL).search);
                ctx.build = {
                    id: buildDetails.get('buildid') ?? '',
                    projectId: buildDetails.get('projectid') ?? '',
                    url: resp.buildURL
                }
                task.output = chalk.gray(`build url: ${resp.buildURL}`);
                task.title = 'SmartUI build created'
            } catch (error) {
                // log.debug(error)
                throw new Error('SmartUI build creation failed');
            }
        },
        rendererOptions: { persistentOutput: true }
    }
}