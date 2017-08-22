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
Format : date(from) // from - date string
Description : convert "from" to a date
e.g. : date("2012-12-25") – date("2012-12-24") = duration("P1D")
*/

/*
Format : date and time(from) // from - date_and_time
Description : convert "from" to a date (set time components to null)
e.g. : date(date and time("2012-12-25T11:00:00Z")) = date("2012-12-25")
*/

/*
Format : date(year, month, day) // year, month, day are numbers
Description : creates a date from year, month, day component values
e.g. : date(2012, 12, 25) = date("2012-12-25")
*/

const moment = require('moment-timezone');
const addProperties = require('./add-properties');
const { types, properties, UTC, UTCTimePart, time_ISO_8601, date_ISO_8601 } = require('../../helper/meta');

const { year, month, day } = properties;
const props = Object.assign({}, { year, month, day, type: types.date, isDate: true });

const isNumber = args => args.reduce((prev, next) => prev && typeof next === 'number', true);

const parseDate = (str) => {
  try {
    const d = moment.parseZone(`${str}${UTCTimePart}`);
    if (d.isValid()) {
      return d;
    }
    throw new Error('Invalid date. This is usually caused by an inappropriate format. Please check the input format.');
  } catch (err) {
    return err;
  }
};

const date = (...args) => {
  let d;
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') {
      try {
        d = arg === '' ? moment.parseZone(UTCTimePart, time_ISO_8601) : parseDate(arg);
      } catch (err) {
        throw err;
      }
    } else if (typeof arg === 'object') {
      if (arg instanceof Date) {
        const ISO = arg.toISOString();
        const dateTime = moment.parseZone(ISO);
        const datePart = dateTime.format(date_ISO_8601);
        d = moment.parseZone(`${datePart}${UTCTimePart}`);
      } else if (arg.isDateTime) {
        const dateTime = moment.tz(arg.format(), UTC);
        const datePart = dateTime.format(date_ISO_8601);
        d = moment.parseZone(`${datePart}${UTCTimePart}`);
      }
      if (!d.isValid()) {
        throw new Error('Invalid date. Parsing error while attempting to create date from date and time');
      }
    } else {
      throw new Error('Invalid format encountered. Please specify date in one of these formats :\n- "date("2012-12-25")"\n- date_and_time object');
    }
  } else if (args.length === 3 && isNumber(args)) {
    const [year, month, day] = args;
    d = moment.tz({ year, month, day, hour: 0, minute: 0, second: 0 }, UTC);
    if (!d.isValid()) {
      throw new Error('Invalid date. Parsing error while attempting to create date from parts');
    }
  } else {
    throw new Error('Invalid number of arguments specified with "date" in-built function');
  }

  return addProperties(d, props);
};

module.exports = { date };

