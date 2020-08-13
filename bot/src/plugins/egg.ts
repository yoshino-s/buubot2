import { MiraiBot } from "../bot/Bot";
import Axios from "axios";
import { join } from "path";
import { saveImg } from "../bot/utils/utils";

export default function EggPlugin(bot: MiraiBot) {
  bot.registerCommand(
    {
      cmd: "sucker",
    },
    async () =>
      (
        await Axios.get(
          "https://hitokoto.yoshino-s.online/?c=a&encode=text&max_length=100"
        )
      ).data
  );
  bot.registerCommand("setu", async (msg, cmd, args) => {
    const api: Record<string, { url: string; save: boolean }> = {
      a: { url: "https://i.xinger.ink:4443/images.php", save: false },
      妈: { url: "https://api.bxmao.net/MORIYA.php", save: true },
      BROTHERS_CONFLICT: {
        url: "https://api.bxmao.net/BROTHERS_CONFLICT.php",
        save: true,
      },
      fate: { url: "https://api.bxmao.net/fate.php", save: true },
      Fate_stay_night: {
        url: "https://api.bxmao.net/Fate_stay_night.php",
        save: true,
      },
      "LoveLive!": { url: "https://api.bxmao.net/LoveLive!.php", save: true },
      NO_GAME_NO_LIFE: {
        url: "https://api.bxmao.net/NO_GAME_NO_LIFE.php",
        save: true,
      },
      alma: { url: "https://api.bxmao.net/alma.php", save: true },
      cjsnz: { url: "https://api.bxmao.net/cjsnz.php", save: true },
      djly: { url: "https://api.bxmao.net/djly.php", save: true },
      dbn: { url: "https://api.bxmao.net/dbn.php", save: true },
      llx: { url: "https://api.bxmao.net/llx.php", save: true },
      gj: { url: "https://api.bxmao.net/gj.php", save: true },
      lzdd: { url: "https://api.bxmao.net/lzdd.php", save: true },
      ltsl: { url: "https://api.bxmao.net/ltsl.php", save: true },
      mfsn: { url: "https://api.bxmao.net/mfsn.php", save: true },
      yzk: { url: "https://api.bxmao.net/yzk.php", save: true },
      cywl: { url: "https://api.bxmao.net/cywl.php", save: true },
      xylg: { url: "https://api.bxmao.net/xylg.php", save: true },
    };
    const val = Object.values(api);
    const a = api[args] || val[(val.length * Math.random()) << 0];
    if (a.save) {
      saveImg(a.url, "setu");
      return `[[Image:path=setu]]`;
    } else {
      return `[[Image:url=${encodeURIComponent(a.url)}]]`;
    }
  });
}
