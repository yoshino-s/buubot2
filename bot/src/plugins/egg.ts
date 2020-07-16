import { MiraiBot } from "../bot/Bot";
import Axios from "axios";
export default function EggPlugin(bot: MiraiBot) {
  bot.registerCommand(
    {
      cmd: "sucker",
    },
    async () =>
      (await Axios.get("https://v1.alapi.cn/api/dog?format=text")).data
  );
}
