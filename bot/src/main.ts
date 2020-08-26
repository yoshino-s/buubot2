import { MiraiBot, BotNamespace } from "./bot/Bot";
import Config from "./config.json";
import BannerPlugin from "./plugins/banner";
import CalendarPlugin from "./plugins/calendar";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import GreetPlugin from "./plugins/greet";
import GroupCmdManagePlugin from "./plugins/groupCmdManage";
import RankPlugin from "./plugins/rank";
import RecallMonitorPlugin from "./plugins/recallMonitor";
import RepeaterPlugin from "./plugins/repeater";
import SearchPlugin from "./plugins/search";

const bot = new MiraiBot(Config.API, Config.Bot);

const entertainment = new BotNamespace(bot);
const ctf = new BotNamespace(bot);
const utils = new BotNamespace(bot);

entertainment.register(
  EggPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin,
  CmdPlugin,
  GreetPlugin
);
ctf.register(RankPlugin, CalendarPlugin);
utils.register(SearchPlugin, BannerPlugin);
bot.register(GroupCmdManagePlugin);

async function bootstrap() {
  await bot.boot();
  await entertainment.boot();
  await ctf.boot();
  await utils.boot();
}

bootstrap();
