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

describe(chalk.blue('Arithmetic expression grammar test'), function() {

    it('Successfully creates ast from simple arithmetic expression', function(done) {
        var text = 'a + b - c';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates ast from arithmetic expression', function(done) {
        var text = '((a + b)/c - (d + e*2))**f';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates ast from arithmetic expression', function(done) {
        var text = '1-(1+rate/12)**-term';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates ast from arithmetic expression', function(done) {
        var text = '(a + b)**-c';

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