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

describe(chalk.blue('Quantified expression grammar test'), function () {

    it('Successfully creates ast from simple quantified expression', function (done) {
        var text = 'some ch in credit history satisfies ch.event = "bankruptcy"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Fails to create ast from quantified expression', function (done) {
        var text = 'somech in credit history satisfies ch.event = "bankruptcy"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).to.be.undefined;
            expect(e).not.to.be.undefined;
        }
        done();
    });
});