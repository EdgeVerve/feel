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

describe(chalk.blue('Arithmetic expression ast parsing test'), function() {
    it('Successfully builds ast from simple arithmetic expression', function(done) {
        var text = 'a + b - c';
        var _context = {
            a: 10,
            b: 20,
            c: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '((a + b)/c - (d + e*2))**f';

        var _context = {
            a: 10,
            b: 20,
            c: 5,
            d: 6,
            e: 30,
            f: 3
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '1-(1+rate/12)**-term';
        var _context = {
            rate: 12,
            term: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '(a + b)**-c';
        _context = {
            a: 10,
            b: 20,
            c: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('should do date subtraction and return a duration', function(done) {
        var text = 'date("2012-12-25") - date("2012-12-24")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDuration).to.be.true;
            expect(result.isDtd).to.be.true;
            expect(result.days).to.equal(1);
            done();
        }).catch(err => done(err));
    });

    it('should do throw error for date addition', function(done) {
        var text = 'date("2012-12-25") + date("2012-12-24")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build()
        .catch(err => {
          expect(err instanceof Error).to.be.true;
          expect(err.message).to.equal('date + date : operation unsupported for one or more operands types');
          done();
        });
    });

    it('should do time subtraction and return a duration', function(done) {
        var text = 'time("T13:10:06") - time("T13:10:05")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDuration).to.be.true;
            expect(result.isDtd).to.be.true;
            expect(result.seconds).to.equal(1);
            done();
        }).catch(err => done(err));
    });

    it('should do throw error for time addition', function(done) {
        var text = 'time("T13:10:06") + time("T13:10:05")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build()
        .catch(err => {
          expect(err instanceof Error).to.be.true;
          expect(err.message).to.equal('time + time : operation unsupported for one or more operands types');
          done();
        });
    });

    it('should do years and months duration subtraction and return a years and months duration', function(done) {
        var text = 'duration("P1Y13M") - duration("P1M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDuration).to.be.true;
            expect(result.isYmd).to.be.true;
            expect(result.years).to.equal(2);
            done();
        }).catch(err => done(err));
    });

    it('should do years and months duration addition and return a years and months duration', function(done) {
        var text = 'duration("P1Y11M") + duration("P1M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDuration).to.be.true;
            expect(result.isYmd).to.be.true;
            expect(result.years).to.equal(2);
            done();
        }).catch(err => done(err));
    });

    it('should add years and months duration addition to date and time and return a date and time', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") + duration("P1Y")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDateTime).to.be.true;
            expect(result.year).to.equal(2013);
            done();
        }).catch(err => done(err));
    });

    it('should multiply years and months duration with number and return a years and months duration', function(done) {
      var text = 'duration("P1Y5M") * 5';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.years).to.equal(7);
          expect(result.months).to.equal(1);
          done();
      }).catch(err => done(err));
    });

    it('should multiply days and time duration with number and return a days and time duration', function(done) {
      var text = 'duration("P5DT12H20M40S") * 5';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.days).to.equal(27);
          expect(result.hours).to.equal(13);
          expect(result.minutes).to.equal(43);
          expect(result.seconds).to.equal(20);
          done();
      }).catch(err => done(err));
    });

     it('should multiply years and months duration with number and return a years and months duration', function(done) {
      var text = 'duration("P1Y5M") * 5';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.years).to.equal(7);
          expect(result.months).to.equal(1);
          done();
      }).catch(err => done(err));
    });

    it('should divide days and time duration with number and return a null when the number is 0', function(done) {
      var text = 'duration("P5DT12H20M40S") / 0';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result).to.be.null;
          done();
      }).catch(err => done(err));
    });

    it('should divide days and time duration with number and return a days and time duration', function(done) {
      var text = 'duration("P5DT12H20M40S") / 5';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.days).to.equal(1);
          expect(result.hours).to.equal(2);
          expect(result.minutes).to.equal(28);
          expect(result.seconds).to.equal(8);
          done();
      }).catch(err => done(err));
    });

    it('should divide years and months duration with number and return a null when the number is 0', function(done) {
      var text = 'duration("P1Y5M") / 0';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result).to.be.null;
          done();
      }).catch(err => done(err));
    });

    it('should divide years and months duration with number and return a years and months duration', function(done) {
      var text = 'duration("P5Y5M") / 5';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.years).to.equal(1);
          expect(result.months).to.equal(1);
          done();
      }).catch(err => done(err));
    });

    it('should divide number with years and months duration and return a years and months duration', function(done) {
      var text = '5 / duration("P5Y5M")';
      var parsedGrammar = FEEL.parse(text);
      parsedGrammar.build().then(result => {
          expect(result.years).to.equal(1);
          expect(result.months).to.equal(1);
          done();
      }).catch(err => done(err));
    });
});
