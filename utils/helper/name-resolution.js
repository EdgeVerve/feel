/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */

const nameResolutionOrder = ['kwargs', 'context', 'decisionMap', 'plugin'];

const resolveName = (name, args) => new Promise((resolve, reject) => {
  const scope = Object.assign({}, { kwargs: args.kwargs }, { context: args.context }, args.env);
  nameResolutionOrder.some((key, index) => {
    const value = scope[key] && scope[key][name];
    if (typeof value !== 'undefined') {
      if (key === 'kwargs' || key === 'context') {
        resolve(value);
      } else if (key === 'decisionMap') {
        value.build(args.context, args.env).then(result => resolve(result));
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
      resolve(value);
    }
    return false;
  });
});

module.exports = resolveName;

