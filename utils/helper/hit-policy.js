/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
/*
Single hit policies for single output decision tables are:
1. Unique: no overlap is possible and all rules are disjoint. Only a single rule can be matched. This is the default.
2. Any: there may be overlap, but all of the matching rules show equal output entries for each output, so any match can
be used. If the output entries are non-equal, the hit policy is incorrect and the result is undefined.
3. Priority: multiple rules can match, with different output entries. This policy returns the matching rule with the
highest output priority. Output priorities are specified in the ordered list of output values, in decreasing order of
priority. Note that priorities are independent from rule sequence.
4. First: multiple (overlapping) rules can match, with different output entries. The first hit by rule order is returned (and
evaluation can halt). This is still a common usage, because it resolves inconsistencies by forcing the first hit.
However, first hit tables are not considered good practice because they do not offer a clear overview of the decision
logic. It is important to distinguish this type of table from others because the meaning depends on the order of the
rules. The last rule is often the catch-remainder. Because of this order, the table is hard to validate manually and
therefore has to be used with care.
Multiple hit policies for single output decision tables can be:
5. Output order: returns all hits in decreasing output priority order. Output priorities are specified in the ordered list of
output values in decreasing order of priority.
6. Rule order: returns all hits in rule order. Note: the meaning may depend on the sequence of the rules.
7. Collect: returns all hits in arbitrary order. An operator (‘+’, ‘<’, ‘>’, ‘#’) can be added to apply a simple function to
the outputs. If no operator is present, the result is the list of all the output entries.
Collect operators are:
a) + (sum): the result of the decision table is the sum of all the distinct outputs.
b) < (min): the result of the decision table is the smallest value of all the outputs.
c) > (max): the result of the decision table is the largest value of all the outputs.
d) # (count): the result of the decision table is the number of distinct outputs.
Other policies, such as more complex manipulations on the outputs, can be performed by post-processing the
output list (outside the decision table).

NOTE : Decision tables with compound outputs support only the following hit policies: Unique, Any, Priority, First, Output
order, Rule order and Collect without operator, because the collect operator is undefined over multiple outputs.
*/

const _ = require('lodash');

const getDistinct = arr => arr.filter((item, index, arr) => arr.indexOf(item) === index);

const sum = (arr) => {
  // const distinctArr = getDistinct(arr);
  const distinctArr = arr;
  const elem = distinctArr[0];
  if (typeof elem === 'string') {
    return distinctArr.join(' ');
  } else if (typeof elem === 'number') {
    return distinctArr.reduce((a, b) => a + b, 0);
  } else if (typeof elem === 'boolean') {
    return distinctArr.reduce((a, b) => a && b, true);
  }
  throw new Error(`sum operation not supported for type ${typeof elem}`);
};

const count = (arr) => {
  if (Array.isArray(arr)) {
    const distinctArr = getDistinct(arr);
    return distinctArr.length;
  }
  throw new Error(`count operation not supported for type ${typeof arr}`);
};

const min = (arr) => {
  const elem = arr[0];
  if (typeof elem === 'string') {
    arr.sort();
    return arr[0];
  } else if (typeof elem === 'number') {
    return Math.min(...arr);
  } else if (typeof elem === 'boolean') {
    return arr.reduce((a, b) => a && b, true) ? 1 : 0;
  }
  throw new Error(`min operation not supported for type ${typeof elem}`);
};

const max = (arr) => {
  const elem = arr[0];
  if (typeof elem === 'string') {
    arr.sort();
    return arr[arr.length - 1];
  } else if (typeof elem === 'number') {
    return Math.max(...arr);
  } else if (typeof elem === 'boolean') {
    return arr.reduce((a, b) => a || b, false) ? 1 : 0;
  }
  throw new Error(`max operation not supported for type ${typeof elem}`);
};

const collectOperatorMap = {
  '+': sum,
  '#': count,
  '<': min,
  '>': max,
};

const checkEntriesEquality = (output) => {
  let isEqual = true;
  if (output.length > 1) {
    const value = output[0];
    output.every((other) => {
      isEqual = _.isEqual(value, other);
      return isEqual;
    });
    return isEqual;
  }
  return isEqual;
};

const getValidationErrors = output =>
  output.filter(ruleStatus => ruleStatus.isValid === false).map((rule) => {
    const newRule = rule;
    delete newRule.isValid;
    return newRule;
  });

const hitPolicyPass = (hitPolicy, output) => new Promise((resolve, reject) => {
  const policy = hitPolicy.charAt(0);
  let ruleOutput = [];
  switch (policy) {
    // Single hit policies
    case 'U':
      ruleOutput = output.length > 1 ? {} : output[0];
      break;
    case 'A':
      ruleOutput = checkEntriesEquality(output) ? output[0] : undefined;
      break;
    case 'P':
      ruleOutput = output[0];
      break;
    case 'F':
      ruleOutput = output[0];
      break;
      // Multiple hit policies
    case 'C': {
      const operator = hitPolicy.charAt(1);
      if (operator.length > 0 && output.length > 0) {
        const fn = collectOperatorMap[operator];
        const key = Object.keys(output[0])[0];
        const arr = output.map(item => item[key]);
        const result = {};
        try {
          result[key] = fn(arr);
        } catch (e) {
          reject(e);
        }
        ruleOutput = result;
      } else {
        ruleOutput = output;
      }
      break;
    }
    case 'R':
      ruleOutput = output;
      break;
    case 'O':
      ruleOutput = output;
      break;
    case 'V':
      ruleOutput = getValidationErrors(output);
      break;
    default :
      ruleOutput = output;
  }
  resolve(ruleOutput);
});

const prepareOutputOrder = (output, priorityList) => {
  const arr = output.map((rule) => {
    const obj = {};
    obj.rule = rule;
    obj.priority = priorityList[rule];
    return obj;
  });
  const sortedPriorityList = _.sortBy(arr, ['priority']);
  const outputList = sortedPriorityList.map(ruleObj => ruleObj.rule);
  return outputList;
};

const ruleSorter = function (a, b) {
  const left = parseInt(a.substr(4), 10);
  const right = parseInt(b.substr(4), 10);
  if (left < right) {
    return -1;
  } else if (left > right) {
    return 1;
  }
  return 0;
};

const getOrderedOutput = (root, outputList) => {
  const policy = root.hitPolicy.charAt(0);
  let outputOrderedList = [];
  switch (policy) {
    case 'P':
      outputOrderedList.push(prepareOutputOrder(outputList, root.priorityList)[0]);
      break;
    case 'O':
      outputOrderedList = prepareOutputOrder(outputList, root.priorityList);
      break;
    case 'F':
      outputOrderedList = outputList.sort(ruleSorter).slice(0, 1);
      break;
    case 'R':
      outputOrderedList = outputList.sort(ruleSorter);
      break;
    default :
      outputOrderedList = outputList;
  }
  return outputOrderedList;
};

module.exports = { hitPolicyPass, getOrderedOutput };
