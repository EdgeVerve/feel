[![Build Status](https://travis-ci.org/EdgeVerve/feel.svg?branch=master)](https://travis-ci.org/EdgeVerve/feel) [![Coverage Status](https://coveralls.io/repos/github/EdgeVerve/feel/badge.svg?branch=master)](https://coveralls.io/github/EdgeVerve/feel?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm](https://img.shields.io/npm/v/js-feel.svg)](https://npmjs.org/package/js-feel) 

[![NPM](https://nodei.co/npm/js-feel.png?compact=true)](https://npmjs.org/package/js-feel)

# About

[FEEL](https://github.com/EdgeVerve/feel/wiki/What-is-FEEL%3F) is an expression language based on DMN specification conformance level 3.
Written using [PEG.js](https://pegjs.org/) - JavaScript Parser Generator.
FEEL is a very powerful language built with the purpose of defining rules in Business Rule Engines.
FEEL also offers an API to implement and execute Decision Table defined in excel (.xlsx)

# Getting Started

FEEL is a completely flexible library which can be used with any project to add support for *Decision Table*. It also comes with a powerful expression language termed *FEEL* built-in to define a multitude of decision rules.

## Installation

### Development

```sh
# npm install
npm install js-feel --save

```

### Contribution

```sh
# clone repo
git clone https://github.com/EdgeVerve/feel.git

# or fork repo

# install dependencies
npm install

# run test cases
npm test

# watch for changes in source and grammar
gulp watch

# generate parser from grammar
gulp generate

# lint source files
npm run lint

# lint-fix source files
npm run lintfix
```

# Usage

## Using [Decision Table](https://github.com/EdgeVerve/feel/wiki/Decision-Table#what-is-decision-table)

Decision tables are defined in excel (.xlsx). Please check [Sample Rules](README.md#sample-rules).
Each cell in the body of the decision table has to be a valid FEEL expression. The following make use of FEEL parser to parse and execute expressions and hence the decision logic.

### Excel to Decision Table

```javascript
const { decisionTable } = require('feel')();

const csv = decisionTable.xls_to_csv('./test/StudentFinancialPackageEligibility.xlsx');
const decision_table = decisionTable.csv_to_decision_table(csv[0]);
```

### Execute Decision Table

The Decision Table (decision_table) created in the previous step can be executed using;  *decisionTable.execute_decision_table*

```javascript

const payload = {"Student GPA" : 3.6,"Student Extra-Curricular Activities Count" : 4,"Student National Honor Society Membership" : "Yes"};
decisionTable.execute_decision_table("StudentFinancialPackageEligibility", decision_table,payload, (results)=> {
    console.log(results)
});
```

## Using [FEEL](https://github.com/EdgeVerve/feel/wiki/What-is-FEEL%3F) Standalone

```javascript
const {feel} = require('feel')();

const rule = 'a + b - c';
const context = {
    a: 10,
    b: 20,
    c: 5
};

const parsedGrammar = feel.parse(rule);
parsedGrammar.build(context).then(result => {
    console.log(result);
}).catch(err => console.error(err));
```

# Sample FEEL Expressions

Some valid FEEL expressions (logically categorized):

### Arithmetic

- a + b - c
- ((a + b)/c - (d + e*2))**f
- 1-(1+rate/12)**-term
- (a + b)**-c
- date("2012-12-25") + date("2012-12-24")
- time("T13:10:06") - time("T13:10:05")
- date and time("2012-12-24T23:59:00") + duration("P1Y")

### Comparision

- 5 in (<= 5)
- 5 in ((5..10])
- 5 in ([5..10])
- 5 in (4,5,6)
- 5 in (<5,>5)
- (a + 5) >= (7 + g)
- (a+b) between (c + d) and (e - f)
- date("2012-12-25") > date("2012-12-24")
- date and time("2012-12-24T23:59:00") < date and time("2012-12-25T00:00:00")

### Conjunction

- a or b
- a and b
- ((a or b) and (b or c)) or (a and d)
- ((a > b) and (a > c)) and (b > c)
- ((a + b) > (c - d)) and (a > b)
- a or b or a > b
- (x(i, j) = y) and (a > b)
- (a + b) > (c - d) and (a > b)

### For

- for a in [1,2,3] return a * a
- for age in [18..40], name in ["george", "mike", "bob"] return status

### Function Definition

- function(age) age < 21
- function(rate, term, amount) (amount*rate/12)/(1-(1+rate/12)**-term)

### If

- if applicant.maritalStatus in ("M", "S") then "valid" else "not valid"
- if Pre-Bureau Risk Category = "DECLINE" or Installment Affordable = false or Age < 18 or Monthly Income < 100 then "INELIGIBLE" else "ELIGIBLE"
- if "Pre-Bureau Risk Category" = "DECLINE" or "Installment Affordable" = false or Age < 18 or "Monthly Income" < 100 then "INELIGIBLE" else "ELIGIBLE"

### Quantified

- some ch in credit history satisfies ch.event = "bankruptcy"

### Date Time Semantics

- time("13:10:05@Etc/UTC").hour
- time("13:10:05@Etc/UTC").minute
- time("13:01:05+05:30").second
- date and time("2012-12-24T23:59:00").year
- date("2017-06-10").month
- date("2017-06-10").day
- duration("P13M").years
- duration("P1Y11M").months
- duration("P5DT12H10M").days
- duration("P5DT12H10M").hours
- duration("P5DT12H10M").minutes
- duration("P5DT12H10M25S").seconds

### Date Time Conversion and Equality

- date("2012-12-25") – date("2012-12-24") = duration("P1D")
- date and time("2012-12-24T23:59:00") + duration("PT1M") = date and time("2012-12-25T00:00:00")
- time("23:59:00z") + duration("PT2M") = time("00:01:00@Etc/UTC")
- date and time("2012-12-24T23:59:00") - date and time("2012-12-22T03:45:00") = duration("P2DT20H14M")
- duration("P2Y2M") = duration("P26M")

***Please note: This is not a complete list of FEEL Expressions. Please refer [DMN Specification Document](http://www.omg.org/spec/DMN/1.1/) for detailed documentation on FEEL grammar.***

# Sample Rules

[Validation.xlsx](/test/data/Validation.xlsx)

[PostBureauRiskCategory.xlsx](/test/data/PostBureauRiskCategory.xlsx)

[ElectricityBill.xlsx](/test/data/ElectricityBill.xlsx)

# Reference

For comprehensive set of documentation on DMN, you can refer to :

[DMN Specification Document](http://www.omg.org/spec/DMN/1.1/)
