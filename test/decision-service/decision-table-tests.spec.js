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

describe('basic tests...', function() {
  // defunct - we are separately specifying this one
  // it('should detect a sheet marked to be exposed as decision service', function() {
  //   var workbook = XLSX.readFile(testDataFile);

  //   var worksheet = workbook.Sheets["Routing"];

  //   var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

  //   var result = DL._.isDecisionService(csvExcel);

  //   expect(result).to.equal(true)
  // });

  it('should detect a sheet marked as a boxed invocation', function() {
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Post-Bureau risk category"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var result = DL._.isBoxedInvocation(csvExcel);

    expect(result).to.equal(true);
  });

  it('should detect a sheet marked as a boxed context with result', function() {
    var workbook = XLSX.readFile(testDataFile);

    var worksheet = workbook.Sheets["Installment Calculation"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var result = DL._.isBoxedContextWithResult(csvExcel);

    expect(result).to.be.true;

  });

  it('should detect a sheet marked as a boxed context without result', function() {
    var workbook = XLSX.readFile(testDataFile2);

    var worksheet = workbook.Sheets["Applicant Data"];

    var csvExcel = XLSX.utils.sheet_to_csv(worksheet, { FS: '&SP', RS: '&RSP'});

    var result = DL._.isBoxedContextWithoutResult(csvExcel);

    expect(result).to.be.true;

  });

});
