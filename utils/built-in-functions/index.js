/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const conversion = require('./conversion-functions');
const list = require('./list-functions');
const boolean = require('./boolean-functions');

module.exports = Object.assign({}, conversion, list, boolean);
