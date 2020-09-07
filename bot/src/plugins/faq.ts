import { ChatMessage } from "mirai-ts/dist/types/message-type";

import { Args, Cmd, Msg } from "../utils/decorator";
import { BotPlugin, BotNamespace } from "../bot/Bot";
import Config from "../config.json";

const faqData = [
  {
    Q: ["学校", "地址|在哪里"],
    A: "上海市普陀区中山北路3663号。",
  },
  {
    Q: ["怎么(?:去|到)|周围|地铁|交通"],
    A: "学校周围有地铁3号线，4号线，13号线，具体交通细节请参考导航软件。",
  },
  {
    Q: ["四|4", "舍", "地址|位置|怎么去|哪里"],
    A: `http://${Config.Bot.host}:${Config.Bot.port}/route`,
  },
];

export default class FaqPlugin extends BotPlugin {
  @Cmd("Q")
  async question(@Msg msg: ChatMessage, @Args args: string) {
    for (const item of faqData) {
      if (item.Q.every((v) => new RegExp(v).test(args))) {
        msg.reply(item.A);
        break;
      }
    }
  }
  boot() {
    const bot = BotNamespace.getCurrentBot();
    bot.express.use("/route", (req, res) => {
      res.render("route");
    });
  }
}
