import { MiraiBot } from "./bot/Bot";
import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import GreetPlugin from "./plugins/greet";
import RepeaterPlugin from "./plugins/repeater";
import RecallMonitorPlugin from "./plugins/recallMonitor";
import BannerPlugin from "./plugins/banner";
import CalendarPlugin from "./plugins/calendar";
import RankPlugin from "./plugins/rank";
import SearchPlugin from "./plugins/search";
import config from "./config";

const bot = new MiraiBot(
  {
    ...config.api,
    enableWebsocket: true,
  },
  {
    account: config.qq.account,
    commandPrefix: config.bot.commandPrefix,
    privilege: config.bot.privilege,
  }
);
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

process.on("unhandledRejection", (err) => {
  console.log(err);
});

bootstrap();
