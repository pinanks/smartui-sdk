import { Context, Env, WebConfigSchema, WebStaticConfigSchema } from '../types.js'
import { DEFAULT_WEB_CONFIG, DEFAULT_WEB_STATIC_CONFIG } from './config.js';
import getEnv from '../lib/env.js'
import httpClient from './httpClient.js';
import fs from 'fs';

export default (options: Record<string, string>): Context => {
    let env: Env = getEnv();
    let config: WebConfigSchema = DEFAULT_WEB_CONFIG;

    try {
        if (options.config) config = JSON.parse(fs.readFileSync(options.config, 'utf-8'));
    } catch (error: any) {
        throw new Error(error.message);
    }

    return {
        env: env,
        client: new httpClient(env),
        config: config,
        git: {
            branch: '',
            commitId: '',
            commitAuthor: '',
            commitMessage: '',
            githubURL: ''
        },
        build: {
            id: '',
            projectId: '',
            url: ''
        },
        args: {}
    }
}