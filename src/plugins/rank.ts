import Axios from "axios";

import { Args, Cmd, Tag } from "../utils/decorator";
import { BotPlugin } from "../bot/Bot";

function cusScore(score: number) {
  if (score <= 1000) {
    return "刷的题太少啦!";
  }
  if (score <= 5000) {
    return "不做题就要爬了!";
  }
  if (score <= 10000) {
    return "继续努力";
  }
  if (score <= 20000) {
    return "你还不是yyds!";
  }
  return "yyds!";
}

@Tag("ctf")
export default class RankPlugin extends BotPlugin {
  @Cmd({
    cmd: "rank",
    help: "rank id",
    verify: (msg, cmd, args) => !!args,
  })
  async rank(@Args args: string) {
    return (
      (
        await Axios.get("https://api.yoshino-s.online/buu/search", {
          params: {
            name: args,
          },
        })
      ).data.message || "Internal Error"
    );
  }
  @Cmd({
    cmd: "list",
    help: "score aff",
    verify: (msg, cmd, args) => !!args,
  })
  async list(@Args args: string) {
    return (
      await Axios.get("https://api.yoshino-s.online/buu/official", {
        params: {
          type: "description",
          aff: args,
        },
      })
    ).data;
  }
  @Cmd({
    cmd: "score",
    help: "score id",
    verify: (msg, cmd, args) => !!args,
  })
  async score(@Args args: string) {
    const res = (
      await Axios.get("https://api.yoshino-s.online/buu/score", {
        params: {
          name: args,
        },
      })
    ).data as Record<
      string,
      { id: number; name: string; affiliation: string; total: number }
    >;
    return Object.values(res)
      .map((i) => `${i.name}获得总分为${i.total}。${cusScore(i.total)}`)
      .join("\n");
  }
}
