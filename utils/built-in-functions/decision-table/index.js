const { execute_decision_table: execDTable } = require('../../helper/decision-table');

const decisionTable = (context, tableData) => {
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

  return new Promise((resolve, reject) => {
    execDTable(id, {inputExpressionList, inputValuesList, outputs, outputValues, ruleList, hitPolicy, defaultOutputValue }, context, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { 'decision table': decisionTable };
