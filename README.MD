# Mirai Bot

## Start

Install cli tool

```bash
yarn global add @mirai-bot/cli
```

Create a project

```bash
mirai-bot new --name bot
```

## Config

Config the bot

copy `config.example.yaml` to `config.yml`

and change the config

## Build & Start

```bash
mirai-bot build
```

```bash
mirai-bot start -d
```

## Other issues

### Login fail

If you use your account on this device first time, it may have some problem when login. Please use 

```bash
mirai-bot interactive
```

to start a interactive mirai instance, follow the steps to login manually

### development

You can use an existing bot instance and attach it to develop your plugin faster

Setup a full bot docker (including `mirai` and `redis`) and expose all the port

And use the same config file in your development environment

Add

```yaml
remote:
  host: 101.200.191.30
```

in the `config.yml` of development environment

and start with

```bash
mirai-bot start --dev
```

Also you can use 

```bash
mirai-bot plugin [name]
```

to add a new plugin.

> TODO: How to write a plugin