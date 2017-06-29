/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/*
Decision Model and Notation, v1.1
Page : 131-132
*/

/*
Format : time(from) // from - time string
Description : time string convert "from" to time
e.g. : time("23:59:00z") + duration("PT2M") = time("00:01:00@Etc/UTC")
*/

/*
Format : time(from) // from - time, date_and_time
Description : time, date and time convert "from" to time (ignoring date components)
e.g. : time(date and time("2012-12-25T11:00:00Z")) = time("11:00:00Z")
*/

/*
Format : time(hour, minute, second, offset)
Description : hour, minute, second, are numbers, offset is a days and time duration, or null creates a time from the given component values
e.g. : time(“T23:59:00z") = time(23, 59, 0, duration(“PT0H”))
*/

const moment = require('moment-timezone');
const addProperties = require('./add-properties');
const { time_ISO_8601, time_IANA_tz, types, properties } = require('./meta');

const { hour, minute, second, time_offset, timezone } = properties;
const props = Object.assign({}, { hour, minute, second, time_offset, timezone, type: types.time, isTime: true });

const isNumber = args => args.reduce((prev, next) => prev && typeof next === 'number', true);

const parseTime = (str) => {
  try {
    const t = moment(str, time_ISO_8601);
    return t.isValid() ? t : new Error('Invalid ISO_8601 format time. This is usually caused by an inappropriate format. Please check the input format.');
  } catch (err) {
    return err;
  }
};

const parseIANATz = (str) => {
  const match = str.match(time_IANA_tz);
  if (match) {
    const [hour, minute, second, tz] = match.slice(1);
    if (hour && minute && second && tz) {
      try {
        const t = moment.tz({ hour, minute, second }, tz);
        return t.isValid() ? t : new Error('Invalid IANA format time. This is usually caused by an inappropriate format. Please check the input format.');
      } catch (err) {
        return err;
      }
    }
    return new Error(`Error parsing IANA format input. One or more parts are missing - hour : ${hour} minute : ${minute} second : ${second} timezone : ${tz}`);
  }
  return match;
};

const time = (...args) => {
  let t;
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') {
      t = parseIANATz(arg) || parseTime(arg);
    } else if (typeof arg === 'object' && arg.isDateTime) {
      const hour = arg.hour;
      const minute = arg.minute;
      const second = arg.second;
      t = moment({ hour, minute, second });
    } else {
      throw new Error('Invalid format encountered. Please specify time in one of these formats :\n- "23:59:00z"\n- "00:01:00@Etc/UTC"\n- date_and_time object');
    }
  } else if (args.length >= 3 && isNumber(args.slice(0, 3))) {
    const [hour, minute, second] = args.slice(0, 3);
    t = moment({ hour, minute, second });
    const offset = args[3];
    if (offset && offset.isDuration) {
      t.utcOffset(offset.value);
    } else {
      throw new Error('Type Mismatch - the fourth argument in "time" in-built function is expected to be of type "duration"');
    }
    t = t.isValid() ? t : new Error('Invalid time');
  } else {
    throw new Error('Invalid number of arguments specified with "time" in-built function');
  }

  if (t instanceof Error) {
    throw t;
  } else {
    return addProperties(t, props);
  }
};

module.exports = { time };
