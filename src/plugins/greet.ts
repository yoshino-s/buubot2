import { SwitchCommand } from "../command/Command";
import { sendMsgQueue, TargetSetStorage } from "../utils";
import { Tag, UseCommand } from "../utils/decorator";
import { BotPlugin } from "../bot/Bot";

const morningRepeat = {
  cron: "0 7 * * *",
  tz: "Asia/Shanghai",
};

const nightRepeat = {
  cron: "0 22 * * *",
  tz: "Asia/Shanghai",
};

@Tag("entertainment")
export default class GreetPlugin extends BotPlugin {
  greetList = new TargetSetStorage("greetList");

  @UseCommand
  greet = new SwitchCommand(
    "greet",
    this.greetList,
    false,
    (target, status) => {
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
    }
  );
}
