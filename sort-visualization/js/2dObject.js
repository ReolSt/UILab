class GLTriangle {
  constructor(vertices, color) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 3);
    this.colors = [
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255])
    ];
  }
}

class GLRectangle {
  constructor(vertices, color) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 4);
    this.colors = [
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255])
    ];
  }
}

class GLPentagon {
  constructor(vertices, color) {
    this.vertices = shrinkArray(GLPadVectors4(vertices), 5);
    this.colors = [
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255]),
      GLPadVector4(color, [0, 0, 0, 255])
    ];
  }
}