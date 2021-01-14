import * as THREE from "../three/build/three.module.js";
import { isPointerLocked } from "./mouse.js";
import { pressedKeys } from "./keyboard.js";
import { UserInputEventListener } from "./eventListener.js";

'use strict';

class IsometricController extends UserInputEventListener {
  constructor(camera) {
    super(document.body);

    this.camera = camera;
    this.cameraHeight = 10;
    this.camera.position.y = this.cameraHeight;
    this.camera.rotation.set(-Math.PI / 4, Math.PI / 4, 0);

    this.moveSpeed = 0.05;

    this.addEventType("switch");
    this.addEventListener("switch", () => {
      this.camera.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
      this.camera.position.y = this.cameraHeight;
    });

    this.addEventType("keypressframe");
    this.addEventListener("keypressframe", () => {
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
    });
  }
}

export { IsometricController };