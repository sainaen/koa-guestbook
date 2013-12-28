var moment = require('moment');
var logger = require('koa-logger');
var parse = require('co-body');
var route = require('koa-route');
var views = require('co-views');
var koa = require('koa');
var dao = require('./dao');

var app = koa();

var render = views('views', {
	ext: 'jade'
});

// logging
app.use(logger());

// routing
app.use(route.get('/', list));
app.use(route.get('/page/:page', list));
app.use(route.post('/posts', create));

function* list(page) {
	var pages = yield dao.getNumberOfPages(20);
	if (page && !(page > 0 && page <= pages)) {
		this.throw(404);
	} else {
		page = page ? page - 1 : 0;
		var posts = yield dao.getPosts(page, 20);

		this.body = yield render('index', {
			posts: posts,
			pages: pages,
			moment: moment
		});
	}
}

function* create() {
	var post = yield parse(this);
	post.created_at = new Date().getTime();
	post.author = post.author || "Anonymous";

	yield dao.savePost(post);
	this.redirect('/');
}

app.listen(3000);
console.log('listening on port 3000');
