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

describe(chalk.blue('IF expression grammar test'), function () {

    it('Successfully creates ast from simple if expression', function (done) {
        var text = 'if applicant.maritalStatus in ("M", "S") then "valid" else "not valid"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates ast from if expression', function (done) {
        var text = 'if Pre-Bureau Risk Category = "DECLINE" or Installment Affordable = false or Age < 18 or Monthly Income < 100 then "INELIGIBLE" else "ELIGIBLE"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Successfully creates ast from if expression', function (done) {
        var text = 'if "Pre-Bureau Risk Category" = "DECLINE" or "Installment Affordable" = false or Age < 18 or "Monthly Income" < 100 then "INELIGIBLE" else "ELIGIBLE"';
        
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