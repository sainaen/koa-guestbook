var logger = require('koa-logger');
var parse = require('co-body');
var route = require('koa-route');
var views = require('co-views');
var koa = require('koa');
var fs = require('fs');

var app = koa();

var render = views('views', {
  ext: 'jade'
});

var file = './data/posts.json';
var posts = require(file);

// logging
app.use(logger());

// routing
app.use(route.get('/', list));
app.use(route.post('/posts', create));

function* list() {
  this.body = yield render('index', { posts: posts });
}

function* create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.id = id;
  post.created_at = new Date().getTime();
  post.author = "Anonymous";

  save(posts);
  this.redirect('/');
}

function save(posts) {
  fs.writeFile(file, JSON.stringify(posts), function ignore() {});
}

app.listen(3000);
console.log('listening on port 3000');
