/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
const moment = require('moment');

const { time_ISO_8601, date_ISO_8601 } = require('../../helper/meta');

const setTimezone = (obj, timezoneId) => obj.tz(timezoneId);

const formatDateTime = obj => moment(obj).format();

const formatDate = obj => moment(obj).format(date_ISO_8601);

const formatTime = obj => moment(obj).format(time_ISO_8601);

const format = (obj, fmt) => obj.format(fmt);

module.exports = { setTimezone, formatDateTime, formatDate, formatTime, format };
