/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
const DL = require('../../utils/helper/decision-logic');
const DS = require('../../utils/helper/decision-service');
const expect = require('chai').expect;

describe('individual sheets...', function(){
  var i = 0;
  var path;
  var xlArr = [
    'ExamEligibility.xlsx',
    'Adjustments2.xlsx',
    'Applicant_Risk_Rating.xlsx', 'ApplicantRiskRating.xlsx',
    'Discount.xlsx', 'ElectricityBill.xlsx',
    'Holidays.xlsx',
    'PostBureauRiskCategory.xlsx',
    'RoutingRules.xlsx', 'StudentFinancialPackageEligibility.xlsx'
  ];

  beforeEach('load test file', function(){
    path = 'test/data/' + xlArr[i++];
  });

  var { executeDecisionService, createDecisionGraphAST } = DS;
  var { parseWorkbook } = DL;

  var runTest = function(path, name, payload, suiteCb, testCb) {
    var decisionMap = parseWorkbook(path);
    var ast = createDecisionGraphAST(decisionMap);
    return executeDecisionService(ast, name, payload, 'a' + i)
    // .then(result => testCb(result))
    // .catch(suiteCb);
  };
  it('ExamEligibility.xlsx', function(done) {
    var payload = {
      GPA: 7,
      d: "1995-11-22"
    };

    runTest(path, 'ExamEligibility', payload)
      .then(results => {
        expect(results.Eligible).to.be.true;
        done();
      })
      .catch(done);
  });

  it('Adjustments2.xlsx', function(done){
    var payload = {
      Customer: "Private",
      "Order size": 12
    };
    debugger;
    runTest(path, 'Adjustments', payload).then(result => {
      expect(result.Shipping).to.equal('Air');
      expect(result.Discount).to.equal(0.05);
      done();
    })
    .catch(done);
  });

  it('Applicant_Risk_Rating.xlsx', function(done){
    var payload = {
      "Applicant Age" : 25,
      "Medical History" : "good"
    };

    runTest(path, 'Applicant_Risk_Rating', payload)
      .then(result => {
        expect(result['Applicant Risk Rating'])
          .to.equal('Medium');
        done();
      })
      .catch(done);
  });

  it('ApplicantRiskRating.xlsx', function(done) {
    var payload = {
      "Applicant Age" : -24,
      "Medical History" : "bad"
    };

    runTest(path, 'Applicant Risk Rating', payload)
    .then(result => {
      expect(result['Applicant Risk Rating']).to.equal('Medium');
      done();
    })
    .catch(done);
  });

  it('Discount.xlsx', function(done) {
    var payload = { "Customer" : "Business", "Order size" : 10 };
    runTest(path, 'Discount', payload)
    .then(result => {
      expect(result.Discount).to.equal(0.15);
      done();
    })
    .catch(done);
  });

  it(`ElectricityBill.xlsx`, function(done) { //electricity bill
    var payload = { "State" : "Karnataka", "Units" : 31 };
    debugger;
    runTest(path, 'Electricity Bill', payload)
    .then(results => {
      expect(results.Amount).to.equal(94.4);
      done();
    })
    .catch(done);
  });

  it(`Holidays.xlsx`, function(done) { //Holidays
    var payload = { "Age" : 100, "Years of Service" : 200 };
    runTest(path, 'Holidays', payload)
    .then(results => {

      expect(results.length).to.equal(5);
      expect(results[0].Holidays).to.equal(22);
      expect(results[1].Holidays).to.equal(5);
      expect(results[2].Holidays).to.equal(5);
      expect(results[3].Holidays).to.equal(3);
      expect(results[4].Holidays).to.equal(3);
      done();

    })
    .catch(done);
  });

  it(`PostBureauRiskCategory.xlsx`, function(done) { //PostBureauRiskCategory
    var payload = {"Applicant": {"ExistingCustomer" : true}, "Report": {"CreditScore" : 600}, "b" : 60};
    runTest(path, 'PostBureauRiskCategory', payload)
    .then(results => {
      expect(results.PostBureauRiskCategory).to.equal('MEDIUM');
      done();

    })
    .catch(done);
  });

  it('RoutingRules.xlsx', function(done) {
    var payload = {
      "Age" : 18,
      "Risk category" : "High",
      "Debt review" : false
    };

    runTest(path, 'Routing rules', payload)
      .then(results => {
        expect(results.length).to.equal(2);
        expect(results[0].Routing).to.equal('Refer');
        expect(results[0]['Review level']).to.equal('Level1');
        expect(results[0].Reason).to.equal('High risk application');
        expect(results[1].Routing).to.equal('Accept');
        expect(results[1]['Review level']).to.equal('None');
        expect(results[1].Reason).to.equal('Acceptable');
        done();
      })
      .catch(done)
  });

  it('StudentFinancialPackageEligibility.xlsx', function(done) {
    var payload = {
      "Student GPA" : 3.6,
      "Student Extra-Curricular Activities Count" : 4,
      "Student National Honor Society Membership" : "Yes"
    };

    runTest(path,'Student Financial Package Eligibility', payload)
      .then(results => {
        expect(results.length).to.equal(2);
        expect(results[0]['Student Financial Package Eligibility List']).to.equal('20% Scholarship');
        expect(results[1]['Student Financial Package Eligibility List']).to.equal('30% Loan');
        done();
      })
      .catch(done)
  });


});
