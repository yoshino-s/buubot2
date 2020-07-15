# BUU BOT V2

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

### Build

```bash
yarn
yarn run init
```

Finish the configuration

### Start

```bash
docker-compose up -d
```

### check logs

```bash
docker-compose logs -f
```

## Known issue

- In the first build or in some cases, the login will fail and you need to enter the verification code.
- Because Mirai is in the development stage, there may be bugs such as not receiving information