/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

const gulp = require('gulp');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const insert = require('gulp-insert');
const clean = require('gulp-clean');
const peg = require('./utils/gulp-utils/gulp-pegjs');
const gulpif = require('gulp-if');
// var backtrace = require("./utils/gulp-utils/gulp-backtrace");
const minimist = require('minimist');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

const knownOptions = {
  string: 'expr',
  default: '',
};

const options = minimist(process.argv.slice(2), knownOptions);

gulp.task('initialize:feel', () => gulp.src('./grammar/feel-initializer.js')
		.pipe(insert.transform((contents, file) => {
  let initializer_start = '{ \n',
    initializer_end = '\n }';
  return initializer_start + contents + initializer_end;
}))
		.pipe(gulp.dest('./temp')));

gulp.task('concat:feel', ['initialize:feel'], () => gulp.src(['./temp/feel-initializer.js', './grammar/feel.pegjs'])
		.pipe(concat('feel.pegjs'))
		.pipe(gulp.dest('./src/')));


gulp.task('clean:temp', ['initialize:feel', 'concat:feel'], () => gulp.src('./temp', {
  read: false,
})
		.pipe(clean()));

gulp.task('clean:dist:feel', ['src:lint'], () => gulp.src('./dist/feel.js', {
  read: false,
})
		.pipe(clean()));

gulp.task('clean:dist:feel:ast', ['src:lint'], () => gulp.src('./dist/feel-ast*.js', {
  read: false,
})
		.pipe(clean()));

gulp.task('clean:src:feel', () => gulp.src('./src/feel.pegjs', {
  read: false,
})
		.pipe(clean()));

gulp.task('generate:parser',['clean:dist:feel'], () => gulp.src('src/feel.pegjs')
		.pipe(peg({
  format: 'commonjs',
  cache: true,
}))
		.pipe(gulp.dest('./dist')));

gulp.task('dist:feel:ast', ['clean:dist:feel:ast'], () => gulp.src('src/feel-ast.js')
		.pipe(gulp.dest('./dist')));

gulp.task('dist:feel:ast:parser', ['clean:dist:feel:ast'], () => gulp.src('src/feel-ast-parser.js')
		.pipe(gulp.dest('./dist')));


gulp.task('mocha', () => gulp.src(['test/*.js'], {
  read: false,
})
		.pipe(mocha({
  reporter: 'list',
}))
		.on('error', gutil.log));


gulp.task('lint', () => {
    return gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('src:lint', ()=>{
  return gulp.src(['src/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('utils:lint', ()=>{
  return gulp.src(['utils/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['initialize:feel', 'clean:src:feel', 'concat:feel', 'clean:temp']);

gulp.task('generate', ['generate:parser', 'dist:feel:ast', 'dist:feel:ast:parser']);

gulp.task('default', ['build', 'generate', 'mocha']);

gulp.task('watch', () => {
  gulp.watch('./grammar/*', ['build']);
  gulp.watch('./src/*.js', ['dist:feel:ast', 'dist:feel:ast:parser']);
  gulp.watch('./utils/*.js',['utils:lint']);
});


// gulp.task("generate:parser:trace", function() {
// 	var generate_condition = function() {
// 		if (options && options.g) {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	}
// 	return gulp.src('src/feel.pegjs')
// 		.pipe(gulpif(generate_condition, peg({
// 			trace: true,
// 			format: "commonjs"
// 		})))
// 		.pipe(gulpif(generate_condition, gulp.dest("./trace")));
// });

// gulp.task("backtrace", ["generate:parser:trace"], function() {
// 	var expr = options.expr;
// 	if (expr && typeof expr === 'string') {
// 		backtrace(expr);
// 	}
// });
