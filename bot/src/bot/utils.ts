import { MessageType } from "mirai-ts";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import Config from "../config.example";
import { createHash, randomBytes } from "crypto";

const codeRegexp = /(?<!\[)\[[^\]]+\](?!\])/g;

const plain = (text: string): MessageType.Plain => ({
  type: "Plain",
  text,
});

function parse(part: string): MessageType.SingleMessage {
  if (part.startsWith("img:")) {
    return {
      type: "Image",
      path: "",
      imageId: "",
      url: part.slice(4),
    };
  } else if (part.startsWith("img_path:")) {
    return {
      type: "Image",
      path: part.slice(9),
      imageId: "",
      url: "",
    };
  } else {
    return plain(part);
  }
}

export function saveImage(p: string): string {
  const f = createHash("md5").update(randomBytes(16)).digest("hex");
  copyFileSync(p, f);
  return f;
}

export function parseMessage(msg: any): MessageType.SingleMessage[] | string {
  if (typeof msg === "string") {
    const parts: MessageType.SingleMessage[] = [];
    let idx = 0;
    msg.replace(codeRegexp, (r, i) => {
      const raw = msg.slice(idx, i);
      if (raw) parts.push(plain(raw));
      idx = i + r.length;
      parts.push(parse(r.slice(1, -1)));
      return "";
    });
    const raw = msg.slice(idx, msg.length);
    if (raw) parts.push(plain(raw));
    return parts;
  } else {
    return msg.toString();
  }
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

export type Pipe<T> = (p: T) => T | undefined;
