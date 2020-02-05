class Todo {
  constructor (title, id, time, tasks) {
    this.title = title;
    this.id = id;
    this.time = time;
    this.tasks = tasks;
  }

  addTask(text) {
    const id = `task-${new Date().getTime()}`;
    this.tasks.push({text, id, status: false});
  }

  removeTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    this.tasks.splice(taskIndex, 1);
  }

  updateTaskStatus(taskId, status) {
    const task = this.tasks.find((task) => task.id === taskId);
    task && (task.status = status);
  }
}

class TodoList {
  constructor () {
    this.todoList = [];
  }

  addTodo(todo) {
    this.todoList.push(todo);
  }

  static load(content) {
    const list = JSON.parse(content);
    const todoList = new TodoList();

    list.forEach(todo => {
      const {title, id, time, tasks} = todo;
      todoList.addTodo(new Todo(title, id, time, tasks));
    });

    return todoList;
  }

  loadTodo(title) {
    const id = `todo-${new Date().getTime()}`;
    const time = new Date();
    this.addTodo(new Todo(title, id, time, []));
  }

  findTodo(todoId) {
    return this.todoList.find((todo) => todo.id === todoId);
  }

  removeTodo(todoId) {
    const todoIndex = this.todoList.findIndex((todo) => todo.id === todoId);
    this.todoList.splice(todoIndex, 1);
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }
}

module.exports = {TodoList};
