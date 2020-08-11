import Config from "../../config.json";
import { SocksProxyAgent } from "socks-proxy-agent";
import Axios, { AxiosInstance } from "axios";

export let agent: AxiosInstance;

switch (Config.Proxy.protocol) {
  case "socks":
  case "socks4":
  case "socks5":
    console.log(
      `${Config.Proxy.protocol}://${Config.Proxy.host}:${Config.Proxy.port}`
    );
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
