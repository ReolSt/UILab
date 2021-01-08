function GLPadVector3(vector, padValues = [0, 0, 0]) {
  return padArray(vector, 4, padValues);
}

function GLPadVectors3(vectors, padValues) {
  return vectors.map(vector =>{
    return GLPadVector3(vector, padValues);
  });
}

function GLPadVector4(vector, padValues = [0, 0, 0, 1]) {
  return padArray(vector, 4, padValues);
}

function GLPadVectors4(vectors, padValues) {
  return vectors.map(vector =>{
    return GLPadVector4(vector, padValues);
  });
}

function GLShrinkVector3(vector) {
  return shrinkArray(vector, 3);
}

function GLShrinkVector4(vector) {
  return shrinkArray(vector, 4);
}

function GLPadOrShrinkVector3(vector, padValues = [0, 0, 0]) {
  if(vector.length > 3) {
    return GLShrinkVector3(vector);
  }
  else {
    return GLPadVector3(vector, padValues);
  }
}

function GLPadOrShrinkVectors3(vectors, padValues) {
  return vectors.map(vector =>{
    return GLPadOrShrinkVector3(vector, padValues);
  });
}

function GLPadOrShrinkVector4(vector, padValues = [0, 0, 0, 1]) {
  if(vector.length > 4) {
    return GLShrinkVector4(vector);
  }
  else {
    return GLPadVector4(vector, padValues);
  }
}

function GLPadOrShrinkVectors4(vectors, padValues) {
  return vectors.map(vector =>{
    return GLPadOrShrinkVector4(vector, padValues);
  });
}

function GLTranslateColor(colorString) {
  let color = [0.0, 0.0, 0.0, 0.0];
  
  if(colorString.startWith("#")) {

  }
  if(colorString.startWith("rgb")) {
    colorString.split(",")
  }
  if(colorString.startWith("hsl")) {

  }

  return color;
}