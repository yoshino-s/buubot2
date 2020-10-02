# BUU BOT V2

[![time tracker](https://wakatime.com/badge/github/Yoshino-s/buubot2.svg)](https://wakatime.com/badge/github/Yoshino-s/buubot2)

A BUUOJ BOT rebuild on mirai (Developing)

## Based on:

- [Mirai](https://github.com/mamoe/mirai)
- [mirai-ts](https://github.com/YunYouJun/mirai-ts)

## Dependency Environments

- Docker
- Docker Compose
- nodejs
- Jre

## Start

### Config & build

If you don't have yarn, install it by `npm install -g yarn` before install, (or change script by yourself.

```bash
yarn
```

Then copy `config.example.yml` to `config.yml` and change the config then run

```bash
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

## How to write your own plugins

> TODO

## Known issue

- In the first build or in some cases, the login will fail and you need to enter the verification code.
- Because Mirai is in the development stage, there may be bugs such as not receiving information

If you find some issue about the bot, see the issues below. Maybe you can find some useful information.

- [mirai-core](https://github.com/mamoe/mirai/issues)
- [mirai-api-http](https://github.com/project-mirai/mirai-api-http/issues)
- [mirai-ts](https://github.com/YunYouJun/mirai-ts/issues)