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

var testFile = 'test/data/RoutingDecisionService.xlsx';

describe('servicification tests...', function() {
  it('should be that each worksheet should not have blank rows at start', function() {
    var { parseXLS } = DL._;

    var parsed = parseXLS(testFile);

    var regex = /^(&SP)+&RSP/;

    parsed.forEach( sheetHash => {
      var key = Object.keys(sheetHash)[0];
      var csv = sheetHash[key];

      expect(regex.test(csv), key + ' sheet is faulty').to.be.false;
    });
  });

  it('should be that each worksheet has a proper qualified name', function() {
    var { parseXLS } = DL._;

    var parsed = parseXLS(testFile);

    parsed.forEach( sheetHash => {
      var key = Object.keys(sheetHash)[0];
      var csv = sheetHash[key];
      var qn = csv.substring(0, csv.indexOf('&SP'))
      // expect(regex.test(csv), key + ' sheet is faulty').to.be.false;
      expect(qn).to.be.string;
      expect(qn.length, 'Could not detect qualified name for sheet: ' + key).to.not.equal(0)
    });
  });
  // became defunct
  // it('should expose a json-feel object which exposes a service', function() {
  //   debugger;
  //   var jsonFeel = DL.parseWorkbook(testFile);

  //   expect(jsonFeel).to.be.defined;
  //   expect(jsonFeel).to.be.object;

  //   var workbook = XLSX.readFile(testFile);

  //   expect(workbook.SheetNames.length + 1).to.equal(Object.keys(jsonFeel).length)
  //   expect(jsonFeel._services).to.be.defined;

  //   expect(jsonFeel._services).to.eql(['Routing']);

  // });

  
});
