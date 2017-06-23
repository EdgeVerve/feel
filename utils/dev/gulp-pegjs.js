/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const gutil = require('gulp-util');
const through = require('through2');
const pegjs = require('pegjs');

module.exports = function (opts) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-pegjs', 'Streaming not supported'));
      return;
    }

    const options = Object.assign({ output: 'source' }, opts);
    const filePath = file.path;

    try {
		    file.contents = new Buffer(pegjs.generate(file.contents.toString(), options));
		    file.path = gutil.replaceExtension(file.path, '.js');
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-pegjs', err, { fileName: filePath }));
    }

    cb();
  });
};
