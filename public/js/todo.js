/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const render = function (id, html) {
  document.querySelector(`#${id}`).innerHTML = html;
};

const removeClassFromAll = function (className) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((element) => element.classList.remove(className));
};

const todoList = new TodoList();

const showTasks = function (todoId) {
  render('todo-container', todoList.tasksHtml(todoId));
  const taskItems = document.querySelector('#tasks-container');
  taskItems.scrollTop = taskItems.scrollHeight;
};

const updateTitleItems = function () {
  render('nav-items', todoList.titlesHtml());
  document.querySelector('#nav-items').scroll(0, 0);

  const lastTodo = todoList.lastTodo;
  if (lastTodo) {
    const lastTodoId = lastTodo.id;
    const todoElement = document.querySelector(`#${lastTodoId}`);
    todoElement.classList.add('clicked');
    showTasks(lastTodoId);
  }
};

const addTodo = function () {
  const titleElement = document.querySelector('#title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    return;
  }
  titleElement.value = '';

  sendPostRequest('addTodo', `titleText=${titleText}`, () => {
    sendGetRequest('todoList', (responseText) => {
      todoList.update(responseText);
      updateTitleItems();
    });
  });
};

const clickedTodo = function (event) {
  const todoElement = event.target.parentElement;

  removeClassFromAll('clicked');
  todoElement.classList.add('clicked');

  const todoId = todoElement.id;
  showTasks(todoId);
};

const removeTodo = function (event) {
  const todoElement = event.target.parentElement;
  const todoId = todoElement.id;

  sendPostRequest('removeTodo', `todoId=${todoId}`, () => {
    sendGetRequest('todoList', (responseText) => {
      todoList.update(responseText);
      updateTitleItems(todoId);
    });
  });
};

const addTask = function () {
  const taskElement = document.querySelector('#task-text');
  const taskText = taskElement.value;

  if (taskText === '') {
    return;
  }

  const clickedTodo = document.querySelector('.clicked');
  const todoId = clickedTodo.id;
  const body = `todoId=${todoId}&taskText=${taskText}`;

  sendPostRequest('addTask', body, () => {
    sendGetRequest('todoList', (responseText) => {
      todoList.update(responseText);
      showTasks(todoId);
    });
  });
};

const removeTask = function (event) {
  const taskElement = event.target.parentElement;
  const taskId = taskElement.id;

  const clickedTodo = document.querySelector('.clicked');
  const todoId = clickedTodo.id;

  const body = `todoId=${todoId}&taskId=${taskId}`;

  sendPostRequest('removeTask', body, () => {
    sendGetRequest('todoList', (responseText) => {
      todoList.update(responseText);
      showTasks(todoId);
    });
  });
};

const updateStatus = function (event) {
  const statusElement = event.target;

  const taskElement = statusElement.parentElement.parentElement;
  const taskId = taskElement.id;

  const clickedTodo = document.querySelector('.clicked');
  const todoId = clickedTodo.id;

  let status = false;
  if (statusElement.checked) {
    status = true;
  }

  const body = `todoId=${todoId}&taskId=${taskId}&status=${status}`;

  sendPostRequest('updateTaskStatus', body, () => {
    sendGetRequest('todoList', (responseText) => {
      todoList.update(responseText);
      showTasks(todoId);
    });
  });
};

const loadPage = function () {
  sendGetRequest('todoList', (responseText) => {
    todoList.update(responseText);
    updateTitleItems();
  });
};
