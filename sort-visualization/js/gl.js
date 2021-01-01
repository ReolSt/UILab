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
  constructor(object) {
    this.glContext = object.glContext;
    this.index = 0;
    this.size = 3;
    this.type = this.glContext.FLOAT;
    this.normalize = false;
    this.stride = 0;
    this.offset = 0;

    if (object.index) {
      this.index = object.index;
    }

    if (object.size) {
      this.size = object.size;
    }

    if (object.type) {
      this.type = object.type;
    }

    if (object.normalize) {
      this.normalize = object.normalize;
    }

    if (object.strided) {
      this.stride = object.stride;
    }

    if (object.offset) {
      this.offset = object.offset;
    }

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

    visualizer.bufferData(
      visualizer.ARRAY_BUFFER,
      new Float32Array(this.array),
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

class GLRenderer {
  constructor(object) {
    this.glContext = object.glContext;
    this.viewportX = 0;
    this.viewportY = 0;
    this.viewportWidth = this.glContext.canvas.width;
    this.viewportHeight = this.glContext.canvas.height;

    this.drawType = this.glContext.TRIANGLES;
    this.offset = 0;

    this.buffers = [];

    if(object.drawType) {
      this.drawType = object.drawType;
    }

    if(object.offset) {
      this.offset = object.offset;
    }

    if(object.program) {
      this.program = object.program;
    }

    if(object.shaders) {
      this.program = new GLProgram({
        glContext: this.glContext,
        shaders: object.shaders
      });
    }

    if(object.vertexShaderSource && object.fragmentShaderSource) {
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
  }

  setViewport(x, y, width, height) {
    this.viewportX = x;
    this.viewportY = y;
    this.viewportWidth = width;
    this.viewportHeight = height;
  }
  
  attachBuffer(buffer) {
    this.buffers.push(buffer);
  }

  detachBuffer(index) {
    this.buffers.splice(index, 1);
  }

  useProgram(program) {
    this.program = program;
    program.use();
  }

  render(beforeDraw) {
    this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);

    this.glContext.clearColor(0, 0, 0, 0);
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);

    this.program.use();

    beforeDraw(this.program, this.buffers);

    let count = 0;

    this.buffers.forEach(buffer => {
      if(buffer.index === 0) {
        count = buffer.array.length / buffer.size;
      }
      buffer.write();
    });

    visualizer.drawArrays(
      this.drawType,
      this.offset,
      count
    );
  }
}