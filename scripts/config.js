/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
const fs = require("fs");

const yaml = require("yaml");

function modifyConfig(
  p,
  f,
  serializer = { stringify: (s) => s, parse: (s) => s }
) {
  fs.writeFileSync(
    p,
    serializer.stringify(
      f(
        serializer.parse(
          fs
            .readFileSync(
              p.slice(0, p.lastIndexOf(".")) +
                ".example" +
                p.slice(p.lastIndexOf("."))
            )
            .toString()
        )
      )
    )
  );
}

const config = yaml.parse(fs.readFileSync("config.yml").toString());

// Redis

modifyConfig("redis/redis.conf", (s) =>
  s.replace("password", config.redis.password)
);
modifyConfig(
  "mirai/src/config/Console/AutoLogin.yml",
  (s) => {
    s.plainPasswords = { [config.qq.account]: config.qq.password };
    return s;
  },
  yaml
);
modifyConfig(
  "mirai/src/config/MiraiApiHttp/setting.yml",
  (s) => {
    s.authKey = config.api.authKey;
    return s;
  },
  yaml
);
modifyConfig(
  "docker-compose.yml",
  (s) => {
    if (config.web.port) {
      s.services.bot.ports = [`${config.web.port}:8080`];
    } else {
      s.services.bot.ports = [`8080`];
    }
    if (config.api.port) {
      s.services.mirai.ports = [`${config.api.port}:8080`];
    } else {
      s.services.mirai.ports = [`8080`];
    }
    if (config.redis.port) {
      s.services.redis.ports = [`${config.redis.port}:6379`];
    } else {
      s.services.redis.ports = [`6379`];
    }
    return s;
  },
  yaml
);

fs.copyFileSync("config.yml", "src/config.yml");
