/*  
*  
*  ©2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/
const Tracer = require('pegjs-backtrace');
const Parser = require('../../trace/feel');
module.exports = function (text) {
  console.log(text);
	// var tracer = new Tracer(text); // input text is required.

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
