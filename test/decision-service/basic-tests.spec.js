/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */
// const XLSX = require('xlsx');
const chai = require('chai');
// process.on('error', (e) => console.error(e))
const expect = chai.expect;
const DL = require('../../utils/helper/decision-logic');
// const fs = require('fs');

const testDataFile = 'test/data/CustomerDiscount2.xlsx';
// var testDataFile2 = 'test/data/ApplicantData.xlsx';
// eslint-disable-next-line no-undef
describe('additional decision table parsing logic...', () => {
  // eslint-disable-next-line no-undef
  it('should create decision table with input values list and output values list', () => {
    const generateContextString = DL._.generateContextString;
    const { parseXLS, parseCsv } = DL._;
    const jsonCsvObject = parseCsv(parseXLS(testDataFile));
    // const values = Object.values(jsonCsvObject);
    const values = Object.keys(jsonCsvObject).map(k => jsonCsvObject[k]);
    // console.log(jsonCsvObject)
    expect(values.length).to.equal(1);
    // debugger;
    const result = DL._.makeContext(values[0]);

    expect(result.qn).to.equal('Customer Discount');

    const computedExpression = result.expression;
    const ruleList = [
      ['"Business"', '< 10', '0.1'],
      ['"Business"', '>=10', '0.15'],
      ['"Private"', '-', '0.05'],
    ];

    // var inpValuesList = ['"Business", "Private"', '<10, >=10'];
    const inpValuesList = [['"Business"', '"Private"'], ['<10', '>=10']];
    // var outputValuesList = ['0.05, 0.10, 0.15'];
    const outputValuesList = [['0.05', '0.10', '0.15']];

    const contextEntries = [
      'outputs : "Discount"',
      'input expression list : ' + '[\'Customer\',\'Order Size\']',
      {
        'rule list': generateContextString(ruleList.map(r => generateContextString(r, false)), 'csv'),
      },
      {
        id: "\'Customer Discount\'",
      },
      'hit policy: "U"',
      {
        'input values list': generateContextString(inpValuesList.map(cl => generateContextString(cl, false)), 'csv'),
        'output values': generateContextString(outputValuesList.map(cl => generateContextString(cl, false)), 'csv'),
      },
    ];

    const entry = `decision table(${generateContextString(contextEntries, 'list')})`;
    // var finalCtxEntry = { result: entry };

    // var expectedContextString = generateContextString(finalCtxEntry, false);
    expect(computedExpression).to.equal(entry);
  });

  // eslint-disable-next-line no-undef
  it('should generate decision table expression with multiple outputs', () => {
    const file = 'test/data/RoutingRules.xlsx';
    const jsonFeel = DL.parseWorkbook(file);
    const values = Object.keys(jsonFeel).map(k => jsonFeel[k]);
    const computedExpression = values[0];
    const outputs = ['Routing', 'Review level', 'Reason'];

    const routingOutputValues = ['"Decline"', '"Refer"', '"Accept"'];
    const reviewLevelOutputValues = ['"Level2"', '"Level1"', '"None"'];

    const outputValuesList = [routingOutputValues, reviewLevelOutputValues, []];

    const inputValuesList = [[], ['"Low"', '"Medium"', '"High"'], []];

    const qualifiedName = 'Routing rules';
    const inputExpressionList = ['Age', 'Risk category', 'Debt review'];

    const ruleList = [
      ['-', '-', '-', '"Accept"', '"None"', '"Acceptable"'],
      ['<18', '-', '-', '"Decline"', '"None"', '"Applicant too young"'],
      ['-', '"High"', '-', '"Refer"', '"Level1"', '"High risk application"'],
      ['-', '-', 'true', '"Refer"', '"Level2"', '"Applicant under debt review"'],
    ];

    const hitPolicy = 'O';

    const generateContextString = DL._.generateContextString;

    const ruleListString = generateContextString(ruleList.map(r => generateContextString(r, false)), 'csv');
    const inputValuesListString = generateContextString(inputValuesList.map(r => generateContextString(r, false)), 'csv');
    const outputValuesListString = generateContextString(outputValuesList.map(r => generateContextString(r, false)), 'csv');
    const outputsString = generateContextString(outputs, false);
    const inputExpressionListString = generateContextString(inputExpressionList, false);
    const dtEntries = [
      `outputs : ${outputsString}`,
      `input expression list : ${inputExpressionListString}`,
      `rule list : ${ruleListString}`,
      `id : '${qualifiedName}'`,
      `hit policy: "${hitPolicy}"`,
      `input values list : ${inputValuesListString}`,
      `output values : ${outputValuesListString}`,
    ];

    const expectedExpression = `decision table(${generateContextString(dtEntries, 'list')})`;

    expect(computedExpression).to.equal(expectedExpression);
  });
});
