import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

import post from "./handler/post";

const app = new Hono;

app.route("/post", post);

app.use(logger());

serve(app);
