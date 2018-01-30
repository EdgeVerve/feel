/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/**
 * All the library wide settings can be configured in this file.
 * This is a collection of the default settings.
*/
// const fs = require('fs');

// const logFile = fs.createWriteStream('output2.log');

module.exports = {
  logger: {
    name: 'js-feel',
    streams: [
      {
        stream: process.stdout,
        level: 'info',
      },
      // {
      //   stream: logFile,
      //   level: 'debug',
      // },
    ],
  },
  enableLexerLogging: false,
  enableExecutionLogging: false,
  logResult: false,
};
