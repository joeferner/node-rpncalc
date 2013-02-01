'use strict';

var express = require('express');
var browserify = require('browserify');
var path = require('path');
var lessMiddleware = require('less-middleware');
var Rpncalc = require('./rpncalc');

module.exports = function(opts) {
  return new Server(opts);
};

var Server = function(opts) {
  this.opts = opts || {};
  this.opts.port = this.opts.port || 8080;
  this.app = express();

  this.app.rpncalc = new Rpncalc();
  this.app.set('views', path.resolve(__dirname, '../web/views'));
  this.app.set('view engine', 'ejs');
  this.app.use(lessMiddleware({
    src: path.resolve(__dirname, '../web/public'),
    compress: false
  }));
  this.app.use(express.static(path.resolve(__dirname, '../components')));
  this.app.use(express.static(path.resolve(__dirname, '../web/public')));
  this.app.use(express.bodyParser());
  require('./routes')(this.app);

  this.app.listen(this.opts.port);
  console.log('listening http://localhost:' + this.opts.port);

  return this;
};