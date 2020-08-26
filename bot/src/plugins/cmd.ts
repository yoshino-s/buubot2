import { VM } from "vm2";

import { Bot } from "../bot/Bot";

import { preventGroupMessageRecall } from "./recallMonitor";
export default function CmdPlugin(bot: Bot) {
  bot.register(
    {
      cmd: "exec",
      help: "exec cmd",
      verify: (msg, cmd, args) => !!args,
    },
    async (msg, cmd, args) => {
      if (msg.type === "GroupMessage") preventGroupMessageRecall(msg);
      try {
        const vm = new VM({
          timeout: 2000,
          sandbox: {},
        });
        let res = String(await vm.run(args));
        if (res.length >= 256) res = res.slice(0, 256) + "...";
        res = res.split("\n").slice(0, 10).join("\n");
        return res;
      } catch (e) {
        return e;
      }
    }
  );
}
