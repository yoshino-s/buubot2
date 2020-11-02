import Axios from "axios";
import { BotPlugin, Args, Cmd, Tag } from "@mirai-bot/core";

import { saveImg } from "../utils";

type Ret = { url?: string; path?: string };

@Tag("entertainment")
export default class EggPlugin extends BotPlugin {
  @Cmd("sucker")
  async sucker() {
    return (
      await Axios.get(
        "https://hitokoto.yoshino-s.online/?c=a&encode=text&max_length=100"
      )
    ).data;
  }
  @Cmd("ctfer")
  async ctfer() {
    return (
      await Axios.get(
        "https://hitokoto.yoshino-s.online/?c=c&encode=text&max_length=100"
      )
    ).data;
  }
  @Cmd("ylbnb")
  async ylbnb() {
    return (
      await Axios.get(
        "https://hitokoto.yoshino-s.online/?c=y&encode=text&max_length=1000"
      )
    ).data;
  }
  @Cmd("setu")
  async setu(@Args args: string) {
    const api: Record<string, () => Ret | Promise<Ret>> = {
      a: () => ({
        url: "https://i.xinger.ink:4443/images.php",
      }),
    };
    const hideApi: Record<string, () => Ret | Promise<Ret>> = {
      twl: async () => {
        await saveImg(
          "https://uploadbeta.com/api/pictures/random/?key=%E6%8E%A8%E5%A5%B3%E9%83%8E",
          "setu",
          "setu.png"
        );
        return { path: "setu.png" };
      },
    };
    const val = Object.values(api);
    const a = await (
      hideApi[args] ||
      api[args] ||
      val[(val.length * Math.random()) << 0]
    )();
    if (a.url) {
      return `[[Image:url=${encodeURIComponent(a.url)}]]`;
    } else {
      return `[[Image:path=${encodeURIComponent(a.path || "setu")}]]`;
    }
  }
}
