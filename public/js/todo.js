/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const render = function (id, html) {
  document.querySelector(`#${id}`).innerHTML = html;
};

const getElementById = (id) => document.querySelector(`#${id}`);
const getElementsByClass = (className) => document.querySelectorAll(`.${className}`);
const getClickedTodoListElement = () => getElementsByClass('clicked')[0];

const removeClassFromAll = function (className) {
  const elements = getElementsByClass(className);
  elements.forEach((element) => element.classList.remove(className));
};

const todoListCollection = new TodoListCollection();

const showTasks = function (todoListId) {
  render('todo-container', todoListCollection.tasksHtml(todoListId));
  const taskItems = getElementById('tasks-container');
  taskItems.scrollTop = taskItems.scrollHeight;
};

const updateTitleItems = function () {
  render('nav-items', todoListCollection.titlesHtml());
  getElementById('nav-items').scroll(0, 0);

  const lastTodoList = todoListCollection.lastTodoList;
  if (lastTodoList) {
    const lastTodoListId = lastTodoList.id;
    const todoListElement = getElementById(lastTodoListId);
    todoListElement.classList.add('clicked');
    showTasks(lastTodoListId);
  }
};

const update = function (callback) {
  sendGetRequest('todoList', (responseText) => {
    todoListCollection.update(responseText);
    callback();
  });
};

const addTodo = function () {
  const titleElement = getElementById('title-text');
  const titleText = titleElement.value;

  if (titleText === '') {
    return;
  }
  titleElement.value = '';

  sendPostRequest('addTodo', JSON.stringify({titleText}), 'application/json', () => {
    update(updateTitleItems);
  });
};

const clickedTodo = function (event) {
  const todoElement = event.target.parentElement;

  removeClassFromAll('clicked');
  todoElement.classList.add('clicked');

  const todoListId = todoElement.id;
  showTasks(todoListId);
};

const removeTodo = function (event) {
  const todoElement = event.target.parentElement;
  const todoListId = todoElement.id;

  sendPostRequest('removeTodo', JSON.stringify({todoListId}), 'application/json', () => {
    update(updateTitleItems);
  });
};

const addTask = function () {
  const taskElement = getElementById('task-text');
  const taskText = taskElement.value;

  if (taskText === '') {
    return;
  }

  const clickedTodoListElement = getClickedTodoListElement();
  const todoListId = clickedTodoListElement.id;
  const body = JSON.stringify({todoListId, taskText});

  sendPostRequest('addTask', body, 'application/json', () => {
    update(showTasks.bind(null, todoListId));
  });
};

const removeTask = function (event) {
  const taskElement = event.target.parentElement;
  const taskId = taskElement.id;

  const clickedTodoListElement = getClickedTodoListElement();
  const todoListId = clickedTodoListElement.id;

  const body = JSON.stringify({todoListId, taskId});

  sendPostRequest('removeTask', body, 'application/json', () => {
    update(showTasks.bind(null, todoListId));
  });
};

const updateStatus = function (event) {
  const statusElement = event.target;

  const taskElement = statusElement.parentElement.parentElement;
  const taskId = taskElement.id;

  const clickedTodoListElement = getClickedTodoListElement();
  const todoListId = clickedTodoListElement.id;

  let status = false;
  if (statusElement.checked) {
    status = true;
  }

  const body = JSON.stringify({todoListId, taskId, status});

  sendPostRequest('updateTaskStatus', body, 'application/json', () => {
    update(showTasks.bind(null, todoListId));
  });
};

const loadPage = function () {
  sendGetRequest('todoList', (responseText) => {
    todoListCollection.update(responseText);
    updateTitleItems();
  });
};
