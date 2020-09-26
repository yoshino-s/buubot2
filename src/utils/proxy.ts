import Axios, { AxiosInstance } from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";

import config from "../config";

export let agent: AxiosInstance;

switch (config.proxy?.protocol) {
  case "socks":
  case "socks4":
  case "socks5":
    agent = Axios.create({
      httpAgent: new SocksProxyAgent(
        `${config.proxy.protocol}://${config.proxy.host}:${config.proxy.port}`
      ),
      httpsAgent: new SocksProxyAgent(
        `${config.proxy.protocol}://${config.proxy.host}:${config.proxy.port}`
      ),
    });
    break;
  case "http":
  case "https":
    agent = Axios.create({
      proxy: {
        host: config.proxy.host,
        port: config.proxy.port,
        protocol: config.proxy.protocol,
      },
    });
    break;
  default:
    agent = Axios.create();
}
