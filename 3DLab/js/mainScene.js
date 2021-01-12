import * as THREE from "../three/build/three.module.js";
import "../cannon.js/build/cannon.min.js";
import { renderer } from "./renderer.js";
import { playerCamera } from "./camera.js";
import { FPSControls } from "./fpsControls.js";
import { IsometricControls } from "./isometricControls.js";
import { Sky } from "./sky.js";
import { debugStats, debugPanel } from "./debugGUI.js";

'use strict';

let mainScene = new THREE.Scene();

let fpsControls = new FPSControls(playerCamera);
let isometricControls = new IsometricControls(playerCamera);

let controls;

function useControls(newControls) {
  if(controls) {
    controls.detach();
  }

  if(controls === newControls) {
    return;
  }

  newControls.attach();
  controls = newControls;

  newControls.eventListeners.switch();
}

// useControls(fpsControls);

fpsControls.attach();
fpsControls.eventListeners.switch();


let sky = new Sky();

sky.material.uniforms['turbidity'].value=10;
sky.material.uniforms['rayleigh'].value=2;
sky.material.uniforms['mieCoefficient'].value=0.005;
sky.material.uniforms['mieDirectionalG'].value=0.8;
sky.material.uniforms['sunPosition'].value.copy(new THREE.Vector3(0.5, 0.2, 0.5));

sky.scale.setScalar(450000);
mainScene.add(sky);


let plane = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 0.1),
  new THREE.MeshBasicMaterial({ color: "#26c728" })
);
plane.rotateX(THREE.MathUtils.degToRad(90));
plane.position.set(0, -2, 0);

mainScene.add(plane);

let sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: "#2e97f2" })
);
sphere.frustrumCulled = false;
sphere.position.set(0, 0, -2);
mainScene.add(sphere);


var world = new CANNON.World();
world.gravity.set(0, 0, 1);

var sphereBody = new CANNON.Body({
   mass: 0.1, // kg
   position: new CANNON.Vec3(0, 1, -2), // m
   shape: new CANNON.Sphere(1)
});
world.addBody(sphereBody);

// Create a plane
var groundBody = new CANNON.Body({
    mass: 0, // mass == 0 makes the body static
    shape: new CANNON.Plane()
});
world.addBody(groundBody);

var fixedTimeStep = 1.0 / 60.0; // seconds
var maxSubSteps = 3;

let cameraControls = new function() {
  this.fov = playerCamera.fov;
  this.near = playerCamera.near;
  this.far = playerCamera.far;
  this.view = "FPS";
};

let folderCamera = debugPanel.addFolder("camera");
folderCamera.add(cameraControls, "fov", 60, 120);
folderCamera.add(cameraControls, "near", 0.01, 1);
folderCamera.add(cameraControls, "far", 10, 10000);
folderCamera.add(cameraControls, "view", ["FPS", "Isometric"]);
folderCamera.open();

function updateCameraValues() {
  playerCamera.fov = cameraControls.fov;
  playerCamera.near = cameraControls.near;
  playerCamera.far = cameraControls.far;
  switch(cameraControls.view) {
    case "FPS":
      useControls(fpsControls);
      break;
    case "Isometric":
      useControls(isometricControls);
      break;
  }
  playerCamera.updateProjectionMatrix();
}

let sphereControls = new function() {
  this.material = "Basic";
};

let folderSphere = debugPanel.addFolder("sphere");
folderSphere.add(sphereControls, "material", ["Basic", "Depth", "Distance", "Lambert", "Matcap", "Normal", "Phong", "Physical", "Standard", "Toon"]);
folderSphere.open();

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

var lastTime;

function render(time  ) {

  updateCameraValues();
  updateSphereValues();

  controls.eventListeners.keypressframe();

  renderer.render(mainScene, playerCamera);

  debugStats.update();

  if(lastTime !== undefined){
     var dt = (time - lastTime) / 1000;
     world.step(fixedTimeStep, dt, maxSubSteps);
  }
  lastTime = time;

  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);
  requestAnimationFrame(render);
}

render();