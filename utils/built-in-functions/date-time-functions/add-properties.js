/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const addProperties = (obj, props) => {
  Object.keys(props).forEach((key) => {
    const value = props[key];
    if (typeof value === 'function') {
      obj[key] = value.call(obj); // eslint-disable-line no-param-reassign
    } else {
      obj[key] = value; // eslint-disable-line no-param-reassign
    }
  });
  return obj;
};

module.exports = addProperties;
