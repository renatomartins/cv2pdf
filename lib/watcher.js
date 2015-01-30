'use strict';

var fs = require('fs');


function Watcher(file, callback) {
  this.file = file;
  this.callback = callback;
  this.watcher = null;
  this.timeout = null;
  this.previousTime = null;
  this.watch();
}


Watcher.prototype.watch = function () {
  try {
    this.watcher = fs.watch(this.file);
  } catch (err) {
    return this.callback(err);
  }

  var context = this;
  this.watcher.on('change', function () {
    context.onChange();
  });
  this.watcher.on('error', function (err) {
    context.callback(err);
  });
};


Watcher.prototype.rewatch = function () {
  this.watcher.close();
  this.watch();
};


Watcher.prototype.close = function () {
  this.watcher.close();
};


Watcher.prototype.onChange = function () {
  clearTimeout(this.timeout);
  var context = this;
  var handle = function () {
    fs.stat(context.file, function (err, stats) {
      if (err) {
        return context.callback(err);
      }
      // note that there is only millisecond-resolution as of node >= 0.11
      // https://github.com/joyent/node/issues/3284
      var currentTime = stats.mtime.getTime();
      if (currentTime === context.previousTime) {
        return context.rewatch();
      }
      context.previousTime = currentTime;
      context.callback();
      context.rewatch();
    });
  };
  this.timeout = setTimeout(handle, 10);
};


module.exports = function (file, callback) {
  return new Watcher(file, callback);
};
