import Mirai, { MiraiApiHttpConfig, MessageType } from "mirai-ts";
import MiraiBotCommand, { MiraiBotCommandConfig } from "./Command";
import { CmdHook } from "./Command";
import * as utils from "./utils";
import { unserialize } from "./serialization";

export interface MiraiBotConfig {
  account: number;
  commandPrefix: string;
  privilege?: number;
}

export class MiraiBot {
  mirai: Mirai;
  config: MiraiBotConfig;
  cmdHooks: Set<MiraiBotCommand>;
  constructor(mirai: Mirai | MiraiApiHttpConfig, config: MiraiBotConfig) {
    this.cmdHooks = new Set();
    if (mirai instanceof Mirai) {
      this.mirai = mirai;
    } else {
      this.mirai = new Mirai(mirai);
    }
    this.config = config;
  }

  async boot() {
    await this.mirai.login(904814779);
    await this.mirai.axios.post("/config", {
      sessionKey: this.mirai.sessionKey,
      cacheSize: 4096,
      enableWebsocket: true,
    });
    this.mirai.on("message", (msg) => {
      console.log(msg);
      this.messageHook(msg);
    });
    this.mirai.listen();
  }

  registerCommand(cmd: string | MiraiBotCommandConfig, hook: CmdHook) {
    this.cmdHooks.add(new MiraiBotCommand(this, cmd, hook));
  }

  registerPlugins(...plugins: ((bot: MiraiBot) => void)[]) {
    plugins.forEach((i) => i(this));
  }

  private messageHook(msg: MessageType.ChatMessage) {
    const plain = msg.plain;
    if (plain && plain.startsWith(this.config.commandPrefix)) {
      console.log("Cmd: " + plain);
      const cmdline = plain
        .slice(this.config.commandPrefix.length)
        .trim()
        .split(" ");
      this.cmdHooks.forEach((v) =>
        v.run(msg, cmdline[0], cmdline.slice(1).join(" "))
      );
    }
  }
  static utils = utils;
}
