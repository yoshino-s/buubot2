import { URLSearchParams } from "url";

import { MessageType } from "mirai-ts";

const e = (o: Record<string, any>) => {
  const u = new URLSearchParams(o);
  u.delete("type");
  u.delete("origin"); // remove origin of Quote
  return u.toString();
};

export const serialize = (messageChain: MessageType.MessageChain) =>
  messageChain
    .map((v) => {
      if (v.type === "Plain") return encodeURIComponent(v.text);
      if (v.type === "Source") return "";
      return `[[${v.type}:${e(v)}]]`;
    })
    .join("");

const codeRegexp = /\[\[[^\]]+\]\]/g;

function parse(s: string): MessageType.SingleMessage {
  const idx = s.indexOf(":");
  const o: any = {};
  o.type = s.slice(0, idx);
  new URLSearchParams(s.slice(idx + 1)).forEach((v, k) => {
    o[k] = v;
  });
  return o;
}

export function unserialize(msg: any): MessageType.MessageChain {
  let idx = 0;
  const message = String(msg);
  const parts: MessageType.MessageChain = [];
  message.replace(codeRegexp, (r, i) => {
    const raw = msg.slice(idx, i);
    if (raw)
      parts.push({
        type: "Plain",
        text: decodeURIComponent(raw),
      });
    idx = i + r.length;
    parts.push(parse(r.slice(2, -2)));
    return "";
  });
  const raw = message.slice(idx, msg.length);
  if (raw)
    parts.push({
      type: "Plain",
      text: decodeURIComponent(raw),
    });
  return parts;
}
