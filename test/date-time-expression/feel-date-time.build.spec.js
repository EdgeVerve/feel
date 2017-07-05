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

describe(chalk.blue('date and time built-in function grammar test'), () => {
  it('should parse date and time with format "YYYY-MM-DDTHH:mm:ssZ"', (done) => {
    debugger;
    const text = 'date and time("2012-12-24T23:59:00").isDateTime';
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

  it('should parse date and time with format "([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2})(?:@(.+))+"', (done) => {
    const text = 'date and time("2012-12-24T00:01:00@Etc/UTC").isDateTime';
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
