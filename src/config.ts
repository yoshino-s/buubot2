import { readFileSync } from "fs";
import { extname } from "path";

import { MiraiApiHttpConfig } from "mirai-ts";
import yaml from "yaml";

export interface Config {
  qq: {
    account: number;
    password: string;
  };
  bot: {
    commandPrefix: string | string[];
    privilege?: number;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  web: {
    host: string;
    port: number;
  };
  api: MiraiApiHttpConfig;
  proxy?: {
    protocol: "socks5" | "http" | "socks4" | "https" | "socks";
    host: string;
    port: number;
  };
  remote?: {
    host: string;
  };
}

export let config: Config;

export function setConfig(cfg: string | Config) {
  if (typeof cfg === "string") {
    const file = readFileSync(cfg).toString();
    const ext = extname(cfg);
    if (ext === ".json") {
      config = JSON.parse(file);
    } else if (ext === ".yaml" || ext === ".yml") {
      config = yaml.parse(file);
    } else {
      throw Error("Unknown config file format, only support json/yaml");
    }
  } else {
    config = cfg;
  }
  if (config.remote) {
    config.redis.host = config.remote.host;

    config.api.host = config.remote.host;
  } else {
    config.redis.host = "redis";
    config.redis.port = 6379;

    config.api.host = "mirai";
    config.api.port = 8080;
  }
}
