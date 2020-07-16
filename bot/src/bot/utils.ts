import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import Config from "../config";
import { createHash, randomBytes } from "crypto";

export function saveImage(p: string): string {
  const f = createHash("md5").update(randomBytes(16)).digest("hex");
  copyFileSync(p, f);
  return f;
}

console.log(Config.Utils.dataStorage);

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
