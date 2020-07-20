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
  Array.from(new URLSearchParams(s.slice(idx + 1)).entries()).forEach(
    ([k, v]) => {
      o[k] = v;
    }
  );
  return o;
}

export function unserialize(msg: string): MessageType.MessageChain {
  let idx = 0;
  const parts: MessageType.MessageChain = [];
  msg.replace(codeRegexp, (r, i) => {
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
  const raw = msg.slice(idx, msg.length);
  if (raw)
    parts.push({
      type: "Plain",
      text: decodeURIComponent(raw),
    });
  return parts;
}
