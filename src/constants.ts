import * as config from "@config";
import { mongo } from "@json/tokens.json";

export const MONGO_PASSWORD = mongo;
export const PREFIX = config.prefix;
export const MANSION = config.servers.mansion;
export const CTCODING = config.servers.programming;
export const OPEN_EMOJI = "⭕";
export const TEST = config.servers.test;
export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const MOD_ROLE = "MOD";
