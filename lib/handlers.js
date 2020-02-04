const fs = require('fs');
const querystring = require('querystring');

const {App} = require('./app');
const {loadTemplate} = require('./viewTemplate');

const MIME_TYPES = require('./mimeTypes.js');
const PUBLIC_FOLDER = `${__dirname}/../public`;
const TODO_LIST_STORE_PATH = `${__dirname}/../data/todoList.json`;

const notFound = function (req, res) {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  const statusCode = 400;
  res.writeHead(statusCode, 'Method Not Allowed');
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

const doesNotFileExist = function (path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticPage = function (req, res, next) {
  const absolutePath = PUBLIC_FOLDER + req.url;
  console.log(absolutePath);
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

const getTodoList = function () {
  if (doesNotFileExist(TODO_LIST_STORE_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(TODO_LIST_STORE_PATH), 'utf8');
}

const addTitle = function (req, res) {
  const todoList = getTodoList();
  const title = req.body;
  const time = new Date();

  const todo = {
    title,
    time,
    tasks: [],
  }

  todoList.push(todo);
  fs.writeFileSync(TODO_LIST_STORE_PATH, JSON.stringify(todoList), 'utf8');

  res.writeHead(201, {'Content-Length': 0});
  res.end();
};

const serveTodoList = function (req, res) {
  const todoListAsString = JSON.stringify(getTodoList());
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', `${todoListAsString.length}`);
  res.end(todoListAsString);
};

const app = new App();

app.get('', serveStaticPage);
app.get('/todoList', serveTodoList);
app.get(/^\/$/, serveHomePage);
app.get('', notFound);
app.post('', readBody);
app.post('/addTitle', addTitle)
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
