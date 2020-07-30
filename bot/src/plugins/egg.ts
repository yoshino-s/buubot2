import { MiraiBot } from "../bot/Bot";
import Axios from "axios";
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
}
