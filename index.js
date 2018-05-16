/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const decisionTable = require('./utils/helper/decision-table');
const decisionLogic = require('./utils/helper/decision-logic');
const feel = require('./dist/feel');
const decisionService = require('./utils/helper/decision-service');
const { configureLogger } = require('./logger');
const feelSettings = require('./settings');

const jsFeel = {
  decisionTable,
  feel,
  decisionLogic,
  decisionService,
};

jsFeel.init = function (settings) {
  const { logger, enableLexerLogging, enableExecutionLogging, logResult } = settings;
  configureLogger(logger);
  if (enableExecutionLogging !== undefined) {
    feelSettings.enableExecutionLogging = enableExecutionLogging;
  }
  if (enableLexerLogging !== undefined) {
    feelSettings.enableLexerLogging = enableLexerLogging;
  }
  if (logResult !== undefined) {
    feelSettings.logResult = logResult;
  }
};

jsFeel.use = function (plugin) {
  plugin.call(this);
};

module.exports = () => jsFeel;
