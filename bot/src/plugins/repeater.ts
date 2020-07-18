import { MiraiBot } from "../bot/Bot";
import { serialize } from "../bot/serialization";
import { diffChars } from "diff";

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
}
