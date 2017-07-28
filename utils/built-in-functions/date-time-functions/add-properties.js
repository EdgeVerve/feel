/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

const addProperties = (obj, props) => {
  const child = Object.create(obj);
  Object.keys(props).forEach((key) => {
    const value = props[key];
    if (typeof value === 'function') {
      Object.defineProperty(child, key, { get: function () { // eslint-disable-line object-shorthand
        const proto = Object.getPrototypeOf(this);
        return value.call(proto);
      },
      });
    } else {
      Object.defineProperty(child, key, { get: function () { // eslint-disable-line object-shorthand
        const proto = Object.getPrototypeOf(this);
        return key !== 'type' && proto[value] ? proto[value]() : value;
      },
      });
    }
  });

  const proxy = new Proxy(child, {
    get: (target, propKey) => {
      const proto = Object.getPrototypeOf(target);
      const protoPropValue = proto[propKey];
      if (!target.hasOwnProperty(propKey) && typeof protoPropValue === 'function') {
        return function (...args) {
          return protoPropValue.apply(proto, args);
        };
      }
      return target[propKey];
    },
  });

  return proxy;
};

module.exports = addProperties;
