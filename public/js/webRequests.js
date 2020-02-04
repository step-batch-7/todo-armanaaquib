const sendGetRequest = function (url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status == 200) {
      callback(this.responseText);
    }
  }
  req.open('GET', url);
  req.send();
}

const sendPostRequest = function (url, content, contentType, callback) {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status == 201) {
      callback();
    }
  }
  req.open('POST', url);
  req.setRequestHeader('Content-Type', contentType);
  req.send(content);
}
