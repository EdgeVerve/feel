/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const XLSX = require('xlsx');
const _ = require('lodash');
const tree = require('./decision-tree.js');

let api;
const rootMap = {};
const delimiter = '&SP';
const rowDelimiter = '&RSP';

const rgxBlankRows = /^(&SP)+&RSP/; // for beginning blank rows

const parseXLS = (path) => {
  let workbook;
  if (typeof path === 'string') {
    workbook = XLSX.readFile(path);
  } else {
    workbook = path;
  }

  const csv = [];
  workbook.SheetNames.forEach((sheetName) => {
 /* iterate through sheets */
    const worksheet = workbook.Sheets[sheetName];
    const csvString = XLSX.utils.sheet_to_csv(worksheet, { FS: delimiter, RS: rowDelimiter, blankrows: false });

    csv.push({
      [sheetName]: csvString.replace(rgxBlankRows, ''),
    });
  });

  return csv;
};

const rCsvString = /"""(\w+)"""/;
const rCsvStringType3 = /(""\w+""\s*,?\s*)+/;
const rCsvStringType5 = /^"(""[^"]*""(\s*,?\s*)?)+"$/;
const rCaptureQuotes = /""([^"]+)""/g;
const rTrailingSpaceCommas = /(\s*)?,(\s*)?/g;
// const rCsvStingType6 = /[.]+\s*,\s*/
// const noop = function () {};

function isCsvString(testString) {
  return rCsvString.test(testString);
}

function isType2String(testString) {
  return testString[0] === '"' && testString[testString.length - 1] === '"';
}

function isType3String(testString) {
  return rCsvStringType3.test(testString);
}

function isType4String(testString) {
  return testString.indexOf('"') === -1
    && testString.indexOf(',') > -1
    && /[<>\+\-=\/\^\.]/.test(testString); // TODO: may need to add more operators here
}

function processString(inputString) {
  if (isCsvString(inputString)) {
    return `"${inputString.match(rCsvString)[1]}"`;
  } else if (isType3String(inputString)) {
    return inputString.replace(/""(\w+)""/g, (_, value) => `*${value}*`)
      .replace(/"/g, '')
      .replace(/\*/g, '"')
      .replace(/\s/g, '');
      // .split(',');
  } else if (isType2String(inputString)) {
    return inputString.substring(1, inputString.length - 1).replace(/""/g, '"');
  } else if (isType4String(inputString)) {
    return inputString.replace(/\s/g, '').split(',');
  }

  return inputString;
}

function processContextString(inputString) {
  if (isType2String(inputString)) {
    return inputString.substring(1, inputString.length - 1).replace(/""/g, '"');
  }
  return inputString;
}

function processValueString(inputString) {

  //check for string of type """s1"",""s2"",""s3"""
  if (rCsvStringType5.test(inputString)) {
    return inputString
      .replace(rCaptureQuotes, (_, val) => val)
      .replace(rTrailingSpaceCommas, ',')
      .split(',').map(s => '\'' + s + '\'')
  }
  else if (inputString.indexOf(',') > -1) { // val1, val2, val3, ...
    return inputString.split(/\s*,\s*/)
  }

}

const parseInvocationFromCsv = function (csvString) {
  const lines = csvString.split(rowDelimiter);
  const { generateContextString } = api._;
  const fnName = lines[1].split(delimiter)[0];
  const entries = [];
  for (let i = 2; i < lines.length; i += 1) {
    const fields = lines[i].split(delimiter);
    if (fields[0].length) { // to avoid blank lines
      entries.push(`${fields[0]} : ${processContextString(fields[1])}`);
    }
  }

  return `${fnName} (${generateContextString(entries, 'list')})`;
};

function parseDecisionTableFromCsv(csvString) {
  const qualifiedName = csvString.substring(0, csvString.indexOf(delimiter));
  const csvArray = csvString.split(rowDelimiter);
  const contextEntries = [];
  const dto = {}; // decision table object representation
  const { generateContextString } = api._;

  let i = 1;
  let line = csvArray[i];

  // 0. parsing context stuff if any
  let hasContext = false;
  while (!line.startsWith('RuleTable')) {
    const fields = line.split(delimiter);
    const tokensCount = fields.filter(token => token.length).length;
    if (tokensCount > 1) {
      contextEntries.push({
        [fields[0]]: processContextString(fields[1]),
      });
    }
    i += 1;
    line = csvArray[i];
    hasContext = true;
  }

  // 1. Parse the rule table

  let components = line.split(delimiter);

  // 1.1 determine number of input components
  const conditionCount = components.filter(c => c === 'Condition').length;

  // 1.2 get the input expressions & hit policy
  i += 1;
  line = csvArray[i];
  components = line.split(delimiter);
  dto.hitPolicy = components[0];
  const inputExpressionList = [];
  // 1.2.1 loop though the rule table line to get input expressions
  for (let j = 1; j < components.length; j += 1) {
    if (j <= conditionCount) {
      inputExpressionList.push(components[j]);
    } else {
      dto.outputs = components[j];
    }
  }

  dto.inputExpressionList = generateContextString(inputExpressionList, false);

  // 1.2.1 detect if you have input/output components and process them
  line = csvArray[i + 1];
  const inputValuesList = [];
  const outputValuesList = [];
  components = line.split(delimiter);
  if (components[0].length === 0) {
    //! you have some input/output values here
    let k;
    let l;
    // let lst;
    for (k = 1, l = components.length; k < l; k += 1) {
      // lst = []
      if (k <= conditionCount) {
        //! input values list
        inputValuesList.push(components[k].length ? processValueString(components[k]) : []);
      } 
      else {
        outputValuesList.push(components[k].length ? processValueString(components[k]) : []);
      }
    }
    i += 1; // next line
  }

  // 1.3 populate the rule list
  const ruleList = [];
  const tmp = {};

  for (i += 1; i < csvArray.length; i += 1) {
    const conditionList = [];
    line = csvArray[i];
    components = line.split(delimiter);
    for (let j = 1; j < components.length; j += 1) {
      const token = components[j];
      if (token.length) {
        tmp[j] = processString(token);
        conditionList.push(tmp[j]);
      } else {
        conditionList.push(tmp[j]);
      }
    }
    // components[0] ? ruleList.push(conditionList) : noop();
    if (components[0]) {
      ruleList.push(conditionList);
    }
  }

  dto.ruleList = generateContextString(ruleList.map(cl => generateContextString(cl, false)), 'csv');

  // 2. generating the context entry object for decision arguments
  const contextEntry = [
    `outputs : \"${dto.outputs}\"`,
    {
      'input expression list': dto.inputExpressionList,
      'rule list': dto.ruleList,
    },
    `id : '${qualifiedName}'`,
    `hit policy: \"${dto.hitPolicy}\"`,
  ];

  if (inputValuesList.length || outputValuesList.length) {
    contextEntry.push({
      'input values list': generateContextString(inputValuesList.map(i => generateContextString(i, false)), 'csv'),
      'output values': generateContextString(outputValuesList.map(i => generateContextString(i, false)), 'csv'),
    });
  }

  const dtContextString = generateContextString(contextEntry, 'list');

  // 3. final context entry
  if (hasContext) {
    contextEntries.push({
      result: `decision table(${dtContextString})`,
    });

    return contextEntries;
  }

  return `decision table(${dtContextString})`;
}
// const getFormattedValue = str => str.replace(/\"{2,}/g, '\"').replace(/^\"|\"$/g, '');
function parseBoxedContextWithoutResultFromCsv(csvString) {
  const lines = csvString.split(rowDelimiter);
  let i;
  let j;
  const entries = [];
  for (i = 1, j = lines.length; i < j; i += 1) {
    const fields = lines[i].split(delimiter);
    if (fields.filter(f => f.length).length) {
      if (fields[0].length) {
        entries.push(`${fields[0]} : ${processContextString(fields[1])}`);
      }
    }
  }
  return entries;
}

function parseBoxedContextWithResultFromCsv(csvString) {
  const csvArray = csvString.split(rowDelimiter);
  let line;
  let i;
  let j;
  const entries = [];
  for (i = 1, j = csvArray.length; i < j; i += 1) {
    line = csvArray[i];
    if (!line.startsWith('(')) {
      const fields = line.split(delimiter);
      if (fields[0].length && fields.filter(f => f.length).length > 1) {
        entries.push(`${fields[0]} : ${processContextString(fields[1])}`);
      } else if (fields[0].length) {
        entries.push(`result : ${processContextString(fields[0])}`);
      }
    }
  }
  return entries;
}

function parseBusinessModelFromCsv(csvString) {
  const csvArray = csvString.split(rowDelimiter);
  // const i = 1;

  const contextEntries = [];

  csvArray.slice(1).forEach((line) => {
    const fields = line.split(delimiter);

    // TODO handle complex cases
    const tokensCount = fields.filter(token => token.length).length;
    if (tokensCount > 1) {
      contextEntries.push({ [fields[0]]: fields[1] });
    } else if (tokensCount === 1) {
      contextEntries.push(fields[0]);
    }
  });
  return contextEntries;
}

const makeContextObject = (csvExcel) => {
  // Convention: context entries are vertical
  // Convention: decision table entries are horizontal

  const qualifiedName = csvExcel.substring(0, csvExcel.indexOf(delimiter));

  const {
    isDecisionTableModel,
    generateContextString,
    isBoxedInvocation,
    isBoxedContextWithResult,
    isBoxedContextWithoutResult,
  } = api._;

  // var csvArray = csvExcel.split('\n');
  let contextEntries;
  if (isDecisionTableModel(csvExcel)) {
    contextEntries = parseDecisionTableFromCsv(csvExcel);
  } else if (isBoxedInvocation(csvExcel)) {
    contextEntries = parseInvocationFromCsv(csvExcel);
  } else if (isBoxedContextWithResult(csvExcel)) {
    contextEntries = parseBoxedContextWithResultFromCsv(csvExcel);
  } else if (isBoxedContextWithoutResult(csvExcel)) {
    contextEntries = parseBoxedContextWithoutResultFromCsv(csvExcel);
  } else {
    contextEntries = parseBusinessModelFromCsv(csvExcel);
  }

  const expression = generateContextString(contextEntries);

  return {
    qn: qualifiedName,
    expression,
  };
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

  const csv = commaSeparatedValue.split(rowDelimiter);

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
  // decisionTable.context = parseContext(csv);

  return decisionTable;
};

// function updateDecisionTable(id, csv) {
//   let table = {};

//   table = createDecisionTable(csv);
//   rootMap[id] = tree.createTree(table);

//   return table;
// }

const executeDecisionTable = (id, table, payload, cb) => {
  if (rootMap[id] == null || rootMap[id] === 'undefined') {
    rootMap[id] = tree.createTree(table);
  }
  tree.traverseTree(rootMap[id], payload, cb);
};


const parseCsvToJson = function (csvArr) {
  return csvArr.reduce((hash, item) => {
    const keys = Object.keys(item);
    return Object.assign({}, hash, { [keys[0]]: item[keys[0]] });
  }, {});
};

const isDecisionTableModel = function (csvString) {
  return csvString.indexOf('RuleTable') > -1;
};

const generateJsonFEEL = function (jsonCsvObject) {
  // const jsonFeel = {};
  const { _: { makeContext, isDecisionService } } = api;
  const services = Object.values(jsonCsvObject)
    .filter(csv => isDecisionService(csv))
    .map(csv => csv.substring(0, csv.indexOf(delimiter)));

  return Object.keys(jsonCsvObject).reduce((hash, key) => {
    const csvModel = jsonCsvObject[key];
    const ctx = makeContext(csvModel);
    // hash[ctx.qn] = ctx.expression;
    // return hash;
    return Object.assign({}, hash, { [ctx.qn]: ctx.expression });
  }, {});
};

const parseWorkbook = function (path) {
  const { parseXLS, parseCsv } = api._;

  const jsonCsv = parseCsv(parseXLS(path));

  return generateJsonFEEL(jsonCsv);
};

const generateContextString = function (contextEntries, isRoot = true) {
  const stringArray = [];
  let feelType = 'string'; // we'll assume default as string entry
  // const override = false;

  if (typeof contextEntries === 'object' && Array.isArray(contextEntries)) {
    //! process array entries
    feelType = 'array';
    contextEntries.forEach((entry) => {
      // var feelEntry = generateContextString(entry, false);
      // stringArray.push(feelEntry)
      let feelEntry;
      if (isRoot) {
        feelEntry = generateContextString(entry);
      } else {
        feelEntry = generateContextString(entry, false);
      }
      stringArray.push(feelEntry);
    });
  } else if (typeof contextEntries === 'object' && !Array.isArray(contextEntries)) {
    //! process object entries

    feelType = 'object';

    const contextKeys = Object.keys(contextEntries);
    contextKeys.forEach((key) => {
      const feelEntry = generateContextString(contextEntries[key], false);
      stringArray.push(`${key} : ${feelEntry}`);
    });
  } else {
    //! default as string
    console.assert(typeof contextEntries === 'string', 'Expected context entry to be a string');
    // stringArray.push(contextEntries)
  }

  if (feelType === 'object') {
    if (typeof isRoot === 'string' && isRoot === 'csv') {
      return stringArray.join(',');
    } else if (typeof isRoot === 'boolean' && isRoot) {
      return stringArray.join(',');
    }

    return `{${stringArray.join(',')}}`;
  } else if (feelType === 'array') {
    if (typeof isRoot === 'string' && isRoot === 'csv') {
      return `[${stringArray.join(',')}]`;
    } else if (typeof isRoot === 'string' && isRoot === 'list') {
      return stringArray.join(',');
    } else if (typeof isRoot === 'boolean' && isRoot) {
      return `{${stringArray.join(',')}}`;
    }

    return `[${stringArray.map(x => `'${x}'`).join(',')}]`;
  } else if (feelType === 'string') {
    return contextEntries;
  }

  throw new Error(`Cannot process contextEntries of type: ${typeof contextEntries}`);
};

const isDecisionService = function (csvString) {
  const lines = csvString.split(rowDelimiter);

  return lines[0].split(delimiter)[1] === 'service';
};

const isBoxedInvocation = function (csvString) {
  const lines = csvString.split(rowDelimiter);
  return lines[0].split(delimiter)[2] === 'invocation';
};

const isBoxedContextWithResult = function (csvString) {
  const line = csvString.split(rowDelimiter)[0];

  if (line && line.length) {
    const fields = line.split(delimiter);
    return fields[2] === 'context-with-result';
  }

  return false;
};

const isBoxedContextWithoutResult = function (csvString) {
  const line = csvString.split(rowDelimiter)[0];

  if (line && line.length) {
    const fields = line.split(delimiter);
    return fields[2] === 'context';
  }

  return false;
};

module.exports = {
  csv_to_decision_table: createDecisionTable,
  xls_to_csv: parseXLS,
  execute_decision_table: executeDecisionTable,
  parseWorkbook,
  // private methods
  _: {
    parseXLS,
    parseCsv: parseCsvToJson,
    makeContext: makeContextObject,
    isDecisionTableModel,
    generateJsonFEEL,
    generateContextString,
    isDecisionService,
    isBoxedInvocation,
    isBoxedContextWithResult,
    isBoxedContextWithoutResult,
  },
};

api = module.exports;
