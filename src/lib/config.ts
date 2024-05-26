import { ZodType } from "zod";

const curEnv = process.env ?? "development";
console.log(curEnv);

export const loadConfig = <T>(codec: ZodType<T>): T => {
	return codec.parse({});
};
