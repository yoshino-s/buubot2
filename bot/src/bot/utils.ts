import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import Config from "../config.json";
import { createHash, randomBytes } from "crypto";
import { MessageType } from "mirai-ts";
import { MiraiBot } from "./Bot";
import { unserialize } from "./serialization";

export function saveImage(p: string): string {
  const f = createHash("md5").update(randomBytes(16)).digest("hex");
  copyFileSync(p, f);
  return f;
}

export class Storage<T> {
  private data: T;
  private name: string;
  private path: string;
  constructor(name: string, defaultValue: T) {
    this.name = name;
    this.data = defaultValue;
    this.get();
    this.path = join(Config.Utils.dataStorage, this.name + ".json");
  }
  get(): T {
    try {
      const d = readFileSync(this.path).toString();
      this.data = JSON.parse(d);
    } catch (e) {
      //
    }
    return this.data;
  }
  set(data: T) {
    this.data = data;
    writeFileSync(this.path, JSON.stringify(data));
  }
}

export class ContactSet {
  storage: Storage<string[]>;
  set: Set<string>;

  constructor(name: string) {
    this.storage = new Storage<string[]>(name, []);
    this.set = new Set(this.storage.get());
  }
  msgToId(msg: MessageType.ChatMessage) {
    switch (msg.type) {
      case "FriendMessage":
        return `friend_${msg.sender.id}`;
      case "GroupMessage":
        return `group_${msg.sender.id}_${msg.sender.group.id}`;
      case "TempMessage":
        return `group_${msg.sender.id}_${msg.sender.group.id}`;
    }
  }
  add(msg: MessageType.ChatMessage) {
    this.set.add(this.msgToId(msg));
    this.storage.set(Array.from(this.set));
  }

  has(msg: MessageType.ChatMessage) {
    return (this.set = new Set(this.storage.get())).has(this.msgToId(msg));
  }

  delete(msg: MessageType.ChatMessage) {
    (this.set = new Set(this.storage.get())).delete(this.msgToId(msg));
    this.storage.set(Array.from(this.set));
  }

  list(): { id: number; group?: number; temp?: number }[] {
    return Array.from((this.set = new Set(this.storage.get()))).map((v) => {
      if (v.startsWith("group_")) {
        const [id, group] = v.slice(6).split("_").map(Number);
        return { id, group };
      } else if (v.startsWith("temp_")) {
        const [id, group] = v.slice(5).split("_").map(Number);
        return { id, temp: group };
      }
      return { id: Number(v.slice(7)) };
    });
  }

  sendAll(bot: MiraiBot, msg: string | MessageType.MessageChain) {
    let message: MessageType.MessageChain = [];
    if (Array.isArray(msg)) message = msg;
    else message = unserialize(msg);
    return Promise.all(
      Array.from((this.set = new Set(this.storage.get()))).map((v: string) => {
        if (v.startsWith("group_")) {
          const [id, group] = v.slice(6).split("_").map(Number);
          return bot.mirai.api.sendGroupMessage(message, id, group);
        } else if (v.startsWith("temp_")) {
          const [id, group] = v.slice(5).split("_").map(Number);
          return bot.mirai.api.sendTempMessage(message, id, group);
        }
        return bot.mirai.api.sendFriendMessage(message, Number(v.slice(7)));
      })
    );
  }
}

export type Pipe<T> = (p: T) => T | undefined;
