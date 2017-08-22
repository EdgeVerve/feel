var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');
var FEEL = require('../../dist/feel');
var chalk = require('chalk');
describe(chalk.blue('Pegjs parsing tests...'), function(){
  it('should successfully parse a excel workbook - decision service', function()  {
    var file = 'test/data/RoutingDecisionService.xlsx';
    debugger;
    var jsonFeel = DL.parseWorkbook(file);

    var keys = Object.keys(jsonFeel)

    keys.filter(k => k !== '_services').forEach(function(key) {
      var feelExpression = jsonFeel[key];
      try {
        var grammer = FEEL.parse(feelExpression);
      }
      catch(e) {
        expect(true, JSON.stringify({key: key, feel: feelExpression, error: e.message}, null, 2)).to.be.false;
      }

      expect(grammer, 'For name: ' + key).not.to.be.undefined;
    });
  })
})
