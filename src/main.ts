import Bot from "@mirai-bot/core";
import { setConfig } from "@mirai-bot/config";

import CmdPlugin from "./plugins/cmd";
import EggPlugin from "./plugins/egg";
import GreetPlugin from "./plugins/greet";
import RepeaterPlugin from "./plugins/repeater";
import RecallMonitorPlugin from "./plugins/recallMonitor";
import BannerPlugin from "./plugins/banner";
import CalendarPlugin from "./plugins/calendar";
import RankPlugin from "./plugins/rank";
import SearchPlugin from "./plugins/search";
import { bootstrap } from "./bot.bootstrap";

setConfig("config.yml");
const bot = new Bot();
bot.register(
  CmdPlugin,
  EggPlugin,
  GreetPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin
);
bot.register(BannerPlugin, CalendarPlugin, RankPlugin, SearchPlugin);
bootstrap(bot);
