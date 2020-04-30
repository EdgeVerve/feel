/*
*
*  ??2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const XLSX = require('xlsx');
const _ = require('lodash');
const tree = require('./decision-tree.js');

const rootMap = {};
const delimiter = '&SP';

const parseXLS = (path) => {
  const workbook = XLSX.readFile(path);
  const csv = [];
  workbook.SheetNames.forEach((sheetName) => {
    /* iterate through sheets */
    const worksheet = workbook.Sheets[sheetName];
    csv.push(XLSX.utils.sheet_to_csv(worksheet, { FS: delimiter }));
  });

  return csv;
};

const getFormattedValue = str => str.replace(/\"{2,}/g, '\"').replace(/^\"|\"$/g, '');

const parseContext = (csv) => {
  let context = {};
  let i = 1;

  for (; i < csv.length; i += 1) {
    const arr = csv[i].split(delimiter).filter(String);
    if (arr.length > 0 && arr[0] === 'RuleTable') {
      break;
    } else if (arr.length > 0) {
      const count = arr[1].split('"').length - 1;
      if (count > 0) {
        arr[1] = getFormattedValue(arr[1]);
      }
      context[arr[0]] = arr[1];
    }
  }
  context = Object.keys(context).length > 0 ? JSON.stringify(context).replace(/"/g, '').replace(/\\/g, '"') : '';
  return context.length > 0 ? context : null;
};

const preparePriorityList = (priorityClass, priorityValues) => {
  const priority = {};
  priorityClass.forEach((pClass, index) => {
    priority[pClass] = priority[pClass] || {};
    let p = 1;
    priorityValues[index].forEach((value) => {
      priority[pClass][value] = p;
      p += 1;
    });
  });
  return priority;
};

const calculatePriority = (priorityMat, outputs) => {
  const sortedPriority = _.sortBy(priorityMat, outputs);
  const rulePriority = {};
  sortedPriority.forEach((priority, index) => {
    const key = `Rule${priority.Rule}`;
    rulePriority[key] = index + 1;
  });
  return rulePriority;
};

const createDecisionTable = (commaSeparatedValue) => {
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
  let priority = {};
  const priorityMat = [];

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
  if (decisionTable.hitPolicy && decisionTable.hitPolicy.charAt(0) === 'C' && decisionTable.hitPolicy.charAt(1) !== '' && numOfActions > 1) {
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
        inputValuesSet[inputExpressionList[index]] = value.split(',').filter(String).map((inVal) => {
          let val = inVal;
          if (val.split('"').length - 1 > 0) {
            val = val.replace(/""/g, '\"');
          }
          return val;
        });
      } else {
        outputValuesList[index - numOfConditions] = [];
        outputValuesList[index - numOfConditions] = value.split(',').filter(String).map((outVal) => {
          let val = outVal;
          if (val.split('"').length - 1 > 0) {
            val = val.replace(/""/g, '\"');
          }
          return val;
        });
      }
    });
    if (decisionTable.hitPolicy === 'P' || decisionTable.hitPolicy === 'O') {
      priority = preparePriorityList(outputs, outputValuesList);
    }
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
    } else {
      const count = cellValue.split('"').length - 1;
      if (count > 0) {
        cellValue = cellValue.replace(/""/g, '\"').replace(/^\"|\"$/g, '');
      }
      if ((decisionTable.hitPolicy === 'P' || decisionTable.hitPolicy === 'O') && (index >= numOfConditions)) {
        priorityMat[decisionTable.ruleList.length] = priorityMat[decisionTable.ruleList.length] || {};
        priorityMat[decisionTable.ruleList.length].Rule = decisionTable.ruleList.length + 1;
        priorityMat[decisionTable.ruleList.length][outputs[index - numOfConditions]] = priority[outputs[index - numOfConditions]][cellValue] || 0;
      }
      if (index < numOfConditions && inputValuesSet[inputExpressionList[index]].indexOf(cellValue) === -1) {
        inputValuesSet[inputExpressionList[index]].push(cellValue);
      } else if (index >= numOfConditions && outputValuesList[index - numOfConditions].indexOf(cellValue) === -1) {
        outputValuesList[index - numOfConditions].push(cellValue);
        // problem in xls 0.10 is treated as 0.1 but string treats 0.10 as 0.10
      }
    }
    return cellValue;
  };

  for (; i < csv.length; i += 1) {
    let currentRuleRow = csv[i].split(delimiter).slice(1);
    currentRuleRow = currentRuleRow.map(processCellValue);
    if (currentRuleRow.length > 0) {
      decisionTable.ruleList.push(currentRuleRow);
      prevRuleRow = currentRuleRow;
    }
  }

  if (priorityMat.length > 0) {
    decisionTable.priorityList = calculatePriority(priorityMat, outputs);
  }

  Object.keys(inputValuesSet).forEach((classKey) => {
    decisionTable.inputValuesList.push(inputValuesSet[classKey].toString());
  });
  decisionTable.inputExpressionList = inputExpressionList;
  decisionTable.outputs = outputs;
  decisionTable.outputValues = outputValuesList;
  decisionTable.context = parseContext(csv);

  return decisionTable;
};

// function updateDecisionTable(id, csv) {
//   let table = {};

//   table = createDecisionTable(csv);
//   rootMap[id] = tree.createTree(table);

//   return table;
// }

const executeDecisionTable = (id, table, payload, cb) => {
  const graphName = payload.graphName;
  let rootMapId = id;
  if (graphName) {
    rootMapId = `${graphName}${id}`;
  }
  if (rootMap[rootMapId] == null || rootMap[rootMapId] === 'undefined') {
    try {
      rootMap[rootMapId] = tree.createTree(table);
    } catch (e) {
      cb(e);
      return;
    }
  }
  tree.traverseTree(rootMap[rootMapId], payload)
    .then(result => cb(null, result))
    .catch(err => cb(err));
};

module.exports = {
  csv_to_decision_table: createDecisionTable,
  xls_to_csv: parseXLS,
  execute_decision_table: executeDecisionTable,
};
