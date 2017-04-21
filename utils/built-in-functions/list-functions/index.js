/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

const _ = require('lodash');

const listContains = (list, element) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    if (list.indexOf(element) > -1) { return true; }
    return false;
  }
};

const count = (list) => {
  if (!Array.isArray(list)) { throw new Error('operation unsupported on element of this type'); } else {
    return list.length;
  }
};

const min = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.min(list);
  }
};

const max = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.max(list);
  }
};

const sum = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.sum(list);
  }
};

const mean = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return (_.sum(list)) / (list.length);
  }
};

const and = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.reduce((recur, next) => recur && next, true);
  }
};

const or = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.reduce((recur, next) => recur || next, false);
  }
};

const append = (element, list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return list.push(element);
  }
};

const concatenate = (...args) => args.reduce((result, next) => Array.prototype.concat(result, next), []);

const insertBefore = (list, position, newItem) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (position > list.length || position < 0) {
    throw new Error('invalid position');
  } else {
    return list.splice(position - 1, 0, newItem);
  }
};

const remove = (list, position) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else if (position > list.length - 1) {
    throw new Error('invalid position');
  } else {
    return list.splice(position, 1);
  }
};

const reverse = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.reverse(list);
  }
};

const indexOf = (list, match) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.indexOf(list, match);
  }
};

const union = (...args) => _.union(args);

const distinctValues = (list) => {
  if (!Array.isArray(list)) {
    throw new Error('operation unsupported on element of this type');
  } else {
    return _.uniq(list);
  }
};

const flatten = (...args) => _.flatten(args);

module.exports = {
  listContains,
  count,
  min,
  max,
  sum,
  mean,
  and,
  or,
  append,
  concatenate,
  insertBefore,
  remove,
  reverse,
  indexOf,
  union,
  distinctValues,
  flatten,
};
