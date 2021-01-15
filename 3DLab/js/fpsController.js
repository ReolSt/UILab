import * as THREE from "../three/build/three.module.js";
import { isPointerLocked } from "./mouse.js";
import { pressedKeys } from "./keyboard.js";
import { UserInputEventListener } from "./eventListener.js";

'use strict';

class FPSController extends UserInputEventListener {
  constructor(camera) {
    super(document.body, ["switch", "keypressframe"]);

    this.camera = camera
    this.camera.rotation.order = "YXZ";

    this.mouseSensitivity = 0.005;
    this.moveSpeed = 0.05;

    this._jumpAnimation = false;
    this._jumpAnimationKey = 0;  
    this.addEventType("switch");
    this.addEventListener("switch", () => {
      this.camera.rotation.set(0, 0, 0);
      this.camera.position.y = 0;
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

      if (pressedKeys[" "] && !this._jumpAnimation) {
        this._jumpAnimation = true;
      }

      if (this._jumpAnimation) {
        this.jump();
      }
    });

    this.addEventListener("mousemove", event => {
      if(isPointerLocked) {
        this.camera.rotation.x = THREE.MathUtils.clamp(-Math.PI / 4, this.camera.rotation.x - this.mouseSensitivity * event.movementY, Math.PI / 3);
        this.camera.rotation.y -= this.mouseSensitivity * event.movementX;
      }
    });
  }

  jump() {
    this.camera.position.y += (30 - this._jumpAnimationKey * 2) / 350;
    this._jumpAnimationKey += 1;
    if (this._jumpAnimationKey > 30) {
      this._jumpAnimation = false;
      this._jumpAnimationKey = 0;
    }
  }
}

export { FPSController };