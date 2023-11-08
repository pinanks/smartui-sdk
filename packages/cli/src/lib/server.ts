import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import { readFileSync, writeFileSync } from 'node:fs';
import { Context, Snapshot } from '../types.js';

export default async (ctx: Context): Promise<FastifyInstance<Server, IncomingMessage, ServerResponse>> => {
	
	const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: false });
	const opts: RouteShorthandOptions = {};
	const SMARTUI_DOM = readFileSync(require.resolve('@lambdatest/serialize-dom'), 'utf-8');

	server.get('/dom', opts, (request, reply) => {
		reply.code(200).send({ data: { dom: SMARTUI_DOM }});
	});


	server.post('/snapshot', opts, async (request, reply) => {
		request.body.dom = Buffer.from(request.body.dom).toString('base64');
		try {
			await ctx.client.uploadSnapshot(ctx.build.id, request.body)
		} catch (error) {
			reply.code(500).send({ error: { message: 'it does not work'}})
		}
		reply.code(200).send({ data: { status: 'it works' }});
	})

	try {
		await server.listen({ port: 8080 })
	} catch (error: any) {
		throw new Error(error.message);
	}

	return server;
}