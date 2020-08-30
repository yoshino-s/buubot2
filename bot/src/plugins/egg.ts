import Axios from "axios";

import { saveImg } from "../bot/utils";
import { Args, Cmd } from "../bot/utils/decorator";
import { BotPlugin } from "../bot/Bot";

type Ret = { url?: string; path?: string };

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
  @Cmd("setu")
  async setu(@Args args: string) {
    const api: Record<string, () => Ret | Promise<Ret>> = {
      a: () => ({
        url: "https://i.xinger.ink:4443/images.php",
      }),
      妈: async () => {
        await saveImg("https://api.bxmao.net/MORIYA.php", "setu");
        return { path: "setu" };
      },
      BROTHERS_CONFLICT: async () => {
        await saveImg("https://api.bxmao.net/BROTHERS_CONFLICT.php", "setu");
        return { path: "setu" };
      },
      fate: async () => {
        await saveImg("https://api.bxmao.net/fate.php", "setu");
        return { path: "setu" };
      },
      Fate_stay_night: async () => {
        await saveImg("https://api.bxmao.net/Fate_stay_night.php", "setu");
        return { path: "setu" };
      },
      "LoveLive!": async () => {
        await saveImg("https://api.bxmao.net/LoveLive!.php", "setu");
        return { path: "setu" };
      },
      NO_GAME_NO_LIFE: async () => {
        await saveImg("https://api.bxmao.net/NO_GAME_NO_LIFE.php", "setu");
        return { path: "setu" };
      },
      alma: async () => {
        await saveImg("https://api.bxmao.net/alma.php", "setu");
        return { path: "setu" };
      },
      cjsnz: async () => {
        await saveImg("https://api.bxmao.net/cjsnz.php", "setu");
        return { path: "setu" };
      },
      djly: async () => {
        await saveImg("https://api.bxmao.net/djly.php", "setu");
        return { path: "setu" };
      },
      dbn: async () => {
        await saveImg("https://api.bxmao.net/dbn.php", "setu");
        return { path: "setu" };
      },
      llx: async () => {
        await saveImg("https://api.bxmao.net/llx.php", "setu");
        return { path: "setu" };
      },
      gj: async () => {
        await saveImg("https://api.bxmao.net/gj.php", "setu");
        return { path: "setu" };
      },
      lzdd: async () => {
        await saveImg("https://api.bxmao.net/lzdd.php", "setu");
        return { path: "setu" };
      },
      ltsl: async () => {
        await saveImg("https://api.bxmao.net/ltsl.php", "setu");
        return { path: "setu" };
      },
      mfsn: async () => {
        await saveImg("https://api.bxmao.net/mfsn.php", "setu");
        return { path: "setu" };
      },
      yzk: async () => {
        await saveImg("https://api.bxmao.net/yzk.php", "setu");
        return { path: "setu" };
      },
      cywl: async () => {
        await saveImg("https://api.bxmao.net/cywl.php", "setu");
        return { path: "setu" };
      },
      xylg: async () => {
        await saveImg("https://api.bxmao.net/xylg.php", "setu");
        return { path: "setu" };
      },
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
