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
import { preventGroupMessageRecall } from "./plugins/recallMonitor";

const bot = new MiraiBot(Config.API, Config.Bot);

bot.registerPlugins(
  CmdPlugin,
  EggPlugin,
  RankPlugin,
  GroupCmdManagePlugin,
  CalendarPlugin,
  RepeaterPlugin,
  MonitorPlugin,
  RecallMonitorPlugin
);

bot.registerCommand({ cmd: "不色的图" }, (msg) => {
  if (msg.type === "GroupMessage") preventGroupMessageRecall(msg);
  return "不色的图来啦\n[[Image:url=https://pixiv.yoshino-s.workers.dev/random]]";
});

async function bootstrap() {
  await bot.boot();
}

bootstrap();
