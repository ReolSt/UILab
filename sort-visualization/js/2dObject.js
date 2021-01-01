class GLTriangle {
  constructor(vertices, colors) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 3);
    this.colors = shrinkArray(GLPadVectors4(colors), 3);
  }
}

class GLSquare {
  constructor(vertices, colors) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 4);
    this.colors = shrinkArray(GLPadVectors4(colors), 5);
  }
}