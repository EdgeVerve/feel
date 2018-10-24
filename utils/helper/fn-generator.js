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
const { logger } = require('../../logger');
const { enableExecutionLogging } = require('../../settings');
const moment = require('moment-timezone');

const $log = logger('fn-generator');
const log = {};

Object.keys($log).forEach((key) => {
  log[key] = (...args) => {
    if (enableExecutionLogging) {
      $log[key](...args);
    }
  };
});
/*
dateTimeComponent contains the list of properties required for comparision.
property collection is in the order of priority of check
priority order is essential for inequality check
for inequality check the property appearing first in the list needs to be checked first
before moving on to the next properties in the list
*/
const dateTimeComponent = {
  time: ['hour', 'minute', 'second', 'time offset'],
  date: ['year', 'month', 'day'],
  dateandtime: ['year', 'month', 'day', 'hour', 'minute', 'second', 'time offset'],
};

const presence = (...args) => args.reduce((acc, arg) => acc && (arg || arg === 0), true);

const typeEq = (...args) => args.reduce((acc, arg) => acc && typeof arg === acc ? typeof arg : false, typeof args[0]); // eslint-disable-line

const presencetypeEq = (...args) => presence(...args) && typeEq(...args) && true;

const operatorMap = {
  '<': _.curry((x, y) => {
    try {
      if (presencetypeEq(x, y)) {
        log.debug(`performing operation - ${x} < ${y}`);
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).lt(y);
        } else if (typeof x === 'string' && typeof y === 'string') {
          return x < y;
        } else if (x.isDate && y.isDate) {
          const checkLt = checkInequality('<'); // eslint-disable-line no-use-before-define
          return checkLt(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) < valueDT(y);
        } else if (x.isTime && y.isTime) {
          // make y with the same offset as x before comparision
          const xOffset = x['time offset'];
          y.utcOffset(xOffset);
          return valueT(x) < valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) < valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) < valueYMD(y);
        }
        throw new Error(`${x.type || typeof x} < ${y.type || typeof y} : operation unsupported for one or more operands types`);
      }
      throw new Error(`${typeof x && x} < ${typeof y && y} : operation invalid for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '<=': _.curry((x, y) => {
    try {
      if (presencetypeEq(x, y)) {
        log.debug(`performing operation - ${x} <= ${y}`);
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).lte(y);
        } else if (typeof x === 'string' && typeof y === 'string') {
          return x <= y;
        } else if (x.isDate && y.isDate) {
          const checkLtEq = checkInequality('<='); // eslint-disable-line no-use-before-define
          return checkLtEq(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) <= valueDT(y);
        } else if (x.isTime && y.isTime) {
          // make y with the same offset as x before comparision
          const xOffset = x['time offset'];
          y.utcOffset(xOffset);
          return valueT(x) <= valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) <= valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) <= valueYMD(y);
        }
        throw new Error(`${x.type || typeof x} <= ${y.type || typeof y} : operation unsupported for one or more operands types`);
      }
      throw new Error(`${typeof x && x} <= ${typeof y && y} : operation invalid for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '>': _.curry((x, y) => {
    try {
      if (presencetypeEq(x, y)) {
        log.debug(`performing operation - ${x} > ${y}`);
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).gt(y);
        } else if (typeof x === 'string' && typeof y === 'string') {
          return x > y;
        } else if (x.isDate && y.isDate) {
          const checkGt = checkInequality('>'); // eslint-disable-line no-use-before-define
          return checkGt(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) > valueDT(y);
        } else if (x.isTime && y.isTime) {
          // make y with the same offset as x before comparision
          const xOffset = x['time offset'];
          y.utcOffset(xOffset);
          return valueT(x) > valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) > valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) > valueYMD(y);
        }
        throw new Error(`${x.type || typeof x} > ${y.type || typeof y} : operation unsupported for one or more operands types`);
      }
      throw new Error(`${typeof x && x} > ${typeof y && y} : operation invalid for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '>=': _.curry((x, y) => {
    try {
      if (presencetypeEq(x, y)) {
        log.debug(`performing operation - ${x} >= ${y}`);
        if (typeof x === 'number' && typeof y === 'number') {
          return Big(x).gte(y);
        } else if (typeof x === 'string' && typeof y === 'string') {
          return x >= y;
        } else if (x.isDate && y.isDate) {
          const checkGtEq = checkInequality('>='); // eslint-disable-line no-use-before-define
          return checkGtEq(x, y, dateTimeComponent.date);
        } else if (x.isDateTime && y.isDateTime) {
          return valueDT(x) >= valueDT(y);
        } else if (x.isTime && y.isTime) {
          // make y with the same offset as x before comparision
          const xOffset = x['time offset'];
          y.utcOffset(xOffset);
          return valueT(x) >= valueT(y);
        } else if (x.isDtd && y.isDtd) {
          return valueDTD(x) >= valueDTD(y);
        } else if (x.isYmd && y.isYmd) {
          return valueYMD(x) >= valueYMD(y);
        }
        throw new Error(`${x.type || typeof x} >= ${y.type || typeof y} : operation unsupported for one or more operands types`);
      }
      throw new Error(`${typeof x && x} >= ${typeof y && y} : operation invalid for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '==': _.curry((x, y) => {
    log.debug(`performing operation - ${x} = ${y}`);
    try {
      if (typeof x === 'undefined' && typeof y === 'undefined') {
        return true;
      } else if (x === null && y === null) {
        return true;
      } else if (typeof x === 'number' && typeof y === 'number') {
        return Big(x).eq(y);
      } else if (typeof x === 'string' && typeof y === 'string') {
        return x === y;
      } else if (typeof x === 'boolean' && typeof y === 'boolean') {
        return x === y;
      } else if (x.isDate && y.isDate) {
        return checkEquality(x, y, dateTimeComponent.date); // eslint-disable-line no-use-before-define
      } else if (x.isDateTime && y.isDateTime) {
        // make y with the same offset as x before comparision
        const xOffset = x['time offset'];
        y.utcOffset(xOffset);
        return checkEquality(x, y, dateTimeComponent.dateandtime); // eslint-disable-line no-use-before-define
      } else if (x.isTime && y.isTime) {
        // make y with the same offset as x before comparision
        const xOffset = x['time offset'];
        y.utcOffset(xOffset);
        return checkEquality(x, y, dateTimeComponent.time); // eslint-disable-line no-use-before-define
      } else if (x.isDtd && y.isDtd) {
        return valueDTD(x) === valueDTD(y);
      } else if (x.isYmd && y.isYmd) {
        return valueYMD(x) === valueYMD(y);
      } else if (x.isList && y.isList) {
        return _.isEqual(x, y);
      }
      throw new Error(`${x.type || typeof x} = ${y.type || typeof y} : operation unsupported for one or more operands types`);
    } catch (err) {
      throw err;
    }
  }),
  '!=': _.curry((x, y) => {
    log.debug(`performing operation - ${x} != ${y}`);
    try {
      return !(operatorMap['=='](x, y));
    } catch (err) {
      throw err;
    }
  }),
  '||': _.curry((x, y) => {
    log.debug(`performing operation - ${x} or ${y}`);
    return x || y;
  }),
  '&&': _.curry((x, y) => {
    log.debug(`performing operation - ${x} and ${y}`);
    return x && y;
  }),
  '+': _.curry((x, y) => {
    if (presence(x, y)) {
      log.debug(`performing operation - ${x} + ${y}`);
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
        return dateandtime(date(y.year + x.years + Math.floor((y.month + x.months) / 12), (y.month + x.months) - (Math.floor((y.month + x.months) / 12) * 12), y.day), time(y));
      } else if ((x.isDateTime || x.isDate) && y.isDtd) {
        return valueInverseDT((valueDT(x) + valueDTD(y)), x['time offset']);
      } else if (x.isDtd && (y.isDateTime || y.isDate)) {
        return valueInverseDT((valueDT(y) + valueDTD(x)), y['time offset']);
      } else if (x.isTime && y.isDtd) {
        return valueInverseT((valueT(x) + valueDTD(y)), x['time offset']);
      } else if (x.isDtd && y.isTime) {
        return valueInverseT((valueT(y) + valueDTD(x)), y['time offset']);
      }
      throw new Error(`${x.type || typeof x} + ${y.type || typeof y} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x && x} + ${typeof y && y} : operation invalid for one or more operands types`);
  }),

  '-': _.curry((x, y) => {
    if (!x && y) {
      return -y;
    }
    if (presence(x, y)) {
      log.debug(`performing operation - ${x} - ${y}`);
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
        let { years, months } = y;
        const monthOverflow = Math.floor(months / 12);
        if (monthOverflow > 0) {
          years += monthOverflow;
          months -= monthOverflow * 12;
        }
        const clone = moment(x);
        clone.add(-years, 'years').add(-months, 'months');
        return dateandtime(date(clone.year(), clone.month(), clone.date()), time(clone.format()));
      } else if (x.isYmd && (y.isDateTime || y.isDate)) {
        throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
      } else if ((x.isDateTime || x.isDate) && y.isDtd) {
        return valueInverseDT(valueDT(x) - valueDTD(y), x['time offset']);
      } else if (x.isDtd && (y.isDateTime || y.isDate)) {
        throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
      } else if (x.isTime && y.isDtd) {
        return valueInverseT(valueT(x) - valueDTD(y), x['time offset']);
      } else if (x.isDtd && y.isTime) {
        throw new Error(`${x.type} - ${y.type} : operation unsupported for one or more operands types`);
      }
      throw new Error(`${x.type || typeof x} - ${y.type || typeof y} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x && x} - ${typeof y && y} : operation invalid for one or more operands types`);
  }),

  '*': _.curry((x, y) => {
    if (presence(x, y)) {
      log.debug(`performing operation - ${x} * ${y}`);
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
      throw new Error(`${x.type || typeof x} * ${y.type || typeof y} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x && x} * ${typeof y && y} : operation invalid for one or more operands types`);
  }),
  '/': _.curry((x, y) => {
    if (presence(x, y)) {
      log.debug(`performing operation - ${x} / ${y}`);
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
      throw new Error(`${x.type || typeof x} / ${y.type || typeof y} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x && x} / ${typeof y && y} : operation invalid for one or more operands types`);
  }),

  '**': _.curry((x, y) => {
    if (presence(x, y)) {
      log.debug(`performing operation - ${x} ** ${y}`);
      if (typeof x === 'number' && typeof y === 'number') {
        return Number(Big(x).pow(y));
      }
      throw new Error(`${x.type || typeof x} ** ${y.type || typeof y} : operation unsupported for one or more operands types`);
    }
    throw new Error(`${typeof x && x} ** ${typeof y && y} : operation invalid for one or more operands types`);
  }),
};

function checkEquality(x, y, props) {
  return props.reduce((recur, next) => recur && x[next] === y[next], true);
}

function checkInequality(op) {
  const fn = operatorMap[op];
  const equalsFn = operatorMap['=='];
  let fallThrough = true;
  const $fn = (a, b) => {
    fallThrough = false;
    return fn(a, b);
  };

  const $eq = (a, b) => {
    fallThrough = true;
    return equalsFn(a, b);
  };
  // const checkFn = (a, b) => equalsFn(a, b) || fn(a, b);
  // const checkFn = (a,b) => fallThrough && ($eq(a,b) || $fn(a,b));
  const checkFn = (a, b) => $eq(a, b) || $fn(a, b);

  return function (x, y, props) {
    // if (op === '>=' || op === '<=') {
    //   return props.every(prop => fn(x[prop], y[prop]));
    // }

    // return props.reduce((recur, next) => recur || fn(x[next], y[next]), false);
    // let fallThrough = true;
    // return props.reduce((prevResult, key) => {
    //   if (prevResult && fallThrough) {
    //     return checkFn(x[key], y[key]);
    //   }
    //   return prevResult;
    // }, true);
    let result = true;
    for (let i = 0; i < props.length && result && fallThrough; i += 1) {
      const key = props[i];
      result = checkFn(x[key], y[key]);
    }

    return result;
  };
}

module.exports = operator => operatorMap[operator];
