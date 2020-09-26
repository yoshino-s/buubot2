import Axios from "axios";

import { Cmd, Args, Tag } from "../utils/decorator";
import { BotPlugin } from "../bot/Bot";
@Tag("entertainment")
export default class SearchPlugin extends BotPlugin {
  @Cmd("search")
  async search(@Args args: string) {
    try {
      const i = await Axios.get(
        `https://wiki.yoshino-s.workers.dev/api/rest_v1/page/summary/${encodeURIComponent(
          args
        )}`,
        {
          headers: {
            "accept-language": "zh-CN,zh;q=0.9",
          },
        }
      );
      return i.data.extract as string;
    } catch (e) {
      return "找不到呢";
    }
  }
}
