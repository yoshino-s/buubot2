import { MiraiBot } from "./bot/Bot";
import Config from "./config.json";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import GreetPlugin from "./plugins/greet";
import RepeaterPlugin from "./plugins/repeater";
import RecallMonitorPlugin from "./plugins/recallMonitor";
import BannerPlugin from "./plugins/banner";
import CalendarPlugin from "./plugins/calendar";
import RankPlugin from "./plugins/rank";
import SearchPlugin from "./plugins/search";

const bot = new MiraiBot(Config.API, Config.Bot);
bot.register(
  CmdPlugin,
  EggPlugin,
  GreetPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin
);
bot.register(BannerPlugin, CalendarPlugin, RankPlugin, SearchPlugin);

async function bootstrap() {
  await bot.boot();
}

bootstrap();
