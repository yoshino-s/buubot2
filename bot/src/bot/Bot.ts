import { resolve } from "path";

import Mirai, { MiraiApiHttpConfig, MessageType, EventType } from "mirai-ts";
import Express from "express";
import ejs from "ejs";
import { UI } from "bull-board";
import { sendMessage } from "mirai-ts/dist/types/api/response";

import BotCommand, { BotCommandConfig, CmdHook } from "./Command";
import { Target, unserialize } from "./utils";

declare type Data<
  T extends "message" | EventType.EventType | MessageType.ChatMessageType
> = T extends EventType.EventType
  ? EventType.EventMap[T]
  : T extends MessageType.ChatMessageType
  ? MessageType.ChatMessageMap[T]
  : MessageType.ChatMessage;

export type BotPlugin = (bot: Bot) => any;

export type BotHook = typeof Mirai.prototype.on;

export interface BotConfig {
  account: number;
  commandPrefix: string | string[];
  privilege?: number;
}

export interface Bot {
  mirai: Mirai;
  config: BotConfig;
  cmdHooks: BotCommand[];
  boot(): Promise<any>;
  register(data: string | BotCommandConfig, cb: CmdHook): void;
  register(
    data: BotPlugin | BotCommand,
    ...args: (BotPlugin | BotCommand)[]
  ): void;
  send(
    target: Target,
    msg: string,
    quote?: number
  ): Promise<sendMessage> | undefined;
  enable(): void;
  disable(): void;
}

export class BotNamespace implements Bot {
  mirai: Mirai;
  readonly config: BotConfig;
  cmdHooks: BotCommand[] = [];
  private _enabled = false;
  constructor(mirai: Mirai | MiraiApiHttpConfig, config: BotConfig);
  constructor(mirai: Bot);
  constructor(mirai: Mirai | MiraiApiHttpConfig | Bot, config?: BotConfig) {
    if (config) {
      if (mirai instanceof Mirai) {
        this.mirai = mirai;
      } else {
        this.mirai = new Mirai(mirai as MiraiApiHttpConfig);
      }
      this.config = config;
    } else {
      this.mirai = (mirai as Bot).mirai;
      this.config = (mirai as Bot).config;
    }
  }
  on<T extends "message" | EventType.EventType | MessageType.ChatMessageType>(
    event: T,
    listener: (data: Data<T>) => any
  ): void {
    return this.mirai.on(event, (data) => {
      if (this._enabled) {
        listener(data);
      }
    });
  }
  async boot() {
    this.on("message", (msg) => this.messageHook(msg));
    this.enable();
  }
  private messageHook(msg: MessageType.ChatMessage) {
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
      this.cmdHooks.forEach((v) =>
        v.run(msg, cmdline[0], cmdline.slice(1).join(" "))
      );
    }
  }
  register(data: string | BotCommandConfig, cb: CmdHook): void;
  register(
    data: BotPlugin | BotCommand,
    ...args: (BotPlugin | BotCommand)[]
  ): void;
  register(
    arg0: BotPlugin | BotCommand | string | BotCommandConfig,
    arg1?: CmdHook | BotPlugin | BotCommand,
    ...args: (BotPlugin | BotCommand)[]
  ) {
    args.forEach((i) => this.register(i));
    if (typeof arg0 === "function") {
      arg0(this);
    } else if (arg0 instanceof BotCommand) {
      this.cmdHooks.push(arg0);
    } else {
      this.cmdHooks.push(new BotCommand(this, arg0, arg1 as CmdHook));
    }
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
  enable() {
    this._enabled = true;
  }
  disable() {
    this._enabled = false;
  }
  static getCurrentBot(): MiraiBot {
    if (!currentBot) {
      throw new Error("No current bot!");
    }
    return currentBot;
  }
}
let currentBot: MiraiBot | undefined;

export class MiraiBot extends BotNamespace implements Bot {
  cmdHooks: BotCommand[] = [];

  express = Express();
  constructor(
    mirai: Mirai | MiraiApiHttpConfig,
    public readonly config: BotConfig
  ) {
    super(mirai, config);
    currentBot = this;
  }
  async boot() {
    await this.mirai.link(this.config.account);
    await this.mirai.axios.post("/config", {
      sessionKey: this.mirai.sessionKey,
      cacheSize: 4096,
      enableWebsocket: true,
    });
    this.express.use("/bull", UI);
    this.express.engine("ejs", (ejs as any).__express);
    this.express.set("view engine", "ejs");
    this.express.set("views", resolve(__dirname, "../views"));

    this.mirai.listen();
    this.express.listen(8080, "0.0.0.0");

    await super.boot();
  }

  /**
   * @deprecated Use `register` instead
   * */
  registerCommand(cmd: string | BotCommandConfig, hook: CmdHook) {
    this.cmdHooks.push(new BotCommand(this, cmd, hook));
  }
  /**
   * @deprecated Use `register` instead
   * */
  registerPlugins(...plugins: ((bot: MiraiBot) => void)[]) {
    plugins.forEach((i) => i(this));
  }
}
