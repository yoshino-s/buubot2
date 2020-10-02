export { MiraiBot, BotPlugin } from "./bot/Bot";
export type { BotConfig } from "./bot/Bot";

export * as Command from "./command/Command";
export * as Permission from "./command/Permission";

export * from "./utils/decorator";
export { Decorator } from "./utils";
export * as Utils from "./utils";

export * from "./config";

import { MiraiBot } from "./bot/Bot";
export default MiraiBot;
