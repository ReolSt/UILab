import * as THREE from "../three/build/three.module.js";
import { isPointerLocked } from "./mouse.js";
import { pressedKeys } from "./keyboard.js";
import { Controls } from "./controls.js";

'use strict';

class FPSControls extends Controls {
  constructor(camera) {
    super();

    this.camera = camera
    this.camera.rotation.order = "YXZ";

    this.mouseSensitivity = 0.005;
    this.moveSpeed = 0.05;

    this.jumpAnimation = false;
    this.jumpAnimationKey = 0;
  }

  eventListeners = {
    switch: () => {
      this.camera.rotation.set(0, 0, 0);
      this.camera.position.y = 0;
    },

    mousedown: event => {

    },

    mouseup: event => {

    },

    mousemove: event => {
      if(isPointerLocked) {
        this.camera.rotation.x = THREE.MathUtils.clamp(-Math.PI / 4, this.camera.rotation.x - this.mouseSensitivity * event.movementY, Math.PI / 3);
        this.camera.rotation.y -= this.mouseSensitivity * event.movementX;
      }
    },

    wheel: event => {

    },

    keydown: event => {
      
    },

    keyup: event => {

    },

    keypress: event => {

    },

    keypressframe: event => {
      if (pressedKeys["w"]) {
        this.camera.position.z -= this.moveSpeed * Math.cos(this.camera.rotation.y);
        this.camera.position.x -= this.moveSpeed * Math.sin(this.camera.rotation.y);
      }
      if (pressedKeys["s"]) {
        this.camera.position.z += this.moveSpeed * Math.cos(this.camera.rotation.y);
        this.camera.position.x += this.moveSpeed * Math.sin(this.camera.rotation.y);
      }
      if (pressedKeys["a"]) {
        this.camera.position.x -= this.moveSpeed * Math.cos(this.camera.rotation.y);
        this.camera.position.z += this.moveSpeed * Math.sin(this.camera.rotation.y);
      }
      if (pressedKeys["d"]) {
        this.camera.position.x += this.moveSpeed * Math.cos(this.camera.rotation.y);
        this.camera.position.z -= this.moveSpeed * Math.sin(this.camera.rotation.y);
      }

      if (pressedKeys[" "] && !this.jumpAnimation) {
        this.jumpAnimation = true;
      }

      if (this.jumpAnimation) {
        this.jump();
      }
    }
  }

  jump() {
    this.camera.position.y += (30 - this.jumpAnimationKey * 2) / 350;
    this.jumpAnimationKey += 1;
    if (this.jumpAnimationKey > 30) {
      this.jumpAnimation = false;
      this.jumpAnimationKey = 0;
    }
  }
}

export { FPSControls };