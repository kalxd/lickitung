import { Env, Hono, Context } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../lib/db";
import { reader, runReader } from "../lib/reader";
import { BlankInput } from "hono/types";

const app = new Hono;

const createTag = z.object({
	title: z.string()
});

app.post(
	"/",
	zValidator("json", createTag),
	async c => {
		const body = c.req.valid("json");
		const a = await db.insertInto("tag")
			.values(body)
			.onConflict(o =>
				o.column("title")
					.doUpdateSet({
						title: eb => eb.ref("excluded.title")
					}))
			.returningAll()
			.executeTakeFirstOrThrow();

		return c.json(a);
	}
);

const getHandler = reader<Context<Env, any, BlankInput>, string | undefined>(helper => {
	const ctx = helper.ask();
	return ctx.req.header("Content-Type");
});

const testHandler = reader<Context<Env, "/test", BlankInput>, string>(helper => {
	const header = helper.bindFrom(getHandler);
	if (!header) {
		return "not founed";
	}

	return header;
});

app.post("/test", async ctx => {
	const r = runReader(testHandler, ctx);
	return ctx.json(r);
});

export default app;
