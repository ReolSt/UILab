class GLObjectRenderer {
  constructor(object) {
    this.webglRenderer = new GLRenderer(object);

    this.vertexBuffer = new GLArrayBuffer({
      glContext: this.glContext,
      size: 4,
      index: 0,
      normalize: false,
      stride: 0,
      offset: 0
    });

    this.colorBuffer = new GLArrayBuffer({
      glContext: this.glContext,
      size: 4,
      index: 1,
      normalize: false,
      stride: 0,
      offset: 0
    });

    webglRenderer.attachBuffer(vertexBuffer);
    webglRenderer.attachBuffer(colorBuffer);

    this.objects = [];
  }

  addObject(object) {
    this.objects.push(object);
  }

  removeObject(index) {
    this.objects.splice(index, 1);
  }
  
  render(beforeDraw) {
    beforeDraw(this.program, this.objects);

    this.GLRenderer.render((program, buffers) => {
      
    });
  }
}