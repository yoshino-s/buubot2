import { MiraiBot } from "../bot/Bot";
import Axios from "axios";
import schedule from "node-schedule";
import { Storage, ContactSet } from "../bot/utils";
import { SwitchCommand } from "../bot/Command";

type NPMAdvisoriesObject = {
  id: number;
  created: string;
  updated: string;
  deleted: null;
  title: string;
  found_by: { link: string; name: string; email: string };
  reported_by: { link: string; name: string; email: string };
  module_name: string;
  cves: string[];
  vulnerable_versions: string;
  patched_versions: string;
  overview: string;
  recommendation: string;
  references: string;
  access: string;
  severity: string;
  cwe: string;
};
export default function MonitorPlugin(bot: MiraiBot) {
  const npmMonitorStorage = new ContactSet("npmMonitor");

  const npmMonitorNewest = new Storage<number>("npmMonitorNewest", 0);

  const sendNPMInfo = async () => {
    let d = (
      await Axios.get("https://www.npmjs.com/advisories?page=0&perPage=20", {
        headers: {
          "x-spiferack": "1",
        },
      })
    ).data.advisoriesData.objects as NPMAdvisoriesObject[];
    d = d.filter((v) => v.id > npmMonitorNewest.get());
    if (!d.length) return;
    npmMonitorNewest.set(d[0].id);
    const msg =
      "Newest npm advisories:\n" +
      d
        .map(
          (v) =>
            `${v.title} on ${v.module_name}\nseverity: ${v.severity}\n${
              v.cves.length ? "CVE:" + v.cves.join(",") + "\n" : ""
            }URL: https://www.npmjs.com/advisories/${v.id}`
        )
        .join("\n\n");
    npmMonitorStorage.list().forEach((v) => {
      if (v.group) {
        bot.mirai.api.sendGroupMessage(msg, v.group);
      } else if (v.temp) {
        bot.mirai.api.sendTempMessage(msg, v.id, v.temp);
      }
      bot.mirai.api.sendFriendMessage(msg, v.id);
    });
  };

  schedule.scheduleJob("npm_monitor", "*/10 * * * *", sendNPMInfo);

  sendNPMInfo();

  bot.cmdHooks.add(new SwitchCommand(bot, "npm_monitor", npmMonitorStorage));
}
