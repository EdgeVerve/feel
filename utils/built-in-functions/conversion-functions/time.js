/*
Decision Model and Notation, v1.1
Page : 131
*/

/*
Format : time(from)
Description : time string convert from to time
e.g. : time("23:59:00z") + duration("PT2M") = time("00:01:00@Etc/UTC")
*/

/*
Format : time(from)
Description : time, date and time convert from to time (ignoring date components)
e.g. : time(date and time("2012-12-25T11:00:00Z")) = time("11:00:00Z")
*/

/*
Format : time(hour, minute, second, offset)
Description : hour, minute, second, are numbers, offset is a days and time duration, or null creates a time from the given component values
e.g. : time(“T23:59:00z") = time(23, 59, 0, duration(“PT0H”))
*/

const moment = require('moment-timezone');
const addProperties = require('./add-properties');

const isNumber = (...args) => args.reduce((prev, next) => prev && typeof next === 'number', true);

const properties = {
  hour() { return this.hour(); },
  minute() { return this.minute(); },
  second() { return this.second(); },
  time_offset() { return this.utcOffset(); },
  timezone() { return this._z && this._z.name; },  // eslint-disable-line no-underscore-dangle,
  isTime: true,
};

const timeFormat = 'HH:mm:ssZ';

const parseMomentFormat = (str) => {
  const format = timeFormat;
  try {
    const t = moment(str, format);
    return t.isValid() ? t : new Error('Invalid Time. This is usually caused by an inappropriate format. Please check the input format.');
  } catch (err) {
    return err;
  }
};

const parseTzId = (str) => {
  const tzFormat = /([0-9]{2}):([0-9]{2}):([0-9]{2})(?:@(.+))+/;
  const match = str.match(tzFormat);
  if (match) {
    const [hour, minute, second, tz] = match.slice(1);
    if (hour > -1 && hour < 24 && minute > -1 && minute < 60 && second > -1 && second < 60 && tz) {
      try {
        const t = moment.tz({ hour, minute, second }, tz);
        return t.isValid() ? t : new Error('Invalid Time');
      } catch (err) {
        return err;
      }
    }
    return new Error(`Out of Range - hour : ${hour} minute : ${minute} second : ${second}`);
  }
  return false;
};

const time = (...args) => {
  let t;
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') {
      t = parseTzId(arg) || parseMomentFormat(arg);
    } else if (typeof arg === 'object' && arg.isDateTime) {
      const timePart = arg.format(timeFormat);
      t = parseMomentFormat(timePart);
    } else {
      throw new Error('Invalid format encountered. Please specify time in one of these formats :\n- "23:59:00z"\n- "00:01:00@Etc/UTC"\n- date and time object');
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
  } else {
    throw new Error('Invalid number of arguments specified with "time" in-built function');
  }

  if (t && t instanceof Error) {
    throw t;
  } else {
    return addProperties(t, properties);
  }
};

module.exports = { time };
