'use strict';

document.body.requestPointerLock = document.body.requestPointerLock ||
                                   document.body.mozRequestPointerLock ||
                                   document.body.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                          document.mozExitPointerLock ||
                          document.webkitRequestPointerLock;

let isPointerLocked = false;

document.addEventListener("pointerlockchange", event => {
  isPointerLocked = !isPointerLocked;
});

function lockPointer() {
  document.body.requestPointerLock();
}

function unlockPointer() {
  document.exitPointerLock();
}

export { isPointerLocked };