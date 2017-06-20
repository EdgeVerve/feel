/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../../dist/feel');

describe(chalk.blue('time built-in function grammar test'), function () {

    it('should parse time with format "HH:mm:ssZ"', function (done) {
        var text = 'time("13:01:05+05:30").isTime';
        try {
            var parsedGrammar = FEEL.parse(text);
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
        var text = 'time("00:01:00@Etc/UTC").isTime';
        try {
            var parsedGrammar = FEEL.parse(text);
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
    var text = 'time("13:10:05@Etc/UTC").hour';
      try {
          var parsedGrammar = FEEL.parse(text);
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
      var text = 'time("13:10:05@Etc/UTC").minute';
      try {
          var parsedGrammar = FEEL.parse(text);
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
      var text = 'time("13:10:05@Etc/UTC").second';
      try {
          var parsedGrammar = FEEL.parse(text);
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
      var text = 'time("13:10:05@Etc/UTC").timezone';
      try {
          var parsedGrammar = FEEL.parse(text);
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
