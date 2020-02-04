const addTitle = function () {
  const titleElement = document.querySelector('#title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    alert('Please Enter Title')
  }

  titleElement.value = ''

  const req = new XMLHttpRequest();
  req.open('POST', '/addTitle');
  req.send(titleText);
};
