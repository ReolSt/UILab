let visualizerCanvas = document.getElementById("canvas-visualizer");

let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

let renderer = new GLRenderer({
  glContext: visualizer,
  vertexShaderSource: document.getElementById("vertex-shader").innerText,
  fragmentShaderSource: document.getElementById("fragment-shader").innerText
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

let mouseButtons = {};

document.body.addEventListener("mousedown", event => {
  mouseButtons[event.button] = true;
})

document.body.addEventListener("mousemove", event => {
  if(mouseButtons[0] === true) {
    cameraMatrix[0][3] += sensitivity * event.movementX;
    cameraMatrix[1][3] -= sensitivity * event.movementY;
  }
});

document.body.addEventListener("mouseup", event => {
  mouseButtons[event.button] = false;
});

function handleKeyboardEvent() {
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
}

let renderloop = setInterval(() => {
  handleKeyboardEvent();

  renderer.render((program, buffers) => {
    visualizer.uniformMatrix4fv(
      program.uniformLocation("cameraMatrix"),
      false,
      new Float32Array(getFlattenArray(cameraMatrix))
    );
    buffers[0].setBuffer(triangleVertexes);
    buffers[1].setBuffer(triangleColors);
  });
}, 33);