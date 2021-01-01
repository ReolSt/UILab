class GLObjectRenderer {
  constructor(object) {
    this.glContext = object.glContext;
    object.drawType = this.glContext.TRIANGLE_FAN;

    this.glRenderer = new GLRenderer(object);

    this.vertexBuffer = new GLArrayBuffer({
      glContext: this.glContext,
      type: this.glContext.FLOAT,
      size: 4,
      index: 0,
      normalize: false,
      stride: 0,
      offset: 0
    });

    this.colorBuffer = new GLArrayBuffer({
      glContext: this.glContext,
      type: this.glContext.UNSIGNED_BYTE,
      size: 4,
      index: 1,
      normalize: true,
      stride: 0,
      offset: 0
    });

    this.glRenderer.attachBuffer("vertex", this.vertexBuffer);
    this.glRenderer.attachBuffer("color", this.colorBuffer);

    this.objects = {};
  }

  getObject(id) {
    return this.objects[id];
  }

  addObject(id, object) {
    this.objects[id] = object;
  }

  addObjects(objects) {
    objects.forEach(object => {
      this.objects[object.id] = object.object;
    });
  }

  removeObject(id) {
    this.objects[id] = undefined;
  }
  
  render(beforeDraw) {    
    Object.values(this.objects).forEach((object, index) => {
      let renderMode = "overlay";
      if(index === 0) {
        renderMode = "clear";
      }
      this.glRenderer.render((program, buffers) => {
        beforeDraw(program, this.objects);
        buffers["vertex"].setBuffer(getFlattenArray(object.vertices));
        buffers["color"].setBuffer(getFlattenArray(object.colors));
      },  renderMode);
    });
  }
}