function getRandomValue_Integer(minValue, maxValue) {
    ++maxValue;
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
}

function getRandomValue_Real(minValue, maxValue) {
    return Math.random() * (maxValue - minValue) + minValue;
}

function getRandomArray_Integer(minValue, maxValue, count) {
    let randomArray = [];
    for (let i = 0; i < count; ++i) {
        randomArray.push(getRandomValue_Integer(minValue, maxValue));
    }

    return randomArray;
}

function getRandomArray_Real(minValue, maxValue, count) {
    let randomArray = [];
    for (let i = 0; i < count; ++i) {
        randomArray.push(getRandomValue_Real(minValue, maxValue));
    }

    return randomArray;
}

function getAverage(list) {
    let sum = list.reduce((acc = 0, value) => {
        return acc + value;
    });

    return sum / list.length;
}

function getVariance(list) {
    let average = getAverage(list);

    let sumOfSquaredDevation = list.reduce((acc = 0, value) => {
        return acc + Math.pow(Math.abs(value - average), 2);
    });
    return sumOfSquaredDevation / list.length;
}

function getMinimum(list) {
    return list.reduce((min = list[0], value) => {
        if (min > value) {
            return value;
        } else {
            return min;
        }
    });
}

function getMaximum(list) {
    return list.reduce((max = list[0], value) => {
        if (max < value) {
            return value;
        } else {
            return max;
        }
    })
}

function getFlattenArray(array) {
  let flattenArray = [];
  
  array.forEach(element => {
    if(element instanceof Array) {
      flattenArray = flattenArray.concat(getFlattenArray(element));
    }
    else {
      flattenArray.push(element);
    }
  });
  
  return flattenArray;
}

function padArray(array, padSize, padValues = []) {
  let paddedArray = [...array];

  for(let i = array.length; i < padSize; ++i) {
    paddedArray.push(padValues[i]);
  }
  
  return paddedArray;
}

function shrinkArray(array, size) {
    if(size > array.length) {
        return [...array];
    }
    
    return [...array].slice(size);
}