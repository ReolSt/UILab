import * as THREE from "../three/build/three.module.js";

'use strict';

document.oncontextmenu = () => { return false; }

let mainCanvas = document.getElementById("canvas-main");

mainCanvas.width = mainCanvas.clientWidth;
mainCanvas.height = mainCanvas.clientHeight;

export let renderer = new THREE.WebGLRenderer({
  canvas: mainCanvas,
  antialias: true
});

renderer.setSize(mainCanvas.width, mainCanvas.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;