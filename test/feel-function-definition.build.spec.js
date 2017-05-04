/*  
*  
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../dist/feel');

describe(chalk.blue('Function definition grammar test'), function() {

    it('Successfully creates user defined function definition from simple expression', function(done) {
        var text = 'function(age) age < 21';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully creates user defined function definition', function(done) {
        var text = 'function(rate, term, amount) (amount*rate/12)/(1-(1+rate/12)**-term)';

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build().then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully creates user defined function definition', function(done) {
        var text = '';

        var _context_text = '{ x : function(a, b, c) if a>b then c else b }';
        var _text = 'x(10,5,20)';

        var parsedContext = FEEL.parse(_context_text);
        var parsedGrammar = FEEL.parse(_text);


        parsedContext.build().then(context => {
            parsedGrammar.build(context).then(result => {

                expect(result).not.to.be.undefined;
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    });

    it('Successfully executes a combination of user-defined function built-in function and if expression', function(done) {
        debugger;
        const _context_text = '{ x : function(a, b, c, d) if d<a then min([d-a,b])*c else 0 }';
        const _text = 'x(0,30,3,27)';
        const parsedContext = FEEL.parse(_context_text);
        const parsedGrammar = FEEL.parse(_text);


        parsedContext.build().then(context => {
            parsedGrammar.build(context).then(result => {
                expect(result).not.to.be.undefined;
                console.log(result);
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    });

    it('should use built-in function sum on an array', function(done) {

        var _context_text = '{ x : [1,2,3,4]}';
        var _text = 'sum(x)';

        var parsedContext = FEEL.parse(_context_text);
        var parsedGrammar = FEEL.parse(_text);


        parsedContext.build().then(context => {
            parsedGrammar.build(context).then(result => {

                expect(result).not.to.be.undefined;
                done();
            }).catch(err => done(err));
        }).catch(err => done(err));
    });

});