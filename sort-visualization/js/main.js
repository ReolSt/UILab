let visualizerCanvas = document.getElementById("canvas-visualizer");

let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

let elementCount = 100;

let randomArray = getRandomArray_Integer(1, 1000, 1000);

let timeStep = 5; /* milliseconds */
let heightOffset = 50; /* px */

let renderer = new GLRenderer({
  glContext: visualizer
});

let vertexShader = document.getElementById("vertex-shader");
vertexShader = new GLShader({
  glContext: visualizer,
  type: visualizer.VERTEX_SHADER,
  source: document.getElementById("vertex-shader").innerText
});

let fragmentShader = new GLShader({
  glContext: visualizer,
  type: visualizer.FRAGMENT_SHADER,
  source: document.getElementById("fragment-shader").innerText
});

let mainProgram = new GLProgram({
  glContext: visualizer,
  shaders: [vertexShader, fragmentShader]
});

let vertexBuffer = new GLArrayBuffer({
  glContext: visualizer,
  size: 3,
  index: 0,
  normalize: false,
  stride: 0,
  offset: 0
});

let colorBuffer = new GLArrayBuffer({
  glContext: visualizer,
  size: 4,
  index: 1,
  normalize: false,
  stride: 0,
  offset: 0
});

renderer.attachBuffer(vertexBuffer);
renderer.attachBuffer(colorBuffer);

let triangleVertexes = [
  0, 0.1, 0,
  0.5, 0, 0.5,
  0, 0.5, 0.5,
  0.4, 0.2, 0.1,
  0.6, 0.6, 0.4,
  0.8, 0.8, 0.6
];

let triangleColors = [
  1, 1, 0, 1,
  0, 1, 0, 1,
  1, 0, 0, 1,
  1, 0, 0, 1,
  0, 1, 1, 1,
  0, 0, 1, 1
];

let cameraMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0 ,0, 1, 0],
  [0, 0, 0, 1]
];

let keys = {};

document.body.addEventListener("keydown", event => {
  keys[event.key] = true;
});

document.body.addEventListener("keyup", event => {
  keys[event.key] = false;
});

let sensitivity = 0.001;

document.body.addEventListener("mousemove", event => {
  if(event.button == 0) {
    console.log(event);
    cameraMatrix[0][3] -= sensitivity * event.movementX;
    cameraMatrix[1][3] += sensitivity * event.movementY;
  }
});

let renderloop = setInterval(() => {
  if(keys["w"]) {
    cameraMatrix[1][3] -= 0.01;
  }
  if(keys["a"]) {
    cameraMatrix[0][3] += 0.01;
  }
  if(keys["s"]) {
    cameraMatrix[1][3] += 0.01;
  }
  if(keys["d"]) {
    cameraMatrix[0][3] -= 0.01;
  }

  if(keys["q"]) {
    cameraMatrix[0][0] -= 0.01;
    cameraMatrix[1][1] -= 0.01;
    cameraMatrix[2][2] -= 0.01;
  }
  if(keys["e"]) {
    cameraMatrix[0][0] += 0.01;
    cameraMatrix[1][1] += 0.01;
    cameraMatrix[2][2] += 0.01;
  }

  mainProgram.use();

  visualizer.uniformMatrix4fv(
    mainProgram.uniformLocation("cameraMatrix"),
    false,
    new Float32Array(getFlattenArray(cameraMatrix))
  );

  vertexBuffer.setBuffer(triangleVertexes);
  colorBuffer.setBuffer(triangleColors);

  renderer.render();
}, 33);