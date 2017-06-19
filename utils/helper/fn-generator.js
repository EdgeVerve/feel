/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const Big = require('big.js');
const _ = require('lodash');


const operatorMap = {
  '<': _.curry((x, y) => {
    // (typeof x === "number" && typeof y === "number") ? Big(x).lt(y) : new Error("operation unsupported for one or more operands types")),
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).lt(y);
      }
      return x < y;
    } catch (err) {
      throw err;
    }
  }),
  '<=': _.curry((x, y) => {
    // (typeof x === "number" && typeof y === "number") ? Big(x).lte(y) : new Error("operation unsupported for one or more operands types")),
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).lte(y);
      }
      return x <= y;
    } catch (err) {
      throw err;
    }
  }),
  '>': _.curry((x, y) => {
    // (typeof x === "number" && typeof y === "number") ? Big(x).gt(y) : new Error("operation unsupported for one or more operands types")),
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).gt(y);
      }
      return x > y;
    } catch (err) {
      throw err;
    }
  }),
  '>=': _.curry((x, y) => {
    // (typeof x === "number" && typeof y === "number") ? Big(x).gte(y) : new Error("operation unsupported for one or more operands types")),
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).gte(y);
      }
      return x >= y;
    } catch (err) {
      throw err;
    }
  }),
  '==': _.curry((x, y) => {
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).eq(y);
      }
      return x == y; // eslint-disable-line
    } catch (err) {
      throw err;
    }
  }),
  '!=': _.curry((x, y) => {
    // (typeof x === "number" && typeof y === "number") ? !(Big(x).eq(y)) : new Error("operation unsupported for one or more operands types")),
    try {
      if (typeof x === 'number' && typeof y === 'number') {
        return !(Big(x).eq(y));
      }
      return x != y; // eslint-disable-line
    } catch (err) {
      throw err;
    }
  }),
  '||': _.curry((x, y) => x || y),
  '&&': _.curry((x, y) => x && y),
  '+': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).plus(y));
    } else if (x instanceof Date && typeof y === 'number') {
      // TO-DO - Date not implemented yet
    } else if (typeof x === 'number' && y instanceof Date) {
      // TO-DO - Date not implemented yet
    } else {
      throw new Error('operation unsupported for one or more operands types');
    }
  }),

  '-': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).minus(y));
    } else if (x instanceof Date && y instanceof Date) {
      // TO-DO - Date not implemented
    } else if (x instanceof Date && typeof y === 'number') {
      // TO-DO - Date not implemented
    } else if (typeof x === 'number' && y instanceof Date) {
      // TO-DO - Date not implemented
    } else {
      throw new Error('operation unsupported for one or more operands types');
    }
  }),

  '*': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).times(y));
    } else if (x instanceof Date && y instanceof Date) {
      // TO-DO - Date not implemented
    } else if (x instanceof Date && typeof y === 'number') {
      // TO-DO - Date not implemented
    } else if (typeof x === 'number' && y instanceof Date) {
      // TO-DO - Date not implemented
    } else {
      throw new Error('operation unsupported for one or more operands types');
    }
  }),
  '/': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).div(y));
    } else if (x instanceof Date && y instanceof Date) {
      // TO-DO - Date not implemented
    } else if (x instanceof Date && typeof y === 'number') {
      // TO-DO - Date not implemented
    } else if (typeof x === 'number' && y instanceof Date) {
      // TO-DO - Date not implemented
    } else {
      throw new Error('operation unsupported for one or more operands types');
    }
  }),

  '**': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).pow(y));
    } else if (x instanceof Date && y instanceof Date) {
      // TO-DO - Date not implemented
    } else if (x instanceof Date && typeof y === 'number') {
      // TO-DO - Date not implemented
    } else if (typeof x === 'number' && y instanceof Date) {
      // TO-DO - Date not implemented
    } else {
      throw new Error('operation unsupported for one or more operands types');
    }
  }),
};

module.exports = operator => operatorMap[operator];
