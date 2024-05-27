import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { z } from "zod";
import { loadConfig } from "./lib/config";

const configC = z.object({
	port: z.number().positive()
});

const config = loadConfig(configC);

console.log(config);

let app = new Hono;

app.use(logger());

app.get("/", c => c.json("hello world"));

serve(app);
