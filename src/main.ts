import Bot from "@mirai-bot/core";
import express from "express";
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
import { NotifyPlugin } from "./plugins/notify.plugin";
setConfig("config.yml");
const bot = new Bot();
bot.express.use(express.json());
bot.register(
  CmdPlugin,
  EggPlugin,
  GreetPlugin,
  RepeaterPlugin,
  RecallMonitorPlugin,
  BannerPlugin,
  CalendarPlugin,
  RankPlugin,
  SearchPlugin,
  NotifyPlugin
);
bootstrap(bot);
