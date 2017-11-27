/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/**
 * All the library wide settings can be configured in this file.
 * This is a collection of the default settings.
*/

module.exports = {
  logger: {
    name: 'js-feel',
    streams: [
      {
        stream: process.stdout,
        level: 'error',
      },
    ],
  },
};
