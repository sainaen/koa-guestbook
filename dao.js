var fs = require('fs');
var Q = require('q');

var postsFile = './data/posts.json';

var readFile = Q.denodeify(fs.readFile);
var writeFile = Q.denodeify(fs.writeFile);

var parseJSON = function (str) {
  return JSON.parse(str);
};

var loadJSON = function (fname) {
  return readFile(fname, "utf-8").then(parseJSON);
};

var writeJSON = function (fname, obj) {
  return writeFile(fname, JSON.stringify(obj));
};

var savePosts = function (fname) {
  return function (posts) {
  	return writeJSON(fname, posts);
  };
};

var pager = function (num_at_page, page) {
  num_at_page = num_at_page || 20;
  page = page || 0;

  return function (list) {
	return list.slice(page*num_at_page, num_at_page);
  };
};

var appendPost = function (post) {
  return function (posts) {
	posts.unshift(post);
	return posts;
  };
};

module.exports = {
  getPosts: function () {
	return loadJSON(postsFile).then(pager());
  },
  savePost: function (post) {
	return loadJSON(postsFile).then(appendPost(post)).then(savePosts(postsFile));
  }
};
