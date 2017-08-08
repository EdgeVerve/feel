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
const { time_ISO_8601, time_IANA_tz, types, properties } = require('../../helper/meta');
const { duration } = require('./duration');

const { hour, minute, second, 'time offset': time_offset, timezone } = properties;
const props = Object.assign({}, { hour, minute, second, 'time offset': time_offset, timezone, type: types.time, isTime: true });

const isNumber = args => args.reduce((prev, next) => prev && typeof next === 'number', true);

const parseTime = (str) => {
  try {
    const t = moment.parseZone(str, time_ISO_8601);
    if (t.isValid()) {
      return t;
    }
    throw new Error('Invalid ISO_8601 format time. This is usually caused by an inappropriate format. Please check the input format.');
  } catch (err) {
    throw err;
  }
};

const dtdToOffset = (dtd) => {
  const msPerDay = 86400000;
  const msPerHour = 3600000;
  const msPerMinute = 60000;
  let d = dtd;
  if (typeof dtd === 'number') {
    const ms = Math.abs(dtd);
    let remaining = ms % msPerDay;
    const hours = remaining / msPerHour;
    remaining %= msPerHour;
    const minutes = remaining / msPerMinute;
    d = duration(`PT${hours}H${minutes}M`);
  }
  if (d.isDtd) {
    let { hours, minutes } = d;
    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minutes}`;
  }
  throw new Error('Invalid Type');
};

const parseIANATz = (str) => {
  const match = str.match(time_IANA_tz);
  if (match) {
    const [hour, minute, second, tz] = match.slice(1);
    if (hour && minute && second && tz) {
      try {
        const t = moment.tz({ hour, minute, second }, tz);
        if (t.isValid()) {
          return t;
        }
        throw new Error('Invalid IANA format time. This is usually caused by an inappropriate format. Please check the input format.');
      } catch (err) {
        throw err;
      }
    }
    throw new Error(`Error parsing IANA format input. One or more parts are missing - hour : ${hour} minute : ${minute} second : ${second} timezone : ${tz}`);
  }
  return match;
};

const time = (...args) => {
  let t;
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') {
      try {
        t = arg === '' ? moment() : parseIANATz(arg) || parseTime(arg);
      } catch (err) {
        throw err;
      }
    } else if (typeof arg === 'object') {
      if (arg instanceof Date) {
        t = moment.parseZone(arg.toISOString);
      } else if (arg.isDateTime) {
        const str = arg.format(time_ISO_8601);
        t = moment.parseZone(str, time_ISO_8601);
      }
      if (!t.isValid()) {
        throw new Error('Invalid time. Parsing error while attempting to extract time from date and time.');
      }
    } else {
      throw new Error('Invalid format encountered. Please specify time in one of these formats :\n- "23:59:00z"\n- "00:01:00@Etc/UTC"\n- date_and_time object');
    }
  } else if (args.length >= 3 && isNumber(args.slice(0, 3))) {
    const [hour, minute, second] = args.slice(0, 3);
    t = moment({ hour, minute, second });
    const dtd = args[3];
    if (dtd) {
      try {
        const sign = Math.sign(dtd) < 0 ? '-' : '+';
        const offset = `${sign}${dtdToOffset(dtd)}`;
        t = moment.parseZone(`${moment({ hour, minute, second }).format('THH:mm:ss')}${offset}`, time_ISO_8601);
      } catch (err) {
        throw new Error(`${err.message} - the fourth argument in "time" in-built function is expected to be of type "days and time duration"`);
      }
    }
    if (!t.isValid()) {
      throw new Error('Invalid time. Parsing error while attempting to create time from parts');
    }
  } else {
    throw new Error('Invalid number of arguments specified with "time" in-built function');
  }

  return addProperties(t, props);
};

module.exports = { time };
