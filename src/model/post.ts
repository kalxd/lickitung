import { Generated } from "kysely";

export interface PostTable {
	id: Generated<number>;
	title: string;
	content: string;
	tags: Array<number> | null;
	createAt: Date;
}
