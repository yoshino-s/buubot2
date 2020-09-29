import fs from "fs";
import { resolve } from "path";

import { MiraiApiHttpConfig } from "mirai-ts";
import yaml from "yaml";

interface Config {
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

const config: Config = yaml.parse(
  fs.readFileSync(resolve(__dirname, "../config.yml")).toString()
);

if (config.remote) {
  config.redis.host = config.remote.host;

  config.api.host = config.remote.host;
} else {
  config.redis.host = "redis";
  config.redis.port = 6379;

  config.api.host = "mirai";
  config.api.port = 8080;
}
console.log(config);
export default config;
