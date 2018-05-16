/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */
const FEEL = require('../../dist/feel.js');

// const functionDeclarationToken = 'function() ';

// const massageDecisionMap = decisionMap => Object.keys(decisionMap).reduce((recur, next) => {
//   const value = decisionMap[next];
//   const r = recur;
//   r[next] = typeof value === 'string' && value && (functionDeclarationToken + value);
//   return r;
// }, {});

const createDecisionGraphAST = (decisionMap) => {
  const graphAST = Object.keys(decisionMap).reduce((recur, next) => {
    const value = decisionMap[next];
    const r = recur;
    r[next] = FEEL.parse(value, { ruleName: next });
    return r;
  }, {});
  return graphAST;
};

const executeDecisionService = (graphAST, decisionName, payload, graphName) =>
  new Promise((resolve, reject) => {
    const decision = graphAST[decisionName];
    if (decision) {
      decision
        .build(payload, { decisionMap: graphAST, graphName })
        .then((result) => {
          resolve(result);
        })
        .catch(err => reject(err));
    }
  });

module.exports = { createDecisionGraphAST, executeDecisionService };
