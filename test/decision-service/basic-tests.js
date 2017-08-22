var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');

var testDataFile = 'test/data/CustomerDiscount2.xlsx';
// var testDataFile2 = 'test/data/ApplicantData.xlsx';

describe('additional decision table parsing logic...', function() {
  it('should create decision table with input value list', function() {
    var generateContextString = DL._.generateContextString;
    var { parseXLS, parseCsv } = DL._;
    var jsonCsvObject = parseCsv(parseXLS(testDataFile));
    var values = Object.values(jsonCsvObject);
    // console.log(jsonCsvObject)
    expect(values.length).to.equal(1);
    // debugger;
    var result = DL._.makeContext(values[0]);

    expect(result.qn).to.equal('Customer Discount');

    var computedExpression = result.expression;
    var ruleList = [
      ['"Business"', '< 10', '0.1'],
      ['"Business"', '>=10', '0.15'],
      ['"Private"', '-', '0.05'],
    ];

    var inpValuesList = [['"Business"', '"Private"'], ['<10', '>=10']];
    var outputValuesList = [['0.05', '0.10', '0.15']];

    var contextEntries = [
      'outputs : "Discount"',
      "input expression list : " + '[Customer,Order Size]',
      {
        "rule list" : generateContextString(ruleList.map(r => generateContextString(r, false)), "csv")
      },
      {
        id: "Customer Discount"
      },
      'hit policy: "U"',
      {
        "input values list" : generateContextString(inpValuesList.map(i => generateContextString(i, false)), "csv"),
        "output values list" : generateContextString(outputValuesList.map(i => generateContextString(i, false)), "csv")
      }
    ];

    var entry = `decision table (${generateContextString(contextEntries, "list")})`;
    // var finalCtxEntry = { result: entry };

    // var expectedContextString = generateContextString(finalCtxEntry, false);
    expect(computedExpression).to.equal(entry);
  });

});
