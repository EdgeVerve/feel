/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/*
Decision Model and Notation, v1.1
Page : 131
*/

/*
Format : duration(from) // from - duration string
Description :convert "from" to a days and time or years and months duration
e.g. : date_and_time("2012-12-24T23:59:00") - date_and_time("2012-12-22T03:45:00") = duration("P2DT20H14M")
duration("P2Y2M") = duration("P26M")
*/

/*
Format : years_and_months_duration(from, to) // both are date_and_time
Description : return years and months duration between "from" and "to"
e.g. : years and months duration(date("2011-12-22"), date("2013-08-24")) = duration("P1Y8M")
*/

const moment = require('moment');
const addProperties = require('./add-properties');
const { ymd_ISO_8601, dtd_ISO_8601, types, properties } = require('../../helper/meta');

const { years, months, days, hours, minutes, seconds } = properties;
const dtdProps = Object.assign({}, { days, hours, minutes, seconds, type: types.dtd, isDtd: true, isDuration: true });
const ymdProps = Object.assign({}, { years, months, type: types.ymd, isYmd: true, isDuration: true });

const isDateTime = args => args.reduce((recur, next) => recur && (next.isDateTime || next.isDate), true);

const daysAndTimeDuration = (...args) => {
  let dtd;
  if (args.length === 1) {
    dtd = moment.duration(args[0]);
    dtd = dtd.isValid() ? dtd : new Error('Invalid Duration : "days_and_time_duration" in-built function');
  } else if (args.length === 2 && isDateTime(args)) {
    const [start, end] = args;
    dtd = moment.duration(Math.floor(end.diff(start)));
  } else {
    throw new Error('Invalid number of arguments specified with "days_and_time_duration" in-built function');
  }

  if (dtd instanceof Error) {
    throw dtd;
  } else {
    return addProperties(dtd, dtdProps);
  }
};

const yearsAndMonthsDuration = (...args) => {
  let ymd;
  if (args.length === 1) {
    ymd = moment.duration(args[0]);
    ymd = ymd.isValid() ? ymd : new Error('Invalid Duration : "years_and_months_duration" in-built function');
  } else if (args.length === 2 && isDateTime(args)) {
    const [start, end] = args;
    const months = Math.floor(moment.duration(end.diff(start)).asMonths());
    ymd = moment.duration(months, 'months');
  } else {
    throw new Error('Invalid number of arguments specified with "years_and_months_duration" in-built function');
  }

  if (ymd instanceof Error) {
    throw ymd;
  } else {
    return addProperties(ymd, ymdProps);
  }
};

// slice(1) is necessary as "P" will be available in both the patterns and we need to check if some optional part is not undefined to determine a type
const patternMatch = (arg, pattern) => arg.match(pattern).slice(1).reduce((recur, next) => recur || Boolean(next), false);

const duration = (arg) => {
  if (typeof arg === 'string') {
    if (patternMatch(arg, ymd_ISO_8601)) {
      try {
        return yearsAndMonthsDuration(arg);
      } catch (err) {
        throw err;
      }
    } else if (patternMatch(arg, dtd_ISO_8601)) {
      try {
        return daysAndTimeDuration(arg);
      } catch (err) {
        throw err;
      }
    }
    throw new Error('Invalid Format : "duration" built-in function. Please check the input format');
  }
  throw new Error(`Type Error : "duration" built-in function expects a string but "${typeof arg}" encountered`);
};


module.exports = { duration, 'years and months duration': yearsAndMonthsDuration, 'days and time duration': daysAndTimeDuration };
