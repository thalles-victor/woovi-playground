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
	// const filePath = path.join(__dirname, '..', 'public', 'index.html');
	const filePath = path.join(__dirname, "home.html");
	ctx.type = 'html';
	ctx.body = fs.createReadStream(filePath);
});



app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
