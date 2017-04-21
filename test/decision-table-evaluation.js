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
var DTree = require('../utils/decision-tree');
var xlArr = ['Adjustments.xlsx', 'Applicant_Risk_Rating.xlsx', 'ApplicantRiskRating.xlsx', 'Discount.xlsx', 'ElectricityBill.xlsx', 'Holidays.xlsx', 'PostBureauRiskCategory.xlsx', 'RoutingRules.xlsx', 'StudentFinancialPackageEligibility.xlsx'];
var decision_table = {};
var csv = {};
var i = 0;

describe(chalk.blue('Decision table evaluation'), function () {
    
    before('setup test data, read excel file and get the decision table', function (done) {
        done();
    });
    
    beforeEach('prepare decision table from excel and set the payload', function (done) {
        var path = './test/' + xlArr[i++];
        csv = DTable.xls_to_csv(path);
        decision_table = DTable.csv_to_decision_table(csv[0]);
        done();
    });
    
    it('Adjustments table evaluation', function (done) {
        var payload = { "Customer" : "Private", "Order size" : 12 };
        DTable.execute_decision_table("Adjustments", decision_table, payload, (results)=> {
            expect(results.Shipping).to.equal('Air');
            expect(results.Discount).to.equal(0.05);
            done();
        });
    });

    it('Applicant_Risk_Rating table evaluation', function (done) {
        var payload = { "Applicant Age" : 25, "Medical History" : "good" };
        DTable.execute_decision_table("Applicant_Risk_Rating", decision_table, payload, (results)=> {
            expect(results['Applicant Risk Rating']).to.equal('Medium');
            done();
        });
    });

    it('ApplicantRiskRating table evaluation', function (done) {
        var payload = { "Applicant Age" : -24, "Medical History" : "bad" };
        DTable.execute_decision_table("ApplicantRiskRating", decision_table, payload, (results)=> {
            expect(results['Applicant Risk Rating']).to.equal('Medium');
            done();
        });
    });

    it('Discount table evaluation', function (done) {
        var payload = { "Customer" : "Business", "Order size" : 10 };
        DTable.execute_decision_table("Discount", decision_table, payload, (results)=> {
            expect(results.Discount).to.equal(0.15);
            done();
        });
    });

    it('ElectricityBill table evaluation', function (done) {
        var payload = { "State" : "Karnataka", "Units" : 31 };
        DTable.execute_decision_table("ElectricityBill", decision_table, payload, (results)=> {
            expect(results.Amount).to.equal(94.4);
            done();
        });
    });

    it('Holidays table evaluation', function (done) {
        var payload = { "Age" : 100, "Years of Service" : 200 };
        DTable.execute_decision_table("Holidays", decision_table, payload, (results)=> {
            expect(results.length).to.equal(5);
            expect(results[0].Holidays).to.equal(22);
            expect(results[1].Holidays).to.equal(3);
            expect(results[2].Holidays).to.equal(5);
            done();
        });
    });

    it('PostBureauRiskCategory table evaluation', function (done) {
        var payload = {"Applicant": {"ExistingCustomer" : true}, "Report": {"CreditScore" : 600}, "b" : 60};
        DTable.execute_decision_table("PostBureauRiskCategory", decision_table, payload, (results)=> {
            expect(results.PostBureauRiskCategory).to.equal('MEDIUM');
            done();
        });
    });

    it('RoutingRules table evaluation', function (done) {
        var payload = {"Age" : 18, "Risk category" : "High", "Debt review" : "false"};
        DTable.execute_decision_table("RoutingRules", decision_table, payload, (results)=> {
            expect(results.length).to.equal(2);
            expect(results[0].Routing).to.equal('Accept');
            expect(results[0]['Review level']).to.equal('None');
            expect(results[0].Reason).to.equal('Acceptable');
            done();
        });
    });

    it('StudentFinancialPackageEligibility table evaluation', function (done) {
        var payload = {"Student GPA" : 3.6,"Student Extra-Curricular Activities Count" : 4,"Student National Honor Society Membership" : "Yes"};
        DTable.execute_decision_table("StudentFinancialPackageEligibility", decision_table, payload, (results)=> {
            expect(results.length).to.equal(2);
            expect(results[0]['Student Financial Package Eligibility List']).to.equal('20% Scholarship');
            expect(results[1]['Student Financial Package Eligibility List']).to.equal('30% Loan');
            done();
        });
    });

});