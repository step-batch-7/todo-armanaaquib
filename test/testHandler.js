const req = require('supertest');

const {app} = require('../lib/handlers');

describe('Home Page', function () {

  it('should return home page for /', function (done) {
    req(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect(/<title>TODO<\/title>/);
  });

});

describe('Static Page', function () {

  it('should return a public css file', function (done) {
    req(app.serve.bind(app))
      .get('/css/index.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css', done)
      .expect(/body{/);
  });

  it('should return a public js file', function (done) {
    req(app.serve.bind(app))
      .get('/js/todo.js')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/javascript', done);
  });

});
