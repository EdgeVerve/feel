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

const jsFeel = {
  decisionTable,
  feel,
  decisionLogic,
  decisionService,
};

jsFeel.init = function (settings) {
  const { logger } = settings;
  configureLogger(logger);
};

jsFeel.use = function (plugin) {
  plugin.call(this);
};

module.exports = () => jsFeel;
