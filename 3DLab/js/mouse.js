'use strict';

document.body.requestPointerLock = document.body.requestPointerLock ||
                                   document.body.element.mozRequestPointerLock ||
                                   document.body.webkitRequestPointerLock;

export let isPointerLocked = false;

document.addEventListener("pointerlockchange", event => {
  isPointerLocked = !isPointerLocked;
});