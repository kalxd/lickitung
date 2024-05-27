import { z } from "zod";

export const databaseCodec = z.object({
	database: z.string().optional(),
	host: z.string().optional(),
	user: z.string().optional(),
	port: z.number().positive().optional(),
	password: z.string().optional()
});

export const configCodec = z.object({
	port: z.number().positive(),
	database: databaseCodec.optional()
});
