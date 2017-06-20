/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
const Tracer = require('pegjs-backtrace');
const Parser = require('../../trace/feel');
module.exports = function (text) {
  console.log(text);

  const tracer = new Tracer(text, {
	  useColor: true,
	  showTrace: true,
  });

  try {
	    Parser.parse(text, { tracer });
  } catch (e) {
	    console.log(tracer.getBacktraceString());
  }
};
