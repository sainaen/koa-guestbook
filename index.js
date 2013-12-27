var logger = require('koa-logger');
var koa = require('koa');

var app = koa();

// logging
app.use(logger());

app.use(function* () {
  this.body = 'Hello, World!';
});

app.listen(3000);
console.log('listening on port 3000');
