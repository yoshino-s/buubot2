import RssParser from "rss-parser";

async function test() {
  const parser = new RssParser();
  const res = await parser.parseURL("https://rsshub.app/pcr/news-cn");
  console.log(res);
}

test();
