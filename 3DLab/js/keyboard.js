import { isPointerLocked } from "./mouse.js";

'use strict';

let pressedKeys = {};

document.body.addEventListener("keydown", event => {
  pressedKeys[event.key] = true;
  
  if(event.key === "Control" && !isPointerLocked) {
    document.body.requestPointerLock();
  }
});

document.body.addEventListener("keyup", event => {
  pressedKeys[event.key] = false;
});

export { pressedKeys };