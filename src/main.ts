import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import "./lib/reader";

import post from "./handler/post";
import tag from "./handler/tag";

const app = new Hono;

app.route("/post", post);
app.route("/tag", tag);

app.use(logger());

serve(app);
