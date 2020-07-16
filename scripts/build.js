'use strict';
const chalk = require("chalk");
const child_process = require("child_process");

async function main() {
  console.log(chalk.blue("Building"));
  child_process.execSync("cd bot && yarn && yarn build", { stdio: "inherit" });
  child_process.execSync("docker-compose build", { stdio: "inherit" });
  console.log(chalk.green("Finish build"));
}

main();