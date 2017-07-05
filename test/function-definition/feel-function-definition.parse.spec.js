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

describe(chalk.blue('Function definition grammar test'), function () {

    it('Successfully creates user defined function definition from simple expression', function (done) {
        var text = 'function(age) age < 21';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates user defined function definition', function (done) {
        var text = 'function(rate, term, amount) (amount*rate/12)/(1-(1+rate/12)**-term)';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates external function definition with string key', function (done) {
        var text = 'function(angle) external {java: {class : "java.lang.Math", "method signature": "cos(double)"}}';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates external function definition with name key', function (done) {
        var text = 'function(angle) external {java: {class : "java.lang.Math", method signature: "cos(double)"}}';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

});
