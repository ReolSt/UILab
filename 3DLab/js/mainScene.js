import * as THREE from "../three/build/three.module.js";
import { renderer } from "./renderer.js";
import { playerCamera } from "./camera.js";
import { FPSControls } from "./fpsControls.js";
import { IsometricControls } from "./isometricControls.js";
import { debugStats, debugPanel } from "./debugGUI.js";

'use strict';

function createEquirectangularTexture(renderer, imgSrc, callback) {
  let texture = new THREE.TextureLoader().load(
    imgSrc,
    () => {
      let renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
      renderTarget.fromEquirectangularTexture(renderer, texture);
      callback(renderTarget);
    }
  );
}

let mainScene = new THREE.Scene();

createEquirectangularTexture(
  renderer,
  "resources/images/background-equirectangular.png",
  renderTarget => {
    mainScene.background = renderTarget;
  }
);

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

useControls(fpsControls);

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

let cameraControls = new function() {
  this.fov = playerCamera.fov;
  this.near = playerCamera.near;
  this.far = playerCamera.far;
  this.view = "Isometric";
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

let lightControls = new function() {
  this.x = light.position.x;
  this.y = light.position.y;
  this.z = light.position.z;
};

let folderLight = debugPanel.addFolder("light");
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

function render() {
  updateCameraValues();
  updateLightValues();
  updateSphereValues();

  controls.eventListeners.keypressframe();

  renderer.render(mainScene, playerCamera);

  debugStats.update();
  requestAnimationFrame(render);
}

render();