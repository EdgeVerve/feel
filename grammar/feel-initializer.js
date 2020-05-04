/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */
// initializer section start

// ast nodes are the constructors used to construct the ast for the parsed grammar
const ast = require('./feel-ast');
// const { enableLexerLogging } = require('../settings');

// const {logger} = require('../logger');
// adding build methods to prototype of each constructor
require('./feel-ast-parser')(ast);
// const _log = logger('feel-grammer-parser');
// let loggerOptions;
// function log(msg) {
//   loggerOptions = options.loggerOptions || {};
//   if (enableLexerLogging) {
//     _log.debug(loggerOptions, msg)
//   }
// };

function log() {
  // empty function
}

let initialized = false;
let ruleName = 'default';

function rule() {
  if (!initialized) {
    ruleName = options.ruleName
    initialized = true
  }
  return ruleName;
}

function extractOptional(optional, index) {
  //log('_extractOptional');
  return optional ? optional[index] : null;
}

function flatten(list) {
  //log('_flatten');
  return list.filter( d => d && d.length).reduce((recur, next) => {
    if(next && Array.isArray(next)) {
      return [].concat.call(recur, flatten(next));
    }
    return [].concat.call(recur, next);
  }, []);
}

function extractList(list, index) {
  //log('_extractList');
  return list.map(element => element[index]);
}

function buildList(head, tail, index) {
  //log('_buildList')
  return [head].concat(extractList(tail, index));
}

function buildName(head, tail, index) {
  //log('_buildName');
  return tail && tail.length ? [...head, ...flatten(tail)].join("") : head.join("");
}


function buildBinaryExpression(head, tail, loc, text, rule) {
  //log('_buildBinaryExpression');
  return tail.reduce((result, element) => new ast.ArithmeticExpressionNode(element[1], result, element[3], loc, text, rule), head);
}

function buildComparisionExpression(head, tail, loc, text, rule) {
  //log('_buildComparisionExpression');
  return tail.reduce((result, element) => {
    const operator = Array.isArray(element[1]) ? element[1][0] : element[1];
    return new ast.ComparisionExpressionNode(operator, result, element[3], null, loc, text, rule);
  }, head);
}

function buildLogicalExpression(head, tail, loc, text, rule) {
  //log('_buildLogicalExpression');
  return tail.reduce((result, element) => {
    let operator = element[1];
    if (operator === 'and') {
      operator = '&&';
    } else if (operator === 'or') {
      operator = '||';
    }
    return new ast.LogicalExpressionNode(operator, result, element[3], loc, text, rule);
  }, head);
}

