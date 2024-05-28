import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../lib/db";

const app = new Hono;

const createPost = z.object({
	title: z.string(),
	content: z.string(),
	tags: z.number().array().optional()
});

app.post(
	"/",
	zValidator("json", createPost),
	async c => {
		const body = c.req.valid("json");

		const result = await db.insertInto("post")
			.values(body)
			.returning(["id", "title", "content", "tags", "createAt"])
			.execute();

		return c.json(result);
	}
);

export default app;
