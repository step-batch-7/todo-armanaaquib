const fs = require('fs');
const querystring = require('querystring');

const {App} = require('./app');
const {loadTemplate} = require('./viewTemplate');

const MIME_TYPES = require('./mimeTypes.js');
const PUBLIC_FOLDER = `${__dirname}/../public`;

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

const app = new App();

app.get('', serveStaticPage);
app.get(/^\/$/, serveHomePage);
app.get('', notFound);
app.post('', readBody);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
