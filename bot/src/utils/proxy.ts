import Axios, { AxiosInstance } from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

import Config from "../config.json";

export let agent: AxiosInstance;

switch (Config.Proxy.protocol) {
  case "socks":
  case "socks4":
  case "socks5":
    agent = Axios.create({
      httpAgent: new SocksProxyAgent(
        `${Config.Proxy.protocol}://${Config.Proxy.host}:${Config.Proxy.port}`
      ),
      httpsAgent: new SocksProxyAgent(
        `${Config.Proxy.protocol}://${Config.Proxy.host}:${Config.Proxy.port}`
      ),
    });
    break;
  case "http":
  case "https":
    agent = Axios.create({
      proxy: Config.Proxy,
    });
    break;
  default:
    agent = Axios.create();
}
