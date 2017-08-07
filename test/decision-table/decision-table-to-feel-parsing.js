var XLSX = require('xlsx')
var chai = require('chai')
var expect = chai.expect
var DTable = require('../../utils/helper/decision-table')
var fs = require('fs')

var excelWorkbookPath = 'test/data/PostBureauRiskCategory2.xlsx';

describe("Excel reading...(internal stuff)...", function() {
  it('should be that parseXLS() returns an array', function() {

    var csvJson = DTable._.parseXLS(excelWorkbookPath)
    expect(Array.isArray(csvJson)).to.equal(true)
  });

  it('should be that parseCsv() returns an object', function(){
    var csvJson = DTable._.parseXLS(excelWorkbookPath)
    var resultObject = DTable._.parseCsv(csvJson)
    var values = Object.values(resultObject)

    expect(Array.isArray(values)).to.equal(true)

    values.forEach(v => expect(v).to.be.string )
  })
});

describe('Excel workbook parsing...', function() {
  it('should correctly parse a csv decision table', function(){
    var json = DTable._.parseXLS(excelWorkbookPath);
    DTable._.parseCsv(Object.values(json)[0])
  })
})

