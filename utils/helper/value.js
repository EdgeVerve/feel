/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/*
Decision Model and Notation, v1.1
Page : 112 - 113
value and valueInverse functions for each of the time, date, date_and_time and duration types.
These functions are not exposed as a part of in-built function suite.
These are used for performing calculations and conversions.
*/

const moment = require('moment');
const { time, dateandtime, duration } = require('../built-in-functions');

const prepareTime = (value) => {
  let remainingTime = value;
  const hour = Math.floor(remainingTime / 3600);
  remainingTime = value % 3600;
  const minute = Math.floor(remainingTime / 60);
  remainingTime = value % 60;
  const second = remainingTime;

  return moment({ hour, minute, second }).format('THH:mm:ss');
};

const valueT = (obj) => {
  if (obj.isTime) {
    return moment.duration(`PT${obj.hour}H${obj.minute}M${obj.second}S`).asSeconds();
  }
  throw new Error('Type Error');
};

const valueInverseT = (value) => {
  if (value >= 0 && value <= 86400) {
    return time(prepareTime(value));
  }
  const secondsFromMidnight = value - (Math.floor(value / 86400) * 86400);
  return time(prepareTime(secondsFromMidnight));
};

const valueDT = (obj) => {
  const epoch = moment('1970-01-01', 'YYYY-MM-DD');
  if (obj.isDateTime || obj.isDate) {
    const duration = moment.duration(obj.diff(epoch));
    return duration.asSeconds();
  }
  throw new Error('Type Error');
};

const valueInverseDT = (value) => {
  const epoch = moment('1970-01-01', 'YYYY-MM-DD');
  return dateandtime(epoch.add(value, 'seconds').format());
};

const valueDTD = (obj) => {
  if (obj.isDtd) {
    return obj.asSeconds();
  }
  throw new Error('Type Error');
};

const valueInverseDTD = value => duration(`PT${value}S`);

const valueYMD = (obj) => {
  if (obj.isYmd) {
    return obj.asMonths();
  }
  throw new Error('Type Error');
};

const valueInverseYMD = value => duration(`P${value}M`);

module.exports = { valueT, valueInverseT, valueDT, valueInverseDT, valueDTD, valueInverseDTD, valueYMD, valueInverseYMD };
