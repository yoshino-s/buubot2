import { MiraiBot } from "../bot/Bot";
import { scheduleJob } from "node-schedule";
import { ContactSet } from "../bot/utils";
import { SwitchCommand } from "../bot/Command";

export default function GreetPlugin(bot: MiraiBot) {
  const greetList = new ContactSet("greetList");
  let nextGreet = "";
  scheduleJob("greetMorning", "0 7 * * *", async () => {
    await greetList.sendAll(bot, nextGreet || "早上好");
    nextGreet = "";
  });
  const job = scheduleJob("greetNight", "0 22 * * *", async () => {
    await greetList.sendAll(bot, nextGreet || "晚上好");
    nextGreet = "";
  });
  console.log(`${job.name} will run at ${job.nextInvocation()}`);
  bot.cmdHooks.add(new SwitchCommand(bot, "greet", greetList));
  bot.registerCommand(
    {
      cmd: "nextGreet",
      help: "nextGreet msg",
      rule: 0,
    },
    (msg, cmd, args) => {
      return `Set to ${(nextGreet = args)}`;
    }
  );
  bot.registerCommand(
    {
      cmd: "greetMsg",
      help: "greetMsg msg",
      rule: 0,
    },
    async (msg, cmd, args) => {
      await greetList.sendAll(bot, args);
      return `Send ${(nextGreet = args)}`;
    }
  );
}
