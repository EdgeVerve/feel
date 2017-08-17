var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');

var testDataFile = 'test/data/RoutingDecisionService.xlsx';

describe('basic tests...', function() {
  it('should detect a sheet marked to be exposed as decision service', function() {
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Routing"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var result = DL._.isDecisionService(csvExcel);

    expect(result).to.equal(true)
  });

  it('should detect a sheet marked as a boxed invocation', function() {
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Routing"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var result = DL._.isBoxedInvocation(csvExcel);

    expect(result).to.equal(true);
  });
})
