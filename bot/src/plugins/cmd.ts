import { MiraiBot } from "../bot/Bot";
import { VM } from "vm2";
export default function CmdPlugin(bot: MiraiBot) {
  bot.registerCommand(
    {
      cmd: "exec",
      help: "Usage: exec cmd",
      verify: (msg, cmd, args) => !!args,
    },
    async (msg, cmd, args) => {
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
