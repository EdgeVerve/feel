/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const Big = require('big.js');
const _ = require('lodash');
const { valueT, valueInverseT, valueDT, valueInverseDT, valueDTD, valueInverseDTD, valueYMD, valueInverseYMD } = require('./value');
const { date, time, 'date and time': dateandtime } = require('../built-in-functions');

// property collection is in the order of priority of check
// priority order is essential for inequality check
// for inequality check the property appearing first in the list needs to be checked first
// before moving on to the next properties in the list

const dateTimeComponent = {
  time: ['hour', 'minute', 'second', 'time_offset', 'timezone'],
  date: ['year', 'month', 'day'],
  dateandtime: ['year', 'month', 'day', 'hour', 'minute', 'second', 'time_offset', 'timezone'],
};


const operatorMap = {
  '<': _.curry((x, y) => {
    try {
      if (typeof x === typeof y || (x && x.type === y && y.type)) {
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).lt(y);
        } else if (x.isDate && y.isDate) {
          const checkLt = checkInequality('<'); // eslint-disable-line no-use-before-define
          return checkLt(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) < valueDT(y);
        } else if (x.isTime && y.isTime) {
          return valueT(x) < valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) < valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) < valueYMD(y);
        }
        return x < y;
      }
      throw new Error(`${typeof x} < ${typeof y} : operation unsupported for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '<=': _.curry((x, y) => {
    try {
      if (typeof x === typeof y || (x && x.type === y && y.type)) {
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).lte(y);
        } else if (x.isDate && y.isDate) {
          const checkLtEq = checkInequality('<='); // eslint-disable-line no-use-before-define
          return checkLtEq(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) <= valueDT(y);
        } else if (x.isTime && y.isTime) {
          return valueT(x) <= valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) <= valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) <= valueYMD(y);
        }
        throw new Error(`${typeof x} <= ${typeof y} : operation unsupported for one or more operands types`);
      }
      return false;
    } catch (err) {
      throw err;
    }
  }),
  '>': _.curry((x, y) => {
    try {
      if (typeof x === typeof y || (x && x.type === y && y.type)) {
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).gt(y);
        } else if (x.isDate && y.isDate) {
          const checkGt = checkInequality('>'); // eslint-disable-line no-use-before-define
          return checkGt(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) > valueDT(y);
        } else if (x.isTime && y.isTime) {
          return valueT(x) > valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) > valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) > valueYMD(y);
        }
        return x > y;
      }
      throw new Error(`${typeof x} > ${typeof y} : operation unsupported for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '>=': _.curry((x, y) => {
    try {
      if (typeof x === typeof y || (x && x.type === y && y.type)) {
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).gte(y);
        } else if (x.isDate && y.isDate) {
          const checkGtEq = checkInequality('>='); // eslint-disable-line no-use-before-define
          return checkGtEq(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) >= valueDT(y);
        } else if (x.isTime && y.isTime) {
          return valueT(x) >= valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) >= valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) >= valueYMD(y);
        }
        return x >= y;
      }
      throw new Error(`${typeof x} >= ${typeof y} : operation unsupported for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '==': _.curry((x, y) => {
    try {
      if (typeof x === typeof y || (x && x.type === y && y.type)) {
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).eq(y);
        } else if (x.isDate && y.isDate) {
          return checkEquality(x, y, dateTimeComponent.date); // eslint-disable-line no-use-before-define
        } else if (x.isDateTime && y.isDateTime) {
          return checkEquality(x, y, dateTimeComponent.dateandtime); // eslint-disable-line no-use-before-define
        } else if (x.isTime && y.isTime) {
          return checkEquality(x, y, dateTimeComponent.time); // eslint-disable-line no-use-before-define
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) === valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) === valueYMD(y);
        }
        // "===" cannot be used as FEEL grammar suggests use of "=="
        return x == y; // eslint-disable-line eqeqeq
      }
      throw new Error(`${typeof x} = ${typeof y} : operation unsupported for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '!=': _.curry((x, y) => {
    try {
      return !(operatorMap['=='](x, y));
    } catch (err) {
      throw err;
    }
  }),
  '||': _.curry((x, y) => x || y),
  '&&': _.curry((x, y) => x && y),
  '+': _.curry((x, y) => {
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).plus(y));
    } else if (typeof x === 'string' && typeof y === 'string') {
      return x + y;
    } else if ((x.isDateTime || x.isDate) && (y.isDateTime || y.isDate)) {
      throw new Error(`${x.type} + ${y.type} : operation unsupported for one or more operands types`);
    } else if (x.isTime && y.isTime) {
      throw new Error(`${x.type} + ${y.type} : operation unsupported for one or more operands types`);
    } else if (x.isYmd && y.isYmd) {
      return valueInverseYMD(valueYMD(x) + valueYMD(y));
    } else if (x.isDtd && y.isDtd) {
      return valueInverseDTD(valueDTD(x) + valueDTD(y));
    } else if ((x.isDateTime || x.isDate) && y.isYmd) {
      return dateandtime(date(x.year + y.years + Math.floor((x.month + y.months) / 12), (x.month + y.months) - (Math.floor((x.month + y.months) / 12) * 12), x.day), time(x));
    } else if (x.isYmd && (y.isDateTime || y.isDate)) {
      return dateandtime(date(y.year + x.years + Math.floor((y.month + x.months) / 12), (y.month + x.months) - (Math.floor((y.month + x.months) / 12) * 12) - 1, y.day), time(y));
    } else if ((x.isDateTime || x.isDate) && y.isDtd) {
      return valueInverseDT(valueDT(x) + valueDTD(y));
    } else if (x.isDtd && (y.isDateTime || y.isDate)) {
      return valueInverseDT(valueDT(y) + valueDTD(x));
    } else if (x.isTime && y.isDtd) {
      return valueInverseT(valueT(x) + valueDTD(y));
    } else if (x.isDtd && y.isTime) {
      return valueInverseT(valueT(y) + valueDTD(x));
    }
    throw new Error(`${typeof x} + ${typeof y} : operation unsupported for one or more operands types`);
  }),

  '-': _.curry((x, y) => { // eslint-disable-line consistent-return
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).minus(y));
    } else if (typeof x === 'string' && typeof y === 'string') {
      throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
    } else if ((x.isDateTime || x.isDate) && (y.isDateTime || y.isDate)) {
      return valueInverseDTD(valueDT(x) - valueDT(y));
    } else if (x.isTime && y.isTime) {
      return valueInverseDTD(valueT(x) - valueT(y));
    } else if (x.isYmd && y.isYmd) {
      return valueInverseYMD(valueYMD(x) - valueYMD(y));
    } else if (x.isDtd && y.isDtd) {
      return valueInverseDTD(valueDTD(x) - valueDTD(y));
    } else if ((x.isDateTime || x.isDate) && y.isYmd) {
      return dateandtime(date(x.year - (y.years + Math.floor((x.month - y.months) / 12)), (x.month - y.months) - (Math.floor((x.month - y.months) / 12) * 12), x.day), time(x));
    } else if (x.isYmd && (y.isDateTime || y.isDate)) {
      throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
    } else if ((x.isDateTime || x.isDate) && y.isDtd) {
      return valueInverseDT(valueDT(x) - valueDTD(y));
    } else if (x.isDtd && (y.isDateTime || y.isDate)) {
      throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
    } else if (x.isTime && y.isDtd) {
      return valueInverseT(valueT(x) - valueDTD(y));
    } else if (x.isDtd && y.isTime) {
      throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x} - ${typeof y} : operation unsupported for one or more operands types`);
  }),

  '*': _.curry((x, y) => {
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).times(y));
    } else if (x.isYmd && typeof y === 'number') {
      return valueInverseYMD(valueYMD(x) * y);
    } else if (typeof x === 'number' && y.isYmd) {
      return valueInverseYMD(x * valueYMD(y));
    } else if (x.isDtd && typeof y === 'number') {
      return valueInverseDTD(valueDTD(x) * y);
    } else if (typeof x === 'number' && y.isDtd) {
      return valueInverseDTD(x * valueDTD(y));
    }
    throw new Error(`${typeof x} * ${typeof y} : operation unsupported for one or more operands types`);
  }),
  '/': _.curry((x, y) => {
    if (typeof x === 'number' && typeof y === 'number') {
      return Number(Big(x).div(y));
    } else if (x.isYmd && typeof y === 'number') {
      return y === 0 ? null : valueInverseYMD(valueYMD(x) / y);
    } else if (typeof x === 'number' && y.isYmd) {
      return x === 0 ? null : valueInverseYMD(valueYMD(y) / x);
    } else if (x.isDtd && typeof y === 'number') {
      return y === 0 ? null : valueInverseDTD(valueDTD(x) / y);
    } else if (typeof x === 'number' && y.isDtd) {
      return x === 0 ? null : valueInverseDTD(valueDTD(y) / x);
    }
    throw new Error(`${typeof x} / ${typeof y} : operation unsupported for one or more operands types`);
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
    }
    throw new Error(`${typeof x} ** ${typeof y} : operation unsupported for one or more operands types`);
  }),
};

function checkEquality(x, y, props) {
  return props.reduce((recur, next) => recur && x[next] === y[next], true);
}

function checkInequality(op) {
  const fn = operatorMap[op];
  return function (x, y, props) {
    return props.reduce((recur, next) => recur || fn(x[next], y[next]), false);
  };
}

module.exports = operator => operatorMap[operator];
