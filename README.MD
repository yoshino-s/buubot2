# BUU BOT V2

[![time tracker](https://wakatime.com/badge/github/Yoshino-s/buubot2.svg)](https://wakatime.com/badge/github/Yoshino-s/buubot2)

A BUUOJ BOT rebuild on mirai (Developing)

## Based on:

- [Mirai](https://github.com/mamoe/mirai)
- [mirai-ts](https://github.com/YunYouJun/mirai-ts)

## Project Structure

```
.
├── bot                                    front-end of bot
│   ├── deploy
│   ├── src
│   │   ├── bot                            core of bot
│   │   └── plugins                        plugins of bot
├── mirai                                  back-end ob bot
│   ├── config.example.txt                 example config file
│   ├── data                               data of mirai-core
│   ├── images                             base dir of mirai-api-http image
│   ├── setting.yml                        mirai-api-http config file
│   └── src                                mirai source
```

## Dependency Environments

- Docker
- Docker Compose
- nodejs

## Start

### Config & build

If you don't have yarn, install it by `npm install -g yarn`, (or change script by yourself.

```bash
yarn
# or use production mode if you only want to deploy it
# yarn --production
yarn run config
yarn run build
```

### Start

```bash
docker-compose up -d
```

### check logs

```bash
docker-compose logs -f
```

## Default Plugins

- calendar
  - Command: `calendar`
    Show the recent or now competitions
- cmd
  - Command: `exec`
    Give you a chance to try to break the `vm2`
- egg
  - Command: `sucker`
    Teach you how to be a real sucker
- groupCmdManage
  - Command `GroupCmd`
    Set special rule for commands
    GroupCmd list | (set {cmd} {rule})
    Rule:
    * 0b00000001 friend
    * 0b00000010 group member
    * 0b00000100 group admin
    * 0b00001000 group owner
    * 0b00010000 temp chat
- monitor
  - Command: `npm_monitor on|off`
    Tell you if npm advisories updated
- rank
  - Command: `rank id`
    Tell your rank on BUUOJ
  - Command: `score id`
    Tell you that you are lazy dog
- recallMonitor
  monitor the recall event and sometimes prevent it
- repeater
  repeater
  repeater
  repeater
  repeater
  repeater

## Known issue

- In the first build or in some cases, the login will fail and you need to enter the verification code.
- Because Mirai is in the development stage, there may be bugs such as not receiving information

If you find some issue about the bot, see the issues below. Maybe you can find some useful information.

- [mirai-core](https://github.com/mamoe/mirai/issues)
- [mirai-api-http](https://github.com/project-mirai/mirai-api-http/issues)
- [mirai-ts](https://github.com/YunYouJun/mirai-ts/issues)