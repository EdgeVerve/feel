const moment = require('moment');

const prepareTime = (value) => {
  let remainingTime = value;
  const hour = Math.floor(remainingTime / 3600);
  remainingTime = value % 3600;
  const minute = Math.floor(remainingTime / 60);
  remainingTime = value % 60;
  const second = remainingTime;

  return moment({ hour, minute, second }).format('THH:mm:ss');
};

const valueT = (obj) => {
  if (obj.isTime) {
    return (this.hour() * 3600) + (this.minute() * 60) + this.second();
  }
  throw new Error('Type Error');
};

const valueInverseT = (value) => {
  if (value >= 0 && value <= 86400) {
    return prepareTime(value);
  }
  const secondsFromMidnight = value - (Math.floor(value / 86400) * 86400);
  return prepareTime(secondsFromMidnight);
};


module.exports = { valueT, valueInverseT };
