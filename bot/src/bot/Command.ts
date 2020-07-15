import { MiraiBot } from "./Bot";
import { Storage, parseMessage } from "./utils";
import { Contact, MessageType } from "mirai-ts";

type Rule = "off" | "on" | "admin";

export interface MiraiBotCommandConfig {
  cmd: string;
  mustGroup?: boolean;
  group?: boolean | "must";
  permission?: Contact.Permission[];
  alias?: string[] | string;
  help?: string;
  verify?: (msg: MessageType.ChatMessage, cmd: string, args: string) => boolean;
  specialRule?: Record<string, Rule>;
}

export type CmdHook = (
  msg: MessageType.ChatMessage,
  cmd: string,
  args: string
) => any;

export default class MiraiBotCommand {
  config: MiraiBotCommandConfig;
  hook: CmdHook;
  specialRules: Storage<Record<string, Rule>>;
  constructor(
    private readonly bot: MiraiBot,
    cmd: string | MiraiBotCommandConfig,
    hook: CmdHook
  ) {
    if (typeof cmd === "string") {
      this.config = {
        cmd,
      };
    } else {
      this.config = cmd;
      if (cmd.verify) this.verifyArgs = cmd.verify;
    }
    this.hook = hook;
    this.specialRules = new Storage<Record<string, Rule>>(
      this.config.cmd,
      this.config.specialRule || {}
    );
  }

  rule(groupId: number, rule: Rule) {
    const rules = this.specialRules.get() || {};
    rules[groupId.toString()] = rule;
    this.specialRules.set(rules);
  }

  async run(msg: MessageType.ChatMessage, cmd: string, args: string) {
    if (cmd !== this.config.cmd && !this.config.alias?.includes(cmd)) {
      return;
    }
    if (this.config.group === "must" && msg.type !== "GroupMessage") {
      return;
    }
    if (msg.type === "GroupMessage" && !this.config.group) {
      return;
    }
    if (msg.type !== "FriendMessage") {
      if (
        this.config.permission &&
        !this.config.permission.includes(msg.sender.permission)
      ) {
        return;
      }
      const r = this.specialRules.get()[msg.sender.group.id.toString()];
      if (r === "off") {
        return;
      }
      if (r === "admin" && msg.sender.group.permission === "MEMBER") {
        return;
      }
    }

    if (!this.verifyArgs(msg, cmd, args)) {
      await msg.reply(this.help);
      return;
    }
    const res = await this.hook(msg, cmd, args);
    if (res === MiraiBotCommand.HelpSymbol) {
      await msg.reply(parseMessage(this.help));
    } else if (res !== undefined) {
      await msg.reply(parseMessage(res));
    }
  }
  get help(): string {
    return (
      this.config.help ||
      "Usage: " + this.bot.config.commandPrefix + this.config.cmd
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyArgs(msg: MessageType.ChatMessage, cmd: string, args: string) {
    return true;
  }

  static readonly HelpSymbol = Symbol("help");
}
