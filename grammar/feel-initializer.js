/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
// initializer section start

// ast nodes are the constructors used to construct the ast for the parsed grammar
const ast = require('./feel-ast');

// adding build methods to prototype of each constructor
require('./feel-ast-parser')(ast);

// require all the built-in functions
// used to parse date
const utility = require('../utils/built-in-functions');

function extractOptional(optional, index) {
  return optional ? optional[index] : null;
}

function extractList(list, index) {
  return list.map(element => element[index]);
}

function buildList(head, tail, index) {
  return [head].concat(extractList(tail, index));
}

function buildBinaryExpression(head, tail, loc) {
  return tail.reduce((result, element) => new ast.ArithmeticExpressionNode(element[1], result, element[3], loc), head);
}

function buildComparisionExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    const operator = Array.isArray(element[1]) ? element[1][0] : element[1];
    return new ast.ComparisionExpressionNode(operator, result, element[3], null, loc);
  }, head);
}

function buildLogicalExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    let operator = element[1];
    if (operator === 'and') {
      operator = '&&';
    } else if (operator === 'or') {
      operator = '||';
    }
    return new ast.LogicalExpressionNode(operator, result, element[3], loc);
  }, head);
}

function parseDateTimeLiteral(head, tail, loc) {
  return utility[head](tail);
}
