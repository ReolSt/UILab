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

visualizer.bufferData(
  visualizer.ARRAY_BUFFER,
  new Float32Array(positions),
  visualizer.STATIC_DRAW
);

let colorBuffer = visualizer.createBuffer();
visualizer.bindBuffer(visualizer.ARRAY_BUFFER, colorBuffer);

visualizer.bufferData(
  visualizer.ARRAY_BUFFER,
  new Float32Array(colors),
  visualizer.STATIC_DRAW
);

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
        3,
        vType,
        vNormalize,
        vStride,
        vOffset
    );

    visualizer.enableVertexAttribArray(1);

    visualizer.bindBuffer(visualizer.ARRAY_BUFFER, colorBuffer);
    visualizer.bufferData(
      visualizer.ARRAY_BUFFER,
      new Float32Array(colors),
      visualizer.STATIC_DRAW
    );

    visualizer.vertexAttribPointer(
      1,
      4,
      vType,
      vNormalize,
      vStride,
      vOffset
    );

    let offset = 0;
    let count = 3;

    visualizer.drawArrays(
        visualizer.TRIANGLES,
        offset,
        count
    );
}

render();

class GLArrayBuffer {
  constructor(object) {
    this.glContext = object.glContext;
    this.index = 0;
    this.size = 3;
    this.type = glContext.FLOAT;
    this.normalize = false;
    this.stride = 0;
    this.offset = 0;

    if(object.index !== undefined) {
      this.index = object.index;
    }

    if(object.size !== undefined) {
      this.size = object.size;
    }

    if(object.type !== undefined) {
      this.type = object.type;
    }

    if(object.normalize !== undefined) {
      this.normalize = object.normalize;
    }

    if(object.stride !== undefined) {
      object.stride = object.stride;
    }

    if(object.offset !== undefined) {
      object.offset = object.offset;
    }
    
    this.buffer = this.glContext.createBuffer();
    this.array = [];
  }

  render() {
    this.glContext.enableVertexAttribArray(this.index);
    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);

    visualizer.bufferData(
      visualizer.ARRAY_BUFFER,
      new Float32Array(array),
      visualizer.STATIC_DRAW
    );

    this.glContext.vertexAttribPointer(
      this.index,
      this.size,
      this.type,
      this.normalize,
      this.stride,
      this.offset
    );
  }
}

class VertexBuffer extends ArrayBuffer {
  constructor(object) {
    super(object);
  }

  push(x, y, z, w) {
    switch(this.size) {
      case 4:
        this.array.push(w);
      case 3:
        this.array.push(z);
      case 2:
        this.array.push(x);
        this.array.push(y);
        break;
    }
  }

  pop() {
    this.array.pop(this.size);
  }
}

class ColorBuffer extends ArrayBuffer {
  constructor(object) {
    super(object);
  }

  push(r, g, b, a) {
    switch(this.size) {
      case 4:
        this.array.push(a);
      case 3:
        this.array.push(r);
        this.array.push(g);
        this.array.push(b);
        break;
    }
  }

  pop() {
    this.array.pop(this.size);
  }
}

let vertexBuffer = {
  clearBuffer: () => {
    this.arrayBuffer = [];
  },

};

let colorBuffer = {
  clearBuffer: () => {
    this.arrayBuffer = [];
  },
};

let renderInterval = setInterval(() => {
  render();
}, 10);