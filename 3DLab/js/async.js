async function readFile(filename) {
  let request = new XMLHttpRequest(filename);
  let promise = new Promise((resolve, reject) => {
    request.addEventListener("load", event => {
      resolve(event.response);
    });
    
    request.addEventListener("error", event => {
      reject(new Error(`readFile(${filename}): Failed to read File.`));
    });
  });
  request.open("GET", filename);
  request.send();
  return promise;
}