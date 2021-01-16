import * as THREE from "../three/build/three.module.js";
import "../cannon/cannon.min.js";
import { renderer } from "./renderer.js";
import { playerCamera } from "./camera.js";
import { FPSController } from "./fpsController.js";
import { IsometricController } from "./isometricController.js";
import { Sky } from "./sky.js";
import { debugStats, debugPanel } from "./debugGUI.js";

import { OBJLoader } from "../three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../three/examples/jsm/loaders/MTLLoader.js";

'use strict';

let objLoader = new OBJLoader();
let mtlLoader = new MTLLoader();

let mainScene = new THREE.Scene();

let controller = new FPSController(playerCamera);

playerCamera.position.set(0, 0, 10);

let sun = new THREE.DirectionalLight("#FFFFFF", 1);
sun.position.set(0.5, 0.2, 0.5);
mainScene.add(sun);

let sky = new Sky();
sky.material.uniforms['turbidity'].value=10;
sky.material.uniforms['rayleigh'].value=2;
sky.material.uniforms['mieCoefficient'].value=0.005;
sky.material.uniforms['mieDirectionalG'].value=0.8;
sky.material.uniforms['sunPosition'].value.copy(sun.position);

sky.scale.setScalar(450000);
mainScene.add(sky);

let ground = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 0.1),
  new THREE.MeshLambertMaterial({ color: "#26c728" })
);
ground.rotation.x = THREE.MathUtils.degToRad(90);
ground.position.set(0, -2, 0);
mainScene.add(ground);

let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshLambertMaterial({ color: "#2e97f2" })
);
sphere.position.set(0, 2, -2);
mainScene.add(sphere);

let box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: "#2e97f2" })
);
box.position.set(1, 1, 3);
mainScene.add(box);


let world = new CANNON.World();
world.gravity.set(0, -9.8, 0);

let groundBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, -2, 0),
  shape: new CANNON.Box(new CANNON.Vec3(20, 20, 0.1))
});
groundBody.position.copy(ground.position);
groundBody.quaternion.copy(ground.quaternion);
world.addBody(groundBody);

let sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 2, -2),
  shape: new CANNON.Sphere(1)
});
sphereBody.position.copy(sphere.position);
sphereBody.quaternion.copy(sphere.quaternion);
sphereBody.linearDamping = -10;
sphereBody.angularDamping = -10;
world.addBody(sphereBody);

let boxBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(1, 1, 3),
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
});
boxBody.position.copy(box.position);
boxBody.quaternion.copy(box.quaternion);
boxBody.linearDamping = -30;
boxBody.angularDamping = -30;
world.addBody(boxBody);

mtlLoader.load("resources/models/stone/stone.mtl", mtl => {
  objLoader.setMaterials(mtl);
  objLoader.load("resources/models/stone/stone.obj", root => {
    mainScene.add(root);
  })
});

let skyController = new function() {
  this.turbidity = sky.material.uniforms['turbidity'].value;
  this.rayleigh = sky.material.uniforms['rayleigh'].value;
  this.mieCoefficient = sky.material.uniforms['mieCoefficient'].value;
  this.mieDirectionalG = sky.material.uniforms['mieDirectionalG'].value;
  this.sunPositionX = sky.material.uniforms['sunPosition'].value.x;
  this.sunPositionY = sky.material.uniforms['sunPosition'].value.y;
  this.sunPositionZ = sky.material.uniforms['sunPosition'].value.z;
};

let folderSky = debugPanel.addFolder("sky");
folderSky.add(skyController, "turbidity");
folderSky.add(skyController, "rayleigh");
folderSky.add(skyController, "mieCoefficient");
folderSky.add(skyController, "mieDirectionalG");
folderSky.add(skyController, "sunPositionX");
folderSky.add(skyController, "sunPositionY");
folderSky.add(skyController, "sunPositionZ");
folderSky.open();

function updateSkyValues() {
  sky.material.uniforms['turbidity'].value = skyController.turbidity;
  sky.material.uniforms['rayleigh'].value = skyController.rayleigh;
  sky.material.uniforms['mieCoefficient'].value = skyController.mieCoeffiecient;
  sky.material.uniforms['mieDirectionalG'].value = skyController.mieDirectionalG;
  sun.position.set(skyController.sunPositionX, skyController.sunPositionY, skyController.sunPositionZ);
  sky.material.uniforms['sunPosition'].value.copy(sun.position);
}

let cameraController = new function() {
  this.fov = playerCamera.fov;
  this.near = playerCamera.near;
  this.far = playerCamera.far;
  this.view = "FPS";
};

let folderCamera = debugPanel.addFolder("camera");
folderCamera.add(cameraController, "fov", 60, 120);
folderCamera.add(cameraController, "near", 0.01, 1);
folderCamera.add(cameraController, "far", 10, 10000);
folderCamera.add(cameraController, "view", ["FPS", "Isometric"]);
folderCamera.open();

function updateCameraValues() {
  playerCamera.fov = cameraController.fov;
  playerCamera.near = cameraController.near;
  playerCamera.far = cameraController.far;
  switch(cameraController.view) {
    case "FPS":
      // useController(fpsController);
      break;
    case "Isometric":
      // useController(isometricController);
      break;
  }
  playerCamera.updateProjectionMatrix();
}

let sphereController = new function() {
  this.material = "Lambert";
};

let folderSphere = debugPanel.addFolder("sphere");
folderSphere.add(sphereController, "material", ["Basic", "Depth", "Distance", "Lambert", "Matcap", "Normal", "Phong", "Physical", "Standard", "Toon"]);
folderSphere.open();

function updateSphereValues() {
  switch(sphereController.material) {
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

function render() {
  updateSkyValues();
  updateCameraValues();
  updateSphereValues();
  
  controller.dispatchEvent("keypressframe");

  renderer.render(mainScene, playerCamera);
  debugStats.update();

  world.step(1 / 60);
  
  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);

  box.position.copy(boxBody.position);
  box.quaternion.copy(boxBody.quaternion);
  
  ground.position.copy(groundBody.position);
  ground.quaternion.copy(groundBody.quaternion);
  
  requestAnimationFrame(render);
}

render();

export { world };