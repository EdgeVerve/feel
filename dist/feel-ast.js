/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const ast = {};

/* Begin AST Node Constructors */
function ProgramNode(body, loc, text) {
  this.type = 'Program';
  this.body = body;
  this.loc = loc; this.text = text;
}

function IntervalStartLiteralNode(intervalType, loc, text) {
  this.type = 'IntervalStartLiteral';
  this.intervalType = intervalType;
  this.loc = loc; this.text = text;
}

function IntervalEndLiteralNode(intervalType, loc, text) {
  this.type = 'IntervalEndLiteral';
  this.intervalType = intervalType;
  this.loc = loc; this.text = text;
}

function IntervalNode(intervalstart, startpoint, endpoint, intervalend, loc, text) {
  this.type = 'Interval';
  this.intervalstart = intervalstart;
  this.startpoint = startpoint;
  this.endpoint = endpoint;
  this.intervalend = intervalend;
  this.loc = loc; this.text = text;
}

function SimplePositiveUnaryTestNode(operator, operand, loc, text) {
  this.type = 'SimplePositiveUnaryTest';
  this.operator = operator;
  this.operand = operand;
  this.loc = loc; this.text = text;
}

function SimpleUnaryTestsNode(expr, not, loc, text) {
  this.type = 'SimpleUnaryTestsNode';
  this.expr = expr;
  this.not = not;
  this.loc = loc; this.text = text;
}

function UnaryTestsNode(expr, not, loc, text) {
  this.type = 'UnaryTestsNode';
  this.expr = expr;
  this.not = not;
  this.loc = loc; this.text = text;
}

function QualifiedNameNode(names, loc, text) {
  this.type = 'QualifiedName';
  this.names = names;
  this.loc = loc; this.text = text;
}

function ArithmeticExpressionNode(operator, operand1, operand2, loc, text) {
  this.type = 'ArithmeticExpression';
  this.operator = operator;
  this.operand_1 = operand1;
  this.operand_2 = operand2;
  this.loc = loc; this.text = text;
}

function SimpleExpressionsNode(simpleExpressions, loc, text) {
  this.simpleExpressions = simpleExpressions;
  this.loc = loc; this.text = text;
}

function NameNode(nameChars, loc, text) {
  this.type = 'Name';
  this.nameChars = nameChars;
  this.loc = loc; this.text = text;
}

function LiteralNode(value, loc, text) {
  this.type = 'Literal';
  this.value = value;
  this.loc = loc; this.text = text;
}

function DateTimeLiteralNode(symbol, params, loc, text) {
  this.symbol = symbol;
  this.params = params;
  this.loc = loc; this.text = text;
}

function DecimalNumberNode(integer, decimal, loc, text) {
  this.type = 'DecimalNumberNode';
  this.integer = integer;
  this.decimal = decimal;
  this.loc = loc; this.text = text;
}

function FunctionInvocationNode(fnName, params, loc, text) {
  this.type = 'FunctionInvocation';
  this.fnName = fnName;
  this.params = params;
  this.loc = loc; this.text = text;
}

function NamedParameterNode(paramName, expr, loc, text) {
  this.type = 'NamedParameter';
  this.paramName = paramName;
  this.expr = expr;
  this.loc = loc; this.text = text;
}

function NamedParametersNode(params, expr, loc, text) {
  this.type = 'NamedParameters';
  this.params = params;
  this.loc = loc; this.text = text;
}

function PositionalParametersNode(params, loc, text) {
  this.type = 'PositionalParameters';
  this.params = params;
  this.loc = loc; this.text = text;
}

function PathExpressionNode(exprs, loc, text) {
  this.type = 'PathExpression';
  this.exprs = exprs;
  this.loc = loc; this.text = text;
}

function ForExpressionNode(inExprs, expr, loc, text) {
  this.type = 'ForExpression';
  this.inExprs = inExprs;
  this.expr = expr;
  this.loc = loc; this.text = text;
}

function InExpressionNode(name, expr, loc, text) {
  this.type = 'InExpression';
  this.name = name;
  this.expr = expr;
  this.loc = loc; this.text = text;
}

function IfExpressionNode(condition, thenExpr, elseExpr, loc, text) {
  this.type = 'IfExpression';
  this.condition = condition;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
  this.loc = loc; this.text = text;
}

function QuantifiedExpressionNode(quantity, inExprs, expr, loc, text) {
  this.type = 'QuantifiedExpression';
  this.quantity = quantity;
  this.inExprs = inExprs;
  this.expr = expr;
  this.loc = loc; this.text = text;
}

function LogicalExpressionNode(operator, expr1, expr2, loc, text) {
  this.type = 'LogicalExpression';
  this.operator = operator;
  this.expr_1 = expr1;
  this.expr_2 = expr2;
  this.loc = loc; this.text = text;
}

function ComparisionExpressionNode(operator, expr1, expr2, expr3, loc, text) {
  this.type = 'ComparisionExpression';
  this.operator = operator;
  this.expr_1 = expr1;
  this.expr_2 = expr2;
  this.expr_3 = expr3;
  this.loc = loc; this.text = text;
}

function FilterExpressionNode(expr, filterExpr, loc, text) {
  this.type = 'FilterExpression';
  this.expr = expr;
  this.filterExpr = filterExpr;
  this.loc = loc; this.text = text;
}

function InstanceOfNode(expr, exprType, loc, text) {
  this.type = 'InstanceOf';
  this.expr = expr;
  this.exprType = exprType;
  this.loc = loc; this.text = text;
}

function ListNode(exprList, loc, text) {
  this.type = 'List';
  this.exprList = exprList;
  this.loc = loc; this.text = text;
}

function FunctionDefinitionNode(formalParams, body, loc, text) {
  this.type = 'FunctionDefinition';
  this.formalParams = formalParams;
  this.body = body;
  this.loc = loc; this.text = text;
}

function FunctionBodyNode(expr, extern, loc, text) {
  this.type = 'FunctionBody';
  this.expr = expr;
  this.extern = extern;
  this.loc = loc; this.text = text;
}

function ContextNode(entries, loc, text) {
  this.type = 'ContextNode';
  this.entries = entries;
  this.loc = loc; this.text = text;
}

function ContextEntryNode(key, expr, loc, text) {
  this.type = 'ContextEntry';
  this.key = key;
  this.expr = expr;
  this.loc = loc; this.text = text;
}

/* End AST Node Constructors */

/* Expose the AST Node Constructors */
ast.ProgramNode = ProgramNode;
ast.IntervalStartLiteralNode = IntervalStartLiteralNode;
ast.IntervalEndLiteralNode = IntervalEndLiteralNode;
ast.IntervalNode = IntervalNode;
ast.SimplePositiveUnaryTestNode = SimplePositiveUnaryTestNode;
ast.SimpleUnaryTestsNode = SimpleUnaryTestsNode;
ast.UnaryTestsNode = UnaryTestsNode;
ast.QualifiedNameNode = QualifiedNameNode;
ast.ArithmeticExpressionNode = ArithmeticExpressionNode;
ast.SimpleExpressionsNode = SimpleExpressionsNode;
ast.NameNode = NameNode;
ast.LiteralNode = LiteralNode;
ast.DateTimeLiteralNode = DateTimeLiteralNode;
ast.DecimalNumberNode = DecimalNumberNode;
ast.FunctionInvocationNode = FunctionInvocationNode;
ast.NamedParameterNode = NamedParameterNode;
ast.NamedParametersNode = NamedParametersNode;
ast.PositionalParametersNode = PositionalParametersNode;
ast.PathExpressionNode = PathExpressionNode;
ast.ForExpressionNode = ForExpressionNode;
ast.InExpressionNode = InExpressionNode;
ast.IfExpressionNode = IfExpressionNode;
ast.QuantifiedExpressionNode = QuantifiedExpressionNode;
ast.LogicalExpressionNode = LogicalExpressionNode;
ast.ComparisionExpressionNode = ComparisionExpressionNode;
ast.FilterExpressionNode = FilterExpressionNode;
ast.InstanceOfNode = InstanceOfNode;
ast.ListNode = ListNode;
ast.FunctionDefinitionNode = FunctionDefinitionNode;
ast.FunctionBodyNode = FunctionBodyNode;
ast.ContextNode = ContextNode;
ast.ContextEntryNode = ContextEntryNode;


module.exports = ast;
