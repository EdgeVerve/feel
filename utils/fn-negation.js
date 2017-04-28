/*  
*  
*  ©2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/
// creates a negation function for any curried function
// fn is expected to be a curried function with pre-populated x
// see ./utils/fn-generator.js for details
module.exports = fn => y => !fn(y);
