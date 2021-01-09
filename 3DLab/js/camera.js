import * as THREE from "../three/build/three.module.js";
import { pressedKeys } from "./keyboard.js";
import { renderer } from "./renderer.js";

'use strict';

let width = renderer.domElement.width;
let height = renderer.domElement.height;
let aspect = width / height;

export let orthographicCamera = new THREE.OrthographicCamera(...Object.values({
  left: width / -50,
  right: width / 50,
  top: height / 50,
  bottom: height / -50,
  near: 0.1,
  far: 10000
}))

export let perspectiveCamera = new THREE.PerspectiveCamera(...Object.values({
  fov: 90,
  aspect: renderer.domElement.width / renderer.domElement.height,
  near: 0.1,
  far: 10000
}));

export let playerCamera = perspectiveCamera;

window.addEventListener("resize", event => {
  width = renderer.domElement.width;
  height = renderer.domElmenet.height;
  aspect = width / height;

  orthogrphicCamera.left = width / -50;
  orthogrphicCamera.right = width / 50;
  orthogrphicCamera.top = height / 50;
  orthogrphicCamera.bottom = height / -50;

  perspectiveCamera.aspect = aspect;
});