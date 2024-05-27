import { ZodType } from "zod";
import { readFileSync, statSync } from "node:fs";
import * as path from "node:path";
import { configCodec } from "../interface/config";

const curEnv = process.env.NODE_ENV ?? "development";

const isFileExist = (filepath: string): boolean => {
	try {
		statSync(filepath);
		return true;
	}
	catch {
		return false;
	}
};

const concatFileName = (filename: string): string =>
	path.join(process.cwd(), "config", filename);

const sampleConfigPath = concatFileName("sample.json");

const loadConfigFromPath = (filepath: string): object => {
	const content = readFileSync(filepath, "utf-8");
	try {
		const obj = JSON.parse(content);
		if (Array.isArray(obj)) {
			throw new Error(`${filepath}不能是数组`)
		}
		else if (typeof obj === "object") {
			return obj;
		}
		else {
			throw new Error(`${filepath}不是有效的对象`);
		}
	}
	catch (e) {
		console.error(e);
		throw new Error(`${filepath}不是有效的配置`);
	}
};

const readCurrentConfig = (): object | undefined => {
	const configPath = concatFileName(`${curEnv}.json`);
	if (isFileExist(configPath)) {
		return loadConfigFromPath(configPath);
	}
	return undefined;
};

export const loadConfig = <T>(codec: ZodType<T>): T => {
	const sampleConfig = loadConfigFromPath(sampleConfigPath);
	const curConfig = readCurrentConfig();
	const config = {
		...sampleConfig,
		...curConfig
	};

	return codec.parse(config);
};

export const config = loadConfig(configCodec);
