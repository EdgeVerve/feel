/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/


const FEEL = require('../dist/feel').parse;
const hitPolicy = require('./hit-policy.js').hitPolicyPass;

function Node(data, type) {
  this.data = data;
  this.type = type;
  this.children = {};
}

function Tree(data) {
  const node = new Node(data, 'Root');
  this.root = node;
}

function createDecisionTree(dTable) {
  const ruleTree = new Tree('Rule');
  const root = ruleTree.root;
  const classNodeList = dTable.inputExpressionList;
  const numOfConditions = classNodeList.length;
  const outputNodeList = dTable.outputs;
  const ruleList = dTable.ruleList;
  const outputSet = {};

  root.hitPolicy = dTable.hitPolicy;
  if (dTable.context !== null) {
    root.context = new Node(dTable.context, 'Context');
    root.context.ast = FEEL(root.context.data);
    root.context.children = null;
  } else {
    root.context = dTable.context;
  }
  classNodeList.forEach((classValue) => {
    const node = new Node(classValue, 'Class');
    node.ast = null;
    root.children[classValue] = node;
  });

  ruleList.forEach((row, rowIndex) => {
    const outputValue = {};
    const index = rowIndex + 1;
    const data = `Rule${index}`;
    const sentinelNode = new Node(data, 'Sentinel');
    sentinelNode.children = null;
    row.forEach((cellValue, colIndex) => {
      if (colIndex < numOfConditions) {
        const node = root.children[classNodeList[colIndex]].children[cellValue] || new Node(cellValue, 'Value');
        node.ast = node.ast || FEEL(cellValue);
        node.children[data] = sentinelNode;
        root.children[classNodeList[colIndex]].children[cellValue] = root.children[classNodeList[colIndex]].children[cellValue] || node;
      } else {
        const node = new Node(cellValue);
        node.ast = FEEL(cellValue);
        node.children = null;
        outputValue[outputNodeList[colIndex - numOfConditions]] = node;
      }
    });
    outputSet[data] = outputValue;
  });

  root.outputSet = outputSet;
  return root;
}

function prepareOutput(outputSet, output, payload) {
  return new Promise((resolve, reject) => {
    Promise.all(output.map((i) => {
      const keys = Object.keys(outputSet[i]);
      return new Promise((resolve, reject) => { // eslint-disable-line
        Promise.all(keys.map(k => outputSet[i][k].ast.build(payload))).then((results) => {
          resolve(results.reduce((res, val, j) => {
            const obj = {};
            obj[keys[j]] = val;
            return Object.assign({}, obj, res);
          }, {}));
        }).catch(err => reject(err));
      });
    })).then(results =>
        resolve(results)).catch(err => reject(err));
  });
}

function resolveConflictRules(root, payload, rules) {
  let output = [];
  const rootChildren = root.children;
  const classArr = Object.keys(rootChildren);

  classArr.every((classNode, i) => {
    const valueKeys = Object.keys(rootChildren[classNode].children);
    const matchKeys = rules[i];
    let arr = [];
    if (matchKeys.length === 0) {
      output = [];
      return false;
    }
    valueKeys.forEach((valKey, j) => {
      if (matchKeys.indexOf(j) > -1) {
        arr = arr.concat(Object.keys(rootChildren[classNode].children[valKey].children));
      }
    });

    arr = arr.filter((item, index) => arr.indexOf(item) === index);
    output = output.length > 0 ? arr.filter(d => output.indexOf(d) > -1) : arr;
    return true;
  });

  if (output.length > 0) {
    output = root.hitPolicy === 'F' ? output.sort().slice(0, 1) : root.hitPolicy === 'R' ? output.sort() : output;
    return prepareOutput(root.outputSet, output, payload);
  }
  return Promise.resolve([]);
}

function traverseDecisionTreeUtil(root, payload) {
  const classArr = Object.keys(root.children);
  return new Promise((resolve, reject) => {
    Promise.all(classArr.map((classKey) => {
      const node = root.children[classKey];
      const sentinelKeys = Object.keys(node.children);
      return new Promise((resolve, reject) => {
        Promise.all(sentinelKeys.map(key => node.children[key].ast.build(payload, 'input'))).then((results) => {
          let res = results.map((f, i) => ({ value: f(payload[classKey]), index: i })).filter(d => d.value === true);
          res = res.map(obj => obj.index);
          resolve(res);
        }).catch(err => reject(err));
      });
    })).then(results =>
        resolveConflictRules(root, payload, results).then(results =>
            resolve(results))).catch(err => reject(err));
  });
}

function prepareContext(root, payload) {
  if (root.context !== null) {
    return root.context.ast.build(payload);
  }
  return Promise.resolve(payload);
}

function traverseDecisionTree(root, payload, cb) {
  prepareContext(root, payload).then((context) => {
    const ctx = Object.assign({}, payload, context);
    traverseDecisionTreeUtil(root, ctx).then((results) => {
      cb(hitPolicy(root.hitPolicy, results));
    });
  });
}

module.exports = {
  createTree: createDecisionTree,
  traverseTree: traverseDecisionTree,
};
