/*
?2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-table');
var DTree = require('../../utils/helper/decision-tree');
var xlArr = ['RoutingRules', 'ElectricityBill', 'Holidays', 'Membership', 'LoanEligibility', 'Validation'];
var decision_table = {};

describe(chalk.blue('Decision table evaluation'), function () {

    before('setup test data, read excel file and get the decision table', function (done) {
        xlArr.forEach(fileName => {
            const path = './test/data/' + fileName + '.xlsx';
            const csv = DTable.xls_to_csv(path);
            decision_table[fileName] = DTable.csv_to_decision_table(csv[0]);
        });
        done();
    });

    it('Collect hit policy without any operator', function (done) {
        decision_table.RoutingRules["hitPolicy"] = "C";
        const payload = {"Age" : 18, "Risk category" : "High", "Debt review" : false};
        DTable.execute_decision_table("RoutingRules", decision_table.RoutingRules, payload, (err, results)=> {
            if(err){
                return done(err);
            }
            let Routing = [];
            let Review = [];
            let Reason = [];
            expect(results.length).to.equal(2);
            Routing.push(results[0].Routing);
            Routing.push(results[1].Routing);
            expect(Routing).to.contain('Accept');
            expect(Routing).to.contain('Refer');

            Review.push(results[0]['Review level']);
            Review.push(results[1]['Review level']);
            expect(Review).to.contain('None');
            expect(Review).to.contain('Level1');

            Reason.push(results[0].Reason);
            Reason.push(results[1].Reason);
            expect(Reason).to.contain('Acceptable');
            expect(Reason).to.contain('High risk application');
            done();
        });
    });

    it('Collect hit policy with + operator for numbers', function (done) {
    const payload = { "State" : "Karnataka", "Units" : 150 };
        DTable.execute_decision_table("ElectricityBill", decision_table.ElectricityBill, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.Amount).to.equal(693);
            done();
        });
    });

    it('Collect hit policy with < operator for numbers', function (done) {
        const payload = { "Age" : 100, "Years of Service" : 200 };
        decision_table.Holidays["hitPolicy"] = "C<";
        DTable.execute_decision_table("Holidays C<", decision_table.Holidays, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.Holidays).to.equal(3);
            done();
        });
    });

    it('Collect hit policy with > operator for numbers', function (done) {
        const payload = { "Age" : 100, "Years of Service" : 200 };
        decision_table.Holidays["hitPolicy"] = "C>";
        DTable.execute_decision_table("Holidays  C>", decision_table.Holidays, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.Holidays).to.equal(22);
            done();
        });
    });

    it('Collect hit policy with # operator for numbers', function (done) {
        const payload = { "Age" : 100, "Years of Service" : 200 };
        decision_table.Holidays["hitPolicy"] = "C#";
        DTable.execute_decision_table("Holidays  C#", decision_table.Holidays, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.Holidays).to.equal(3);
            done();
        });
    });

    it('Collect hit policy with + operator for strings', function (done) {
        const payload = { "loanAmount" : 2000, "salary" : 20000 };
        DTable.execute_decision_table("Membership", decision_table.Membership, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.membership).to.equal("SILVER GENERAL GENERAL");
            done();
        });
    });

    it('Collect hit policy with < operator for strings', function (done) {
        const payload = { "loanAmount" : 30000, "salary" : 60000 };
        decision_table.Membership["hitPolicy"] = "C<";
        DTable.execute_decision_table("Membership C<", decision_table.Membership, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.membership).to.equal("GENERAL");
            done();
        });
    });

    it('Collect hit policy with > operator for strings', function (done) {
        const payload = { "loanAmount" : 12000, "salary" : 110000 };
        decision_table.Membership["hitPolicy"] = "C>";
        DTable.execute_decision_table("Membership  C>", decision_table.Membership, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.membership).to.equal("SILVER");
            done();
        });
    });

    it('Collect hit policy with # operator for strings', function (done) {
        const payload = { "loanAmount" : 1000, "salary" : 200000 };
        decision_table.Membership["hitPolicy"] = "C#";
        DTable.execute_decision_table("Membership  C#", decision_table.Membership, payload, (err, result)=> {
            if(err){
                return done(err);
            }
            expect(result.membership).to.equal(4);
            done();
        });
    });

    it('Collect hit policy with + operator for boolean', function (done) {
        const payload1 = { "age" : 40, "salary" : 55000 };//T, T
        const payload2 = { "age" : 18, "salary" : 6000 };//F, F
        const payload3 = { "age" : 30, "salary" : 55000 };//T, T, F
        DTable.execute_decision_table("LoanEligibility", decision_table.LoanEligibility, payload3, (err3, result3)=> {
            expect(result3.LoanEligibility).to.equal(false);
            DTable.execute_decision_table("LoanEligibility", decision_table.LoanEligibility, payload2, (err2, result2)=> {
                expect(result2.LoanEligibility).to.equal(false);
                DTable.execute_decision_table("LoanEligibility", decision_table.LoanEligibility, payload1, (err1, result1)=> {
                    expect(result1.LoanEligibility).to.equal(true);
                    done();
                });
            });
        });
    });

    it('Collect hit policy with < operator for boolean', function (done) {
        const payload1 = { "age" : 40, "salary" : 55000 };//T, T
        const payload2 = { "age" : 18, "salary" : 6000 };//F, F
        const payload3 = { "age" : 30, "salary" : 55000 };//T, T, F
        decision_table.LoanEligibility["hitPolicy"] = "C<";
        DTable.execute_decision_table("LoanEligibility C<", decision_table.LoanEligibility, payload3, (err3, result3)=> {
            expect(result3.LoanEligibility).to.equal(0);
            DTable.execute_decision_table("LoanEligibility C<", decision_table.LoanEligibility, payload2, (err2, result2)=> {
                expect(result2.LoanEligibility).to.equal(0);
                DTable.execute_decision_table("LoanEligibility C<", decision_table.LoanEligibility, payload1, (err1, result1)=> {
                    expect(result1.LoanEligibility).to.equal(1);
                    done();
                });
            });
        });
    });

    it('Collect hit policy with > operator for boolean', function (done) {
        const payload1 = { "age" : 40, "salary" : 55000 };//T, T
        const payload2 = { "age" : 18, "salary" : 6000 };//F, F
        const payload3 = { "age" : 30, "salary" : 55000 };//T, T, F
        decision_table.LoanEligibility["hitPolicy"] = "C>";
        DTable.execute_decision_table("LoanEligibility C>", decision_table.LoanEligibility, payload3, (err3, result3)=> {
            expect(result3.LoanEligibility).to.equal(1);
            DTable.execute_decision_table("LoanEligibility C>", decision_table.LoanEligibility, payload2, (err2, result2)=> {
                expect(result2.LoanEligibility).to.equal(0);
                DTable.execute_decision_table("LoanEligibility C>", decision_table.LoanEligibility, payload1, (err1, result1)=> {
                    expect(result1.LoanEligibility).to.equal(1);
                    done();
                });
            });
        });
    });

    it('Collect hit policy with # operator for boolean', function (done) {
        const payload1 = { "age" : 40, "salary" : 55000 };//T, T
        const payload2 = { "age" : 18, "salary" : 6000 };//F, F
        const payload3 = { "age" : 30, "salary" : 55000 };//T, T, F
        decision_table.LoanEligibility["hitPolicy"] = "C#";
        DTable.execute_decision_table("LoanEligibility C#", decision_table.LoanEligibility, payload3, (err3, result3)=> {
            expect(result3.LoanEligibility).to.equal(2);
            DTable.execute_decision_table("LoanEligibility C#", decision_table.LoanEligibility, payload2, (err2, result2)=> {
                expect(result2.LoanEligibility).to.equal(1);
                DTable.execute_decision_table("LoanEligibility C#", decision_table.LoanEligibility, payload1, (err1, result1)=> {
                    expect(result1.LoanEligibility).to.equal(1);
                    done();
                });
            });
        });
    });

    it('Validation hit policy with invalid data', function (done) {
        const payload = { "status" : "entered", "age" : 150, "married" : true, "gender" : "F", "phone" : "9090909090" };
        DTable.execute_decision_table("Validation", decision_table.Validation, payload, (err, results)=> {
            if(err){
                done(err);
            } else {
                let errMessage = [];
                let errCode = [];
                expect(results.length).to.equal(3);
                errMessage.push(results[0].errMessage);
                errMessage.push(results[1].errMessage);
                errMessage.push(results[2].errMessage);
                expect(errMessage).to.contain("phone or email not present");
                expect(errMessage).to.contain("husband name missing");
                expect(errMessage).to.contain("age is out of range");

                errCode.push(results[0].errCode);
                errCode.push(results[1].errCode);
                errCode.push(results[2].errCode);
                expect(errCode).to.contain("err-phone-email-presence");
                expect(errCode).to.contain("err-husband-name-presence");
                expect(errCode).to.contain("err-age-range");
                done();
            }
        });
    });

    it('Validation hit policy valid data', function (done) {
        const payload = { "status" : "entered", "phone" : "9090909090", "email" : "abc@def.com", "married" : true, "gender" : "F", "husband_name" : "Test Name", "age" : 40 };
        DTable.execute_decision_table("Validation", decision_table.Validation, payload, (err, results)=> {
            if(err){
                done(err);
            } else {
                expect(results.length).to.equal(0);
                done();
            }
        });
    });

});
