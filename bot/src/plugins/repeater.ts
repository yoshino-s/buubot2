import { MiraiBot } from "../bot/Bot";
import { serialize } from "../bot/serialization";
import { diffChars } from "diff";

function similarity(s0: string, s1: string) {
  return (
    (diffChars(s0, s1).reduce(
      (p, c) => (!(c.added || c.removed) ? p + c.value.length : p),
      0
    ) /
      (s0.length + s1.length)) *
    2
  );
}
export default function RepeaterPlugin(bot: MiraiBot) {
  const msgSet = new Map<number, [string, number]>();
  bot.mirai.on("message", (msg) => {
    if (msg.type === "FriendMessage") return;
    const plain = serialize(msg.messageChain);
    const p = msgSet.get(msg.sender.group.id) ?? [plain, 0];
    const s = similarity(plain, p[0]);
    console.log(s, plain);
    if (s > 0.6) {
      p[1]++;
    } else {
      p[0] = plain;
      p[1] = 1;
    }
    if (p[1] === 3) {
      msg.reply(msg.messageChain);
    }
    msgSet.set(msg.sender.group.id, p);
  });
}
