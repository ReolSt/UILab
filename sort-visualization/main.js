let visualizerCanvas = document.getElementById("canvas-visualizer");
let graphACanvas = document.getElementById("canvas-graph-a");
let graphBCanvas = document.getElementById("canvas-graph-b");

let visualizerContext = visualizerCanvas.getContext("webgl");
let graphAContext = graphACanvas.getContext("webgl");
let graphBContext = graphBCanvas.getContext("webgl");

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