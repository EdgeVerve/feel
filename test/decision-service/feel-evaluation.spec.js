/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
var chai = require('chai');
var expect = chai.expect;
var DL = require('../../utils/helper/decision-logic');
var fs = require('fs');
var FEEL = require('../../dist/feel');
var chalk = require('chalk');


var DS = require('../../utils/helper/decision-service');

describe(chalk.yellow('Feel evaluation...'), function(){

  it('RoutingRules2.xlsx', function(done){
    var parseWorkbook = DL.parseWorkbook;
    var { createDecisionGraphAST, executeDecisionService } = DS;

    var decMap = parseWorkbook('test/data/RoutingRules2.xlsx');
    var ast = createDecisionGraphAST(decMap);

    const payload = {
      'Post Bureau Risk Category' : 'MEIDUM',
      'Post Bureau Affordability' : false,
      'Bankrupt' : false,
      'Credit Score': 600
    };
    debugger;
    executeDecisionService(ast, 'Routing Rules', payload)
      .then(result => {
        expect({Routing: 'ACCEPT'}).to.not.deep.equal(result);
        done();
      })
      .catch(done)
  });

  it('RoutingRules2.xlsx - old path', function(done){
    var DT = require('../../utils/helper/decision-table');
    debugger;
    var decision_table = DT.xls_to_csv('test/data/RoutingRules2.xlsx');
    var payload = {
      'Post Bureau Risk Category' : 'MEIDUM',
      'Post Bureau Affordability' : false,
      'Bankrupt' : false,
      'Credit Score': 600
    };
    DT.execute_decision_table("Routing Rules", decision_table, payload, (err, results) => {
      if(err){
          done(err);
          return;
      }
      expect({Routing: 'ACCEPT'}).to.not.deep.equal(results);
      done();
    });
  });
  it('should execute a decision logic correctly - case 1', function(done) {
    //from the routingdecisionservice.json file
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
    debugger;
    DS.executeDecisionService(decisionAST, 'Routing', inputData).then( r => {
      // console.log(r);
      expect({Routing: 'ACCEPT'}).to.deep.equal(r);
      done();
    }).catch(done);

  });

  it('should execute a decision service given manually created decision map', function(done){
    const { createDecisionGraphAST, executeDecisionService } = DS;

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
    }

    const decisionMap = {
      "Routing": "Routing Rules (Bankrupt : Bureau data . Bankrupt,Credit Score : Bureau data . CreditScore,Post Bureau Risk Category : Post bureau risk category,Post Bureau Affordability : Post bureau affordability)",
      "Routing Rules": "decision table(outputs : \"Routing\",input expression list : ['Post Bureau Risk Category','Post Bureau Affordability','Bankrupt','Credit Score'],rule list : [['-','FALSE','-','-','\"DECLINE\"'],['-','-','TRUE','-','\"DECLINE\"'],['\"HIGH\"','-','-','-','\"REFER\"'],['-','-','-','<580','\"REFER\"'],['-','-','-','-','\"ACCEPT\"']],id : 'Routing Rules',hit policy: \"U\",input values list : [[null, [0..999]]],output values : [[\"DECLINE\", \"REFER\", \"ACCEPT\"]])",
      "Post bureau risk category": "Post Bureau risk category table (Existing Customer : Applicant data . ExistingCustomer,Credit Score : Bureau data . CreditScore,Application Risk Score : Application risk score)",
      "Post Bureau risk category table": "decision table(outputs : \"Post Bureau Risk Category\",input expression list : ['Existing Customer','Application Risk Score','Credit Score'],rule list : [['FALSE','< 120','<590','\"HIGH\"'],['FALSE','< 120','[590..610]','\"MEDIUM\"'],['FALSE','< 120','> 610','\"LOW\"'],['FALSE','[120..130]','<600','\"HIGH\"'],['FALSE','[120..130]','[600..625]','\"MEDIUM\"'],['FALSE','[120..130]','> 625','\"LOW\"'],['FALSE','> 130','-','\"VERY LOW\"'],['TRUE','<= 100','< 580','\"HIGH\"'],['TRUE','<= 100','[580..600]','\"MEDIUM\"'],['TRUE','<= 100','> 600','\"LOW\"'],['TRUE','> 100','< 590','\"HIGH\"'],['TRUE','> 100','[590..615]','\"MEDIUM\"'],['TRUE','> 100','> 615','\"LOW\"']],id : 'Post Bureau risk category table',hit policy: \"U\")",
      "Post bureau affordability": "Affordability calculation (Monthly Income : Applicant data . Monthly . Income,Monthly Repayments : Applicant data . Monthly . Repayments,Monthly Expenses : Applicant data . Monthly . Expenses,Risk Category : Post bureau risk category,Required Monthly Installment : Required monthly installment)",
      "Affordability calculation": "{Disposable Income : Monthly Income - (Monthly Repayments + Monthly Expenses),Credit Contingency Factor : Credit contingency factor,Affordability : if Disposable Income * Credit Contingency Factor > Required Monthly Installment then true else false,result : Affordability}",
      "Credit contingency factor": "Credit Contingency factor table (Risk Category : Risk Category)",
      "Credit Contingency factor table": "decision table(outputs : \"Credit Contingency Factor\",input expression list : ['Risk Category'],rule list : [['\"HIGH\",\"DECLINE\"','0.6'],['\"MEDIUM\"','0.7'],['\"LOW\",\"VERYLOW\"','0.8']],id : 'Credit Contingency factor table',hit policy: \"U\")",
      "Required monthly installment": "Installment Calculation (Product Type : Requested product . ProductType,Rate : Requested product . Rate,Term : Requested product . Term,Amount : Requested product . Amount)",
      "Installment Calculation": "{Monthly Fee : if Product Type = \"STANDARD LOAN\" then 20.00 else if Product Type = \"SPECIAL LOAN\" then 25.00 else null,Monthly Repayment : PMT(Rate, Term, Amount),result : Monthly Repayment + Monthly Fee}",
      "Application risk score": "Application risk score model (Age : Applicant data . Age,Marital Status : Applicant data . MaritalStatus,Employment Status : Applicant data . EmploymentStatus)",
      "Application risk score model": "decision table(outputs : \"Partial Score\",input expression list : ['Age','Marital Status','Employment Status'],rule list : [['[18..21]','-','-','32'],['[22..25]','-','-','35'],['[26..35]','-','-','40'],['[36..49]','-','-','43'],['>=50','-','-','48'],['-','\"S\"','-','25'],['-','\"M\"','-','45'],['-','-','\"UNEMPLOYED\"','15'],['-','-','\"STUDENT\"','18'],['-','-','\"EMPLOYED\"','45'],['-','-','\"SELF-EMPLOYED\"','36']],id : 'Application risk score model',hit policy: \"C+\",input values list : [[[18..120]],[\"S\", \"M\"],[\"UNEMPLOYED\", \"EMPLOYED\", \"SELF-EMPLOYED\", \"STUDENT\"]],output values : [[]])",
      "PMT": "function(rate, term, amount) (amount *rate/12) / (1 - (1 + rate/12)**-term)"
    };

    const decisionAST = createDecisionGraphAST(decisionMap);

    executeDecisionService(decisionAST,'Routing',inputData).then((result) => {
      // debugger;
      expect({Routing: 'ACCEPT'}).to.deep.equal(result);
      done();
    }).catch(done);

  });

  it('should execute the Routing rules decision service when input with payload', function(done) {
    var file = 'test/data/RoutingRules.xlsx';
    var jsonFEEL = DL.parseWorkbook(file);
    const { createDecisionGraphAST, executeDecisionService } = DS;
    var payload = {"Age" : 18, "Risk category" : "High", "Debt review" : false};
    var graph = createDecisionGraphAST(jsonFEEL);
  // console.log(jsonFEEL)
    debugger;
    executeDecisionService(graph, 'Routing rules', payload).then(results => {
      // console.log(results)
      expect(results.length).to.equal(2);
      expect(results[0].Routing).to.equal('Refer');
      expect(results[0]['Review level']).to.equal('Level1');
      expect(results[0].Reason).to.equal('High risk application');
      expect(results[1].Routing).to.equal('Accept');
      expect(results[1]['Review level']).to.equal('None');
      expect(results[1].Reason).to.equal('Acceptable');
      done();
    }).catch(done)
  });

  it('should execute a decision logic correctly - case 2', function(done) { //from workbook
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

    // var contents = fs.readFileSync('test/data/RoutingDecisionService.json', { encoding: 'utf8'});

    // var decisionMap = JSON.parse(contents);

    var decisionMap = DL.parseWorkbook('test/data/RoutingDecisionService.xlsx');

    decisionMap.PMT = "function(rate, term, amount) (amount *rate/12) / (1 - (1 + rate/12)**-term)";


    var decisionAST = DS.createDecisionGraphAST(decisionMap);

    DS.executeDecisionService(decisionAST, 'Routing', inputData).then( r => {
      // console.log(r);
      expect({Routing: 'ACCEPT'}).to.deep.equal(r);
      done();
    }).catch(done);

  });


});


