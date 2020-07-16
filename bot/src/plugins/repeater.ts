import { MiraiBot } from "../bot/Bot";
import { serialize } from "../bot/serialization";
export default function RepeaterPlugin(bot: MiraiBot) {
  const msgSet = new Map<number, [string, number]>();
  bot.mirai.on("message", (msg) => {
    if (msg.type === "FriendMessage") return;
    const plain = serialize(msg.messageChain);
    const p = msgSet.get(msg.sender.group.id) ?? [plain, 0];
    if (p[0] === plain) {
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
