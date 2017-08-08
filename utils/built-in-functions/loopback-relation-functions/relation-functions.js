const FEEL = require('../../../dist/feel');

const preparePayload = (modelName, data) => new Promise((resolve, reject) => {
  const context = '{ fetchPayload : function() external { js : {dependencies : [{ loopback : "loopback"}], signature : "const Model = loopback.getModel(modelName);const payload = new Model(data);done(null, payload)"}}}';
  const text = 'fetchPayload()';
  const parsedContext = FEEL.parse(context);
  const parsedText = FEEL.parse(text);
  const payload = {};

  payload.modelName = modelName;
  payload.data = data;
  parsedContext.build(payload).then(ctx => parsedText.build(Object.assign({}, ctx, payload))).then((result) => {
    resolve(result);
  }).catch((err) => {
    reject(err);
  });
});

const relationCb = (resolve, reject) => (err, res) => {
  if (err) {
    reject(err);
  } else {
    resolve(res);
  }
};

const lbRelation = (fnStr, data) => {
  const fnSeries = fnStr.split('.');
  const fnArray = fnSeries.map((str) => {
    if (str.includes(')')) {
      return str.substring(0, str.length - 2);
    }
    return null;
  }).filter(d => Boolean(d));
  const prop = fnSeries[fnSeries.length - 1].includes(')') ? '' : fnSeries[fnSeries.length - 1];
  const options = data.options;

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-underscore-dangle
    preparePayload(options.modelName, data).then(payload => fnArray.reduce((promise, fn) => promise.then(parent => new Promise((resolve, reject) => {
      parent[fn]({}, options, relationCb(resolve, reject));
    })), Promise.resolve(payload))).then((res) => {
      let result = res || {};
      result = prop ? result[prop] : result;
      resolve(result);
    }).catch(err => reject(err));
  });
};

module.exports = { lbRelation };
