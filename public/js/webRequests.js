/* eslint-disable no-unused-vars */
const sendGetRequest = function (url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function () {
    const OK_STATUS = 200;
    if (this.status === OK_STATUS) {
      callback(this.responseText);
    }
  };
  req.open('GET', url);
  req.send();
};

const sendPostRequest = function (url, body, contentType, callback) {
  const req = new XMLHttpRequest();
  req.onload = function () {
    const CREATED_STATUS = 201;
    if (this.status === CREATED_STATUS) {
      callback();
    }
  };
  req.open('POST', url);
  req.setRequestHeader('Content-Type', contentType);
  req.send(body);
};
