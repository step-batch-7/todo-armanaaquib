const taskHtml = function (task) {
  return `
  <div class="task" id="${task.id}">
    <div>
      <input type="checkbox" ${task.status ? 'checked' : ''} onclick="updateStatus(event);">
      <label>${task.text}</label>
    </div>
    <a class='delete-link' onclick="removeTask(event)">X</a>
  </div>
  <br>`;
};

const titleHtml = function (todo) {
  return `
  <div class="nav-item" id="${todo.id}">
    <h2 class="todo-title" onclick="clickedTodo(event);">${todo.title}</h2>
    <a class='delete-link' onclick="removeTodo(event)">X</a>
  </div>`;
};

class TodoList {
  constructor (todoList) {
    this.todoList = todoList;
  }

  static load(content) {
    const list = JSON.parse(content);
    const todoList = new TodoList(list);
    return todoList;
  }

  titlesHtml() {
    const reverseTodoList = this.todoList.slice().reverse();
    return reverseTodoList.map((todo) => titleHtml(todo)).join('');
  }

  tasksHtml(id) {
    const todo = this.todoList.find((todo) => todo.id === id);

    const addTaskHtml = `
    <input id="task-text" type="text" placeholder="Enter Task" required>
    <input id="task-button" type="button" value="Add Task" onclick="addTask();"/>`;

    const tasksHtml = todo.tasks ?
      todo.tasks.map((task) => taskHtml(task)).join('') : '';

    return tasksHtml + addTaskHtml;
  }

  get lastTodo() {
    return this.todoList[this.todoList.length - 1];
  }
}
