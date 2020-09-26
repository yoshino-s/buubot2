import { resolve } from "path";

import Mirai, { MiraiApiHttpConfig, MessageType, EventType } from "mirai-ts";
import Express from "express";
import ejs from "ejs";
import { UI } from "bull-board";
import log4js, { Logger } from "log4js";

import { Target, unserialize } from "../utils";
import { use } from "../utils/decorator";
import BotCommand from "../command/Command";
import BuiltinPlugin from "../plugins/builtin";

declare type Data<
  T extends "message" | EventType.EventType | MessageType.ChatMessageType
> = T extends EventType.EventType
  ? EventType.EventMap[T]
  : T extends MessageType.ChatMessageType
  ? MessageType.ChatMessageMap[T]
  : MessageType.ChatMessage;

export type BotHook = typeof Mirai.prototype.on;

export interface BotConfig {
  account: number;
  commandPrefix: string | string[];
  privilege?: number;
}

export abstract class BotPlugin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  boot(bot: MiraiBot) {
    //
  }
}

export class MiraiBot {
  name: string;
  logger: Logger;
  mirai: Mirai;
  cmdHooks: BotCommand[] = [];

  express = Express();
  constructor(
    mirai: Mirai | MiraiApiHttpConfig,
    public readonly config: BotConfig
  ) {
    if (typeof config !== "string") {
      if (mirai instanceof Mirai) {
        this.mirai = mirai;
      } else {
        this.mirai = new Mirai(mirai as MiraiApiHttpConfig);
      }
      this.config = config;
      this.name = "default";
    } else {
      this.mirai = (mirai as MiraiBot).mirai;
      this.config = (mirai as MiraiBot).config;
      this.name = config;
    }
    this.logger = log4js.getLogger(this.name);
    this.logger.level = "ALL";
  }
  on<T extends "message" | EventType.EventType | MessageType.ChatMessageType>(
    event: T,
    listener: (data: Data<T>) => any
  ): void {
    return this.mirai.on(event, (data) => {
      listener(data);
    });
  }
  async boot() {
    await this.mirai.link(this.config.account);
    await this.mirai.axios.post("/config", {
      sessionKey: this.mirai.api.sessionKey,
      cacheSize: 4096,
      enableWebsocket: true,
    });
    this.express.use("/bull", UI);
    this.express.engine("ejs", (ejs as any).__express);
    this.express.set("view engine", "ejs");
    this.express.set("views", resolve(__dirname, "../views"));

    this.mirai.listen();
    this.express.listen(8080, "0.0.0.0");

    this.on("message", (msg) => this.messageHook(msg));

    this.register(BuiltinPlugin);

    process.on("beforeExit", () => {
      this.logger.info("Exiting...");
    });
  }
  private async messageHook(msg: MessageType.ChatMessage) {
    this.logger.info(msg);
    const plain = msg.plain;
    if (
      plain &&
      (typeof this.config.commandPrefix === "string"
        ? plain.startsWith(this.config.commandPrefix)
        : this.config.commandPrefix.some((p) => plain.startsWith(p)))
    ) {
      const cmdline = plain
        .slice(
          typeof this.config.commandPrefix === "string"
            ? this.config.commandPrefix.length
            : this.config.commandPrefix.find((p) => plain.startsWith(p))?.length
        )
        .trim()
        .split(" ");
      for (const cmd of this.cmdHooks) {
        if (await cmd.run(this, msg, cmdline[0], cmdline.slice(1).join(" "))) {
          this.logger.info(`Trigger cmd: ${cmdline[0]}`);
          break;
        }
      }
    }
  }
  register(...args: (BotCommand | { new (): BotPlugin })[]) {
    args.forEach((arg) => {
      if (arg instanceof BotCommand) {
        this.cmdHooks.push(arg);
      } else {
        use(new arg(), this);
      }
    });
  }
  send(target: Target, msg: string, quote?: number) {
    if (target.group) {
      return this.mirai.api.sendGroupMessage(
        unserialize(msg),
        target.group,
        quote
      );
    } else if (target.id) {
      if (target.temp) {
        return this.mirai.api.sendTempMessage(
          unserialize(msg),
          target.id,
          target.temp,
          quote
        );
      } else {
        return this.mirai.api.sendFriendMessage(
          unserialize(msg),
          target.id,
          quote
        );
      }
    }
  }
  static getCurrentBot(): MiraiBot {
    if (!currentBot) {
      throw new Error("No current bot!");
    }
    return currentBot;
  }
}
let currentBot: MiraiBot | undefined;
