/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
// add new properties to the kwargs object
// returns the updated _args object
module.exports = (_args, obj = {}) => Object.assign({}, _args, {
  kwargs: Object.assign({}, _args.kwargs, obj),
});
