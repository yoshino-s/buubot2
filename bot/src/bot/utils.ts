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
          const [, group] = v.slice(6).split("_").map(Number);
          return bot.mirai.api.sendGroupMessage(message, group);
        } else if (v.startsWith("temp_")) {
          const [id, group] = v.slice(5).split("_").map(Number);
          return bot.mirai.api.sendTempMessage(message, id, group);
        }
        return bot.mirai.api.sendFriendMessage(message, Number(v.slice(7)));
      })
    );
  }
}

export class ContactMap<T> {
  storage: Storage<[string, string][]>;
  map: Map<string, string>;

  constructor(name: string) {
    this.storage = new Storage(name, []);
    this.map = new Map(this.storage.get());
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
  set(msg: MessageType.ChatMessage, value: T) {
    this.map.set(this.msgToId(msg), JSON.stringify(value));
    this.storage.set(Array.from(this.map.entries()));
  }

  get(msg: MessageType.ChatMessage): T | null {
    return JSON.parse(
      (this.map = new Map(this.storage.get())).get(this.msgToId(msg)) || "null"
    );
  }

  delete(msg: MessageType.ChatMessage) {
    (this.map = new Map(this.storage.get())).delete(this.msgToId(msg));
    this.storage.set(Array.from(this.map.entries()));
  }

  async sendAll(
    bot: MiraiBot,
    msg: (data: T) => Promise<string | MessageType.MessageChain>
  ) {
    return Promise.all(
      Array.from((this.map = new Map(this.storage.get())).entries()).map(
        async ([k, v]) => {
          const message = await msg(JSON.parse(v));
          console.log(message);
          if (k.startsWith("group_")) {
            const [, group] = k.slice(6).split("_").map(Number);
            return bot.mirai.api.sendGroupMessage(message, group);
          } else if (k.startsWith("temp_")) {
            const [id, group] = k.slice(5).split("_").map(Number);
            return bot.mirai.api.sendTempMessage(message, id, group);
          }
          return bot.mirai.api.sendFriendMessage(message, Number(k.slice(7)));
        }
      )
    );
  }
}

export const Async = {
  map<T, R>(
    arr: Array<T>,
    m: (v: T, i: number, a: ArrayLike<T>) => R
  ): Promise<R[]> {
    return Promise.all(arr.map(m));
  },
};
