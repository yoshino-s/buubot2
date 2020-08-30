import { MessageType } from "mirai-ts";
import { GroupRecallEvent } from "mirai-ts/dist/types/event-type";

import { serialize, unserialize } from "../bot/utils";
import { BotNamespace, BotPlugin } from "../bot/Bot";
import { On, Event, Bot } from "../bot/utils/decorator";

const preventRecallList = new Map<number, string>();

export default class RecallMonitorPlugin extends BotPlugin {
  @On("GroupRecallEvent")
  async(@Event e: GroupRecallEvent, @Bot bot: BotNamespace) {
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
  }
}

export function preventGroupMessageRecall(msg: MessageType.GroupMessage) {
  preventRecallList.set(msg.messageChain[0].id, serialize(msg.messageChain));
}
