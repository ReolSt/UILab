import * as THREE from "../three/build/three.module.js"
import { FirstPersonControls } from "../three/examples/jsm/controls/FirstPersonControls.js"

document.oncontextmenu = () => { return false; }

let visualizerCanvas = document.getElementById("canvas-visualizer");
let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

document.body.requestPointerLock = document.body.requestPointerLock ||
                                   document.body.element.mozRequestPointerLock ||
                                   document.body.webkitRequestPointerLock;

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

let mainScene = new THREE.Scene();

let xLineGeometry = new THREE.Geometry();
xLineGeometry.vertices.push(
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0)
);

let xAxis = new THREE.Mesh(
  xLineGeometry,
  new THREE.LineBasicMaterial({
    color: "#FFFFFF",
    lineWidth: 5
  })
);
mainScene.add(xAxis);

let plane = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 2),
  new THREE.MeshToonMaterial({ color: "#26c728" })
);
plane.position.set(0, -2, 0);
plane.rotateX(THREE.MathUtils.degToRad(90));

mainScene.add(plane);

let cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshToonMaterial({ color: "#2e97f2" })
);
cube.position.set(0, 0, -2);
cube.frustrumCulled = false;
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

document.body.addEventListener("click", event => {
  document.body.requestPointerLock();
});

document.body.addEventListener("mousemove", event => {
  playerCamera.rotation.y -= mouseSensitivity * event.movementX;
  playerCamera.rotation.x = THREE.MathUtils.clamp(-Math.PI / 4, playerCamera.rotation.x - mouseSensitivity * event.movementY, Math.PI / 3);
});

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

let clock = new THREE.Clock();

function render() {
  let delta = clock.getDelta();
  if (keys["w"]) {
    playerCamera.position.z -= moveSpeed * Math.cos(playerCamera.rotation.y);
    playerCamera.position.x -= moveSpeed * Math.sin(playerCamera.rotation.y);
  }
  if (keys["s"]) {
    playerCamera.position.z += moveSpeed * Math.cos(playerCamera.rotation.y);
    playerCamera.position.x += moveSpeed * Math.sin(playerCamera.rotation.y);
  }
  if (keys["a"]) {
    playerCamera.position.x -= moveSpeed * Math.cos(playerCamera.rotation.y);
    playerCamera.position.z += moveSpeed * Math.sin(playerCamera.rotation.y);
  }
  if (keys["d"]) {
    playerCamera.position.x += moveSpeed * Math.cos(playerCamera.rotation.y);
    playerCamera.position.z -= moveSpeed * Math.sin(playerCamera.rotation.y);
  }

  if (keys[" "] && !jumpAnimation) {
    jumpAnimation = true;
  }

  if (keys["Escape"]) {
    document.exitPointerLock();
  }

  if (jumpAnimation) {
    jump();
  }

  renderer.render(mainScene, playerCamera);
  requestAnimationFrame(render);
}

render();