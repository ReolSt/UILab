let sortCanvas = document.getElementById("canvas-sort");
let graphACanvas = document.getElementById("canvas-graph-a");
let graphBCanvas = document.getElementById("canvas-graph-b");

let sortContext = sortCanvas.getContext("webgl");
let graphAContext = graphACanvas.getContext("webgl");
let graphBContext = graphBCanvas.getContext("webgl");

sortCanvas.width = sortCanvas.clientWidth;
sortCanvas.height = sortCanvas.clientHeight;

graphACanvas.width = graphACanvas.clientWidth;
graphACanvas.height = graphACanvas.clientHeight;

graphBCanvas.width = graphBCanvas.clientWidth;
graphBCanvas.height = graphBCanvas.clientHeight;

let elementCount = 100;

function getRandomizedList(minValue, maxValue, count) {
  let randomizedList = [];
  for(let i = 0; i < count; ++i) {

  }
}