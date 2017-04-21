# FEEL (Friendly Enough Expression Language)

Expression Language based on DMN specification conformance level 3.

Written using [PEG.js](https://pegjs.org/) - JavaScript Parser Generator

## What is FEEL:
FEEL stands for Friendly Enough Expression Language and it has the following features:
-	Side-effect free
-	Simple data model with numbers, dates, strings, lists, and contexts
-	Simple syntax designed for a wide audience
-	Three-valued logic (true, false, null) based on SQL and PMML

We define a graphical notation for decision logic called boxed expressions. This notation serves to decompose the decision logic model into small pieces that can be associated with DRG artifacts. The DRG plus the boxed expressions form a complete, mostly graphical language that completely specifies Decision Models.
A boxed expression is either:
-	a decision table
-	a boxed FEEL expression
-	a boxed invocation
-	a boxed context
-	a boxed list
-	a relation, or
-	a boxed function

# Business Rules Engine

## Introduction:
As name suggests Business Rules Engine is a framework to write pre-defined and custom rules for business validations and decision making. Business Rules Engines is developed based on DMN (Decision Model and Notation v 1.1) specification and use FEEL (Friendly Enough Expression Language) to write expressions for rules.

## What is DMN:
One of the ways to express decision logic is decision table. A decision table is a tabular representation of a set of related input and output expressions, organized into rules indicating which output entry applies to a specific set of input entries. The decision table contains all (and only) the inputs required to determine the output. Moreover, a complete table contains all possible combinations of input values (all the rules). Decision table is part of DRG (Decision Requirement Graph)

A decision table consists of:

-	An information item name: the name of an Information Item, if any, for which the decision table is its value expression. This will usually be the name of the Decision or Business Knowledge Model for which the decision table provides the decision logic.

-	An output label, which can be any text to describe the output of the decision table. The result of a decision table must be referenced using the information item name, not the output label, in another expression.

-	A set of inputs (zero or more). Each input is made of an input expression and a number of input entries. The specification of input expression and all input entries is referred to as the input clause.

-	A set of outputs (one or more). A single output has no name, only a value. Two or more outputs are called output components. Each output component SHALL be named. Each output (component) SHALL specify an output entry for each rule. The specification of output component name (if multiple outputs) and all output entries is referred to as an output clause.

-	A list of rules (one or more) in rows or columns of the table (depending on orientation), where each rule is composed of the specific input entries and output entries of the table row (or column). If the rules are expressed as rows, the columns are clauses, and vice versa.

![singleDT](/img/singleDT.png)
[Figure: Decision Table example (horizontal orientation: rules as rows)]

![multiDT](/img/multiDT.png)
[Figure: Decision Table example (horizontal orientation: multiple output)]

DMN input would be given by user in excel file. Here is an example of excel (.xlsx) file content

| Holiday | | | |
| ------- | --------- | -------- | --------- |
| RuleTable | Condition | Condition | Action |
| C+ | Age | Years of Service | Holidays |
| 1 | - | - | 1 |
| 2 | <18 | - | 5 |
| 3 | >=60 | - | 5 |
| 4 | - | [15..30) | 5 |
| 5 | [18..60) | [15..30) | 2 |
| 6 | >=60 | - | 3 |
| 7 | - | >=30 | 3 |
| 8 | [45..60) | <30 | 2 |

[Figure: Decision Table. Each cell contains an expression written in FEEL]

Below is the programmatic representation of above input
![exec-tree](/img/exec-tree.PNG)
[Figure: Flow of decision through nodes]

## Sample rules

[Validation.xlsx](/examples/validation.xlsx)

[PostBureauRiskCategory.xlsx](/examples/PostBureauRiskCategory.xlsx)

[ElectricityBill.xlsx](/examples/ElectricityBill.xlsx)

For comprehensive set of documentation on DMN, you can refer to 1.1 specification given in below url:

[DMN Specification Document](http://www.omg.org/spec/DMN/1.1/)
