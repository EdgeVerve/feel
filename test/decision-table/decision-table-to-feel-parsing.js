var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-table');
var fs = require('fs');

var excelWorkbookPath = 'test/data/PostBureauRiskCategory2.xlsx';

describe("Internal tests...", function() {
  it('should be that parseXLS() returns an array', function() {

    var csvJson = DTable._.parseXLS(excelWorkbookPath)
    expect(Array.isArray(csvJson)).to.equal(true)
  });

  it('should be that parseCsv() returns an object', function(){
    var csvJson = DTable._.parseXLS(excelWorkbookPath);
    var resultObject = DTable._.parseCsv(csvJson);
    var values = Object.values(resultObject);

    expect(Array.isArray(values)).to.equal(true);

    values.forEach(v => expect(v).to.be.string );
  });

  it('should create the decision object without context property', function(){
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var dto = DTable.csv_to_decision_table(values[0]);
    expect(dto.context).to.be.undefined;
  });

  it('should be that makeContext() returns an object', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var boxedExpression = fs.readFileSync('test\\data\\BoxedExpression-PostBureauRiskCategoryTable-Compressed.txt', { encoding: 'utf8' });
    // boxedExpression = boxedExpression.replace(/(\r\n|\n|\t)/g, '')
    var dto = DTable.csv_to_decision_table(values[0]);
    // debugger;
    var result = DTable._.makeContext(values[0], dto)

    expect(result).to.be.object

    expect(Object.keys(result)).to.eql(['qn', 'expression'])
  })

  it.skip('should parse decision table worksheet correctly', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var boxedExpression = fs.readFileSync('test\\data\\BoxedExpression-PostBureauRiskCategoryTable-Compressed.txt', { encoding: 'utf8' });
    // boxedExpression = boxedExpression.replace(/(\r\n|\n|\t)/g, '')
    var dto = DTable.csv_to_decision_table(values[0]);
    // debugger;
    var result = DTable._.makeContext(values[0], dto).contextString
      + '\n'; //adding this to avoid problem with editor
    // console.log({a: boxedExpression, b: result})
    fs.writeFileSync('file1.txt', boxedExpression, { encoding: 'utf8'})
    fs.writeFileSync('file2.txt', result, { encoding: 'utf8'})
    // expect(boxedExpression).to.equal(result)
    expect(boxedExpression.localeCompare(result)).to.equal(0)
  });

  it('should detect if a sheet is a decision table model', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var result = DTable._.isDecisionTableModel(values[1])

    expect(result).to.equal(false)

    result = DTable._.isDecisionTableModel(values[0])

    expect(result).to.equal(true)
  });

  it('should parse a business model worksheet correctly', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var businessModelCsv = values[1];
    // console.log(businessModelCsv)
    debugger;
    var contextString = DTable._.makeContext(businessModelCsv).expression

    // here is the contextEntry object for the speific model
    //note: you'll have to manually verify this
    var contextEntries = [
      'Post Bureau Risk Category Table',
      {
        "Existing Customer" : "Applicant. ExistingCustomer",
        "Credit Score" : "Report. CreditScore",
        "Application Risk Score": "Affordability Model(Applicant, Product). Application Risk Score"
      }
    ];

    var expected = DTable._.generateContextString(contextEntries);

    expect(contextString).to.equal(expected)
  });

  it('should parse the qualified name of worksheet', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var businessModelCsv = values[1];

    var ctxObj = DTable._.makeContext(businessModelCsv)

    expect(ctxObj.qn).to.be.defined
    expect(ctxObj.qn).to.equal("Post Bureau Risk Category")
  })
});

describe.skip('Excel workbook parsing...', function() {
  it.skip('should parse a workbook to a json-feel boxed expression', function(){
    var jsonFeel = DTable.parseWorkbook(excelWorkbookPath);

    //this jsonFeel should have two keys
    var keys = Object.keys(jsonFeel)
    expect(keys.length).to.equal(2)

    //their values should be a FEEL string
    keys.map(key => {
      var val = jsonFeel[key]
      expect(val).to.be.defined
      expect(val).to.be.string
    })
  });
});

