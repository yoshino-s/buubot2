import RssParser from "rss-parser";
import $ from "cheerio";
import config from "./config.json";

async function test() {
  const parser = new RssParser();
  const res = await parser.parseURL(
    `https://${config.Rss.proxyHost}/pcr/news-cn`
  );
  console.log(res);
  const content = $(res.items?.[0].content);
  console.log(
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
}

test();
