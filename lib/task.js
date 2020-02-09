class Task {
  constructor (text, id, status) {
    this.text = text;
    this.id = id;
    this.status = status;
  }

  static load(taskObj) {
    const {text, id, status} = taskObj;
    return new Task(text, id, status);
  }

  updateStatus(status) {
    this.status = status;
  }

  editText(newText) {
    this.text = newText;
  }
}

module.exports = {Task};
