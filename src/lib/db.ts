import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { config } from "./config";
import { PostTable } from "../model/post";
import { TagTable } from "../model/tag";

const dialect = new PostgresDialect({
	pool: new Pool(config.database),
});

export interface Database {
	post: PostTable;
	tag: TagTable;
}

export const db = new Kysely<Database>({
	dialect,
	log(event): void {
		console.log(event.query.sql);
		console.log(event.query.parameters);
	},
	plugins: [
		new CamelCasePlugin()
	]
});
