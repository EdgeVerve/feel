var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');
var FEEL = require('../../dist/feel');
var chalk = require('chalk');

var DS = require('../../utils/helper/decision-service');

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
  });

  it('should execute a decision logic correctly', function(done) {
    const inputData = {
      'Applicant data': {
        Age: 51,
        MaritalStatus: 'M',
        EmploymentStatus: 'EMPLOYED',
        'ExistingCustomer': false,
        'Monthly': {
          'Income': 10000,
          'Repayments': 2500,
          'Expenses': 3000
        }
      },
      'Requested product': {
        ProductType: 'STANDARD LOAN',
        Rate: 0.08,
        Term: 36,
        Amount: 100000
      },
      'Bureau data': {
        Bankrupt: false,
        CreditScore: 600
      }
    };

    var contents = fs.readFileSync('test/data/RoutingDecisionService.json', { encoding: 'utf8'});

    var decisionMap = JSON.parse(contents);

    decisionMap.PMT = "function(rate, term, amount) (amount *rate/12) / (1 - (1 + rate/12)**-term)";


    var decisionAST = DS.createDecisionGraphAST(decisionMap);

    DS.executeDecisionService(decisionAST, 'Routing', inputData).then( r => {
      console.log(r);
      expect(true).to.be.true;
      done();
    }).catch(done);

  });
});
