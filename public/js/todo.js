/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const renderById = function (id, html) {
  document.querySelector(`#${id}`).innerHTML = html;
};

const getElementById = (id) => document.querySelector(`#${id}`);
const getElementsByClass = (className) => document.querySelectorAll(`.${className}`);
const addClass = (element, className) => element.classList.add(className);
const getClickedTodoListElement = () => getElementsByClass('clicked')[0];

const clearTitleSearchBar = () => {
  getElementById('title-search').value = '';
};

const removeClassFromAll = function (className) {
  const elements = getElementsByClass(className);
  elements.forEach((element) => element.classList.remove(className));
};

const todoListCollection = new TodoListCollection();

const showTasks = function (todoListId) {
  renderById('todo-container', todoListCollection.tasksHtml(todoListId));
  const taskItems = getElementById('tasks-container');
  taskItems.scrollTop = taskItems.scrollHeight;
};

const selectFirstTodoList = function () {
  const firstTodoListElement = getElementsByClass('nav-item')[0];

  if (firstTodoListElement) {
    const firstTodoListId = firstTodoListElement.id;
    addClass(firstTodoListElement, 'clicked');
    showTasks(firstTodoListId);
  }
};

const updateTitleItems = function () {
  renderById('nav-items', todoListCollection.titlesHtml());
  getElementById('nav-items').scroll(0, 0);

  selectFirstTodoList();
};

const clickedTodo = function (event) {
  const todoListElement = event.target;

  removeClassFromAll('clicked');
  addClass(todoListElement, 'clicked');

  const todoListId = todoListElement.id;
  todoListCollection.selectedTodoListId = todoListId;
  showTasks(todoListId);
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
  clearTitleSearchBar();

  const body = JSON.stringify({titleText});
  sendPostRequest('addTodo', body, 'application/json', () => {
    update(updateTitleItems);
  });
};

const removeTodo = function (event) {
  const removedTodoListElement = event.target.parentElement;
  const removedTodoListId = removedTodoListElement.id;

  const body = JSON.stringify({todoListId: removedTodoListId});
  sendPostRequest('removeTodo', body, 'application/json', () => {
    update(filterTitle);
  });
};

const addTask = function () {
  const taskElement = getElementById('task-text');
  const taskText = taskElement.value;

  if (taskText === '') {
    return;
  }

  const selectedTodoListElement = getClickedTodoListElement();
  const todoListId = selectedTodoListElement.id;
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

  const todoListId = getClickedTodoListElement().id;

  let status = false;
  if (statusElement.checked) {
    status = true;
  }

  const body = JSON.stringify({todoListId, taskId, status});

  sendPostRequest('updateTaskStatus', body, 'application/json', () => {
    update(showTasks.bind(null, todoListId));
  });
};

const filterTitle = function () {
  const searchText = getElementById('title-search').value;

  renderById('nav-items', todoListCollection.filterTodoListHtmlByTitle(searchText));
  getElementById('nav-items').scroll(0, 0);

  selectFirstTodoList();
};

const filterTask = function () {
  const searchText = getElementById('task-search').value;

  renderById('nav-items', todoListCollection.filterTodoListHtmlByTask(searchText));
  getElementById('nav-items').scroll(0, 0);

  selectFirstTodoList();
};

const editTitle = function (event) {
  const newTitle = event.target.innerText;

  const selectedTodoListElement = event.target.parentElement;
  const todoListId = selectedTodoListElement.id;

  const body = JSON.stringify({todoListId, newTitle});

  sendPostRequest('editTitle', body, 'application/json', () => {
    update(updateTitleItems);
  });
};

const editTask = function (event) {
  const newText = event.target.innerText;
  const taskId = event.target.parentElement.parentElement.id;

  const selectedTodoListElement = getClickedTodoListElement();
  const todoListId = selectedTodoListElement.id;

  const body = JSON.stringify({todoListId, taskId, newText});

  sendPostRequest('editTask', body, 'application/json', () => {
    update(showTasks.bind(null, todoListId));
  });
};

const keyPressedForEdit = function (event) {
  if (event.key === 'Enter') {
    event.target.blur();
  }
};

const loadPage = function () {
  sendGetRequest('todoList', (responseText) => {
    todoListCollection.update(responseText);
    updateTitleItems();
  });
};
