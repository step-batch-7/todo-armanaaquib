const {Task} = require('./task');

class TodoList {
  constructor (title, id, tasks) {
    this.title = title;
    this.id = id;
    this.tasks = tasks;
  }

  static load(todoObj) {
    const tasks = todoObj.tasks.map(Task.load);
    return new TodoList(todoObj.title, todoObj.id, tasks);
  }

  nextTaskId() {
    const lastTask = this.tasks[this.tasks.length - 1];
    const idCount = lastTask ? +lastTask.id.split('-')[1] + 1 : 1;
    return `task-${idCount}`;
  }

  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  addTask(text) {
    const id = this.nextTaskId();
    const task = Task.load({text, id, status: false});
    this.tasks.push(task);
  }

  removeTask(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    this.tasks.splice(index, 1);
  }

  updateTaskStatus(taskId, status) {
    const task = this.getTask(taskId);
    task.updateStatus(status);
  }
}

module.exports = {TodoList};
