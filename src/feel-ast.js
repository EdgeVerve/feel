/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/


const ast = {};

/* Begin AST Node Constructors */
function ProgramNode(body, loc) {
  this.type = 'Program';
  this.body = body;
  this.loc = loc;
}

function IntervalStartLiteralNode(intervalType, loc) {
  this.type = 'IntervalStartLiteral';
  this.intervalType = intervalType;
  this.loc = loc;
}

function IntervalEndLiteralNode(intervalType, loc) {
  this.type = 'IntervalEndLiteral';
  this.intervalType = intervalType;
  this.loc = loc;
}

function IntervalNode(intervalstart, startpoint, endpoint, intervalend, loc) {
  this.type = 'Interval';
  this.intervalstart = intervalstart;
  this.startpoint = startpoint;
  this.endpoint = endpoint;
  this.intervalend = intervalend;
  this.loc = loc;
}

function SimplePositiveUnaryTestNode(operator, operand, loc) {
  this.type = 'SimplePositiveUnaryTest';
  this.operator = operator;
  this.operand = operand;
  this.loc = loc;
}

function SimpleUnaryTestsNode(expr, not, loc) {
  this.type = 'SimpleUnaryTestsNode';
  this.expr = expr;
  this.not = not;
  this.loc = loc;
}

function UnaryTestsNode(expr, not, loc) {
  this.type = 'UnaryTestsNode';
  this.expr = expr;
  this.not = not;
  this.loc = loc;
}

function QualifiedNameNode(names, loc) {
  this.type = 'QualifiedName';
  this.names = names;
  this.loc = loc;
}

function ArithmeticExpressionNode(operator, operand1, operand2, loc) {
  this.type = 'ArithmeticExpression';
  this.operator = operator;
  this.operand_1 = operand1;
  this.operand_2 = operand2;
  this.loc = loc;
}

function SimpleExpressionsNode(simpleExpressions, loc) {
  this.simpleExpressions = simpleExpressions;
  this.loc = loc;
}

function NameNode(nameChars, loc) {
  this.type = 'Name';
  this.nameChars = nameChars;
  this.loc = loc;
}

function LiteralNode(value, loc) {
  this.type = 'Literal';
  this.value = value;
  this.loc = loc;
}

function DateTimeLiteralNode(symbol, params, loc) {
  this.symbol = symbol;
  this.params = params;
  this.loc = loc;
}

function DecimalNumberNode(integer, decimal, loc) {
  this.type = 'DecimalNumberNode';
  this.integer = integer;
  this.decimal = decimal;
  this.loc = loc;
}

function FunctionInvocationNode(fnName, params, loc) {
  this.type = 'FunctionInvocation';
  this.fnName = fnName;
  this.params = params;
  this.loc = loc;
}

function NamedParameterNode(paramName, expr, loc) {
  this.type = 'NamedParameter';
  this.paramName = paramName;
  this.expr = expr;
  this.loc = loc;
}

function NamedParametersNode(params, expr, loc) {
  this.type = 'NamedParameters';
  this.params = params;
  this.loc = loc;
}

function PositionalParametersNode(params, loc) {
  this.type = 'PositionalParameters';
  this.params = params;
  this.loc = loc;
}

function PathExpressionNode(exprs, loc) {
  this.type = 'PathExpression';
  this.exprs = exprs;
  this.loc = loc;
}

function ForExpressionNode(inExprs, expr, loc) {
  this.type = 'ForExpression';
  this.inExprs = inExprs;
  this.expr = expr;
  this.loc = loc;
}

function InExpressionNode(name, expr, loc) {
  this.type = 'InExpression';
  this.name = name;
  this.expr = expr;
  this.loc = loc;
}

function IfExpressionNode(condition, thenExpr, elseExpr, loc) {
  this.type = 'IfExpression';
  this.condition = condition;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
  this.loc = loc;
}

function QuantifiedExpressionNode(quantity, inExprs, expr, loc) {
  this.type = 'QuantifiedExpression';
  this.quantity = quantity;
  this.inExprs = inExprs;
  this.expr = expr;
  this.loc = loc;
}

function LogicalExpressionNode(operator, expr1, expr2, loc) {
  this.type = 'LogicalExpression';
  this.operator = operator;
  this.expr_1 = expr1;
  this.expr_2 = expr2;
  this.loc = loc;
}

function ComparisionExpressionNode(operator, expr1, expr2, expr3, loc) {
  this.type = 'ComparisionExpression';
  this.operator = operator;
  this.expr_1 = expr1;
  this.expr_2 = expr2;
  this.expr_3 = expr3;
  this.loc = loc;
}

function FilterExpressionNode(expr, filterExpr, loc) {
  this.type = 'FilterExpression';
  this.expr = expr;
  this.filterExpr = filterExpr;
  this.loc = loc;
}

function InstanceOfNode(expr, exprType, loc) {
  this.type = 'InstanceOf';
  this.expr = expr;
  this.exprType = exprType;
  this.loc = loc;
}

function ListNode(exprList, loc) {
  this.type = 'List';
  this.exprList = exprList;
  this.loc = loc;
}

function FunctionDefinitionNode(formalParams, body, loc) {
  this.type = 'FunctionDefinition';
  this.formalParams = formalParams;
  this.body = body;
  this.loc = loc;
}

function FunctionBodyNode(expr, extern, loc) {
  this.type = 'FunctionBody';
  this.expr = expr;
  this.extern = extern;
  this.loc = loc;
}

function ContextNode(entries, loc) {
  this.type = 'ContextNode';
  this.entries = entries;
  this.loc = loc;
}

function ContextEntryNode(key, expr, loc) {
  this.type = 'ContextEntry';
  this.key = key;
  this.expr = expr;
  this.loc = loc;
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
