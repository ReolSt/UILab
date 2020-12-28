function getShader(glContext, type, source) {
    let shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);

    let success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.error("Shader Compiling Error\n" + glContext.getShaderInfoLog(shader));
    glContext.deleteShader(shader);
}

function getProgram(glContext, shaders) {
    let program = glContext.createProgram();

    shaders.forEach(shader => {
        glContext.attachShader(program, shader);
    });

    glContext.linkProgram(program);

    let success = glContext.getProgramParameter(program, glContext.LINK_STATUS);
    if (success) {
        return program;
    }

    console.error("Program Linking Error\n" + glContext.getProgramInfoLog(program));
    glContext.deleteProgram(program);
}