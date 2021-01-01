class GLObjectRenderer {
  constructor(object) {
    this.glContext = object.glContext;
    object.drawType = this.glContext.TRIANGLES_FAN;

    this.glRenderer = new GLRenderer(object);

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

    this.glRenderer.attachBuffer("vertex", this.vertexBuffer);
    this.glRenderer.attachBuffer("color", this.colorBuffer);

    this.objects = {};
  }

  addObject(id, object) {
    this.objects[id] = object;
  }

  removeObject(id) {
    this.objects[id] = undefined;
  }
  
  render(beforeDraw) {    
    Object.values(this.objects).forEach(object => {
      this.glRenderer.render((program, buffers) => {
        beforeDraw(program, this.objects);
        buffers["vertex"].setBuffer(getFlattenArray(object.vertices));
        buffers["color"].setBuffer(getFlattenArray(object.colors));
      });
    });
  }
}