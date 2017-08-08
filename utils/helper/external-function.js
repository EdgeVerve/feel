/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const vm = require('vm');

const callback = (resolve, reject) => (err, res) => {
  if (err) {
    reject(err);
  } else {
    resolve(res);
  }
};

const execute = (script, payload, done) => {
  const sandbox = Object.assign({}, payload);
  sandbox.done = done;
  script.runInNewContext(sandbox);
};

const prepareDependencies = (dependencies) => {
  const requireObj = {};
  dependencies.forEach((dependency) => {
    Object.keys(dependency).forEach((key) => {
      requireObj[key] = require(dependency[key]); // eslint-disable-line
    });
  });
  return requireObj;
};

const externalFn = bodyMeta => ((code, dependencies) => {
  const script = new vm.Script(code);
  const reqdLibs = Object.assign({}, prepareDependencies(dependencies), global);
  return (payload, done) => execute(script, Object.assign({}, reqdLibs, payload), done);
})(bodyMeta.js.signature || '', bodyMeta.js.dependencies || []);

module.exports = (ctx, bodyMeta) => new Promise((resolve, reject) => {
  externalFn(bodyMeta)(ctx, callback(resolve, reject));
});
