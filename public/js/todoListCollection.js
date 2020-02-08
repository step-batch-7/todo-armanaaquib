/* eslint-disable no-unused-vars */
const taskHtml = function (task) {
  const doneStatus = task.status ? 'checked' : '';
  return `
  <div class="task" id="${task.id}">
    <div>
      <input type="checkbox" ${doneStatus} onclick="updateStatus(event);">
      <label>${task.text}</label>
    </div>
    <a class='delete-link' onclick="removeTask(event)">X</a>
  </div>
  <br>`;
};

const titleHtml = function (todoList) {
  return `
  <div class="nav-item" id="${todoList.id}">
    <h2 class="todo-title" onclick="clickedTodo(event);">${todoList.title}</h2>
    <a class='delete-link' onclick="removeTodo(event)">X</a>
  </div>`;
};

const isSearchedTitle = function (title, searchText) {
  return title.toLowerCase().includes(searchText.toLowerCase());
};

class TodoListCollection {
  constructor () {
    this.todoLists = [];
    this.currentTodoListId = '';
  }

  update(content) {
    this.todoLists = JSON.parse(content);
  }

  filterTodoLists(searchText) {
    return this.todoLists.filter((todoList) => isSearchedTitle(todoList.title, searchText));
  }

  filterTodoListHtml(searchText) {
    const filterTodoLists = this.filterTodoLists(searchText);
    const reverseFilterTodoLists = filterTodoLists.slice().reverse();
    return reverseFilterTodoLists.map((todoList) => titleHtml(todoList)).join('');
  }

  titlesHtml() {
    const reverseTodoLists = this.todoLists.slice().reverse();
    return reverseTodoLists.map((todoList) => titleHtml(todoList)).join('');
  }

  tasksHtml(id) {
    const todo = this.todoLists.find((todo) => todo.id === id);

    const searchBarHtml = `
    <input id="task-search" type="text" placeholder="Search Task" required>
    `;

    const addTaskHtml = `
    <input id="task-text" type="text" placeholder="Enter Task" required>
    <input id="task-button" type="button" value="Add Task" onclick="addTask();">
    `;

    let tasksHtml = todo.tasks ?
      todo.tasks.map((task) => taskHtml(task)).join('') : '';

    tasksHtml = `
    <div id="tasks-container">
      ${tasksHtml}
    </div>`;

    return searchBarHtml + tasksHtml + addTaskHtml;
  }
}
