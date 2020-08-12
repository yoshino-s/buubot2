"use strict";
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const inquirer = require("inquirer");
const chalk = require("chalk");
const yaml = require("yaml");

const config = require("../bot/src/config.example.json");
const { red } = require("chalk");
const compose = yaml.parse(fs.readFileSync("docker-compose.example.yml").toString());

async function writeConfig(cnf) {
  fs.writeFileSync(
    path.join(__dirname, "../bot/src/config.json"),
    JSON.stringify(config, undefined, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/config.txt"),
    `login ${cnf.account} ${cnf.password}`
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/setting.yml"),
    fs.readFileSync(path.join(__dirname, "../mirai/setting.example.yml"))
      .toString()
      .replace("1234567890", cnf.authKey)
  );
  fs.writeFileSync(
    path.join(__dirname, "../redis/redis.conf"),
    fs.readFileSync(path.join(__dirname, "../redis/redis.example.conf"))
      .toString()
      .replace("password", cnf.redisPassword)
  );
  fs.writeFileSync(
    path.join(__dirname, "../docker-compose.yml"),
    yaml.stringify(compose)
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

  console.log(chalk.blue("\nBase Config\n"));

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
        message: "Enter web port of bot",
        name: "exposePort",
        validate: s => !Number.isNaN(Number(s)),
      },
    ]);

  config.API.authKey = input.authKey;
  config.Bot.account = Number(input.account);
  config.Bot.commandPrefix = input.commandPrefix;
  config.Bot.privilege = Number(input.privilege);
  if (input.exposePort) {
    compose.services.bot.ports = [`${input.exposePort}:8080`];
  } else {
    delete compose.services.bot.ports;
  }

  console.log(chalk.blue("\nProxy Config\n"));

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
    config.Proxy.host = proxy.host;
    config.Proxy.port = Number(proxy.port);
    config.Proxy.protocol = proxy.protocol;
  }
  let redisPassword = "";
  if (mode === "Development") {
    console.log(chalk.blue("\nRemote server Config\n"));
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
    config.API.host = development.host;
    config.API.port = Number(development.port);
    config.Utils.dataStorage = "../../data/bot_data";
    config.Utils.imageStorage = "../../mirai/image";

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
    config.Redis.host = redis.host;
    config.Redis.password = redis.password || "password";
    config.Redis.port = parseInt(redis.port);
    redisPassword = redis.password || "password";    
  } else {
    const {exposePort} = await inquirer.prompt([{
      type: "input",
      message: "Export mirai-api-http port?",
      default: "",
      name: "exposePort",
    },]);
    if (exposePort) {
      compose.services.mirai.ports = [`${exposePort}:8080`];
    } else {
      delete compose.services.mirai.ports;
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
    config.Redis.host = "redis";
    config.Redis.password = redis.password || "password";
    if (redis.port) {
      compose.services.redis.ports = [`${redis.port}:6379`];
    } else {
      delete compose.services.redis.ports;
    }
    redisPassword = redis.password  || "password";
  }

  console.log(chalk.blue("\nWriting config file\n"));
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
            exit(0);
          }
        }
      });
      r.on("error", rej);
    });
  }
}

main();