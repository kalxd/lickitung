import { Generated } from "kysely";

export interface TagTable {
	id: Generated<number>;
	title: string;
	createAt: Generated<Date>;
}
