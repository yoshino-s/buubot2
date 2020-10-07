import { diffChars } from "diff";
import { ChatMessage, GroupMessage } from "mirai-ts/dist/types/message-type";
import {
  On,
  Event,
  UseCommand,
  Tag,
  SwitchCommand,
  BotPlugin,
} from "@mirai-bot/core";
import {
  serialize,
  unserialize,
  SetStorage,
  extractTarget,
  Target,
} from "@mirai-bot/utils";

function similarity(s0: string, s1: string) {
  return (
    diffChars(s0, s1).reduce(
      (p, c) => (!(c.added || c.removed) ? p + c.value.length : p),
      0
    ) / Math.max(s0.length, s1.length)
  );
}
@Tag("entertainment")
export default class RepeaterPlugin extends BotPlugin {
  msgSet = new Map<number, [string, number]>();

  @On("message")
  repeat(@Event msg: ChatMessage) {
    if (msg.type === "FriendMessage") return;
    const plain = serialize(msg.messageChain);
    const p = this.msgSet.get(msg.sender.group.id) ?? [plain, 0];
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
    this.msgSet.set(msg.sender.group.id, p);
  }

  preventFlashImage = new SetStorage<Target>("preventFlashImage");

  @UseCommand
  preventFlashImageCmd = new SwitchCommand(
    "preventFlashImage",
    this.preventFlashImage,
    false
  );
  @On("GroupMessage")
  async flashImage(@Event msg: GroupMessage) {
    if (await this.preventFlashImage.has(extractTarget(msg, false))) {
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
  }
}
