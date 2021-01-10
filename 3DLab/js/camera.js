import * as THREE from "../three/build/three.module.js";
import { pressedKeys } from "./keyboard.js";
import { renderer } from "./renderer.js";

'use strict';

let width = renderer.domElement.width;
let height = renderer.domElement.height;
let aspect = width / height;

let perspectiveCamera = new THREE.PerspectiveCamera(...Object.values({
  fov: 90,
  aspect: renderer.domElement.width / renderer.domElement.height,
  near: 0.1,
  far: 10000
}));

let playerCamera = perspectiveCamera;

window.addEventListener("resize", event => {
  width = renderer.domElement.width;
  height = renderer.domElmenet.height;
  aspect = width / height;

  perspectiveCamera.aspect = aspect;
});

export { playerCamera };