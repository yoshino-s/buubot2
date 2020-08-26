import { Bot } from "../bot/Bot";
import { SwitchCommand } from "../bot/Command";
import { sendMsgQueue, TargetSetStorage } from "../bot/utils";

const morningRepeat = {
  cron: "0 7 * * *",
  tz: "Asia/Shanghai",
};

const nightRepeat = {
  cron: "0 22 * * *",
  tz: "Asia/Shanghai",
};

export default function GreetPlugin(bot: Bot) {
  const greetList = new TargetSetStorage("greetList");
  bot.register(
    new SwitchCommand(bot, "greet", greetList, false, (target, status) => {
      if (status) {
        sendMsgQueue.add(
          { target: target, msg: "早上好" },
          {
            repeat: morningRepeat,
            jobId: `greet:morning:${JSON.stringify(target)}`,
          }
        );
        sendMsgQueue.add(
          { target: target, msg: "晚上好" },
          {
            repeat: nightRepeat,
            jobId: `greet:night:${JSON.stringify(target)}`,
          }
        );
      } else {
        sendMsgQueue.removeRepeatable({
          ...morningRepeat,
          jobId: `greet:morning:${JSON.stringify(target)}`,
        });
        sendMsgQueue.removeRepeatable({
          ...nightRepeat,
          jobId: `greet:night:${JSON.stringify(target)}`,
        });
      }
    })
  );
}
