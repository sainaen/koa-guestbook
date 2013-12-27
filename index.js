var logger = require('koa-logger');
var parse = require('co-body');
var route = require('koa-route');
var koa = require('koa');

var app = koa();

var posts = [];

// logging
app.use(logger());

// routing
app.use(route.get('/', list));
app.use(route.post('/posts', create));

function* list() {
  this.body = JSON.stringify(posts);
}

function* create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.id = id;
  post.created_at = new Date();

  this.redirect('/');
}

app.listen(3000);
console.log('listening on port 3000');
