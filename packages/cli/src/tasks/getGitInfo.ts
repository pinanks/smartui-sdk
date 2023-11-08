import { ListrTask, ListrRendererFactory } from 'listr2';
import { execSync } from 'child_process';
import { Context } from '../types.js'
import getGitInfo from '../lib/git.js'
import chalk from 'chalk';

export default (ctx: Context): ListrTask<Context, ListrRendererFactory, ListrRendererFactory>  =>  {
    return {
        title: `Fetching git repo details`,
        task: async (ctx, task): Promise<void> => {
            try {
                // Skip this task if not a git repo
                ctx.git = getGitInfo();
                task.output = chalk.gray(`branch: ${ctx.git.branch}, commit: ${ctx.git.commitId}, author: ${ctx.git.commitAuthor}`);
                task.title = 'Fetched git information'
            } catch (error) {
                // log.debug(error)
                console.error(error);
                task.output = chalk.gray(`build name will be assigned randomly`);
                throw new Error('Not a git repository')
            }
        },
        exitOnError: false,
        rendererOptions: { persistentOutput: true }
    }
}