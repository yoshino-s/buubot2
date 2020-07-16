import { MiraiBot } from "../bot/Bot";
import { CommandPermission } from "../bot/Command";

export default function GroupCmdManagePlugin(bot: MiraiBot) {
  bot.registerCommand(
    {
      cmd: "GroupCmd",
      help: `Usage: GroupCmd list | (set {cmd} {rule})
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
        if (r[0] === "set" && r.length === 3 && !Number.isNaN(r[2]))
          return true;
        return false;
      },
    },
    (msg, cmd, args) => {
      if (msg.type === "FriendMessage") return;
      const id = msg.sender.group.id;
      const c = Array.from(bot.cmdHooks.values()).filter(
        (v) => v.getRule(id) & CommandPermission.member
      );
      if (args === "list")
        return (
          `List of cmd in ${msg.sender.group.name}(${id})\n` +
          c
            .map(
              (v) =>
                `${v.config.cmd} ${v.getRule(id).toString(2).padStart(8, "0")}`
            )
            .join("\n")
        );
      const r = args.split(" ");
      const command = c.find((i) => i.config.cmd === r[1]);
      if (!command) return `Command ${r[1]} not found.`;
      const o = Number(r[2]);
      command.setRule(id, o);
      return `Command Rule of ${r[1]} in ${
        msg.sender.group.name
      }(${id}) is ${o.toString(2).padStart(8, "0")}.`;
    }
  );
}
