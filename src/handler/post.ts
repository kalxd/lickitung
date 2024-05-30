import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../lib/db";
import { sql } from "kysely";
import { groupBy } from "../lib/fn";

const app = new Hono;

const createPost = z.object({
	title: z.string(),
	content: z.string(),
	tags: z.number().array().optional()
});

const tagCodec = z.object({
	tagId: z.number().positive(),
	tagTitle: z.string()
});

const postCodec = z.object({
	id: z.number().positive(),
	title: z.string(),
	createAt: z.date(),
	tags: tagCodec.array()
})

app.get("/", c => db.selectFrom([
	"post",
	_ => sql<{ id: number }>`unnest(tags)`.as<"t">(sql`t(id)`)
])
	.leftJoin("tag", "tag.id", "t.id")
	.selectAll("post")
	.select(["tag.title as tagTitle", "tag.id as tagId"])
	.where("tag.id", "is not", null)
	.execute()
	.then(xs => {
		return groupBy(x => x.id, xs)
			.map(xs => {
				const tags = xs.map(x => tagCodec.parse(x));
				const post = postCodec.parse({
					...xs[0],
					tags
				});
				return post;
			});
	})
	.then(a => c.json(a)));

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
