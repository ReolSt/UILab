import * as THREE from "../three/three.module.js"
import { FirstPersonControls } from "../three/jsm/controls/FirstPersonControls.js"

document.oncontextmenu = () => { return false; }

let visualizerCanvas = document.getElementById("canvas-visualizer");

let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

let renderer = new THREE.WebGLRenderer({
  canvas: visualizerCanvas,
  antialias: true
});
renderer.setSize(visualizer.canvas.width, visualizer.canvas.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let playerCamera = new THREE.PerspectiveCamera(...Object.values({
  fov: 90,
  aspect: renderer.domElement.width / renderer.domElement.height,
  near: 0.1,
  far: 10000
}));
playerCamera.position.set(0, 0, 1);

window.addEventListener("resize", event => {
  playerCamera.aspect = renderer.domElement.width / renderer.domElement.height;
});

var camControls = new FirstPersonControls(playerCamera);
camControls.lookSpeed = 0.4;
camControls.movementSpeed = 20;
camControls.noFly = true;
camControls.lookVertical = true;
camControls.constrainVertical = true;
camControls.verticalMin = 1.0;
camControls.verticalMax = 2.0;
camControls.lon = -150;
camControls.lat = 120;

let mainScene = new THREE.Scene();

let plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 2),
  new THREE.MeshLambertMaterial({ color: "#26c728" })
);
plane.position.set(0, 0, -3);
mainScene.add(plane);

let cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshLambertMaterial({ color: "#2e97f2" })
);
cube.position.set(0, 0, -2);
mainScene.add(cube);

let light = new THREE.DirectionalLight("#FFFFFF", 2);
light.castShadow = true;
light.position.set(1, 4, 2);
mainScene.add(light);



let keys = {};

document.body.addEventListener("keydown", event => {
  keys[event.key] = true;
});

document.body.addEventListener("keyup", event => {
  keys[event.key] = false;
});

let mouseSensitivity = 0.005;


document.body.addEventListener("mousemove", event => {});

let moveSpeed = 0.01;

let jumpAnimation = false;
let jumpAnimationKey = 0;

function jump() {
  playerCamera.position.y += (20 - jumpAnimationKey * 2) / 500;
  jumpAnimationKey += 1;
  if (jumpAnimationKey > 20) {
    jumpAnimation = false;
    jumpAnimationKey = 0;
  }
}

function render() {
  if (keys["w"]) {
    playerCamera.position.z -= moveSpeed;
  }
  if (keys["s"]) {
    playerCamera.position.z += moveSpeed;
  }
  if (keys["a"]) {
    playerCamera.position.x -= moveSpeed;
  }
  if (keys["d"]) {
    playerCamera.position.x += moveSpeed;
  }

  if (keys[" "] && !jumpAnimation) {
    jumpAnimation = true;
  }

  if (jumpAnimation) {
    jump();
  }

  renderer.render(mainScene, playerCamera);
  requestAnimationFrame(render);
}

render();