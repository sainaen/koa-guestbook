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

var postsFile = './data/posts.json';
var posts = require(postsFile);

// logging
app.use(logger());

// routing
app.use(route.get('/', list));
app.use(route.post('/posts', create));

function* list() {
  this.body = yield render('index', { posts: pager(posts) });
}

function* create() {
  var post = yield parse(this);
  post.created_at = new Date().getTime();
  post.author = "Anonymous";

  posts.unshift(post);
  save(posts);
  this.redirect('/');
}

function save(posts) {
  fs.writeFile(postsFile, JSON.stringify(posts), function ignore() {});
}

function pager(posts, count, padding) {
  count = count || 3;
  padding = padding || 0;
  return posts.slice(padding, padding + count);
}

app.listen(3000);
console.log('listening on port 3000');
