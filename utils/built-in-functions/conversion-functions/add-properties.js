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
