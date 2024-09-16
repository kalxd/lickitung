import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../lib/db";

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

const f = {} as any;

app.post("/test", f);

export default app;
