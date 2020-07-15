import { MiraiBot } from "./bot/Bot";
import Config from "./config.example";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import RankPlugin from "./plugins/rank";
import GroupCmdManagePlugin from "./plugins/groupCmdManage";
import CalendarPlugin from "./plugins/calendar";
import RepeaterPlugin from "./plugins/repeater";

const bot = new MiraiBot(Config.APIConfig, Config.BotConfig);

bot.registerPlugins(
  CmdPlugin,
  EggPlugin,
  RankPlugin,
  GroupCmdManagePlugin,
  CalendarPlugin,
  RepeaterPlugin
);

bot.registerCommand({ cmd: "不色的图", group: true }, () => {
  return "不色的图来啦\n[img:https://api.yoshino-s.online/random]";
});

async function bootstrap() {
  await bot.boot();
}

bootstrap();
