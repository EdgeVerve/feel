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
Format : date_and_time(date, time)
Description : date is a date or date time; time is a time creates a date time from the given date (ignoring any time component) and the given time
e.g. : date_and_time("2012-12-24T23:59:00") = date_and_time(date("2012-12-24”), time(“T23:59:00"))
*/

/*
Format : date and time(from) // from - date time string
Description : date time string convert "from" to a date and time
e.g. : date and time("2012-12-24T23:59:00") + duration("PT1M") = date and time("2012-12-25T00:00:00")
*/


const moment = require('moment-timezone');
const addProperties = require('./add-properties');
const { time_ISO_8601, date_ISO_8601, date_time_IANA_tz, types, properties } = require('./meta');

const { year, month, day, hour, minute, second, time_offset, timezone } = properties;
const props = Object.assign({}, { year, month, day, hour, minute, second, time_offset, timezone, type: types.date_and_time, isDateTime: true });

const parseIANATz = (str) => {
  const match = str.match(date_time_IANA_tz);
  if (match) {
    const [dateTime, timeZone] = match.slice(1);
    if (dateTime && timeZone) {
      try {
        const dt = moment(dateTime).tz(timeZone);
        return dt;
      } catch (err) {
        return err;
      }
    }
    return new Error(`Error parsing IANA format input. One or more parts are missing. DateTimePart : ${dateTime} TimeZonePart : ${timeZone}`);
  }
  return match;
};

const date_and_time = (...args) => { // eslint-disable-line camelcase
  let dt;
  if (args.length === 1) {
    const arg = args[0];
    dt = parseIANATz(arg) || moment(arg);
    dt = dt.isValid() ? dt : new Error('Invalid date_and_time. This is usually caused by an invalid format. Please check the input format');
  } else if (args.length === 2) {
    const [date, time] = args;
    if (date && date.isDate && time && time.isTime) {
      dt = moment(`${date.format(date_ISO_8601)}${time.format(time_ISO_8601)}`);
      dt = dt.isValid() ? dt : new Error('Invalid date_and_time');
    } else {
      throw new Error('Type Mismatch - args specified with date_and_time are expected to be of type date and time respectively. Please check the arguments order or type');
    }
  } else {
    throw new Error('Invalid number of arguments specified with "date_and_time" in-built function');
  }

  if (dt instanceof Error) {
    throw dt;
  } else {
    return addProperties(dt, props);
  }
};

module.exports = { date_and_time }; // eslint-disable-line camelcase
