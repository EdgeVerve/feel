/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */

const nameResolutionOrder = ['kwargs', 'context', 'decisionMap', 'plugin'];

const resolveName = (name, args, isResult = false) =>
  new Promise((resolve, reject) => {
    nameResolutionOrder.some((key, index) => {
      let value;
      if (key === 'plugin') {
        value =
          args.context && args.context.plugin && args.context.plugin[name];
      } else {
        value = args[key] && args[key][name];
      }

      if (typeof value !== 'undefined') {
        if (key === 'kwargs' || key === 'context') {
          resolve(value);
        } else if (key === 'decisionMap') {
          if (!isResult) {
            value
              .build(Object.assign({}, args.context, args.kwargs), {
                decisionMap: args.decisionMap,
                plugin: args.plugin,
              })
              .then((result) => {
                const decisionValue = typeof result === 'object'
                  ? Object.keys(result).map(key => result[key])[0]
                  : result;
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
          if (typeof value === 'function') {
            // Assumption: functions added to plugins return a promise
            value()
              .then((result) => {
                resolve({ context: result });
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            resolve(value);
          }
        }
        return true;
      }
      if (index === nameResolutionOrder.length - 1) {
        resolve(value);
      }
      return false;
    });
  });

module.exports = resolveName;
