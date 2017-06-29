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

describe(chalk.blue('time built-in function grammar test'), function () {

    it('should parse time with format "HH:mm:ssZ"', function (done) {
        const text = 'time("13:01:05+05:30").isTime';
        try {
            const parsedGrammar = FEEL.parse(text);
            parsedGrammar.build()
            .then((result) => {
                expect(result).to.be.true;
                done();
            }).catch(err => {
                done(err);
            });
        } catch (err) {
            done(err);
        }
    });

    it('should parse time with format "([0-9]{2}):([0-9]{2}):([0-9]{2})(?:@(.+))+"', function (done) {
        const text = 'time("00:01:00@Etc/UTC").isTime';
        try {
            const parsedGrammar = FEEL.parse(text);
            parsedGrammar.build()
            .then((result) => {
                expect(result).to.be.true;
                done();
            }).catch(err => {
                done(err);
            });
        } catch (err) {
            done(err);
        }
    });

    it('should extract hour part from time', function (done) {
    const text = 'time("13:10:05@Etc/UTC").hour';
      try {
          const parsedGrammar = FEEL.parse(text);
          parsedGrammar.build()
          .then((result) => {
              expect(result).to.equal(13);
              done();
          }).catch(err => {
              done(err);
          });
      } catch (err) {
          done(err);
      }
    });

    it('should extract minute part from time', function (done) {
      const text = 'time("13:10:05@Etc/UTC").minute';
      try {
          const parsedGrammar = FEEL.parse(text);
          parsedGrammar.build()
          .then((result) => {
              expect(result).to.equal(10);
              done();
          }).catch(err => {
              done(err);
          });
      } catch (err) {
          done(err);
      }
    });

    it('should extract second part from time', function (done) {
      const text = 'time("13:10:05@Etc/UTC").second';
      try {
          const parsedGrammar = FEEL.parse(text);
          parsedGrammar.build()
          .then((result) => {
              expect(result).to.equal(5);
              done();
          }).catch(err => {
              done(err);
          });
      } catch (err) {
          done(err);
      }
    });

    it('should extract timezone part from time', function (done) {
      const text = 'time("13:10:05@Etc/UTC").timezone';
      try {
          const parsedGrammar = FEEL.parse(text);
          parsedGrammar.build()
          .then((result) => {
              expect(result).to.equal("Etc/UTC");
              done();
          }).catch(err => {
              done(err);
          });
      } catch (err) {
          done(err);
      }
    });
});
