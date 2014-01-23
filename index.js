var moment = require('moment');
var logger = require('koa-logger');
var serve = require('koa-static');
var parse = require('co-body');
var route = require('koa-route');
var views = require('co-views');
var etag = require('koa-etag');
var koa = require('koa');

var config = require('./config.json');
var dao = require('./dao');
var pager = require('./pager');

var app = koa();

var render = views('views', {
	ext: 'jade'
});

// logging
app.use(logger());

// static
app.use(etag());
app.use(serve('public'));

// routing
app.use(route.get('/', list));
app.use(route.get('/page/:page', list));
app.use(route.post('/', create));

function* list(page) {
	var pages = yield dao.getNumberOfPages(config.posts_at_page);
	if (page && !(page > 0 && page <= pages)) {
		this.throw(404);
	} else {
		var posts = yield dao.getPosts(config.posts_at_page, page || 1);
		var author = this.cookies.get('author');

		this.body = yield render('index', {
			pages: pager.paginate(page || 1, pages),
			posts: posts,
			author: (author ? decodeURIComponent(author) : config.default_author),
			moment: moment
		});
	}
}

function* create() {
	var post = yield parse(this);
	if (post.message.trim().length === 0) {
		this.throw(400, 'Please, provide a message');
	}
	post.created_at = new Date().getTime();
	post.author = post.author || config.default_author;

	yield dao.savePost(post);

	this.cookies.set('author', encodeURIComponent(author), { expires: moment().add('month', 1).toDate() });
	this.redirect('/');
}

app.listen(config.port);
console.log('listening on port ' + config.port);
