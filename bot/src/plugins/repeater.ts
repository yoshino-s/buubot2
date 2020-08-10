import { MiraiBot } from "../bot/Bot";
import { serialize, unserialize } from "../bot/serialization";
import { diffChars } from "diff";
import { CommandPermission } from "../bot/Command";
import { SetStorage } from "../bot/utils/storage";

function similarity(s0: string, s1: string) {
  return (
    diffChars(s0, s1).reduce(
      (p, c) => (!(c.added || c.removed) ? p + c.value.length : p),
      0
    ) / Math.max(s0.length, s1.length)
  );
}
export default function RepeaterPlugin(bot: MiraiBot) {
  const msgSet = new Map<number, [string, number]>();
  bot.mirai.on("message", (msg) => {
    if (msg.type === "FriendMessage") return;
    const plain = serialize(msg.messageChain);
    const p = msgSet.get(msg.sender.group.id) ?? [plain, 0];
    const s = similarity(plain, p[0]);
    if (s > 0.7) {
      p[1]++;
    } else {
      p[0] = plain;
      p[1] = 1;
    }
    if (p[1] === 5) {
      msg.reply(msg.messageChain);
    }
    msgSet.set(msg.sender.group.id, p);
  });

  const preventFlashImage = new SetStorage<number>("preventFlashImage");

  bot.registerCommand(
    {
      cmd: "preventFlashImage",
      help: "preventFlashImage on|off",
      rule: CommandPermission.admin,
      verify: (msg, cmd, args) => ["on", "off"].includes(args),
    },
    async (msg, cmd, args) => {
      if (msg.type !== "GroupMessage") return;
      if (args === "on") {
        await preventFlashImage.add(msg.sender.group.id);
      } else {
        await preventFlashImage.remove(msg.sender.group.id);
      }
      return "OK";
    }
  );

  bot.mirai.on("GroupMessage", async (msg) => {
    if (await preventFlashImage.has(msg.sender.group.id)) {
      msg.messageChain.forEach((m) => {
        if (m.type === "FlashImage") {
          msg.reply(
            unserialize(
              `${msg.sender.memberName}发了一张闪照:\n[[Image:imageId=${m.imageId}]]`
            )
          );
        }
      });
    }
  });
}
