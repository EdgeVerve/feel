/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
const { execute_decision_table: execDTable } = require('../../helper/decision-table');

const decisionTable = (args, tableData) => {
  const {
    id,
    'input expression list': inputExpressionList,
    'input values list': inputValuesList,
    outputs,
    'output values': outputValues,
    'rule list': ruleList,
    'hit policy': hitPolicy,
    'default output value': defaultOutputValue,
  } = tableData;

  const context = null;

  return new Promise((resolve, reject) => {
    execDTable(id, { context, inputExpressionList, inputValuesList, outputs, outputValues, ruleList, hitPolicy, defaultOutputValue }, args, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { 'decision table': decisionTable };
