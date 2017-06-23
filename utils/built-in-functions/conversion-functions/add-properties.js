/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const addProperties = (obj, props) => {
  const o = Object.assign({}, obj);
  Object.keys(props).forEach((key) => {
    const value = props[key];
    if (typeof value === 'function') {
      o[key] = value.call(obj);
    } else {
      o[key] = value;
    }
  });
  return o;
};

module.exports = addProperties;
