import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { db } from "./lib/db";

let app = new Hono;

app.use(logger());

app.get("/", async c => {
	const a = await db.selectFrom("post")
		.where(q => {
			return q.eb(q.fn("length", ["title"]), ">", 2);
		})
		.selectAll()
		.execute();
	return c.json(a);
});

serve(app);
