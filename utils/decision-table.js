/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const XLSX = require('xlsx');
const tree = require('./decision-tree.js');
// const hitPolicy = require('./hit-policy.js');
const rootMap = {};
const delimiter = '&SP';

function parseXLS(path) {
  const workbook = XLSX.readFile(path);
  const csv = [];
  workbook.SheetNames.forEach((sheetName) => {
 /* iterate through sheets */
    const worksheet = workbook.Sheets[sheetName];
    csv.push(XLSX.utils.sheet_to_csv(worksheet, { FS: delimiter }));
  });

  return csv;
}

function parseContext(csv) {
  let context = {};
  let i = 1;

  for (; i < csv.length; i += 1) {
    const arr = csv[i].split(delimiter).filter(String);
    if (arr.length > 0 && arr[0] === 'RuleTable') {
      break;
    } else if (arr.length > 0) {
      const count = arr[1].split('"').length - 1;
      if (count > 0) {
        arr[1] = arr[1].replace(/"/g, '');
        arr[1] = `"${arr[1]}"`;
      }
      context[arr[0]] = arr[1];
    }
  }
  context = Object.keys(context).length > 0 ? JSON.stringify(context).replace(/"/g, '').replace(/\\/g, '"') : '';
  return context.length > 0 ? context : null;
}

function createDecisionTable(commaSeparatedValue) {
  const decisionTable = {};
  decisionTable.inputExpressionList = [];
  decisionTable.inputValuesList = [];
  decisionTable.outputs = [];
  decisionTable.outputValues = [];
  decisionTable.ruleList = [];

  const inputExpressionList = [];
  let outputs = [];
  const inputValuesSet = {};
  const outputValuesList = [];
  let outputLabel = false;

  const csv = commaSeparatedValue.split('\n');

  let numOfConditions = 0;
  let numOfActions = 0;
  let i = 0;
  const conditionActionFilter = (elem) => {
    if (elem === 'Condition') {
      numOfConditions += 1;
    } else if (elem === 'Action') {
      numOfActions += 1;
    }
  };

  for (;i < csv.length; i += 1) {
    const arr = csv[i].split(delimiter);
    if (arr[0] === 'RuleTable') {
      arr.forEach(conditionActionFilter);
      break;
    }
  }

  i += 1;
  const classArr = csv[i].split(delimiter);
  decisionTable.hitPolicy = classArr[0];

    // input and output classes
  classArr.slice(1).every((classValue, index) => {
    if (index < numOfConditions) {
      inputExpressionList.push(classValue);
    } else {
      if (classValue === '') {
        outputLabel = true;
        return false;
      }
      outputs.push(classValue);
    }
    return true;
  });
  i += 1;
  let values = csv[i].split(/&SP(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    // if there is a output label which contains the output component names
  if (outputLabel) {
    outputs = [];
    numOfActions = 0;
    values = values.filter(String);// removes all blank strings from array
    values.forEach((action) => {
      numOfActions += 1;
      outputs.push(action);
    });
    i += 1;
    values = csv[i].split(/&SP(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
  }
    // "Collect" Hit Policy Check
  if (decisionTable.hitPolicy.charAt(0) === 'C' && numOfActions > 1) {
    throw new Error({
      hitPolicy: decisionTable.hitPolicy,
      actionItems: numOfActions,
      message: 'Hit policy violation, collect operator is undefined over multiple outputs',
    });
  }

    // input and output values
  if (values[0] === '') {
    values.slice(1).forEach((classValue, index) => {
      let value = classValue;
      value = value.replace(/(^")|("$)/g, '');
      if (index < numOfConditions) {
        inputValuesSet[inputExpressionList[index]] = value.split(',').filter(String);
      } else {
        outputValuesList[index - numOfConditions] = [];
        outputValuesList[index - numOfConditions] = value.split(',').filter(String).map((outVal) => {
          let val = outVal;
          if (val.split('"').length - 1 > 0) {
            val = val.replace(/"/g, '');
            val = `"${val}"`;
          }
          return val;
        });
      }
    });
    i += 1;
  } else {
    inputExpressionList.forEach((condition) => {
      inputValuesSet[condition] = [];
    });
    outputs.forEach((action, i) => {
      outputValuesList[i] = [];
    });
  }

// rulelist
  let prevRuleRow = [];

  const processCellValue = (value, index) => {
    let cellValue = value;
    if (cellValue === '') {
      cellValue = prevRuleRow[index];
    }
    const count = cellValue.split('"').length - 1;
    if (count > 0) {
      cellValue = cellValue.replace(/"/g, '');
      cellValue = `"${cellValue}"`;
    }
    if (index < numOfConditions && inputValuesSet[inputExpressionList[index]].indexOf(cellValue) === -1) {
      inputValuesSet[inputExpressionList[index]].push(cellValue);
    } else if (index >= numOfConditions && outputValuesList[index - numOfConditions].indexOf(cellValue) === -1) {
      outputValuesList[index - numOfConditions].push(cellValue);
                // problem in xls 0.10 is treated as 0.1 but string treats 0.10 as 0.10
    }
    return cellValue;
  };

  for (; i < csv.length; i += 1) {
    let currentRuleRow = csv[i].split(delimiter).slice(1);// csv[i].split(",").slice(1);
    currentRuleRow = currentRuleRow.map(processCellValue);
    if (currentRuleRow.length > 0) {
      decisionTable.ruleList.push(currentRuleRow);
      prevRuleRow = currentRuleRow;
    }
  }

  Object.keys(inputValuesSet).forEach((classKey) => {
    decisionTable.inputValuesList.push(inputValuesSet[classKey].toString());
  });
  decisionTable.inputExpressionList = inputExpressionList;
  decisionTable.outputs = outputs;
  decisionTable.outputValues = outputValuesList;
  decisionTable.context = parseContext(csv);
    // if (decisionTable["hitPolicy"] === "P" || decisionTable["hitPolicy"] === "O") {
    //    var priorityList = getPriorityList(outputValuesList);
    // }
  return decisionTable;
}

// function updateDecisionTable(id, csv) {
//   let table = {};

//   table = createDecisionTable(csv);
//   rootMap[id] = tree.createTree(table);

//   return table;
// }

function executeDecisionTable(id, table, payload, cb) {
  if (rootMap[id] == null || rootMap[id] === 'undefined') {
    rootMap[id] = tree.createTree(table);
  }
  tree.traverseTree(rootMap[id], payload, cb);
}

module.exports = {
  csv_to_decision_table: createDecisionTable,
  xls_to_csv: parseXLS,
  execute_decision_table: executeDecisionTable,
};
