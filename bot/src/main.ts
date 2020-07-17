import { MiraiBot } from "./bot/Bot";
import Config from "./config.json";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import RankPlugin from "./plugins/rank";
import GroupCmdManagePlugin from "./plugins/groupCmdManage";
import CalendarPlugin from "./plugins/calendar";
import RepeaterPlugin from "./plugins/repeater";
import MonitorPlugin from "./plugins/monitor";

const bot = new MiraiBot(Config.API, Config.Bot);

bot.registerPlugins(
  CmdPlugin,
  EggPlugin,
  RankPlugin,
  GroupCmdManagePlugin,
  CalendarPlugin,
  RepeaterPlugin,
  MonitorPlugin
);

bot.registerCommand({ cmd: "不色的图" }, () => {
  return "不色的图来啦\n[[Image:url=https://api.yoshino-s.online/random]]";
});

async function bootstrap() {
  await bot.boot();
}

bootstrap();
