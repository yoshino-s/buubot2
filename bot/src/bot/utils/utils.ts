import Config from "../../config.json";
import { MessageType } from "mirai-ts";
import { MiraiBot } from "../Bot";
import Queue from "bull";
import { setQueues } from "bull-board";
import { createWriteStream } from "fs";
import { resolve } from "path";
import Axios from "axios";
import { createHash } from "crypto";
import { execSync } from "child_process";
import textify from "./textify";

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

export const queue = <T = any>(name: string) => {
  const queue = new Queue<T>(name, {
    redis: Config.Redis,
  });
  setQueues(queue);
  return queue;
};

export const sendMsgQueue = queue<{
  target: Target;
  msg: string;
}>("sendMessage");

sendMsgQueue.process(async (job) =>
  MiraiBot.getCurrentBot().send(job.data.target, job.data.msg)
);

export async function saveImg(url: string, name: string, text?: string) {
  name = resolve(Config.Utils.imageStorage, name);
  execSync(`wget "${url}" -O ${name}`);
  if (text) {
    await textify(name, resolve(Config.Utils.imageStorage, text));
  }
}
