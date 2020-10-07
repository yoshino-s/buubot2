import { ChatMessage } from "mirai-ts/dist/types/message-type";
import { VM } from "vm2";
import { BotPlugin, Args, Cmd, Msg, Tag } from "@mirai-bot/core";

import { preventGroupMessageRecall } from "./recallMonitor";

@Tag("util")
export default class CmdPlugin extends BotPlugin {
  @Cmd("exec")
  async exec(@Msg msg: ChatMessage, @Args args: string) {
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
}
