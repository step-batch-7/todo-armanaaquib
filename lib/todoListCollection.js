const {TodoList} = require('./todoList');

class TodoListCollection {
  constructor (todoLists) {
    this.todoLists = todoLists;
  }

  static load(list) {
    const todoLists = list.map(TodoList.load);
    return new TodoListCollection(todoLists);
  }

  getNextTodoId() {
    const lastTodoList = this.todoLists[this.todoLists.length - 1];
    const idCount = lastTodoList ? +lastTodoList.id.split('-')[1] + 1 : 1;
    return `tl-${idCount}`;
  }

  getTodoList(id) {
    return this.todoLists.find((todoList) => todoList.id === id);
  }

  addTodoList(title) {
    const id = this.getNextTodoId();
    const todoList = new TodoList(title, id, []);
    this.todoLists.push(todoList);
  }

  removeTodoList(id) {
    const index = this.todoLists.findIndex((todoList) => todoList.id === id);
    this.todoLists.splice(index, 1);
  }

  editTitle(todoListId, newTitle) {
    const todoList = this.getTodoList(todoListId);
    todoList.editTitle(newTitle);
  }

  addTask(todoListId, taskText) {
    const todoList = this.getTodoList(todoListId);
    todoList.addTask(taskText);
  }

  removeTask(todoListId, taskId) {
    const todoList = this.getTodoList(todoListId);
    todoList.removeTask(taskId);
  }

  updateTaskStatus(todoListId, taskId, status) {
    const todoList = this.getTodoList(todoListId);
    todoList.updateTaskStatus(taskId, status);
  }

  toJSON() {
    return JSON.stringify(this.todoLists);
  }

  save(writer) {
    writer(this.toJSON(), 'utf8');
  }
}

module.exports = {TodoListCollection};
