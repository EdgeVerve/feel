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
var DTree = require('../../utils/helper/decision-tree');
var decision_table = {};

describe(chalk.blue('Decision table to decision tree'), function () {
    
    before('setup test data, read excel file and get the decision table', function (done) {
        var csv = DTable.xls_to_csv('./test/data/StudentFinancialPackageEligibility.xlsx');
        decision_table = DTable.csv_to_decision_table(csv[0]);
        done();
    });

    it('Successfully converts decision table to decision tree', function (done) {
        var root = DTree.createTree(decision_table);
        expect(root).not.to.be.null;
        done();
    });

});