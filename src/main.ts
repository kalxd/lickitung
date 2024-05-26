import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

let app = new Hono;

app.use(logger());

app.get("/", c => c.json("hello world"));

serve(app);
