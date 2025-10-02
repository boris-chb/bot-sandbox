import { startHandler } from "./start";
import { subscribeHandler } from "./subscribe";

export const handlers = {
  start: startHandler,
  sub: subscribeHandler,
};
