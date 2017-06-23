/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/*
creates a negation function for any curried function
fn is expected to be a curried function with pre-populated x
fn signature - function(x,y) { // function body  }
*/

const not = fn => y => !fn(y);

module.exports = { not };
