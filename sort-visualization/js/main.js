let visualizerCanvas = document.getElementById("canvas-visualizer");

let visualizer = visualizerCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

let objectRenderer = new GLObjectRenderer({
  glContext: visualizer,
  vertexShaderSource: document.getElementById("vertex-shader").innerText,
  fragmentShaderSource: document.getElementById("fragment-shader").innerText
});

objectRenderer.addObject("triangle", new GLTriangle(
  [
    [0, 0.1, 0],
    [0.5, 0, 0.5],
    [0, 0.5, 0.5]
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [1, 0, 0]
  ]
));

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

  objectRenderer.render((program, buffers) => {
    visualizer.uniformMatrix4fv(
      program.uniformLocation("cameraMatrix"),
      false,
      new Float32Array(getFlattenArray(cameraMatrix))
    );
  });
}, 33);