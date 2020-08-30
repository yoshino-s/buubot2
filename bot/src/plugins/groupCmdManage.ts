import { ChatMessage } from "mirai-ts/dist/types/message-type";

import { CommandPermission } from "../bot/Command";
import { Async } from "../bot/utils";
import { Args, Bot, Cmd, Msg } from "../bot/utils/decorator";
import { BotNamespace, BotPlugin } from "../bot/Bot";

export default class GroupCmdManagePlugin extends BotPlugin {
  @Cmd({
    cmd: "GroupCmd",
    help: `GroupCmd list | (set {cmd} {rule}) | mute
Rule:
* 0b00000001 friend
* 0b00000010 group member
* 0b00000100 group admin
* 0b00001000 group owner
* 0b00010000 temp chat`,
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
    const c = bot.cmdHooks;
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
