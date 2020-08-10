import Config from "../../config.json";
import { MessageType } from "mirai-ts";
import { MiraiBot } from "../Bot";
import Queue from "bull";

export type Target = {
  id: number;
  group?: number;
  temp?: number;
};

export function extractTarget(
  msg: MessageType.ChatMessage,
  explicit = true
): Target {
  switch (msg.type) {
    case "GroupMessage":
      return {
        id: msg.sender.id,
        group: explicit ? msg.sender.group.id : undefined,
      };
    case "TempMessage":
      return {
        id: msg.sender.id,
        temp: explicit ? msg.sender.group.id : undefined,
      };
  }
  return {
    id: msg.sender.id,
  };
}

export const queue = <T = any>(name: string) =>
  new Queue<T>(name, {
    redis: Config.Redis,
  });

export const sendMsgQueue = queue<{
  target: Target;
  msg: string;
}>("sendMessage");

sendMsgQueue.process(async (job) =>
  MiraiBot.getCurrentBot().send(job.data.target, job.data.msg)
);
