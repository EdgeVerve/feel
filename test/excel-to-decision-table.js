/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../utils/decision-table');

describe(chalk.blue('Excel to decision table conversion test'), function () {

    it('Parse excel and convert it to csv format', function (done) {
        var csv = DTable.xls_to_csv('./test/StudentFinancialPackageEligibility.xlsx');
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