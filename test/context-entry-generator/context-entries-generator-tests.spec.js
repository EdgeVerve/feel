/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-logic');
var fs = require('fs');

var excelWorkbookPath = 'test/data/PostBureauRiskCategory2.xlsx';

describe('Context generation tests...', function() {
  it('should create a FEEL context - case 1', function() {
    // string when provided with input containing context entries
    var contextEntriesArray = [
      'Post Bureau Risk Category',
      {
        "Existing Customer" : "Applicant. ExistingCustomer",
        "Credit Score" : "Report. CreditScore"
      }
    ];

    var expected = "{Post Bureau Risk Category,Existing Customer : Applicant. ExistingCustomer,Credit Score : Report. CreditScore}"
    // debugger;
    var contextString = DTable._.generateContextString(contextEntriesArray);

    expect(expected).to.equal(contextString);
  });

  it('should create a FEEL context - case 2', function() {
    // string when provided with input containing context entries
    var contextEntriesArray = [
      {
        "some list": [
          'value 1', 'value2', 'value3'
        ]
      }
    ];

    var expected = "{some list : ['value 1','value2','value3']}"
    // debugger;
    var contextString = DTable._.generateContextString(contextEntriesArray);

    expect(expected).to.equal(contextString);
  });

  it('should create FEEL context string - case 3', function() {
    // generateContextString on array with 2nd argument as "csv"
    // should give you a simple csv list [val1, val2, val3, ...]
    var contextEntries = {
      "input expression list":
        DTable._.generateContextString(
          ["Existing Customer", "Credit Score", "Application Risk Score"],
          "csv"
        )
    };

    var computedExpression = DTable._.generateContextString([contextEntries]);

    var expectedExpression = '{input expression list : [Existing Customer,Credit Score,Application Risk Score]}';

    expect(computedExpression).to.equal(expectedExpression)
  });

  it('should create FEEL context string - case 4', function() {
    // generateContextString on array with 2nd argument as "list"
    // should give you a simple  list - val1, val2, val3, ...

    var list = ["Existing Customer", "Credit Score", "Application Risk Score"];
    var expectedExpression = list.join(',');

    var computedExpression = DTable._.generateContextString(list, "list");

    expect(computedExpression).to.equal(expectedExpression);

  });
})
