var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');

var testFile = 'test/data/RoutingDecisionService.xlsx';

describe('servicification tests...', function() {
  it('should be that each worksheet has a proper qualified name', function() {
    var workbook = XLSX.readFile(testFile);
    var sheets = workbook.SheetNames.map(name => {
      var csv = XLSX.utils.sheet_to_csv( workbook.Sheets[name], {FS: '&SP', RS: '&RSP', blankrows: false });
      return { name, csv };
    }).filter(s => s.csv.substring(0, s.csv.indexOf('&SP')).length);
    console.log(sheets.map(s => s.name));
    console.log(workbook.SheetNames);
    expect(sheets.length, 'not all sheets have qualified names').to.equal(workbook.SheetNames.length);
  });

  it('should expose a servicified json-feel object', function() {
    debugger;
    var jsonFeel = DL.parseWorkbook(testFile);

    expect(jsonFeel).to.be.defined;
    expect(jsonFeel).to.be.object;

    var workbook = XLSX.readFile(testFile);

    expect(workbook.SheetNames.length + 1).to.equal(Object.keys(jsonFeel).length)
    expect(jsonFeel._services).to.be.defined;

    expect(jsonFeel._services).to.be.array;

  });

});
