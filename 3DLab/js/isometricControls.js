import * as THREE from "../three/build/three.module.js";
import { isPointerLocked } from "./mouse.js";
import { pressedKeys } from "./keyboard.js";
import { Controls } from "./controls.js";

'use strict';

export class IsometricControls extends Controls {
  constructor(camera) {
    super();

    this.camera = camera;
    this.cameraHeight = 10;
    this.camera.position.y = this.cameraHeight;
    this.camera.rotation.set(-Math.PI / 4, Math.PI / 4, 0);

    this.moveSpeed = 0.05;
  }

  eventListeners = {
    switch: () => {
      this.camera.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
      this.camera.position.y = this.cameraHeight;
    },

    mousedown: event => {

    },

    mouseup: event => {

    },

    mousemove: event => {
      if(isPointerLocked) {

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

    keypressframe: () => {
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
    }
  }
}