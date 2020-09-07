import { ChatMessage } from "mirai-ts/dist/types/message-type";

import { Async } from "../utils";
import { Args, Bot, Cmd, Msg } from "../utils/decorator";
import { BotNamespace, BotPlugin } from "../bot/Bot";
import {
  CommandPermission,
  permissionInstruction,
} from "../command/Permission";
import MiraiBotCommand from "../command/Command";

export default class BuiltinPlugin extends BotPlugin {
  extractAllCommand(bot: BotNamespace): MiraiBotCommand[] {
    return bot.cmdHooks.concat(
      ...bot.children.map((child) => this.extractAllCommand(child))
    );
  }

  @Cmd({
    cmd: "GroupCmd",
    help:
      `GroupCmd list | (set {cmd} {rule}) | mute
Rule:` + permissionInstruction,
    rule: CommandPermission.admin,
    verify: (msg, cmd, args) => {
      if (args === "list") return true;
      const r = args.split(" ");
      if (r[0] === "set" && r.length === 3 && !Number.isNaN(r[2])) return true;
      return false;
    },
  })
  async groupCmd(
    @Msg msg: ChatMessage,
    @Args args: string,
    @Bot bot: BotNamespace
  ) {
    if (msg.type === "FriendMessage") return;
    const id = msg.sender.group.id;
    const c = this.extractAllCommand(bot);
    if (args === "list")
      return (
        `List of cmd in ${msg.sender.group.name}(${id})\n` +
        (
          await Async.map(
            c,
            async (v) =>
              `${v.config.cmd} ${(await v.getRule(id))
                .toString(2)
                .padStart(8, "0")}`
          )
        ).join("\n")
      );
    else if (args === "mute") {
      c.forEach((c) => c.setRule(id, 0));
      return "Mute all cmd";
    }
    const r = args.split(" ");
    const command = c.find((i) => i.config.cmd === r[1]);
    if (!command) return `Command ${r[1]} not found.`;
    const o = Number(r[2]);
    await command.setRule(id, o);
    return `Command Rule of ${r[1]} in ${
      msg.sender.group.name
    }(${id}) is ${o.toString(2).padStart(8, "0")}.`;
  }
}
