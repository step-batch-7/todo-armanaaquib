class Todo {
  constructor (title, id, time, tasks) {
    this.title = title;
    this.time = time;
    this.tasks = tasks;
    this.id = id;
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
    const id = `todo-${this.todoList.length}`;
    const time = new Date();
    this.addTodo(new Todo(title, id, time, []));
  }

  toJSON() {
    return JSON.stringify(this.todoList);
  }
}

module.exports = {Todo, TodoList};
