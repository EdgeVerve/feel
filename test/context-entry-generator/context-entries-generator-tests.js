var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-table');
var fs = require('fs');

var excelWorkbookPath = 'test/data/PostBureauRiskCategory2.xlsx';

describe('context-entries-generator tests', function() {
  it('should create a FEEL context string when provided with input containing context entries', function() {
    var contextEntriesArray = [
      'Post Bureau Risk Category',
      {
        "Existing Customer" : "Applicant. ExistingCustomer",
        "Credit Score" : "Report. CreditScore"
      }
    ];

    var expected = "{Post Bureau Risk Category,Existing Customer: Applicant. ExistingCustomer,Credit Score: Report. CreditScore}"
    // debugger;
    var contextString = DTable._.generateContextStringFromArray(contextEntriesArray);

    expect(expected).to.equal(contextString);
  });
})
