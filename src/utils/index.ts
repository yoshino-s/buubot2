import { EventEmitter as EE } from "events";

import Queue from "bull";
import StrictEventEmitter from "strict-event-emitter-types";
import { setQueues } from "bull-board";
import { MessageType } from "mirai-ts";

import { MiraiBot } from "../bot/Bot";
import { config } from "../config";

export type Target = {
  id?: number;
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
        id: explicit ? msg.sender.id : undefined,
        group: msg.sender.group.id,
      };
    case "TempMessage":
      return {
        id: msg.sender.id,
        temp: msg.sender.group.id,
      };
  }
  return {
    id: msg.sender.id,
  };
}

export const queue = <T = any>(name: string) => {
  const queue = new Queue<T>(name, {
    redis: config.redis,
  });
  setQueues(queue);
  return queue;
};

let sendMsgQueue: Queue.Queue;

export const getSendMsgQueue = () => {
  if (!sendMsgQueue)
    sendMsgQueue = queue<{
      target: Target;
      msg: string;
    }>("sendMessage");
  sendMsgQueue.process(async (job) =>
    MiraiBot.getCurrentBot().send(job.data.target, job.data.msg)
  );
  return sendMsgQueue;
};

export type EventEmitter<T> = StrictEventEmitter<EE, T>;
export type EventEmitterClass<T> = { new (): StrictEventEmitter<EE, T> };

export * from "./async";
export * from "./proxy";
export * from "./storage";
export * from "./serialization";
export * as Decorator from "./decorator";
