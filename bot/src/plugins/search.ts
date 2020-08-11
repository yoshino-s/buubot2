import { MiraiBot } from "../bot/Bot";
import { agent } from "../bot/utils/proxy";
import Axios from "axios";
export default function SearchPlugin(bot: MiraiBot) {
  bot.registerCommand(
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
