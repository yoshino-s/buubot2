/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import { MessageType, EventType } from "mirai-ts";

import { BotCommand, BotCommandConfig } from "../command/Command";
import { MiraiBot as BotClass, BotPlugin } from "../bot/Bot";
import { CommandPermission } from "../command/Permission";

export function Tag(tag: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("tag", tag, target);
  };
}

export function On(
  event: EventType.EventType | MessageType.ChatMessageType | "message"
): MethodDecorator {
  return (target, key) => {
    Reflect.defineMetadata("on", event, target, key);
  };
}

export function Command(cmd: string | BotCommandConfig): MethodDecorator {
  return (target, key) => {
    const command = typeof cmd === "string" ? { cmd } : cmd;
    Reflect.defineMetadata("command", command, target, key);
  };
}
export const Cmd = Command;

export const UseCommand: PropertyDecorator = (target, key) => {
  Reflect.defineMetadata("command", 1, target, key);
};

export function Permission(permission: CommandPermission): MethodDecorator {
  return (target, key) => {
    const command: BotCommandConfig = Reflect.getMetadata(
      "command",
      target,
      key
    ) ?? {
      cmd: String(key),
    };
    command.rule = (command.rule ?? 0) || permission;
    Reflect.defineMetadata("command", command, target, key);
  };
}

export function Help(help: string): MethodDecorator {
  return (target, key) => {
    const command: BotCommandConfig = Reflect.getMetadata(
      "command",
      target,
      key
    ) ?? {
      cmd: String(key),
    };
    command.help = help;
    Reflect.defineMetadata("command", command, target, key);
  };
}

export function Param(name: string): ParameterDecorator {
  return (target, key, idx) => {
    const args: string[] = Reflect.getMetadata("args", target, key) ?? [];
    args[idx] = name;
    Reflect.defineMetadata("args", args, target, key);
  };
}

export const Bot: ParameterDecorator = Param("bot");
export const Msg: ParameterDecorator = Param("msg");
export const Event: ParameterDecorator = Param("event");
export const Message = Msg;
export const Args: ParameterDecorator = Param("args");

function extractCommand(bot: BotClass, instance: BotPlugin) {
  const prototype = Object.getPrototypeOf(instance);
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    (item) =>
      item !== "constructor" &&
      typeof (prototype as any)[item] === "function" &&
      Reflect.getMetadata("command", prototype, item)
  );

  return methodsNames
    .map((methodName) => {
      const command = Reflect.getMetadata(
        "command",
        prototype,
        methodName
      ) as BotCommandConfig;
      const argList: string[] =
        Reflect.getMetadata("args", prototype, methodName) ?? [];
      return new BotCommand(command, (msg, cmd, args) => {
        const argument = argList.map((i) => {
          switch (i) {
            case "bot":
              return bot;
            case "msg":
              return msg;
            case "args":
              return args;
            default:
              return undefined;
          }
        });
        return (instance as any)[methodName](...argument);
      });
    })
    .concat(
      Object.getOwnPropertyNames(instance)
        .filter(
          (item) =>
            (instance as any)[item] instanceof BotCommand &&
            Reflect.getMetadata("command", instance, item)
        )
        .map((item) => (instance as any)[item] as BotCommand)
    );
}

function extractOn(bot: BotClass, instance: BotPlugin) {
  const prototype = Object.getPrototypeOf(instance);
  const methodsNames = Object.getOwnPropertyNames(prototype).filter(
    (item) =>
      item !== "constructor" &&
      typeof (prototype as any)[item] === "function" &&
      Reflect.getMetadata("on", prototype, item)
  );

  return methodsNames.forEach((methodName) => {
    const config = Reflect.getMetadata("on", prototype, methodName) as
      | EventType.EventType
      | MessageType.ChatMessageType
      | "message";
    const argList: string[] =
      Reflect.getMetadata("args", prototype, methodName) ?? [];

    bot.on(config, (e) => {
      const argument = argList.map((i) => {
        switch (i) {
          case "bot":
            return bot;
          case "event":
          case "msg":
            return e;
          default:
            return undefined;
        }
      });
      return (instance as any)[methodName](...argument);
    });
  });
}

export function use(instance: BotPlugin, bot: BotClass) {
  extractCommand(bot, instance).forEach((i) => bot.register(i));
  extractOn(bot, instance);
  instance.boot?.(bot);
}
