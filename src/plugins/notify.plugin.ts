import { config } from "@mirai-bot/config";
import MiraiBot, { BotPlugin } from "@mirai-bot/core";

export class NotifyPlugin extends BotPlugin {
  boot(bot: MiraiBot) {
    bot.express.post("/send", async (req, res) => {
      if (req.body.token === config.api.authKey) {
        try {
          res.send(await bot.send(req.body.target, req.body.message));
        } catch (e) {
          res.send({ code: -1, message: e });
        }
      } else {
        res.send({ code: -1, message: "Wrong token" });
      }
    });
  }
}
