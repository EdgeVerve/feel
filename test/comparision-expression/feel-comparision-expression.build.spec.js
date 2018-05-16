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

describe(chalk.blue('Comparision expression ast parsing test'), function() {

    it('Successfully builds ast from simple comparision expression', function(done) {
        var text = '5 in (<= 5)';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '5 in (5..10]';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '5 in ([5..10])';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '5 in (4,5,6)';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '5 in (<5,>5)';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '(a + 5) >= (7 + g)';

        _context = {
            a: 10,
            g: 7
        }
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from comparision expression', function(done) {
        var text = '(a+b) between (c + d) and (e - f)';
        _context = {
            a: 10,
            b: 7,
            c: 8,
            d: 5,
            e: 10,
            f: 5
        }
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare dates with ">"', function(done) {
        var text = 'date("2012-12-25") > date("2012-12-24")';
        var parsedGrammar = FEEL.parse(text);
        debugger;
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare dates with ">="', function(done) {
        var text = 'date("2012-12-25") >= date("2012-12-24")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare string "<"', function(done) {
        var text = '"XYZ" < "ABC"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.false;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare string "<="', function(done) {
        var text = '"XYZ" <= "ABC"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.false;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare string ">"', function(done) {
        var text = '"XYZ" > "ABC"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare string ">="', function(done) {
        var text = '"XYZ" >= "ABC"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare string "="', function(done) {
        var text = '"XYZ" = "XYZ"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });


    it('Successfully compare string "!="', function(done) {
        var text = '"XYZ" != "XYZ"';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.false;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare date and time with "<"', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") < date and time("2012-12-25T00:00:00")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare date with "<"', function(done) {
        var text = 'date("2012-12-24") < date("2012-12-25")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare time with "<"', function(done) {
        var text = 'time("T00:00:00Z") < time("T23:59:00Z")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare days and time duration with "<"', function(done) {
        var text = 'duration("P1D") < duration("P2D")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare years and months duration with "<"', function(done) {
        var text = 'duration("P2Y") < duration("P26M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare date and time with "<="', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") <= date and time("2012-12-25T00:00:00")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare time successfully with ">" accross time zones', function(done) {
        var text = 'time("T23:59:00+05:30") > time("T23:59:00+06:30")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

     it('Successfully compare time successfully with ">=" accross time zones', function(done) {
        var text = 'time("T23:59:00+05:30") >= time("T23:59:00+06:30")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare date successfully with ">"', function(done) {
        var text = 'date("2012-11-10") > date("2011-10-09")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare date successfully with ">="', function(done) {
        var text = 'date("2012-11-10") >= date("2011-10-09")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression', function(done) {
        var text = 'date("2012-12-25") - date("2012-12-24") = duration("P1D")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression with date and time as argument to date function', function(done) {
        var text = 'date(date and time("2012-12-25T11:00:00Z")) = date("2012-12-25")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using date with multiple args and date with string arg', function(done) {
        var text = 'date(2012, 11, 25) = date("2012-12-25")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using date and time with string arg and date and time with date and time parts', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") = date and time(date("2012-12-24"),time("T23:59:00"))';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using addition of date and time and duration', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") + duration("PT1M") = date and time("2012-12-25T00:00:00")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using addition of time and duration with time defined in IANA tz format', function(done) {
        var text = 'time("23:59:00z") + duration("PT2M") = time("00:01:00@Etc/UTC")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using time from date and time and time', function(done) {
        var text = 'time(date and time("2012-12-25T11:00:00Z")) = time("11:00:00Z")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using difference of date and time and duration', function(done) {
        var text = 'date and time("2012-12-24T23:59:00") - date and time("2012-12-22T03:45:00") = duration("P2DT20H14M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using durations', function(done) {
        var text = 'duration("P2Y2M") = duration("P26M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using ymd duration between two dates and duration', function(done) {
        var text = 'years and months duration(date("2011-12-22"), date("2013-08-24")) = duration("P1Y8M")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully parse and build equality expression using date and time in a "in" comparision expression', function(done) {
        var text = 'date and time("2017-04-12T11:45:00Z") in [date and time("2017-04-12T11:30:00Z")..date and time("2017-04-12T12:45:00Z")]';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully subtract duration from date', function(done) {
        var text = 'date and time("2018-03-01T00:00:00Z") - duration("P3M") = date and time("2017-12-01T00:00:00Z")';
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).to.be.true;
            done();
        }).catch(err => done(err));
    });

    it('Successfully compare dates with ">="', function(done) {
      var text = 'date("2012-12-23") >= date("2012-12-24")';
      // another error case: var text = 'date("2011-12-25") > date("2012-12-24")';
      var parsedGrammar = FEEL.parse(text);
      // debugger;
      parsedGrammar.build().then(result => {
        expect(result).to.be.false;
        done();
      }).catch(err => done(err));
    });

});
