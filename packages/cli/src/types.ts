import { Server, IncomingMessage, ServerResponse } from 'http';
import { FastifyInstance } from 'fastify';
import httpClient from './lib/httpClient.js';
import { Options } from 'tsup';


export interface Context {
    env: Env;
    server?: FastifyInstance<Server, IncomingMessage, ServerResponse>;
    client: httpClient;
    config: {
        browsers: Array<string>;
        resolutions: Array<Record<string, number>>;
    };
    staticConfig?: WebStaticConfigSchema;
    build: Build;
    git: Git;
    args: {
        execCommand?: Array<string>
    }
    
}

export interface Env {
    PROJECT_TOKEN: string;
    SMARTUI_CLIENT_API_URL: string;
}

export interface Snapshot {
    name: string;
    dom: string;
}

export interface Git {
    branch: string;
    commitId: string;
    commitAuthor: string;
    commitMessage: string;
    githubURL?: string;
}

export interface Build {
    id: string;
    projectId: string;
    url: string;
}

export interface WebConfigSchema {
    web: {
        browsers: Array<string>;
        resolutions: Array<Array<number>>;
    }
}

export type WebStaticConfigSchema = Array<Record<string, string | number>>;