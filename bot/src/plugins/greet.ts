import { MiraiBot } from "../bot/Bot";
import { SwitchCommand } from "../bot/Command";
import { TargetSetStorage } from "../bot/utils/storage";
import { sendMsgQueue } from "../bot/utils/utils";

const morningRepeat = {
  cron: "0 7 * * *",
  tz: "Asia/Shanghai",
};

const nightRepeat = {
  cron: "0 22 * * *",
  tz: "Asia/Shanghai",
};

export default function GreetPlugin(bot: MiraiBot) {
  const greetList = new TargetSetStorage("greetList");
  bot.cmdHooks.add(
    new SwitchCommand(bot, "greet", greetList, (target, status) => {
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
