// @ts-nocheck
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import { graphqlHTTP } from 'koa-graphql';
import Router from 'koa-router';
import logger from 'koa-logger';

import { schema } from '../schema/schema';
import { getContext } from './getContext';
import { createWebsocketMiddleware } from './websocketMiddleware';
import * as fs from 'fs';
import * as path from 'path';
import rateLimit from "koa-ratelimit"
import Redis from "ioredis"
import { envParsed } from '../config';

const app = new Koa();

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(
	bodyParser({
		onerror(err, ctx) {
			ctx.throw(err, 422);
		},
	})
);

app.use(createWebsocketMiddleware());

// apply rate limit
app.use(rateLimit({
	driver: 'redis',
	db: new Redis(envParsed.REDIS_HOST),
	duration: 5 * 1000,
	max: 10,
	errorMessage: 'Sometimes You Just Have to Slow Down.',
	id: (ctx) => ctx.ip,
	headers: {
		remaining: 'Rate-Limit-Remaining',
		reset: 'Rate-Limit-Reset',
		total: 'Rate-Limit-Total'
	},
	disableHeader: false,
}));

const routes = new Router();

// routes.all('/graphql/ws', wsServer);

routes.all(
	'/graphql',
	graphqlHTTP((req, res, ctx) => ({
		schema,
		graphiql: true,
		context: getContext(req),
	}))
);

routes.get('/', async (ctx) => {
	const filePath = path.join(__dirname, '..', 'public', 'home.html');
	ctx.type = 'html';
	ctx.body = fs.createReadStream(filePath);
});



app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
