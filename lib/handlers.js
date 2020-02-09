const fs = require('fs');
const {App} = require('./app');
const {TodoListCollection} = require('./todoListCollection');
const querystring = require('querystring');

const MIME_TYPES = require('./mimeTypes.js');
const STATUS_CODES = require('./httpStatusCodes');
const {TODO_LIST_STORE_PATH} = require('../config');
const PUBLIC_FOLDER = `${__dirname}/../public`;

const todoListsWriter = fs.writeFileSync.bind(null, TODO_LIST_STORE_PATH);

const doesFileExist = function (filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};

const getTodoList = function () {
  if (!doesFileExist(TODO_LIST_STORE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(TODO_LIST_STORE_PATH, 'utf8'));
};

const todoListCollection = TodoListCollection.load(getTodoList());

const notFound = function (req, res) {
  const responseText = '<h1>NOT FOUND</h1>';
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.setHeader('Content-Length', responseText.length);
  res.writeHead(STATUS_CODES.NOT_FOUND);
  res.end(responseText);
};

const methodNotAllowed = function (req, res) {
  res.writeHead(STATUS_CODES.METHOD_NOT_ALLOWED, 'Method Not Allowed');
  res.end();
};

const readBody = function (req, res, next) {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(data);
    }
    if (req.headers['content-type'] === 'application/json') {
      req.body = JSON.parse(data);
    }
    next();
  });
};

const getAbsolutePath = function (url) {
  const path = url === '/' ? '/index.html' : url;
  return PUBLIC_FOLDER + path;
};

const serveStaticPage = function (req, res, next) {
  const absolutePath = getAbsolutePath(req.url);
  if (!doesFileExist(absolutePath)) {
    next();
    return;
  }

  const [, extension] = absolutePath.match(/.*\.(.*)$/) || [];
  const contentType = MIME_TYPES[extension];

  const content = fs.readFileSync(absolutePath);

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const serveTodoList = function (req, res) {
  const todoListsJSON = todoListCollection.toJSON();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', `${todoListsJSON.length}`);
  res.end(todoListsJSON);
};

const addTodo = function (req, res) {
  const {titleText} = req.body;
  todoListCollection.addTodoList(titleText);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const removeTodo = function (req, res) {
  const {todoListId} = req.body;
  todoListCollection.removeTodoList(todoListId);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const addTask = function (req, res) {
  const {todoListId, taskText} = req.body;
  todoListCollection.addTask(todoListId, taskText);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const removeTask = function (req, res) {
  const {todoListId, taskId} = req.body;
  todoListCollection.removeTask(todoListId, taskId);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const updateTaskStatus = function (req, res) {
  const {todoListId, taskId, status} = req.body;
  todoListCollection.updateTaskStatus(todoListId, taskId, status);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const editTitle = function (req, res) {
  const {todoListId, newTitle} = req.body;
  todoListCollection.editTitle(todoListId, newTitle);
  todoListCollection.save(todoListsWriter);

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const app = new App();

app.get('', serveStaticPage);
app.get('/todoList', serveTodoList);
app.get('', notFound);
app.post('', readBody);
app.post('/addTodo', addTodo);
app.post('/addTask', addTask);
app.post('/removeTodo', removeTodo);
app.post('/removeTask', removeTask);
app.post('/updateTaskStatus', updateTaskStatus);
app.post('/editTitle', editTitle);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
