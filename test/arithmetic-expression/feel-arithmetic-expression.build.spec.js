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
    debugger;
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
});