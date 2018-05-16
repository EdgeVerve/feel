/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/**
 * Creates a bunyan logger if no custom logger is passed to the configureLogger utility function.
*/

const bunyan = require('bunyan');
const { logger: loggerSettings } = require('./settings');

let logger = (name) => {
  const settings = Object.assign({}, loggerSettings, { name });
  const defaultLogger = bunyan.createLogger(settings);
  const levels = ['trace', 'info', 'warn', 'error', 'debug', 'fatal', 'ast'];
  const modifiedLogger = {};
  levels.forEach((level) => {
    modifiedLogger[level] = (...args) => {
      let _; // eslint-disable-line no-unused-vars
      let message;
      if (args.length === 2) {
        [_, message] = args;
      } else if (args.length === 1) {
        [message] = args;
      }
      defaultLogger[level](message);
    };
  });
  return modifiedLogger;
};

const configureLogger = (customLogger) => {
  logger = customLogger || logger;
};

module.exports = { configureLogger, logger: name => logger(name) };
