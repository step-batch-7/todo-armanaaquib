const renderTitleItems = function (todoList) {
  document.querySelector('#nav-items').innerHTML = todoList.titlesHtml();
};

const updateTitleItems = function () {
  sendGetRequest('todoList', (responseText) => {
    const todoList = TodoList.load(responseText);
    renderTitleItems(todoList);
  });
}

const addTodo = function () {
  const titleElement = document.querySelector('#title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    alert('Please Enter Title');
    return;
  }
  titleElement.value = ''

  sendPostRequest('addTodo', titleText, 'text/plain', updateTitleItems);
};