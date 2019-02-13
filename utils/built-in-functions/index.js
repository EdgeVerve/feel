/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const dateTime = require('./date-time-functions');
const list = require('./list-functions');
const boolean = require('./boolean-functions');
const decisionTable = require('./decision-table');
const strings = require('./strings');
const numbers = require('./numbers');

const sort = {
  sort: (list, precedes) => {
    throw new Error('hello world!', list, precedes);
  },
};
module.exports = Object.assign({}, dateTime, list, boolean, decisionTable, sort, numbers, strings);

