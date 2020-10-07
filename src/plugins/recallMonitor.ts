import { MessageType } from "mirai-ts";
import { GroupRecallEvent } from "mirai-ts/dist/types/event-type";
import {
  serialize,
  unserialize,
  MiraiBot,
  BotPlugin,
  On,
  Event,
  Bot,
  Tag,
} from "@mirai-bot/core";

const preventRecallList = new Map<number, string>();

@Tag("util")
export default class RecallMonitorPlugin extends BotPlugin {
  @On("GroupRecallEvent")
  async(@Event e: GroupRecallEvent, @Bot bot: MiraiBot) {
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
