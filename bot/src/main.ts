import { MiraiBot } from "./bot/Bot";
import Config from "./config.json";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import RankPlugin from "./plugins/rank";
import GroupCmdManagePlugin from "./plugins/groupCmdManage";
import CalendarPlugin from "./plugins/calendar";
import RepeaterPlugin from "./plugins/repeater";
import RecallMonitorPlugin from "./plugins/recallMonitor";

const bot = new MiraiBot(Config.API, Config.Bot);

bot.registerPlugins(
  CmdPlugin,
  EggPlugin,
  RankPlugin,
  GroupCmdManagePlugin,
  CalendarPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin
);

async function bootstrap() {
  await bot.boot();
}

bootstrap();
