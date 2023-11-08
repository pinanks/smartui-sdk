import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Env, Snapshot, Git } from '../types.js';

export default class httpClient {
    axiosInstance: AxiosInstance;

    constructor({ SMARTUI_CLIENT_API_URL, PROJECT_TOKEN }: Env) {
        this.axiosInstance = axios.create({
            baseURL: SMARTUI_CLIENT_API_URL,
            headers: { 'projectToken': PROJECT_TOKEN },
        })
    }

    async request(config: AxiosRequestConfig): Promise<Record<string, any>> {
        return this.axiosInstance.request(config)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                if (error.response) {
                    throw new Error(JSON.stringify(error.response.data));
                }
                if (error.request) {
                    throw new Error(error.toJSON().message);
                }
                throw new Error(error.message);
            })
    }

    auth() {
        return this.request({
            url: '/token/verify',
            method: 'GET'
        })
    }

    createBuild({ branch, commitId, commitAuthor, commitMessage, githubURL}: Git, config: any) {
        return this.request({
            url: '/build',
            method: 'POST',
            data: {
                git: {
                    branch,
                    commitId,
                    commitAuthor,
                    commitMessage,
                    githubURL
                },
                config: config
            }
        })
    }

    finalizeBuild(buildId: string) {
        return this.request({
            url: '/build',
            method: 'DELETE',
            params: {
                buildId: buildId
            }
        })
    }

    uploadSnapshot(buildId: string, snapshot: Snapshot) {
        return this.request({
            url: `/builds/${buildId}/snapshot`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { snapshot }
        })
    }
}