'use strict';
const chalk = require("chalk");
const child_process = require("child_process");

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
    console.log(chalk.green("Docker Compose Version: ") + dockerCompose);
  }
  const docker = checkCmd("docker", "-v");
  if (!docker) {
    console.log(chalk.red("Docker not found or have no permission to use docker."));
    process.exit(1);
  } else {
    console.log(chalk.green("Docker Version: ") + docker);
  }
  console.log(chalk.green("Environment OK!"))
}

main();