import { Context, Env, WebConfigSchema, WebStaticConfigSchema } from '../types.js'
import { DEFAULT_WEB_CONFIG, DEFAULT_WEB_STATIC_CONFIG } from './config.js';
import getEnv from '../lib/env.js'
import httpClient from './httpClient.js';
import fs from 'fs';
import { createContext } from 'vm';
import { string } from 'fastify/types/route.js';

export default (options: Record<string, string>): Context => {
    let env: Env = getEnv();
    let resolutions: Array<Record<string, number>> = []
    let webConfig: WebConfigSchema = DEFAULT_WEB_CONFIG;

    try {
        if (options.config) {
            webConfig = JSON.parse(fs.readFileSync(options.config, 'utf-8'));
        }
        for (let resolution of webConfig.web.resolutions) {
            resolutions.push({ width: resolution[0], height: resolution[1]})
        }
    } catch (error: any) {
        throw new Error(error.message);
    }

    return {
        env: env,
        client: new httpClient(env),
        config: {
            browsers: webConfig.web.browsers,
            resolutions: resolutions
        },
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