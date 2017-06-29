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

describe(chalk.blue('Disjunction-Conjunction ast parsing test'), function() {

    it('Successfully builds ast from simple disjunction expression', function(done) {
        var text = 'a or b';

        const _context = {
            a: true,
            b: false
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));

    });

    it('Successfully builds ast from simple conjunction expression', function(done) {
        var text = 'a and b';

        const _context = {
            a: true,
            b: false
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 1', function(done) {
        var text = '((a or b) and (b or c)) or (a and d)';

        const _context = {
            a: true,
            b: false,
            c: true,
            d: false
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 2', function(done) {
        var text = '((a > b) and (a > c)) and (b > c)';

        const _context = {
            a: 10,
            b: 5,
            c: 3
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 3', function(done) {
        var text = '((a + b) > (c - d)) and (a > b)';

        const _context = {
            a: 10,
            b: 5,
            c: 20,
            d: 10
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 4', function(done) {
        var text = 'a or b or a > b';

        const _context = {
            a: 10,
            b: 5
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 5', function(done) {

        var _context_text = '{ x : function(x,y) x+y , y:5 , a:10 , b:5 , i:4 , j:1 }';
        var _text = '(x(i, j) = y) and (a > b)';

        var parsedContext = FEEL.parse(_context_text);
        var parsedGrammar = FEEL.parse(_text);


        parsedContext.build().then(context => {
            parsedGrammar.build(context).then(result => {
                expect(result).not.to.be.undefined;
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    });

    it('Successfully builds ast from given logical expression 6', function(done) {
        var text = '(a + b) > (c - d) and (a > b)';

        const _context = {
            a: 10,
            b: 5,
            c: 20,
            d: 10
        }

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });
});