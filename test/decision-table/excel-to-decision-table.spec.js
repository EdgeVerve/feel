/*  
*  
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-table');

describe(chalk.blue('Excel to decision table conversion test'), function () {

    it('Parse excel and convert it to csv format', function (done) {
        var csv = DTable.xls_to_csv('./test/data/StudentFinancialPackageEligibility.xlsx');
        var decision_table = DTable.csv_to_decision_table(csv[0]);
        
        expect(decision_table.hitPolicy).to.equal('R');
        expect(decision_table.inputExpressionList.length).to.equal(3);
        expect(decision_table.inputValuesList[0].split(",").length).to.equal(3);
        expect(decision_table.inputValuesList[1].split(",").length).to.equal(3);
        expect(decision_table.inputValuesList[2].split(",").length).to.equal(3);
        expect(decision_table.outputs.length).to.equal(1);
        expect(decision_table.outputValues[0].length).to.equal(4);
        expect(decision_table.ruleList.length).to.equal(4);
        done();
    });

});