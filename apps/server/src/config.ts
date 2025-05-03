// @ts-nocheck
import path from 'path';
import { z } from "zod"

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;

/**@deprecated */
export const config = {
	PORT: ENV.PORT ?? 4000,
	MONGO_URI: ENV.MONGO_URI ?? '',
	JWT_SECRET: ENV.JWT_SECRET ?? '',
	JWT_EXPIRES_IN: ENV.JWT_EXPIRES_IN ?? '',
};

const envSchema = z.object({
	PORT: z.string().default('4000'),
	MONGO_URI: z.string(),
	JWT_SECRET: z.string().min(100),
	JWT_EXPIRES_IN: z.string().default('1d'),
})

export const envParsed = envSchema.parse(ENV);

