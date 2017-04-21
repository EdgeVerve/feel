/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
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
