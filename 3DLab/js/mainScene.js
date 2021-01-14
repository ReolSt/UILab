import * as THREE from "../three/build/three.module.js";
import { renderer } from "./renderer.js";
import { playerCamera } from "./camera.js";
import { FPSController } from "./fpsController.js";
import { IsometricController } from "./isometricController.js";
import { Sky } from "./sky.js";
import { debugStats, debugPanel } from "./debugGUI.js";

'use strict';

let mainScene = new THREE.Scene();

let controller = new FPSController(playerCamera);


let sky = new Sky();

sky.material.uniforms['turbidity'].value=10;
sky.material.uniforms['rayleigh'].value=2;
sky.material.uniforms['mieCoefficient'].value=0.005;
sky.material.uniforms['mieDirectionalG'].value=0.8;
sky.material.uniforms['sunPosition'].value.copy(new THREE.Vector3(0.5, 0.2, 0.5));

sky.scale.setScalar(450000);
mainScene.add(sky);

let ground = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 0.1),
  new THREE.MeshBasicMaterial({ color: "#26c728" })
);
ground.rotation.x = THREE.MathUtils.degToRad(90);
ground.position.set(0, -2, 0);
mainScene.add(ground);

let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "#2e97f2" })
);
sphere.frustrumCulled = false;
sphere.position.set(0, 1, -2);
mainScene.add(sphere);


var world = new CANNON.World();
world.gravity.set(0, 0, 1);

var groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane()
});
groundBody.position.copy(ground.position);
groundBody.quaternion.copy(ground.quaternion);
world.addBody(groundBody);

var sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 1, -2),
  shape: new CANNON.Sphere(1)
});
sphereBody.position.copy(sphere.position);
sphereBody.quaternion.copy(sphere.quaternion);
world.addBody(sphereBody);


var fixedTimeStep = 1.0 / 60.0; // seconds
var maxSubSteps = 3;

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
  this.material = "Basic";
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

var lastTime = 0.0;
function render(time = 0.0) {

  updateCameraValues();
  updateSphereValues();
  
  controller.dispatchEvent("keypressframe");

  renderer.render(mainScene, playerCamera);
  debugStats.update();

  var dt = (time - lastTime) / 100000;
  world.step(fixedTimeStep, dt, maxSubSteps);
  lastTime = time;
  
  sphere.position.copy(sphereBody.position);
  
  requestAnimationFrame(render);
}

render();