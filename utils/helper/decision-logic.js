/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const XLSX = require('xlsx');
const _ = require('lodash');
const tree = require('./decision-tree.js');

const rootMap = {};
const delimiter = '&SP';
const rowDelimiter = '&RSP';

const parseXLS = (path) => {
  const workbook = XLSX.readFile(path);
  const csv = [];
  workbook.SheetNames.forEach((sheetName) => {
 /* iterate through sheets */
    const worksheet = workbook.Sheets[sheetName];
    csv.push({
      [sheetName]: XLSX.utils.sheet_to_csv(worksheet, { FS: delimiter , RS: rowDelimiter }),
    });
  });

  return csv;
};

const getFormattedValue = str => str.replace(/\"{2,}/g, '\"').replace(/^\"|\"$/g, '');

const makeContextObject = (csvExcel) => {

  //Convention: context entries are vertical
  //Convention: decision table entries are horizontal

  var qualifiedName = csvExcel.substring(0 , csvExcel.indexOf(delimiter))
  var expression;

  let { isDecisionTableModel, generateContextString } = api._
  // var csvArray = csvExcel.split('\n');
  var contextEntries;
  if (isDecisionTableModel(csvExcel)) {
    contextEntries = parseDecisionTableFromCsv(csvExcel)
  }
  else if(isBoxedInvocation(csvExcel)) {
    contextEntries = parseInvocationFromCsv(csvExcel);
  }
  else {
    contextEntries = parseBusinessModelFromCsv(csvExcel);
  }

  expression = generateContextString(contextEntries)

  return {
    qn: qualifiedName,
    expression
  }
};

function parseBusinessModelFromCsv(csvString) {
  var csvArray = csvString.split(rowDelimiter);
  var i = 1;

  var contextEntries = []

  csvArray.slice(1).forEach(line => {
    var fields = line.split(delimiter)

    //TODO handle complex cases
    var tokensCount = fields.filter(token => token.length).length
    if( tokensCount > 1) {
      contextEntries.push({ [fields[0]] : fields[1] })
    }
    else if(tokensCount === 1) {
      contextEntries.push(fields[0])
    }
  });
  return contextEntries;
}

var rCsvString = /"""(\w+)"""/;
var noop = function() {};

function isCsvString(testString) {
  return rCsvString.test(testString);
}

function parseDecisionTableFromCsv(csvString) {
  var csvArray = csvString.split(rowDelimiter);
  var contextEntries = [];
  var dto = {}; //decision table object representation
  let { generateContextString } = api._

  var i = 1;
  var line = csvArray[i];

  //parsing context stuff if any
  while( !line.startsWith("RuleTable") ) {
    var fields = line.split(delimiter);
    var tokensCount = fields.filter(token => token.length).length
    if (tokensCount > 1) {
      contextEntries.push({
        [fields[0]] : fields[1]
      });
    }
    i++;
    line = csvArray[i]
  }

  // 1. Parse the rule table

  var components = line.split(delimiter);

  // 1.1 determine number of input components
  var conditionCount = components.filter( c => c === "Condition").length;

  // 1.2 get the input expressions & hit policy
  i++;
  line = csvArray[i];
  components = line.split(delimiter);
  dto["hitPolicy"] = components[0];
  var inputExpressionList = [];
  // 1.2.1 loop though the rule table line to get input expressions
  for(let j = 1; j < components.length; j++) {
    if (j <= conditionCount) {
      inputExpressionList.push(components[j]);
    }
    else {
      dto["outputs"] = components[j];
    }
  }

  dto["inputExpressionList"] = generateContextString(inputExpressionList, "csv");

  // 1.3 populate the rule list
  var ruleList = [];
  var tmp = {};

  for(i++; i < csvArray.length; i++) {
    var conditionList = [];
    line = csvArray[i];
    components = line.split(delimiter)
    for(let j = 1; j < components.length; j++) {
      var token = components[j];
      if (isCsvString(token)) {
        token = '"' + token.match(rCsvString)[1] +'"';
      }
      if (token.length) {
        tmp[j] = token
        conditionList.push(token)
      }
      else {
        conditionList.push(tmp[j])
      }
    }
    components[0] ? ruleList.push(conditionList) : noop();
  }

  dto["ruleList"] = generateContextString(ruleList.map(cl => {
    return generateContextString(cl, false)
  }), "csv");

  // 2. generating the context entry object for decision arguments
  var contextEntry = [
    `outputs : \"${dto["outputs"]}\"`,
    {
      "input expression list" : dto["inputExpressionList"],
      "rule list": dto["ruleList"]
    },
    `hit policy: \"${dto["hitPolicy"]}\"`
  ];

  var dtContextString = generateContextString(contextEntry, "list")

  //3. final context entry
  contextEntries.push({
    result: `decision table (${dtContextString})`
  });

  return contextEntries;
}

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
    hash[keys[0]] = item[keys[0]];
    return hash;
  }, {});
};

const isDecisionTableModel = function (csvString) {
  return csvString.indexOf('RuleTable') > -1;
};

const parseWorkbook = function (path) {
  const { parseXLS, parseCsv, makeContext } = api._;

  jsonCsv = parseCsv(parseXLS(path));

  return generateJsonFEEL(jsonCsv);
};

var generateJsonFEEL = function (jsonCsvObject) {
  // const jsonFeel = {};
  const { _: { isDecisionTableModel, makeContext, createBusinessModel } } = api;

  return Object.keys(jsonCsvObject).reduce( (hash, key) => {
    var csvModel = jsonCsvObject[key];
    var ctx = makeContext(csvModel);
    hash[ctx.qn] = ctx.expression;
    return hash;
  }, {})
};

var generateContextString = function(contextEntries, isRoot = true) {
  var stringArray = []
  var feelType = 'string' //we'll assume default as string entry
  var override = false;

  if (typeof contextEntries === "object" && Array.isArray(contextEntries)) {
    //! process array entries
    feelType = 'array'
    contextEntries.forEach(entry => {
      // var feelEntry = generateContextString(entry, false);
      // stringArray.push(feelEntry)
      var feelEntry
      if (isRoot) {
        feelEntry = generateContextString(entry)
      }
      else {
        feelEntry = generateContextString(entry, false)
      }
      stringArray.push(feelEntry)
    })
  }
  else if (typeof contextEntries === "object" && !Array.isArray(contextEntries)) {
    //! process object entries

    feelType = 'object'

    var contextKeys = Object.keys(contextEntries)
    contextKeys.forEach(key => {
      var feelEntry = generateContextString(contextEntries[key], false)
      stringArray.push(`${key} : ${feelEntry}`)
    });
  }
  else {
    //! default as string
    console.assert(typeof contextEntries === 'string', "Expected context entry to be a string")
    // stringArray.push(contextEntries)
  }

  if (feelType === 'object') {
    if (typeof isRoot === 'string' && isRoot === 'csv') {
      return stringArray.join(',')
    }
    else if (typeof isRoot === 'boolean' && isRoot) {
      return stringArray.join(',')
    }
    else {
      return "{" + stringArray.join(',') + "}";
    }

  }
  else if(feelType === 'array') {
    if (typeof isRoot === 'string' && isRoot === 'csv') {
      return "[" + stringArray.join(',') + "]";
    }
    else if (typeof isRoot === 'string' && isRoot === 'list') {
      return stringArray.join(',');
    }
    else if (typeof isRoot === 'boolean' && isRoot) {
      return "{" + stringArray.join(",") + "}";
    }
    else {
      return "[" + stringArray.map(x => "'" + x + "'").join(",") + "]";
    }
  }
  else if (feelType === "string") {
    return contextEntries
  }
  else {
    throw new Error("Cannot process contextEntries of type: " + typeof contextEntries)
  }
};

var isDecisionService = function(csvString) {
  var lines = csvString.split(rowDelimiter);

  return lines[0].split(delimiter)[1] === "service";
};

var isBoxedInvocation = function(csvString) {
  var lines = csvString.split(rowDelimiter);
  return lines[0].split(delimiter)[2] === "invocation"
}

var parseInvocationFromCsv = function(csvString) {
  var lines = csvString.split(rowDelimiter);
  let { generateContextString } = api._;
  var fnName = lines[1].split(delimiter)[0];
  var entries = [];
  for(var i = 2; i < lines.length; i++) {
    var fields = lines[i].split(delimiter);
    if (fields[0].length) { //to avoid blank lines
      entries.push(`${fields[0]} : ${fields[1]}`)
    }
  }

  return `${fnName} (${generateContextString(entries, "list")})`
};

var isBoxedContextWithResult = function(csvString) {
  var line = csvString.split(rowDelimiter)[0];

  if (line && line.length) {
    var fields = line.split(delimiter);
    return fields[2] === 'context-with-result';
  }

  return false;
};

let api;
api = module.exports = {
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
    isBoxedContextWithResult
  },
};
