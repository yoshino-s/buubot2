import Axios from "axios";

import { Bot } from "../bot/Bot";
export default function SearchPlugin(bot: Bot) {
  bot.register(
    {
      cmd: "search",
    },
    (msg, cmd, args) =>
      Axios.get(
        `https://wiki.yoshino-s.workers.dev/api/rest_v1/page/summary/${encodeURIComponent(
          args
        )}`,
        {
          headers: {
            "accept-language": "zh-CN,zh;q=0.9",
          },
        }
      )
        .then((i) => i.data.extract)
        .catch(() => "找不到呢")
  );
}
