const render = function (id, html) {
  document.querySelector(`#${id}`).innerHTML = html;
};

const removeClassFromAll = function (className) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((element) => element.classList.remove(className));
};

const updateTitleItems = function () {
  sendGetRequest('todoList', (responseText) => {
    const todoList = TodoList.load(responseText);
    render('nav-items', todoList.titlesHtml());
  });
};

const addTodo = function () {
  const titleElement = document.querySelector('#title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    alert('Please Enter Title');
    return;
  }
  titleElement.value = '';

  sendPostRequest('addTodo', titleText, 'text/plain', updateTitleItems);
};

const showTasks = function (todoId) {
  sendGetRequest('todoList', (responseText) => {
    const todoList = TodoList.load(responseText);
    render('todo-container', todoList.tasksHtml(todoId));
  });
};

const clickedTodo = function (event) {
  const todoElement = event.target;

  removeClassFromAll('clicked');
  todoElement.classList.add('clicked');

  const todoId = todoElement.id;
  showTasks(todoId);
};

const addTask = function () {
  const taskElement = document.querySelector('#task-text');
  const taskText = taskElement.value;

  if (taskText === '') {
    alert('Please Enter Task');
    return;
  }

  const clickedTodo = document.querySelector('.clicked');
  const todoId = clickedTodo.id;
  const requestText = JSON.stringify({todoId, taskText});

  sendPostRequest('addTask', requestText, 'application/json', () => showTasks(todoId));
};

