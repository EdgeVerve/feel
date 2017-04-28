/*  
*  
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/

/* eslint-disable */

const moment = require('moment');

const date = (...args) => {
  const [arg_1, month, day] = args;
  let dt = null;
  if (typeof arg_1 === 'string') {
    const dt_temp = moment(arg_1);
    dt = moment({
      years: dt_temp.year(),
      months: dt_temp.month(),
      date: dt_temp.date(),
    });
  } else if (arg_1._isDateTime()) {
    dt = moment({
      years: arg_1.year(),
      months: arg_1.month(),
      date: arg_1.date(),
    });
  } else if (typeof year === 'number' && typeof month === 'number' && typeof day === 'number') {
    dt = moment({
      years: arg_1,
      months: month,
      date: day,
    });
  } else {
    throw 'insufficient number of arguments or datatype mismatch';
  }
  dt.isDate = () => true;
};

const date_and_time = (...args) => {
  const [date, time] = args;
  let dt;
  if (typeof date === 'string') {
    dt = moment(dateTimeString);
  } else if (date.isDate() && time.isTime()) {
    var dateTimeString = `${date.format('YYYY-MM-DD')}T${time.format('HH:mm:ssZ')}`;
    dt = moment(dateTimeString);
  } else {
    throw 'insufficient number of arguments or datatype mismatch';
  }

  dt.isDateTime = () => true;
  return dt;
};

const time = (...args) => {
	// var [arg_1, arg_2, second, offset] = args;
	// var dt;
	// if (typeof arg_1 === "string") {
	// 	dt = moment.format("YYYY-MM-DD") + "T" +
	// }

	// dt.isTime = () => true;
	// return dt;
};

const duration = durationString => moment.duration(durationString);

module.exports = {
  date,
  date_and_time,
  time,
  duration,
};
