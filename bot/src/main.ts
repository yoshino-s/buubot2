import { MiraiBot } from "./bot/Bot";
import Config from "./config.json";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import RankPlugin from "./plugins/rank";
import GroupCmdManagePlugin from "./plugins/groupCmdManage";
import CalendarPlugin from "./plugins/calendar";
import RepeaterPlugin from "./plugins/repeater";
import MonitorPlugin from "./plugins/monitor";
import RecallMonitorPlugin from "./plugins/recallMonitor";
import GreetPlugin from "./plugins/greet";
import RssPlugin from "./plugins/rss";

const bot = new MiraiBot(Config.API, Config.Bot);

bot.registerPlugins(
  CmdPlugin,
  EggPlugin,
  RankPlugin,
  GroupCmdManagePlugin,
  CalendarPlugin,
  RepeaterPlugin,
  MonitorPlugin,
  RecallMonitorPlugin,
  GreetPlugin,
  RssPlugin
);

async function bootstrap() {
  await bot.boot();
}

bootstrap();
