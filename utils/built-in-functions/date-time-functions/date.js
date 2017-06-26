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
const { date_ISO_8601, types, properties } = require('./meta');

const { year, month, day } = properties;
const props = Object.assign({}, { year, month, day, type: types.date, isDate: true });

const isNumber = args => args.reduce((prev, next) => prev && typeof next === 'number', true);

const parseDate = (str) => {
  try {
    const d = moment(str, date_ISO_8601);
    return d.isValid() ? d : new Error('Invalid date. This is usually caused by an inappropriate format. Please check the input format.');
  } catch (err) {
    return err;
  }
};

const date = (...args) => {
  let d;
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg === 'string') {
      d = parseDate(arg);
    } else if (typeof arg === 'object' && arg.isDateTime) {
      const year = arg.year;
      const month = arg.month;
      const day = arg.day;
      d = moment({ year, month, day });
    } else {
      throw new Error('Invalid format encountered. Please specify date in one of these formats :\n- "date("2012-12-25")"\n- date_and_time object');
    }
  } else if (args.length === 3 && isNumber(args)) {
    const [year, month, day] = args;
    d = moment({ year, month, day });
    d = d.isValid() ? d : new Error('Invalid date');
  } else {
    throw new Error('Invalid number of arguments specified with "date" in-built function');
  }

  if (d instanceof Error) {
    throw d;
  } else {
    return addProperties(d, props);
  }
};

module.exports = { date };

