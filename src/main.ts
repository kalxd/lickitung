import { Hono } from "hono";
import { serve } from "@hono/node-server";

let app = new Hono;

app.get("/", c => c.json("hello world"));

serve(app);
