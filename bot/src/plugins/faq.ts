import { ChatMessage } from "mirai-ts/dist/types/message-type";

import { Args, Cmd, Msg } from "../utils/decorator";
import { BotPlugin, BotNamespace } from "../bot/Bot";
import Config from "../config.json";

const faqData = [
  {
    E: "学校地址",
    Q: ["学校", "地址|在哪里"],
    A: "上海市普陀区中山北路3663号。",
  },
  {
    E: "周围交通",
    Q: ["怎么(?:去|到)|地铁|交通", "周围|附近|旁边"],
    A: "学校周围有地铁3号线，4号线，13号线，具体交通细节请参考导航软件。",
  },
  {
    E: "宿舍在哪里",
    Q: ["舍", "地址|位置|怎么去|哪里"],
    A: `http://${Config.Bot.host}:${Config.Bot.port}/route`,
  },
  {
    E: "开学考",
    Q: ["开学|期初", "考"],
    A: "英语，高数和简单的上机测试",
  },
  {
    E: "上机测试内容",
    Q: ["上机|计算机|", "测试|考试"],
    A:
      "https://acm.ecnu.edu.cn/contest/43/。\n看书可以选择《C Primer Plus》。书看不下去可以去看https://www.bilibili.com/video/BV1Bx411u7qY。（其实这个考试是选考，就是说可以不去滴",
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
  @Cmd("E")
  async listExample(@Msg msg: ChatMessage, @Args args: string) {
    return (
      `你可以以 "Q 关键词" 的格式问我以下问题：\n` +
      faqData.map((v) => v.E).join("\n")
    );
  }
  boot() {
    const bot = BotNamespace.getCurrentBot();
    bot.express.use("/route", (req, res) => {
      res.render("route");
    });
  }
}
