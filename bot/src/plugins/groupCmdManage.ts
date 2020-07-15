import { MiraiBot } from "../bot/Bot";

export default function GroupCmdManagePlugin(bot: MiraiBot) {
  bot.registerCommand(
    {
      cmd: "GroupCmd",
      group: "must",
      help: "Usage: GroupCmd list | (set {cmd} off|on|admin)",
      permission: ["ADMINISTRATOR", "OWNER"],
      verify: (msg, cmd, args) => {
        if (args === "list") return true;
        const r = args.split(" ");
        if (
          r[0] === "set" &&
          r.length === 3 &&
          ["off", "on", "admin"].includes(r[2])
        )
          return true;
        return false;
      },
    },
    (msg, cmd, args) => {
      if (msg.type === "FriendMessage") return;
      const id = msg.sender.group.id;
      const c = Array.from(bot.cmdHooks.values()).filter((v) => v.config.group);
      if (args === "list")
        return (
          `List of cmd in ${msg.sender.group.name}(${id})\n` +
          c
            .map(
              (v) =>
                `${v.config.cmd} ${v.specialRules.get()[id.toString()] || "on"}`
            )
            .join("\n")
        );
      const r = args.split(" ");
      const command = c.find((i) => i.config.cmd === r[1]);
      if (!command) return `Command ${r[1]} not found.`;
      const o = r[2] as "off" | "on" | "admin";
      command.rule(id, o);
      return `Command ${r[1]} in ${msg.sender.group.name}(${id}) ${o}.`;
    }
  );
}
