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
debugger;
describe(chalk.blue('duration built-in function grammar test'), () => {
  it('should parse days and time duration', (done) => {
    const text = 'duration("P2DT20H14M").isDtd';
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

  it('should parse years and months duration', (done) => {
    const text = 'duration("P1Y2M").isYmd';
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

  it('should normalize "P13M" years and months duration to 1 year and 1 month and extract the years part', (done) => {
    const text = 'duration("P13M").years';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
            .then((result) => {
              expect(result).to.equal(1);
              done();
            }).catch((err) => {
              done(err);
            });
    } catch (err) {
      done(err);
    }
  });

  it('should extract months part from years and months duration', (done) => {
    const text = 'duration("P1Y11M").months';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
            .then((result) => {
              expect(result).to.equal(11);
              done();
            }).catch((err) => {
              done(err);
            });
    } catch (err) {
      done(err);
    }
  });

  it('should extract days part from days and time duration', (done) => {
    const text = 'duration("P5DT12H10M").days';
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

  it('should extract hours part from days and time duration', (done) => {
    const text = 'duration("P5DT12H10M").hours';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
            .then((result) => {
              expect(result).to.equal(12);
              done();
            }).catch((err) => {
              done(err);
            });
    } catch (err) {
      done(err);
    }
  });

  it('should extract minutes part from days and time duration', (done) => {
    const text = 'duration("P5DT12H10M").minutes';
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

  it('should extract seconds part from days and time duration', (done) => {
    const text = 'duration("P5DT12H10M25S").seconds';
    try {
      const parsedGrammar = FEEL.parse(text);
      parsedGrammar.build()
            .then((result) => {
              expect(result).to.equal(25);
              done();
            }).catch((err) => {
              done(err);
            });
    } catch (err) {
      done(err);
    }
  });

});
