import { MiraiBot, BotNamespace } from "./bot/Bot";
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
import FaqPlugin from "./plugins/faq";

const bot = new MiraiBot(Config.API, Config.Bot);
const entertainment = new BotNamespace(bot, "entertainment");
const utils = new BotNamespace(bot, "utils");
entertainment.register(
  CmdPlugin,
  EggPlugin,
  GreetPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin
);
utils.register(
  BannerPlugin,
  CalendarPlugin,
  RankPlugin,
  SearchPlugin,
  FaqPlugin
);

async function bootstrap() {
  await bot.boot();
}

bootstrap();
