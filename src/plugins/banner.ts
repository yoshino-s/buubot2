import { ChatMessage, GroupMessage } from "mirai-ts/dist/types/message-type";

import { CommandPermission } from "../command/Permission";
import { extractTarget, TargetMapStorage } from "../utils";
import { Args, Bot, Cmd, Msg, On, Tag } from "../utils/decorator";
import { MiraiBot, BotPlugin } from "../bot/Bot";

@Tag("util")
export default class BannerPlugin extends BotPlugin {
  banWorkMap = new TargetMapStorage<string[]>("banWord");
  @Cmd({
    cmd: "ban",
    help: "Ban word",
    rule: CommandPermission.admin,
    verify: (msg, cmd, args) => !!args,
  })
  async ban(@Msg msg: ChatMessage, @Args args: string) {
    const target = extractTarget(msg, false);
    const w = (await this.banWorkMap.get(target)) || [];
    w.push(args.toLowerCase());
    await this.banWorkMap.set(target, w);
    return `将对关键词"${args}"封禁。现在的封禁词列表：${w.join(",")}`;
  }
  @Cmd({
    cmd: "unban",
    help: "Unban word",
    rule: CommandPermission.admin,
    verify: (msg, cmd, args) => !!args,
  })
  async unban(@Msg msg: ChatMessage, @Args args: string) {
    const target = extractTarget(msg, false);
    let w = (await this.banWorkMap.get(target)) || [];
    w = w.filter((v) => v !== args.toLowerCase());
    await this.banWorkMap.set(target, w);
    return `将对关键词"${args}"解封。现在的封禁词列表：${w.join(",")}`;
  }
  @On("GroupMessage")
  async onBan(@Msg msg: GroupMessage, @Bot bot: MiraiBot) {
    const target = extractTarget(msg, false);
    const w = (await this.banWorkMap.get(target)) || [];
    const plain = msg.plain.toLowerCase();
    if (w.some((v) => plain.includes(v))) {
      try {
        await bot.mirai.api.recall(msg);
        await bot.mirai.api.mute(msg.sender.group.id, msg.sender.id, 60 * 60);
        await bot.send(
          target,
          `由于${msg.sender.memberName}触发了封禁关键词，已将其封禁，下不为例。`
        );
      } catch (e) {
        bot.logger.error(e.response.data);
      }
    }
  }
}
