const taskHtml = function (task) {
  return `
  <div class="task" id="${task.id}">
    <input class="tick-mark" type="checkbox" ${task.status ? 'checked' : ''}>
    <label>${task.text}</label>
    <a class='delete-link' href="">Delete</a>
  </div>
  <br>`;
};

const titleHtml = function (todo) {
  return `
  <h2 class="nav-item" id="${todo.id}" onclick="clickedTodo(event);">
    ${todo.title}
  </h2>`;
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
    <input id="task-text" type="text" placeholder=" Enter Task" required>
    <input id="task-button" type="button" value="Add Task" onclick="addTask();"/>`;

    const tasksHtml = todo.tasks ?
      todo.tasks.map((task) => taskHtml(task)).join('') : '';

    return tasksHtml + addTaskHtml;
  }
}
