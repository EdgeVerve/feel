/*  
*  
*  ©2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
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

function checkEntriesEquality(output) {
  let isEqual = true;
  if (output.length > 1) {
    const value = output[0];
    output.every((other) => { isEqual = _.isEqual(value, other); return isEqual; });
    return isEqual;
  }
  return isEqual;
}


function sum(arr) {
  const isBoolean = arr.reduce((prev, next) => prev && typeof next === 'boolean', true);
  return isBoolean ? arr.reduce((a, b) => a && b, true) : arr.reduce((a, b) => a + b, 0);
}

function count(arr) {
  return arr.length;
}

function min(arr) {
  return Math.min(...arr);
}

function max(arr) {
  return Math.max(...arr);
}

// function getDistinct(arr) {
//   arr = arr.filter((item, index, arr) => arr.indexOf(item) === index);
//   return arr;
// }

// function getPriorityList(outputValuesList) {
//     // TO-DO
// }

const collectOperatorMap = {
  '+': sum,
  '#': count,
  '<': min,
  '>': max,
};

function hitPolicyPass(hitPolicy, output) {
  const policy = hitPolicy.charAt(0);
  let ruleOutput = [];
  switch (policy) {
// Multiple hit policies
    case 'U':
      ruleOutput = output.length > 1 ? {} : output[0];
      break;
    case 'A':
      ruleOutput = checkEntriesEquality(output) ? output[0] : undefined;
      break;
    case 'P':
            // TO-DO
      ruleOutput = output[0];
      break;
    case 'F':
      ruleOutput = output[0];// resolved before preparing the output values
      break;
// Multiple hit policies
    case 'C': {
      const operator = hitPolicy.charAt(1);
      if (operator.length > 0 && output.length > 0) {
        const fn = collectOperatorMap[operator];
        const key = Object.keys(output[0])[0];
        const arr = output.map(item => item[key]);
        const result = {};
        result[key] = fn(arr);
        ruleOutput = result;
      } else {
        ruleOutput = output;
      }
      break;
    }
    case 'R':
      ruleOutput = output;// resolved before preparing the output values
      break;
    case 'O':
            // TO-DO
      ruleOutput = output;
      break;
    default :
      ruleOutput = output;
  }
  return ruleOutput;
}

module.exports = {
  hitPolicyPass,
};
