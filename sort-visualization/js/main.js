let visualizerCanvas = document.getElementById("canvas-visualizer");
let graphACanvas = document.getElementById("canvas-graph-a");
let graphBCanvas = document.getElementById("canvas-graph-b");

let visualizer = visualizerCanvas.getContext("webgl");
let graphA = graphACanvas.getContext("webgl");
let graphB = graphBCanvas.getContext("webgl");

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

let vertexShader = document.getElementById("vertex-shader");
vertexShader = getShader(
    visualizer,
    visualizer.VERTEX_SHADER,
    vertexShader.innerText
);

let fragmentShader = document.getElementById("fragment-shader");
fragmentShader = getShader(
    visualizer,
    visualizer.FRAGMENT_SHADER,
    fragmentShader.innerText
);

let mainProgram = getProgram(
    visualizer, [vertexShader, fragmentShader]
);

let positionBuffer = visualizer.createBuffer();
visualizer.bindBuffer(visualizer.ARRAY_BUFFER, positionBuffer);

let positions = [
    0, 0,
    0, 0.5,
    0.5, 0
];

visualizer.bufferData(
    visualizer.ARRAY_BUFFER,
    new Float32Array(positions),
    visualizer.STATIC_DRAW
);

let colorBuffer = visualizer.createBuffer();
visualizer.bindBuffer(visualizer.ARRAY_BUFFER, positionBuffer);

let colors = [
  1, 0, 0, 0.5,
  0, 1, 0, 1,
  0.5, 1, 0.5 ,0.2
];

let vType = visualizer.FLOAT;
let vNormalize = false;
let vStride = 0;
let vOffset = 0;

function render() {
    visualizer.viewport(0, 0, visualizer.canvas.width, visualizer.canvas.height);

    visualizer.clearColor(0, 0, 0, 0);
    visualizer.clear(visualizer.COLOR_BUFFER_BIT);
    visualizer.useProgram(mainProgram);

    visualizer.enableVertexAttribArray(0);

    visualizer.bindBuffer(visualizer.ARRAY_BUFFER, positionBuffer);

    visualizer.vertexAttribPointer(
        0,
        2,
        vType,
        vNormalize,
        vStride,
        vOffset
    );

    let offset = 0;
    let count = 3;

    visualizer.enableVertexAttribArray(1);

    visualizer.bindBuffer(visualizer.ARRAY_BUFFER, positionBuffer);

    visualizer.vertexAttribPointer(
      1,
      4,
      vType,
      vNormalize,
      vStride,
      vOffset
    );

    visualizer.drawArrays(
        visualizer.TRIANGLES,
        offset,
        count
    );
}

render();

let colorSwitchInterval = setInterval(() => {
  let color = [Math.random(), Math.random(), Math.random(), 1];
}, 1000);