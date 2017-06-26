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

    it('should add years and months duration addition to dateandtime and return a dateandtime', function(done) {
        var text = 'dateandtime("2012-12-24T23:59:00") + duration("P1Y")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result.isDateTime).to.be.true;
            expect(result.year).to.equal(2013);
            done();
        }).catch(err => done(err));
    });
});
