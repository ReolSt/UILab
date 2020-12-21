let sortCanvas = document.getElementById("canvas-sort");
let graphACanvas = document.getElementById("canvas-graph-a");
let graphBCanvas = document.getElementById("canvas-graph-b");

let sortContext = sortCanvas.getContext("2d");
let graphAContext = graphACanvas.getContext("2d");
let graphBContext = graphBCanvas.getContext("2d");

sortCanvas.width = sortCanvas.clientWidth;
sortCanvas.height = sortCanvas.clientHeight;

graphACanvas.width = graphACanvas.clientWidth;
graphACanvas.height = graphACanvas.clientHeight;

graphBCanvas.width = graphBCanvas.clientWidth;
graphBCanvas.height = graphBCanvas.clientHeight;

async function loadImage(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.addEventListener("error", () => {
      reject(new Error(`loadImage(${url}): Failed To Load Image.`));
    });
    image.src = url;
  });
}

let image = null;
async function main() {
  image = await loadImage("hos.png");
  sortContext.drawImage(image, (sortCanvas.width - sortCanvas.height) / 2, 0);
}

main();