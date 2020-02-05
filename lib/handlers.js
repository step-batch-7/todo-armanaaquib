const fs = require('fs');
const {App} = require('./app');
const {loadTemplate} = require('./viewTemplate');
const {TodoList} = require('./todo');

const MIME_TYPES = require('./mimeTypes.js');
const STATUS_CODES = require('./httpStatusCodes');
const PUBLIC_FOLDER = `${__dirname}/../public`;
const TODO_LIST_STORE_PATH = `${__dirname}/../data/todoList.json`;

const doesNotFileExist = function (path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const getTodoList = function () {
  if (doesNotFileExist(TODO_LIST_STORE_PATH)) {
    return '[]';
  }
  return fs.readFileSync(TODO_LIST_STORE_PATH, 'utf8');
};

const todoList = TodoList.load(getTodoList());

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
    req.body = data;
    next();
  });
};

const serveStaticPage = function (req, res, next) {
  const absolutePath = PUBLIC_FOLDER + req.url;
  if (doesNotFileExist(absolutePath)) {
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

const serveHomePage = function (req, res) {
  const homePage = loadTemplate('index.html', {});
  res.setHeader('Content-Type', MIME_TYPES.html);
  res.setHeader('Content-Length', homePage.length);
  res.end(homePage);
};

const addTodo = function (req, res) {
  const title = req.body;
  todoList.loadTodo(title);

  fs.writeFileSync(TODO_LIST_STORE_PATH, todoList.toJSON(), 'utf8');

  res.writeHead(STATUS_CODES.CREATED, {'Content-Length': 0});
  res.end();
};

const serveTodoList = function (req, res) {
  const todoListJSON = todoList.toJSON();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', `${todoListJSON.length}`);
  res.end(todoListJSON);
};

const app = new App();

app.get('', serveStaticPage);
app.get('/todoList', serveTodoList);
app.get(/^\/$/, serveHomePage);
app.get('', notFound);
app.post('', readBody);
app.post('/addTodo', addTodo);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
