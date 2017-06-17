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

// proxy return value somehow to include a marker
// which specifies the type for other functions
// to use for checking types before applying functions on them.

const moment = require('moment');
const applyMixin = require('./apply-mixin');

const isNumber = (...args) => args.reduce((prev, next) => prev && typeof next === 'number', true);

const prepareTime = (value) => {
  let remainingTime = value;
  const hour = Math.floor(remainingTime / 3600);
  remainingTime = value % 3600;
  const minute = Math.floor(remainingTime / 60);
  remainingTime = value % 60;
  const second = remainingTime;

  return moment({ hour, minute, second }).format('THH:mm:ss');
};

const mixin = {
  hour: {
    fn() { return this.hour(); },
    executeOnApply: true,
  },
  minute: {
    fn() { return this.minute(); },
    executeOnApply: true,
  },
  second: {
    fn() { return this.second(); },
    executeOnApply: true,
  },
  time_offset: {
    fn() { return this.utcOffset(); },
    executeOnApply: true,
  },
  timezone: {
    fn() { return this._z && this._z.name; },  // eslint-disable-line no-underscore-dangle
    executeOnApply: true,
  },
  value: {
    fn() { return (this.hour() * 3600) + (this.minute() * 60) + this.second(); },
  },
  valueInverse: {
    fn(value) {
      if (value >= 0 && value <= 86400) {
        return prepareTime(value);
      }
      const secondsFromMidnight = value - (Math.floor(value / 86400) * 86400);
      return prepareTime(secondsFromMidnight);
    },
  },
};

const timeFormat = 'HH:mm:ssZ';

const parseMomentFormat = (str) => {
  const format = timeFormat;
  try {
    const t = moment(str, format);
    return t.isValid() ? t : new Error('Invalid Time');
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
      t = parseTzId(arg) && parseMomentFormat(arg);
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
      throw new Error('Type Mismatch - the fourth parameter is expected to be of type "duration"');
    }
  } else {
    throw new Error('Invalid number of arguments specified with "time" in-built function');
  }

  if (t && t instanceof Error) {
    throw t;
  } else {
    return applyMixin(t, mixin);
  }
};

module.exports = { time };
