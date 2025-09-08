import EventEmitter  from "eventemitter3";

export const tokenEventEmitter = new EventEmitter();

export const triggerTokenExpire = () => {
  tokenEventEmitter.emit("token-expired");
};
