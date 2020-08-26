import { MessageType } from "mirai-ts";

import { Bot } from "../bot/Bot";
import { serialize, unserialize } from "../bot/utils";

const preventRecallList = new Map<number, string>();

export default function RecallMonitorPlugin(bot: Bot) {
  bot.mirai.on("GroupRecallEvent", async (e) => {
    const msg = preventRecallList.get(e.messageId);
    if (msg) {
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
