let todoList = [];

const updateToHtml = function (todo) {
  return `<h2 class="nav-item">${todo.title}</h2>`;
};

const renderNav = function () {
  const navItemsAsHtml = todoList.map(updateToHtml).join('');
  document.querySelector('#nav-items').innerHTML = navItemsAsHtml;
};

const updatePage = function () {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status == 200) {
      todoList = JSON.parse(this.responseText);
      renderNav();
    }
  }
  req.open('GET', '/todoList');
  req.send();
};

const addTitle = function () {
  const titleElement = document.querySelector('#title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    alert('Please Enter Title')
  }

  titleElement.value = ''

  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status == 200) {
      updatePage();
    }
  }
  req.open('POST', '/addTitle');
  req.send(titleText);
};