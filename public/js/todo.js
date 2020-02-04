const render = function (identifier, html) {
  document.querySelector(identifier).innerHTML = html;
};

const updateTitleItems = function () {
  sendGetRequest('todoList', (responseText) => {
    const todoList = TodoList.load(responseText);
    render('#nav-items', todoList.titlesHtml());
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

const showTasks = function (event) {
  console.log('hi');
  const titleElement = event.target;
  const title = titleElement.innerText;

  sendGetRequest('todoList', (responseText) => {
    const todoList = TodoList.load(responseText);
    render('#todo-container', todoList.tasksHtml(title));
  });
}