"use strict";
const inquirer = require("inquirer");
const chalk = require("chalk");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const config = require("../bot/src/config.example.json");

async function main() {
  console.log(chalk.blue("Input configuration\n"));

  const { mode, exposePort } = await inquirer
    .prompt([
      {
        type: "list",
        message: "Select mode",
        choices: ["Development", "Production"],
        default: "Production",
        name: "mode",
      },
      {
        type: "input",
        message: "Export mirai-api-http port?",
        default: "",
        name: "exposePort",
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
      },
    ]);

  config.API.authKey = input.authKey;
  config.Bot.account = Number(input.account);
  config.Bot.commandPrefix = input.commandPrefix;
  config.Bot.privilege = Number(input.privilege);

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

  if (mode === "Development") {
    console.log(chalk.blue("\nDevelopment Config\n"));
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
  }

  console.log(chalk.blue("\nWriting config file\n"));
  fs.writeFileSync(
    path.join(__dirname, "../bot/src/config.json"),
    JSON.stringify(config, undefined, 2)
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/config.txt"),
    `login ${input.account} ${input.password}`
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/setting.yml"),
    fs.readFileSync(path.join(__dirname, "../mirai/setting.example.yml"))
      .toString()
      .replace("1234567890", input.authKey)
  );
  fs.writeFileSync(
    path.join(__dirname, "../docker-compose.yml"),
    fs.readFileSync(path.join(__dirname, "../docker-compose.example.yml"))
      .toString()
      .replace(exposePort ? "8081" : /\n\W+ports:\W+- 8081:8080/, exposePort ? exposePort : "")
  );
  console.log(chalk.green("Finish configuration"));

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

main();