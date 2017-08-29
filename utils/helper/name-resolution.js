/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */

const nameResolutionOrder = ['kwargs', 'context', 'decisionMap', 'plugin'];

const resolveName = (name, args, isResult = true) => new Promise((resolve, reject) => {
  nameResolutionOrder.some((key, index) => {
    const value = args[key] && args[key][name];
    if (typeof value !== 'undefined') {
      if (key === 'kwargs' || key === 'context') {
        resolve(value);
      } else if (key === 'decisionMap') {
        if (!isResult) {
          value.build(Object.assign({}, args.context, args.kwargs), { decisionMap: args.decisionMap, plugin: args.plugin }).then((result) => {
            const decisionValue = typeof result === 'object' && Object.keys(result).map(key => result[key])[0];
            resolve(decisionValue);
          });
        } else {
          const decision = {
            expr: value,
            isDecision: true,
          };
          resolve(decision);
        }
      } else if (key === 'plugin') {
        value((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
      return true;
    }
    if (index === nameResolutionOrder.length - 1) {
      console.log(`${name} : ${value}`);
      resolve(value);
    }
    return false;
  });
});

module.exports = resolveName;

