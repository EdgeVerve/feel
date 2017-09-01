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

module.exports = {
  decisionTable,
  feel,
  decisionLogic,
  decisionService
};
