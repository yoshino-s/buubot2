import { MiraiBot } from "./Bot";
import { Storage, ContactSet } from "./utils";
import { MessageType } from "mirai-ts";
import { unserialize } from "./serialization";

/**
 * 0b00000001 friend
 * 0b00000010 group member
 * 0b00000100 group admin
 * 0b00001000 group owner
 * 0b00010000 temp chat
 */
export enum CommandPermission {
  friend = 0b00000001,
  group = 0b00001110,
  member = 0b00000010,
  admin = 0b00001100,
  administrator = 0b00000100,
  owner = 0b00001000,
  temp = 0b00010000,
}

export interface MiraiBotCommandConfig {
  cmd: string;
  rule?: CommandPermission;
  alias?: string[] | string;
  help?: string;
  verify?: (msg: MessageType.ChatMessage, cmd: string, args: string) => boolean;
  specialRule?: Record<string, CommandPermission>;
}

export type CmdHook = (
  msg: MessageType.ChatMessage,
  cmd: string,
  args: string
) => any;

export default class MiraiBotCommand {
  config: MiraiBotCommandConfig;
  hook: CmdHook;
  specialRules: Storage<Record<string, CommandPermission>>;
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
    this.specialRules = new Storage(
      this.config.cmd,
      this.config.specialRule || {}
    );
  }

  setRule(groupId: number, rule: CommandPermission) {
    const rules = this.specialRules.get() || {};
    rules[groupId.toString()] = rule;
    this.specialRules.set(rules);
  }

  getRule(groupId?: number): CommandPermission {
    return (
      (groupId && this.specialRules.get()[groupId.toString()]) ||
      this.config.rule ||
      CommandPermission.friend |
        CommandPermission.group |
        CommandPermission.temp
    );
  }

  async run(msg: MessageType.ChatMessage, cmd: string, args: string) {
    if (cmd !== this.config.cmd && !this.config.alias?.includes(cmd)) {
      return;
    }
    if (msg.sender.id !== this.bot.config.privilege) {
      const rule = this.getRule(
        msg.type !== "FriendMessage" ? msg.sender.group.id : undefined
      );
      if (msg.type === "FriendMessage" && !(rule & CommandPermission.friend))
        return;
      if (msg.type === "GroupMessage") {
        if (
          msg.sender.permission === "MEMBER" &&
          !(rule & CommandPermission.member)
        )
          return;
        if (
          msg.sender.permission === "ADMINISTRATOR" &&
          !(rule & CommandPermission.administrator)
        )
          return;
        if (
          msg.sender.permission === "OWNER" &&
          !(rule & CommandPermission.owner)
        )
          return;
      }
      if (msg.type === "TempMessage" && !(rule & CommandPermission.temp))
        return;
    }
    if (!this.verifyArgs(msg, cmd, args)) {
      await msg.reply(this.help);
      return;
    }
    const res = await this.hook(msg, cmd, args);
    if (res === MiraiBotCommand.HelpSymbol) {
      await msg.reply(unserialize(this.help));
    } else if (res !== undefined) {
      await msg.reply(unserialize(res));
    }
  }
  get help(): string {
    return (
      "Usage: " +
      this.bot.config.commandPrefix +
      (this.config.help || this.config.cmd)
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyArgs(msg: MessageType.ChatMessage, cmd: string, args: string) {
    return true;
  }

  static readonly HelpSymbol = Symbol("help");
}

export class SwitchCommand extends MiraiBotCommand {
  set: ContactSet;
  constructor(bot: MiraiBot, cmd: string, set: ContactSet) {
    super(
      bot,
      {
        cmd,
        help: `${cmd} on|off`,
        rule: CommandPermission.admin | CommandPermission.friend,
        verify: (msg, cmd, args) => ["on", "off"].includes(args),
      },
      (msg: MessageType.ChatMessage, cmd: string, args: string) => {
        if (args === "on") {
          this.set.add(msg);
        } else {
          this.set.delete(msg);
        }
        return "OK";
      }
    );
    this.set = set;
  }
}
