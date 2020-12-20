import * as config from "./json/config.json"

export const PREFIX = config.prefix;
export const MANSION = config.servers.mansion;
export const CTCODING = config.servers.programming;
export const OPEN_EMOJI = "⭕";
export const TEST = config.servers.test;
export const DEVELOPMENT = process.env.NODE_ENV === "development";