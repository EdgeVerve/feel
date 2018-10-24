/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
const chalk = require('chalk');
const chai = require('chai');
const FEEL = require('../../dist/feel');

const expect = chai.expect;

describe(chalk.blue('misc date-and-time related tests...'), () => {
  it('should subtract months from last day of month correctly', (done) => {
    debugger;
    const text = 'date(date("2018-07-31") - duration("P1M")) = date("2018-06-30")';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
            .then((result) => {
              expect(result).to.be.true;
              done();
            }).catch((err) => {
              done(err);
            });
    } catch (err) {
      done(err);
    }
  });
  
});
