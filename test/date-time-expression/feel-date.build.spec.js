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

describe(chalk.blue('date built-in function grammar test'), () => {
  it('should parse date with format "YYYY-MM-DD"', (done) => {
    const text = 'date("2017-06-10").isDate';
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

  it('should extract year part from date', (done) => {
    const text = 'date("2017-06-10").year';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
          .then((result) => {
            expect(result).to.equal(2017);
            done();
          }).catch((err) => {
            done(err);
          });
    } catch (err) {
      done(err);
    }
  });

  it('should extract month part from date', (done) => {
    const text = 'date("2017-06-10").month';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
          .then((result) => {
            expect(result).to.equal(5);
            done();
          }).catch((err) => {
            done(err);
          });
    } catch (err) {
      done(err);
    }
  });

  it('should extract day part from date', (done) => {
    const text = 'date("2017-06-10").day';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
          .then((result) => {
            expect(result).to.equal(10);
            done();
          }).catch((err) => {
            done(err);
          });
    } catch (err) {
      done(err);
    }
  });
});
