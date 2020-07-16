import { MiraiBot } from "../bot/Bot";
import Axios from "axios";
import schedule from "node-schedule";
import { Storage } from "../bot/utils";

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
  const npmMonitorStorage = new Storage<string[]>("npmMonitor", []);

  const npmMonitorNewest = new Storage<number>("npmMonitorNewest", 0);

  const sendNPMInfo = async () => {
    let d = (
      await Axios.get("https://www.npmjs.com/advisories?page=0&perPage=20", {
        headers: {
          "x-spiferack": "1",
        },
      })
    ).data.advisoriesData.objects as NPMAdvisoriesObject[];
    console.log(d);
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
    console.log(msg);
    npmMonitorStorage.get().forEach((v) => {
      if (v.startsWith("friend_")) {
        const id = Number(v.slice(7));
        bot.mirai.api.sendFriendMessage(msg, id);
      } else if (v.startsWith("group_")) {
        const id = Number(v.slice(6));
        bot.mirai.api.sendGroupMessage(msg, id);
      } else if (v.startsWith("temp_")) {
        const [id, group] = v.slice(5).split("_").map(Number);
        bot.mirai.api.sendTempMessage(msg, id, group);
      }
    });
  };

  schedule.scheduleJob("npm_monitor", "*/10 * * * *", sendNPMInfo);

  sendNPMInfo();

  bot.registerCommand(
    {
      cmd: "npm_monitor",
      help: "npm_monitor on|off",
      verify: (msg, cmd, args) => ["on", "off"].includes(args),
    },
    async (msg, cmd, args) => {
      let id = "";
      switch (msg.type) {
        case "FriendMessage":
          id = `friend_${msg.sender.id}`;
          break;
        case "GroupMessage":
          id = `group_${msg.sender.group.id}`;
          break;
        case "TempMessage":
          id = `temp_${msg.sender.group.id}_${msg.sender.id}`;
      }
      const r = new Set(npmMonitorStorage.get());
      if (args === "on") {
        r.add(id);
      } else {
        r.delete(id);
      }
      npmMonitorStorage.set(Array.from(r));
      return "OK";
    }
  );
}
