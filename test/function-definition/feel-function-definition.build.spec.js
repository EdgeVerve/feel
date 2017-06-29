/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../../dist/feel');

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

        var _context_text = '{ x : function(a, b, c, d) if d>a then min([d-a,b])*c else 0 }';
        var _text = 'x(0,30,3,27)';

        var parsedContext = FEEL.parse(_context_text);
        var parsedGrammar = FEEL.parse(_text);


        parsedContext.build().then(context => {
            parsedGrammar.build(context).then(result => {
                expect(result).not.to.be.undefined;
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

    it('Fails to execute a combination of user-defined function built-in function and if expression', function(done) {

        var context = '{getAmount : function(a,b,c,d) if d > a then min([d - a, b - a])*c else 0}';
        var fn = 'getAmount(0, b, 30, d)';

        var parsedContext = FEEL.parse(context);
        var fnCall = FEEL.parse(fn);
        parsedContext.build().then(ctx => {
            return Object.assign({}, ctx, {"d" : 300 });
        }).then((context) => {
            return fnCall.build(context);
        }).then((result) => {
            expect(result).to.be.undefined;
            done(result);
        }).catch(err => {
            expect(err).not.to.be.undefined;
            done();
        });

    });

});