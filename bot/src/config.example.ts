import { join } from "path";

const Config = {
  APIConfig: {
    host: process.env.API_HOST || "127.0.0.1",
    port: Number(process.env.API_PORT) || 8081,
    authKey: process.env.API_AUTH_KEY || "1234567890",
    enableWebsocket: true,
  },
  BotConfig: {
    account: 9999999999,
    commandPrefix: "/",
  },
  Utils: {
    dataStorage: process.env.DATA_STORAGE_PATH || join(__dirname, "../data"),
    imageStorage:
      process.env.IMAGE_PATH || join(__dirname, "../../mirai/image"),
  },
};
export default Config;
