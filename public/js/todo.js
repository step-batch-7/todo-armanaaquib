const addTitle = function () {
  const titleText = document.querySelector('#title-text').value;
  const req = new XMLHttpRequest();
  req.open('POST', '/addTitle');
  req.send(titleText);
};
