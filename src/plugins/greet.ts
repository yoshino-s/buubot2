import { SwitchCommand, Tag, UseCommand, BotPlugin } from "@mirai-bot/core";
import { SetStorage, Target } from "@mirai-bot/utils";

import { getSendMsgQueue } from "../utils";

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
  greetList = new SetStorage<Target>("greetList");

  @UseCommand
  greet = new SwitchCommand(
    "greet",
    this.greetList,
    false,
    (target, status) => {
      if (status) {
        getSendMsgQueue().add(
          { target: target, msg: "早上好" },
          {
            repeat: morningRepeat,
            jobId: `greet:morning:${JSON.stringify(target)}`,
          }
        );
        getSendMsgQueue().add(
          { target: target, msg: "晚上好" },
          {
            repeat: nightRepeat,
            jobId: `greet:night:${JSON.stringify(target)}`,
          }
        );
      } else {
        getSendMsgQueue().removeRepeatable({
          ...morningRepeat,
          jobId: `greet:morning:${JSON.stringify(target)}`,
        });
        getSendMsgQueue().removeRepeatable({
          ...nightRepeat,
          jobId: `greet:night:${JSON.stringify(target)}`,
        });
      }
    }
  );
}
