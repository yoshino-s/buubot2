import { MiraiBot } from "../bot/Bot";
import { TargetMapStorage } from "../bot/utils/storage";
import { extractTarget } from "../bot/utils/utils";
import { CommandPermission } from "../bot/Command";
export default function BannerPlugin(bot: MiraiBot) {
  const banWorkMap = new TargetMapStorage<string[]>("banWord");
  bot.registerCommand(
    {
      cmd: "ban",
      help: "Usage: rank word",
      rule: CommandPermission.admin,
      verify: (msg, cmd, args) => !!args,
    },
    async (msg, cmd, args) => {
      const target = extractTarget(msg, false);
      const w = (await banWorkMap.get(target)) || [];
      w.push(args.toLowerCase());
      await banWorkMap.set(target, w);
      return `将对关键词"${args}"封禁。现在的封禁词列表：${w.join(",")}`;
    }
  );
  bot.mirai.on("GroupMessage", async (msg) => {
    const target = extractTarget(msg, false);
    const w = (await banWorkMap.get(target)) || [];
    const plain = msg.plain.toLowerCase();
    if (w.some((v) => plain.includes(v))) {
      await bot.mirai.api.mute(msg.sender.group.id, msg.sender.id, 60 * 60);
      await bot.send(
        target,
        `由于${msg.sender.memberName}触发了封禁关键词，已将其封禁，下不为例。`
      );
    }
  });
}
