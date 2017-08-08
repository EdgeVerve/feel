/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const dateTime = require('./date-time-functions');
const list = require('./list-functions');
const boolean = require('./boolean-functions');
const relationFunctions = require('./loopback-relation-functions');

module.exports = Object.assign({}, dateTime, list, boolean, relationFunctions);
