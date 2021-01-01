document.oncontextmenu = () => {return false;}

let visualizerCanvas = document.getElementById("canvas-visualizer");

let visualizer = visualizerCanvas.getContext("webgl2",  {preserveDrawingBuffer: true});

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
    [0.5, 0, 0],
    [0, 0.5, 0]
  ],
  [
    [255, 255, 255],
    [255, 255, 255],
    [255, 255, 255]
  ]
));

objectRenderer.addObject("rectangle", new GLRectangle(
  [
    [0, 0, 0],
    [-0.25, -1, 0],
    [-0.5, -0.25, 0],
    [-0.5, 0, 0]
  ],
  [
    [255, 0, 255],
    [255, 122, 233],
    [255, 255, 255],
    [255, 255, 255]
  ]
));

objectRenderer.addObject("pentagon", new GLPentagon(
  [
    [0.5, 0.5, 0],
    [0.7, 0.7, 0],
    [0.6, 1.0, 0],
    [0.4, 1.0, 0],
    [0.3, 0.7, 0]
  ],
  [
    [255, 0, 255],
    [255, 3, 233],
    [255, 3, 255],
    [2, 255, 255],
    [255, 255, 255]
  ]
));

let cameraPosition = [0, 0, 0];

let rotateMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0 ,0, 1, 0],
  [0, 0, 0, 1]
];

function updateRotateMatrix() {
  let sinX = Math.sin(rotateX), cosX = Math.cos(rotateX);
  let sinY = Math.sin(rotateY), cosY = Math.cos(rotateY);
  let sinZ = Math.sin(rotateZ), cosZ = Math.cos(rotateZ);
  rotateMatrix[0][0] = cosY * cosZ - sinX * sinY * sinZ;
  rotateMatrix[0][1] = -cosX * sinZ;
  rotateMatrix[0][2] = sinX * cosY * sinZ + sinY * cosZ;
  rotateMatrix[1][0] = sinX * sinY * cosZ + cosY * sinZ;
  rotateMatrix[1][1] = cosX * cosZ;
  rotateMatrix[1][2] = sinY * sinZ - sinX * cosY * cosZ;
  rotateMatrix[2][0] = -cosX * sinY;
  rotateMatrix[2][1] = sinX;
  rotateMatrix[2][2] = cosX * cosY;
}

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
    moveMatrix[3][2] += sensitivity * event.movementX;
    moveMatrix[3][2] -= sensitivity * event.movementY;
  }

  if(mouseButtons[1] === true) {
    rotateY += sensitivity * 2 * event.movementX;
    updateRotateMatrix();
  }

  if(mouseButtons[2] === true) {
    rotateX += sensitivity * 2 * event.movementY;
    rotateZ += sensitivity * 2 * event.movementX;
    updateRotateMatrix();
  }
});

document.body.addEventListener("mouseup", event => {
  mouseButtons[event.button] = false;
});

document.body.addEventListener("wheel", event => {
  if(event.deltaY > 0) {
    moveMatrix[0][0] -= 0.05;
    moveMatrix[1][1] -= 0.05;
    moveMatrix[2][2] -= 0.05;
  }
  else if(event.deltaY < 0) {
    moveMatrix[0][0] += 0.05;
    moveMatrix[1][1] += 0.05;
    moveMatrix[2][2] += 0.05;
  }
});

let rotateX = 0;
let rotateY = 0;
let rotateZ = 0;

function handleKeyboardEvent() {
  if(keys["w"]) {
    moveMatrix[3][1] -= 0.05;
  }
  if(keys["a"]) {
    moveMatrix[3][0] += 0.05;
  }
  if(keys["s"]) {
    moveMatrix[3][1] += 0.05;
  }
  if(keys["d"]) {
    moveMatrix[3][0] -= 0.05;
  }
}

let renderloop = setInterval(() => {
  handleKeyboardEvent();

  objectRenderer.render((program, buffers) => {
    visualizer.uniform3f(
      program.uniformLocation("cameraPosition"),
      false,
      new Float32Array(cameraPosition)
    );

    visualizer.uniformMatrix4fv(
      program.uniformLocation("rotateMatrix"),
      false,
      new Float32Array(getFlattenArray(rotateMatrix))
    );
  });
}, 33);