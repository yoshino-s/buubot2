import { MiraiBot } from "../bot/Bot";
import { MessageType } from "mirai-ts";
import { serialize, unserialize } from "../bot/serialization";

const preventRecallList = new Map<number, string>();

export default function RecallMonitorPlugin(bot: MiraiBot) {
  bot.mirai.on("GroupRecallEvent", async (e) => {
    const msg = preventRecallList.get(e.messageId);
    if (msg) {
      console.log(msg);
      bot.mirai.api.sendGroupMessage(
        [
          {
            type: "Plain",
            text: `${e.operator?.memberName || "我"}撤回了一条重要信息:\n`,
          },
          ...unserialize(msg),
        ],
        e.group.id
      );
      preventRecallList.delete(e.messageId);
    }
  });
}

export function preventGroupMessageRecall(msg: MessageType.GroupMessage) {
  preventRecallList.set(msg.messageChain[0].id, serialize(msg.messageChain));
}
