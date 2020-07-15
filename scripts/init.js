'use strict';
const inquirer = require('inquirer');
const chalk = require("chalk");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const { exit } = require('process');

function checkCmd(cmd, ...args) {
  const ret = child_process.spawnSync(cmd, args);
  if (ret.status !== 0)
    return false;
  return ret.stdout.toString().trim();
}

async function main() {
  console.log(chalk.blue("Checking dependency"));
  const dockerCompose = checkCmd("docker-compose", "-v");
  if (!dockerCompose) {
    console.log(chalk.red("Docker Compose not found."));
    process.exit(1);
  } else {
    console.log(chalk.green("Docker Compose Version:\n") + dockerCompose);
  }
  const docker = checkCmd("docker", "-v");
  if (!docker) {
    console.log(chalk.red("Docker not found or have no permission to use docker."));
    process.exit(1);
  } else {
    console.log(chalk.green("Docker Version:\n") + docker);
  }

  console.log(chalk.blue("Input Account info and authKey"));
  const answer = await inquirer
    .prompt([
      {
        type: 'input',
        message: 'Enter your account',
        name: 'account',
        validate: s => !Number.isNaN(Number(s))
      },
      {
        type: 'password',
        message: 'Enter your password',
        name: 'password',
        mask: '*',
      },
      {
        type: 'input',
        message: 'Enter authKey(random string)',
        name: 'authKey',
      },
    ]);

  console.log(chalk.blue("Writing config file"));
  fs.writeFileSync(
    path.join(__dirname, "../bot/src/config.ts"),
    fs.readFileSync(path.join(__dirname, "../bot/src/config.example.ts"))
      .toString()
      .replace("9999999999", answer.account)
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/config.txt"),
    fs.readFileSync(path.join(__dirname, "../mirai/config.example.txt"))
      .toString()
      .replace("9999999999", answer.account)
      .replace("password", answer.password)
  );
  fs.writeFileSync(
    path.join(__dirname, "../mirai/setting.yml"),
    fs.readFileSync(path.join(__dirname, "../mirai/setting.example.yml"))
      .toString()
      .replace("1234567890", answer.authKey)
  );
  fs.writeFileSync(
    path.join(__dirname, "../docker-compose.yml"),
    fs.readFileSync(path.join(__dirname, "../docker-compose.example.yml"))
      .toString()
      .replace("1234567890", answer.authKey)
  );
  console.log(chalk.green("Finish configuration"));

  console.log(chalk.blue("Building"));
  child_process.execSync("cd bot && yarn && yarn build", { stdio: "inherit" });
  child_process.execSync("docker-compose build", { stdio: "inherit" });
  console.log(chalk.green("Finish build"));

  console.log(
    chalk.blue("Input this:") +
    chalk.green(` login ${answer.account} ${answer.password} `) +
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
    const r = child_process.spawn("docker-compose", "run mirai java -jar /app/mirai-console-wrapper.jar --update KEEP".split(' '), { stdio: ["inherit", "pipe", "pipe"] });
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