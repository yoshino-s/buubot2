"use strict";
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const inquirer = require("inquirer");
const chalk = require("chalk");
const yaml = require("yaml");

const botConfig = require("../bot/src/config.example.json");
const dockerCompose = yaml.parse(fs.readFileSync("docker-compose.example.yml").toString());
const miraiSetting = yaml.parse(fs.readFileSync("mirai/setting.example.yml").toString());
const accountConfig = [""];

async function writeConfig(cnf) {
  fs.writeFileSync(
    path.join(__dirname, "../bot/src/config.json"),
    JSON.stringify(botConfig, undefined, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/config.txt"),
    accountConfig.join("\n")
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/setting.yml"),
    yaml.stringify(miraiSetting)
  );
  fs.writeFileSync(
    path.join(__dirname, "../redis/redis.conf"),
    fs.readFileSync(path.join(__dirname, "../redis/redis.example.conf"))
      .toString()
      .replace("password", cnf.redisPassword)
  );
  fs.writeFileSync(
    path.join(__dirname, "../docker-compose.yml"),
    yaml.stringify(dockerCompose)
  );
}

async function main() {
  console.log(chalk.blue("Input configuration\n"));

  const { mode } = await inquirer
    .prompt([
      {
        type: "list",
        message: "Run mode",
        choices: [{
          name: "Development: Use `yarn dev`, separated mirai server",
          value: "Development",
          short: "Development",
        }, {
          name: "Production: Use docker-compose",
          value: "Production",
          short: "Production",
        }],
        default: "Production",
        name: "mode",
      },
    ]);

  const input = await inquirer
    .prompt([
      {
        type: "input",
        message: "Enter your account",
        name: "account",
        validate: s => !Number.isNaN(Number(s))
      }, {
        type: "password",
        message: "Enter your password",
        name: "password",
        mask: "*",
      }, {
        type: "input",
        message: "Enter authKey(random string)",
        name: "authKey",
      }, {
        type: "input",
        message: "Command Prefix",
        default: "/",
        name: "commandPrefix",
      }, {
        type: "input",
        message: "Enter your privilege account",
        name: "privilege",
        validate: s => !Number.isNaN(Number(s)),
      }, {
        type: "input",
        message: "Enter web host of bot",
        name: "host",
      }, {
        type: "input",
        message: "Enter web port of bot",
        name: "port",
        validate: s => !Number.isNaN(Number(s)),
      },
    ]);

  botConfig.API.authKey = input.authKey;
  botConfig.Bot.account = Number(input.account);
  accountConfig.push(`login ${input.account} ${input.password}`)
  botConfig.Bot.commandPrefix = input.commandPrefix;
  botConfig.Bot.privilege = Number(input.privilege);
  botConfig.Bot.host = input.host;
  botConfig.Bot.port = Number(input.port);
  dockerCompose.services.bot.ports = [`${input.port}:8080`];

  const { useProxy } = await inquirer
    .prompt([
      {
        type: "confirm",
        message: "Use proxy!",
        default: false,
        name: "useProxy"
      },
    ]);

  if (useProxy) {
    const proxy = await inquirer
      .prompt([
        {
          type: "list",
          message: "Select protocol",
          choices: ["socks5", "http"],
          name: "protocol",
        }, {
          type: "input",
          message: "Input host",
          default: "localhost",
          name: "host",
        }, {
          type: "input",
          message: "Input port",
          default: "7891",
          name: "port",
          validate: s => !Number.isNaN(Number(s)),
        },
      ]);
    botConfig.Proxy.host = proxy.host;
    botConfig.Proxy.port = Number(proxy.port);
    botConfig.Proxy.protocol = proxy.protocol;
  }
  let redisPassword = "";
  if (mode === "Development") {
    const development = await inquirer
      .prompt([
        {
          type: "input",
          message: "API host",
          name: "host",
        }, {
          type: "input",
          message: "API port",
          name: "port",
          validate: s => !Number.isNaN(Number(s)),
        },
      ]);
    botConfig.API.host = development.host;
    botConfig.API.port = Number(development.port);
    botConfig.Utils.dataStorage = "../../data/bot_data";
    botConfig.Utils.imageStorage = "../../mirai/image";

    const redis = await inquirer
      .prompt([
        {
          type: "input",
          message: "Redis host",
          name: "host",
        }, {
          type: "input",
          message: "Redis port",
          name: "port",
          validate: s => !Number.isNaN(Number(s)),
        }, {
          type: "password",
          message: "Redis password",
          name: "password",
          mask: "*",
        },
      ]);
    botConfig.Redis.host = redis.host;
    botConfig.Redis.password = redis.password || "password";
    botConfig.Redis.port = parseInt(redis.port);
    redisPassword = redis.password || "password";    
  } else {
    const {exposePort} = await inquirer.prompt([{
      type: "input",
      message: "Export mirai-api-http port?",
      default: "",
      name: "exposePort",
    },]);
    if (exposePort) {
      dockerCompose.services.mirai.ports = [`${exposePort}:8080`];
    } else {
      delete dockerCompose.services.mirai.ports;
    }
    const redis = await inquirer
      .prompt([
        {
          type: "input",
          message: "Export redis port?",
          default: "",
          name: "port",
        }, {
          type: "password",
          message: "Redis password",
          name: "password",
          mask: "*",
        },
      ]);
    botConfig.Redis.host = "redis";
    botConfig.Redis.password = redis.password || "password";
    if (redis.port) {
      dockerCompose.services.redis.ports = [`${redis.port}:6379`];
    } else {
      delete dockerCompose.services.redis.ports;
    }
    redisPassword = redis.password  || "password";
  }

  await writeConfig({
    account: input.account,
    password: input.password,
    authKey: input.authKey,
    redisPassword
  });

  console.log(chalk.green("Finish configuration"));

  if (mode === "Production") {

    console.log(chalk.blue("Building mirai"));
    child_process.execSync("docker-compose build mirai", { stdio: "inherit" });
    console.log(chalk.green("Finish build"));

    console.log(
      chalk.blue("Input this:") +
      chalk.green(` login ${input.account} ${input.password} `) +
      chalk.blue("and follow the shown steps.")
    );
    await inquirer.prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "I know."
      }
    ]);

    await new Promise((res, rej) => {
      const r = child_process.spawn("docker-compose", "run mirai java -jar /app/mirai-console-wrapper.jar --update KEEP".split(" "), { stdio: ["inherit", "pipe", "pipe"] });
      let finish = false;
      r.stdout.on("data", c => {
        if (!finish) {
          process.stdout.write(c);
          if (c.toString().includes("Login successful")) {
            console.log(chalk.green("Build success!"));
            r.kill("SIGKILL");
            exit(0);
          }
        }
      });
      r.on("error", rej);
    });
  }
}

main();