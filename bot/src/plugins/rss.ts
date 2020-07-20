import { MiraiBot } from "../bot/Bot";
import { ContactMap, Async } from "../bot/utils";
import { CommandPermission } from "../bot/Command";
import RssParser from "rss-parser";
import $ from "cheerio";
import config from "../config.json";

const parser = new RssParser();

const cacheMap = new Map<string, string>();

async function parseRss(url: string) {
  const r = cacheMap.get(url);
  if (r) return r;
  const lastUpdate = Date.now() - config.Rss.updateInterval;
  const res = await parser.parseURL(url);
  const result =
    res.items
      ?.filter((i) => new Date(i.isoDate || lastUpdate).getTime() >= lastUpdate)
      .slice(0, 5)
      .map((i) => {
        const content = $(i.content);
        return (
          (i.link ? i.link + "\n" : "") +
          Array.from(content.contents())
            .map((e) => {
              if (e.type === "text") return e.data;
              if (e.tagName === "br") return "\n";
              if (e.tagName === "img") return `[[Image:url=${e.attribs.src}]]`;
            })
            .join("")
            .replace(/(?:\n\s+)+/g, "\n")
            .trim()
        );
      })
      .join("\n") || "";
  cacheMap.set(url, result);
  return result;
}
export default function RssPlugin(bot: MiraiBot) {
  const rssMap = new ContactMap<[string, string][]>("rssMap");
  const update = () => {
    cacheMap.clear();
    return rssMap.sendAll(bot, async (c) => {
      return (
        await Async.map(
          c,
          async ([id, url]) =>
            `来自${id}的订阅\n` + ((await parseRss(url)).trim() || "暂无")
        )
      ).join("\n\n");
    });
  };

  setInterval(update, config.Rss.updateInterval);
  bot.registerCommand(
    {
      cmd: "rss",
      help: "rss list | update | add id url | remove id",
      rule: CommandPermission.admin | CommandPermission.friend,
      verify: (msg, cmd, args) => {
        const a = args.split(" ");
        switch (a.length) {
          case 1:
            return a[0] === "list" || a[0] === "update";
          case 2:
            return a[0] === "remove";
          case 3:
            return a[0] === "add";
        }
        return false;
      },
    },
    async (msg, cmd, args) => {
      const a = args.split(" ");
      const s = rssMap.get(msg) || [];
      let idx = -1;
      let item: [string, string];
      switch (a.length) {
        case 1:
          if (a[0] === "list")
            return "订阅列表：\n" + (rssMap.get(msg) || []).join("\n");
          else {
            await update();
            return "OK";
          }
        case 2:
          idx = s.findIndex((i) => i[0] === a[1]);
          if (idx === -1) return `没有找到ID为${a[1]}的订阅。`;
          [item] = s.splice(idx, 1);
          rssMap.set(msg, s);
          return `已从订阅列表里移除ID为${item[0]}的订阅，链接为${item[1]}。`;
        case 3:
          idx = s.findIndex((i) => i[0] === a[1]);
          if (idx !== -1)
            return `已经有了ID为${a[1]}的订阅，链接为${s[idx][1]}。`;
          item = [a[1], a[2]];
          s.push(item);
          rssMap.set(msg, s);
          return `添加了ID为${item[0]}的订阅，链接为${item[1]}。`;
      }
    }
  );
}
