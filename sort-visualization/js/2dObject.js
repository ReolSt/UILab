class GLTriangle {
  constructor(vertices, colors) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 3);
    this.color
    this.colors = shrinkArray(GLPadVectors4(colors, [0, 0, 0, 255]), 3);
    console.log(this.vertices, this.colors);
  }
}

class GLRectangle {
  constructor(vertices, colors) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 4);
    this.colors = shrinkArray(GLPadVectors4(colors, [0, 0, 0, 255]), 4);
  }
}

class GLPentagon {
  constructor(vertices, colors) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 5);
    this.colors = shrinkArray(GLPadVectors4(colors, [0, 0, 0, 255]), 5);
  }
}