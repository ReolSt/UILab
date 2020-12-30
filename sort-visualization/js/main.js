let visualizerCanvas = document.getElementById("canvas-visualizer");
let graphACanvas = document.getElementById("canvas-graph-a");
let graphBCanvas = document.getElementById("canvas-graph-b");

let visualizer = visualizerCanvas.getContext("webgl2");
let graphA = graphACanvas.getContext("webgl2");
let graphB = graphBCanvas.getContext("webgl2");

visualizerCanvas.width = visualizerCanvas.clientWidth;
visualizerCanvas.height = visualizerCanvas.clientHeight;

graphACanvas.width = graphACanvas.clientWidth;
graphACanvas.height = graphACanvas.clientHeight;

graphBCanvas.width = graphBCanvas.clientWidth;
graphBCanvas.height = graphBCanvas.clientHeight;

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
  size: 4,
  index: 0,
  normalize: false,
  stride: 0,
  offset: 0
});

let colorBuffer = new GLArrayBuffer({
  glContext: visualizer,
  size: 4,
  index: 0,
  normalize: false,
  stride: 0,
  offset: 0
});

renderer.attachProgram(mainProgram);

renderer.attachBuffer(vertexBuffer);
renderer.attachBuffer(colorBuffer);

vertexBuffer.setBuffer([
  0, 0, 0, 1,
  0, 1, 0, 1,
  1, 0, 0, 1
]);

colorBuffer.setBuffer([
  1, 1, 0, 1,
  0, 1, 0, 0.5,
  1, 0, 0, 1
]);


let renderInterval = setInterval(() => {
  renderer.render();
}, 33);