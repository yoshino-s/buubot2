import { MiraiBot } from "../bot/Bot";
import { scheduleJob } from "node-schedule";
import { ContactSet } from "../bot/utils";
import { SwitchCommand } from "../bot/Command";
export default function GreetPlugin(bot: MiraiBot) {
  const greetList = new ContactSet("greetList");
  let nextGreet = "";
  scheduleJob("greetMorning", "0 7 * * *", () => {
    greetList.sendAll(bot, nextGreet || "早上好");
    nextGreet = "";
  });
  scheduleJob("greetNight", "0 22 * * *", () => {
    greetList.sendAll(bot, nextGreet || "晚上好");
    nextGreet = "";
  });
  bot.cmdHooks.add(new SwitchCommand(bot, "greet", greetList));
  bot.registerCommand(
    {
      cmd: "setNextGreet",
      help: "setNextGreet msg",
      rule: 0,
    },
    (msg, cmd, args) => {
      return `Set to ${(nextGreet = args)}`;
    }
  );
}
