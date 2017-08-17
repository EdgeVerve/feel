var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');

var testDataFile = 'test/data/RoutingDecisionService.xlsx';

describe('invocation tests...', function() {
  it('should generate the required invocation expression from worksheet', function() {
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
});

