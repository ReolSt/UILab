import * as THREE from "../three/build/three.module.js";
import Stats from '../three/examples/jsm/libs/stats.module.js';
import GUI from '../three/examples/jsm/libs/dat.gui.module.js';

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
playerCamera.rotation.order = "YXZ";
playerCamera.position.set(0, 0, 1);

window.addEventListener("resize", event => {
  playerCamera.aspect = renderer.domElement.width / renderer.domElement.height;
});

let mainScene = new THREE.Scene();

let backgroundTextureLoader = new THREE.TextureLoader();
let backgroundTexture = new THREE.TextureLoader().load(
  "resources/images/background-equirectangular.png",
  () => {
    let renderTarget = new THREE.WebGLCubeRenderTarget(backgroundTexture.image.height);
    renderTarget.fromEquirectangularTexture(renderer, backgroundTexture);
    mainScene.background = renderTarget;
  }
);

{
  let light = new THREE.DirectionalLight("#ffffbb", 1);
  light.castShadow = true;
  light.position.set(1, 4, 2);
  mainScene.add(light);
}

{
  let plane = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 2),
    new THREE.MeshToonMaterial({ color: "#26c728" })
  );
  plane.position.set(0, -2, 0);
  plane.rotateX(THREE.MathUtils.degToRad(90));

  mainScene.add(plane);
}

{
  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshToonMaterial({ color: "#2e97f2" })
  );
  cube.frustrumCulled = false;
  cube.renderOrder = 1;
  cube.position.set(0, 0, -2);
  mainScene.add(cube);
}

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
  playerCamera.rotation.x = THREE.MathUtils.clamp(-Math.PI / 4, playerCamera.rotation.x - mouseSensitivity * event.movementY, Math.PI / 3);
  playerCamera.rotation.y -= mouseSensitivity * event.movementX;
});

let moveSpeed = 0.05;

let jumpAnimation = false;
let jumpAnimationKey = 0;

function jump() {
  playerCamera.position.y += (30 - jumpAnimationKey * 2) / 350;
  jumpAnimationKey += 1;
  if (jumpAnimationKey > 30) {
    jumpAnimation = false;
    jumpAnimationKey = 0;
  }
}


let stats = new Stats();
document.body.appendChild(stats.dom);

/*

let panel = new GUI({width: 310});

let folderCamera = panel.addFolder("camera");

*/

function render() {
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

  stats.update();
  requestAnimationFrame(render);
}

render();