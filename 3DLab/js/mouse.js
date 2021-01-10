'use strict';

document.body.requestPointerLock = document.body.requestPointerLock ||
                                   document.body.element.mozRequestPointerLock ||
                                   document.body.webkitRequestPointerLock;

let isPointerLocked = false;

document.addEventListener("pointerlockchange", event => {
  isPointerLocked = !isPointerLocked;
});

export { isPointerLocked };