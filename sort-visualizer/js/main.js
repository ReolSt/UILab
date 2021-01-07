import * as THREE from "../three/build/three.module.js";
import Stats from '../three/examples/jsm/libs/stats.module.js';
import { GUI } from '../three/examples/jsm/libs/dat.gui.module.js';

function createEquirectangularTexture(imgSrc, callback) {
  let texture = new THREE.TextureLoader().load(
    "resources/images/background-equirectangular.png",
    () => {
      let renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
      renderTarget.fromEquirectangularTexture(renderer, texture);
      callback(renderTarget);
    }
  );
}

document.oncontextmenu = () => { return false; }

let visualizerCanvas = document.getElementById("canvas-visualizer");
let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

document.body.requestPointerLock = document.body.requestPointerLock ||
                                   document.body.element.mozRequestPointerLock ||
                                   document.body.webkitRequestPointerLock;

let isPointerLocked = false;

document.addEventListener("pointerlockchange", event => {
  isPointerLocked = !isPointerLocked;
});

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

createEquirectangularTexture("resources/images/background-equirectangular.png", renderTarget => {
  mainScene.background = renderTarget;
})

let light = new THREE.DirectionalLight("#ffffbb", 1);
light.castShadow = true;
light.position.set(1, 4, 2);
mainScene.add(light);

let plane = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 2),
  new THREE.MeshBasicMaterial({ color: "#26c728" })
);
plane.position.set(0, -2, 0);
plane.rotateX(THREE.MathUtils.degToRad(90));

mainScene.add(plane);

let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "#2e97f2" })
);
sphere.frustrumCulled = false;
sphere.position.set(0, 0, -2);
mainScene.add(sphere);

let keys = {};

document.body.addEventListener("keydown", event => {
  keys[event.key] = true;
  
  if(event.key === "Control" && !isPointerLocked) {
    document.body.requestPointerLock();
  }
});

document.body.addEventListener("keyup", event => {
  keys[event.key] = false;
});

let mouseSensitivity = 0.005;

document.body.addEventListener("mousemove", event => {
  if(isPointerLocked) {
    playerCamera.rotation.x = THREE.MathUtils.clamp(-Math.PI / 4, playerCamera.rotation.x - mouseSensitivity * event.movementY, Math.PI / 3);
    playerCamera.rotation.y -= mouseSensitivity * event.movementX;
  }
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

let panel = new GUI({width: 310});

let cameraControls = new function() {
  this.fov = playerCamera.fov;
  this.near = playerCamera.near;
  this.far = playerCamera.far;
};

let folderCamera = panel.addFolder("camera");
folderCamera.add(cameraControls, "fov", 60, 120);
folderCamera.add(cameraControls, "near", 0.01, 1);
folderCamera.add(cameraControls, "far", 10, 10000);
folderCamera.open();

function updateCameraValues() {
  playerCamera.fov = cameraControls.fov;
  playerCamera.near = cameraControls.near;
  playerCamera.far = cameraControls.far;
  playerCamera.updateProjectionMatrix();
}

let lightControls = new function() {
  this.x = light.position.x;
  this.y = light.position.y;
  this.z = light.position.z;
};

let folderLight = panel.addFolder("light");
folderLight.add(lightControls, "x", -100, 100);
folderLight.add(lightControls, "y", -100, 100);
folderLight.add(lightControls, "z", -100, 100);
folderLight.open();

function updateLightValues() {
  light.position.set(lightControls.x, lightControls.y, lightControls.z);
}

let sphereControls = new function() {
  this.material = "Basic";
};

let folderSphere = panel.addFolder("sphere");
folderSphere.add(sphereControls, "material", ["Basic", "Depth", "Distance", "Lambert", "Matcap", "Normal", "Phong", "Physical", "Standard", "Toon"]);
folderSphere.open();

sphere.frustrumCulled = false;
sphere.frustumCulled = false;

function updateSphereValues() {
  switch(sphereControls.material) {
    case "Basic":
      sphere.material = new THREE.MeshBasicMaterial({ color: "#2e97f2" });
      break;
    case "Depth":
      sphere.material = new THREE.MeshDepthMaterial();
      break;
    case "Distance":
      sphere.material = new THREE.MeshDistanceMaterial();
      break;
    case "Lambert":
      sphere.material = new THREE.MeshLambertMaterial({ color: "#2e97f2" });
      break;
    case "Matcap":
      sphere.material = new THREE.MeshMatcapMaterial({ color: "#2e97f2" });
      break;
    case "Normal":
      sphere.material = new THREE.MeshNormalMaterial();
      break;
    case "Phong":
      sphere.material = new THREE.MeshPhongMaterial({ color: "#2e97f2" });
      break;
    case "Physical":
      sphere.material = new THREE.MeshPhysicalMaterial({ color: "#2e97f2" });
      break;
    case "Standard":
      sphere.material = new THREE.MeshStandardMaterial({ color: "#2e97f2" });
      break;
    case "Toon":
      sphere.material = new THREE.MeshToonMaterial({ color: "#2e97f2" });
      break;
  }
}

mainScene.frustumCulled = false;

function render() {
  updateCameraValues();
  updateLightValues();
  updateSphereValues();
  
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