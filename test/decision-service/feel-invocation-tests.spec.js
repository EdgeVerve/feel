/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');

var testDataFile = 'test/data/RoutingDecisionService.xlsx';
var testDataFile2 = 'test/data/ApplicantData.xlsx';

describe('boxed expression tests...', function() {
  it('should generate the required boxed invocation expression from worksheet', function() {
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Application Risk Score"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});
    // debugger;
    var isBoxed = DL._.isBoxedInvocation(csvExcel);

    expect(isBoxed).to.equal(true);

    //defining below the context string for this sheet
    var generateContextString = DL._.generateContextString;

    var funcContext = {
      "Age" : "Applicant data . Age",
      "Marital Status" : "Applicant data . MaritalStatus",
      "Employment Status" : "Applicant data . EmploymentStatus"
    };

    var funcContextString = generateContextString(funcContext, "csv");

    var fnName = "Application risk score model";

    var expectedCtxString = `${fnName} (${funcContextString})`;

    var result = DL._.makeContext(csvExcel);

    expect(result.expression).to.equal(expectedCtxString);
  });


  it('should generate expression for boxed context with result correctly', function() {
    var generateContextString = DL._.generateContextString;
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Installment Calculation"];

    expect(worksheet).to.be.defined;

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var isContextWithResult = DL._.isBoxedContextWithResult(csvExcel);

    expect(isContextWithResult).to.be.true;

    var contextEntries = {
      "Monthly Fee" : "if Product Type = \"STANDARD LOAN\" "
                      + "then 20.00 "
                      + "else if Product Type = \"SPECIAL LOAN\" "
                      + "then 25.00 "
                      + "else null",
      "Monthly Repayment" : "PMT(Rate, Term, Amount)",
      "result" : "Monthly Repayment + Monthly Fee"
    };

    var expectedCtxString = generateContextString(contextEntries, false);

    var computedCtxString = DL._.makeContext(csvExcel).expression;
    // fs.writeFileSync('file1.txt', computedCtxString)
    // fs.writeFileSync('file2.txt', expectedCtxString)
    expect(computedCtxString).to.equal(expectedCtxString);

  });

  it('should generate expression for boxed context without result', function() {
    var generateContextString = DL._.generateContextString;
    var workbook = XLSX.readFile(testDataFile2);

    var worksheet = workbook.Sheets["Applicant Data"];

    expect(worksheet).to.be.defined;

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});
    expect(csvExcel.length).to.not.equal(0)
    var isContext = DL._.isBoxedContextWithoutResult(csvExcel);
    expect(isContext).to.be.true;
    var contextEntries = {
      "Age" : '51',
      "MaritalStatus" : '"M"',
      EmploymentStatus: '"EMPLOYED"',
      ExistingCustomer: 'FALSE'
    };

    var expectedCtxString = generateContextString(contextEntries, false);
    // debugger;
    var computedCtxString = DL._.makeContext(csvExcel).expression;

    expect(computedCtxString).to.equal(expectedCtxString);
  });
});

