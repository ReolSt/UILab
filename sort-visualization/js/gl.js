class GLShader {
  constructor(object) {
    this.glContext = object.glContext;
    this.type = object.type;
    this.source = object.source;

    this.shader = this.glContext.createShader(this.type);
    this.glContext.shaderSource(this.shader, this.source);
    this.glContext.compileShader(this.shader);

    let success = this.glContext.getShaderParameter(this.shader, this.glContext.COMPILE_STATUS);
    if (success) {
        return;
    }

    console.error("GLShader: Shader Compiling Error\n" + this.glContext.getShaderInfoLog(this.shader));
    this.glContext.deleteShader(this.shader);

    this.typeString = "";
    switch(this.type) {
      case this.glContext.VERTEX_SHADER:
        this.typeString = "fragment";
        break;
      case this.glContext.FRAGMENT_SHADER:
        this.typeString = "vertex";
        break;
    }
  }

  attachTo(program) {
    this.glContext.attachShader(program, this.shader);
  }
}

class GLProgram {
  constructor(object) {
    this.glContext = object.glContext;
    this.program = this.glContext.createProgram();

    this.shaders = object.shaders;
    this.shaders.forEach(shader => {
      shader.attachTo(this.program);
    });

    this.glContext.linkProgram(this.program);

    let success = this.glContext.getProgramParameter(this.program, this.glContext.LINK_STATUS);
    if(success) {
      return;
    }

    console.log("GLProgram: Program Linking Error\n" + this.glContext.getProgramInfoLog(this.program));
    this.glContext.deleteProgram(this.program);
  }

  use() {
    this.glContext.useProgram(this.program);
  }

  uniformLocation(uniformName) {
    return this.glContext.getUniformLocation(this.program, uniformName);
  }
}

class GLArrayBuffer {
  constructor(object = {
    index: 0,
    size: 3,
    normalize: false,
    stride: 0,
    offset: 0
  }) {
    this.glContext = object.glContext;
    this.index = object.index;
    this.size = object.size;
    this.type = object.type === undefined ? this.glContext.FLOAT : object.type;
    this.normalize = object.normalize;
    this.stride = object.stride;
    this.offset = object.offset;

    this.buffer = this.glContext.createBuffer();
    this.array = [];
  }

  realloc() {
    this.glContext.deleteBuffer(this.buffer);
    this.buffer = this.glContext.createBuffer();
  }

  delete() {
    this.glContext.deleteBuffer(this.buffer);
  }

  clearData() {
    this.array = [];
  }

  pushData(data) {
    if(data instanceof Number) {
      this.array.push(data);
    }
    else if(data instanceof Array) {
      data.forEach(element => {
        this.array.push(element);
      });
    }
  }

  popData(size = 1) {
    this.array.pop(size);
  }

  getBuffer() {
    return this.array;
  }

  setBuffer(array) {
    this.array = array;
  }

  write() {
    this.glContext.enableVertexAttribArray(this.index);
    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);

    let dataArray = function(type) {
      if(type === this.glContext.BYTE) {
        return new Int8Array(this.array);
      }
      if(type === this.glContext.UNSIGNED_BYTE) {
        return new Uint8Array(this.array);
      }
      if(type === this.glContext.SHORT) {
        return new Int16Array(this.array);
      }
      if(type === this.glContext.UNSIGNED_SHORT) {
        return new Uint16Array(this.array);
      }
      if(type === this.glContext.INT) {
        return new Int32Array(this.array);
      }
      if(type === this.glContext.UNSIGNED_INT) {
        return new Uint32Array(this.array);
      }
      return new Float32Array(this.array);
    }.bind(this)(this.type);

    this.glContext.bufferData(
      this.glContext.ARRAY_BUFFER,
      dataArray,
      this.glContext.STATIC_DRAW
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

class GLRenderer {
  constructor(object = {
    viewportX: 0,
    viewportY: 0,
    offset: 0
  }) {
    this.glContext = object.glContext;
    this.viewportX = 0;
    this.viewportY = 0;
    this.viewportWidth = this.glContext.canvas.width;
    this.viewportHeight = this.glContext.canvas.height;

    this.drawType = object.drawType === undefined ? this.glContext.TRIANGLES : object.drawType;
    this.offset = object.offset;

    this.buffers = {};

    if(object.program) {
      this.program = object.program;
    }
    else if(object.shaders) {
      this.program = new GLProgram({
        glContext: this.glContext,
        shaders: object.shaders
      });
    }
    else if(object.vertexShaderSource && object.fragmentShaderSource) {
      let vertexShader = new GLShader({
        glContext: this.glContext,
        type: this.glContext.VERTEX_SHADER,
        source: object.vertexShaderSource
      });

      let fragmentShader = new GLShader({
        glContext: this.glContext,
        type: this.glContext.FRAGMENT_SHADER,
        source: object.fragmentShaderSource
      });

      this.program = new GLProgram({
        glContext: this.glContext,
        shaders: [vertexShader, fragmentShader]
      });
    }
    else {
      console.warn("GLRenderer: No program attached at constructing.");
    }
  }

  setViewport(x, y, width, height) {
    this.viewportX = x;
    this.viewportY = y;
    this.viewportWidth = width;
    this.viewportHeight = height;
  }
  
  attachBuffer(id, buffer) {
    this.buffers[id] = buffer;
  }

  detachBuffer(id) {
    this.buffers[id] = undefined;
  }
  
  attachProgram(program) {
    this.program = program;
  }

  useProgram(program) {
    this.program = program;
    program.use();
  }
  
  render(beforeDraw, renderMode = "clear" /* clear, overlay */) {
    this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);

    if(renderMode === "clear") {
      this.glContext.clear(
        this.glContext.COLOR_BUFFER_BIT |
        this.glContext.DEPTH_BUFFER_BIT |
        this.glContext.STENCIL_BUFFER_BIT
      );
    }

    this.program.use();

    beforeDraw(this.program, this.buffers);

    let count = 0;

    Object.values(this.buffers).forEach(buffer => {
      count = buffer.array.length / buffer.size;
      buffer.write()
    });

    visualizer.drawArrays(
      this.drawType,
      this.offset,
      count
    );
  }
}