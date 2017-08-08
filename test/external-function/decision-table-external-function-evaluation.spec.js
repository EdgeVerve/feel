/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
const chalk = require('chalk');
const chai = require('chai');
const expect = chai.expect;
const DTable = require('../../utils/helper/decision-table');
const DTree = require('../../utils/helper/decision-tree');
const xlArr = ['RiskCategoryEvaluation.xlsx','LoanApplicationValidity.xlsx', 'BillCalculation.xlsx'];
let decision_table = {};
let csv = {};
let i = 0;

describe(chalk.blue('External function definition and evaluation'), () => {

    before('setup test data, read excel file and get the decision table', (done) => {
        done();
    });

    beforeEach('prepare decision table from excel and set the payload', (done) => {
        const path = './test/data/' + xlArr[i++];
        csv = DTable.xls_to_csv(path);
        decision_table = DTable.csv_to_decision_table(csv[0]);
        done();
    });

    it('External Function - RiskCategoryEvaluation', (done) => {
        const payload = {"Applicant": {"ExistingCustomer" : true}, "Report": {"CreditScore" : 600}, "b" : 60};
        DTable.execute_decision_table("RiskCategoryEvaluation", decision_table, payload, (err, results)=> {
            if(err){
                return done(err);
            }
            expect(results.PostBureauRiskCategory).to.equal('MEDIUM');
            done();
        });
    });

    it('External Function - LoanApplicationValidity', (done) => {
        const payload = {
            "organisation": "A Corp",
            "designation": "SSE",
            "state": "KA",
            "pincode": "560100",
            "loanAmount": 40000,
            "basePay": 250000,
            "experience": 3,
            "age": 55,
            "address proof": false
        }
        DTable.execute_decision_table("LoanApplicationValidity", decision_table, payload, (err, results)=> {
            if(err){
                return done(err);
            }
            expect(results.length).to.equal(2);
            expect(results[0].errCode).to.equal('err-employer-check');
            expect(results[0].errMessage).to.equal('employer details(employeeId, department and organisation) were not given');
            expect(results[1].errCode).to.equal('err-address-check');
            expect(results[1].errMessage).to.equal('passport details alongwith city necessary');
            done();
        });
    });

    it('External Function - BillCalculation', (done) => {
        const payload = { "State" : "Karnataka", "Units" : 31 };
        DTable.execute_decision_table("BillCalculation", decision_table, payload, (err, results)=> {
            if(err){
                return done(err);
            }
            expect(results.Amount).to.equal(94.4);
            done();
        });
    });

});
