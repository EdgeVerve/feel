{ 
/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */
// initializer section start

// ast nodes are the constructors used to construct the ast for the parsed grammar
const ast = require('./feel-ast');

// adding build methods to prototype of each constructor
require('./feel-ast-parser')(ast);

function extractOptional(optional, index) {
  return optional ? optional[index] : null;
}

function flatten(list) {
  return list.filter( d => d && d.length).reduce((recur, next) => {
    if(next && Array.isArray(next)) {
      return [].concat.call(recur, flatten(next));
    }
    return [].concat.call(recur, next);
  }, []);
}

function extractList(list, index) {
  return list.map(element => element[index]);
}

function buildList(head, tail, index) {
  return [head].concat(extractList(tail, index));
}

function buildName(head, tail, index) {
  return tail && tail.length ? [...head, ...flatten(tail)].join("") : head.join("");
}


function buildBinaryExpression(head, tail, loc) {
  return tail.reduce((result, element) => new ast.ArithmeticExpressionNode(element[1], result, element[3], loc), head);
}

function buildComparisionExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    const operator = Array.isArray(element[1]) ? element[1][0] : element[1];
    return new ast.ComparisionExpressionNode(operator, result, element[3], null, loc);
  }, head);
}

function buildLogicalExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    let operator = element[1];
    if (operator === 'and') {
      operator = '&&';
    } else if (operator === 'or') {
      operator = '||';
    }
    return new ast.LogicalExpressionNode(operator, result, element[3], loc);
  }, head);
}


 }
Start
    = __ program:(StartExpression __)?
        {
            return new ast.ProgramNode(extractOptional(program,0),location());
        }

StartExpression
	= Expression

Expression
	= BoxedExpression
	/ TextualExpression

TextualExpression
    = TxtExpa
    / TxtExpb
    / TxtExpc
    / TxtExpd
    / TxtExpe
    / TxtExpf
    / TxtExpg
    / TxtExph
    / TxtExpi

SimpleExpression
  = ArithmeticExpression
  / SimpleValue

SimpleExpressions
  =   head:SimpleExpression tail:(__ "," __ SimpleExpression)*
        {
          return new ast.SimpleExpressionsNode(buildList(head,tail,3), location());
        }

TxtExpi
	="(" __ expr:TextualExpression __ ")"
		{
			return expr;
		}
	/ Name
  / Literal
	/ SimplePositiveUnaryTest

//Name Start

NameStartUnicodeChar = [\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962-\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2-\u09E3\u0A01-\u0A02\u0A3C\u0A41-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A51\u0A70-\u0A71\u0A75\u0A81-\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7-\u0AC8\u0ACD\u0AE2-\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62-\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C62-\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC-\u0CCD\u0CE2-\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62-\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EC8-\u0ECD\u0F18-\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039-\u103A\u103D-\u103E\u1058-\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085-\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17B4-\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927-\u1928\u1932\u1939-\u193B\u1A17-\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80-\u1B81\u1BA2-\u1BA5\u1BA8-\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8-\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8-\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099-\u309A\uA66F\uA674-\uA67D\uA69E-\uA69F\uA6F0-\uA6F1\uA802\uA806\uA80B\uA825-\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31-\uAA32\uAA35-\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7-\uAAB8\uAABE-\uAABF\uAAC1\uAAEC-\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]

NamePartUnicodeChar = [\u0B70\u0300-\u036F\u203F-\u2040]

NameStartChar
    = [?]
    / [A-Z]
    / [_]
    / [a-z]
    / NameStartUnicodeChar

NamePartChar
    = NameStartChar
    / Digit
    / NamePartUnicodeChar
    / [']

NameStart
    = head:NameStartChar tail:(NamePartChar)*
        {
            return buildList(head,tail,0);
        }

NamePart
    = head:NamePartChar tail:(NamePartChar)*
        {
            return buildList(head,tail,0);
        }

Name
    = "time zone"
    / !ReservedWord head:NameStart tail:(__ (!ReservedWord) __ NamePart)*
        {
            return new ast.NameNode(buildName(head,tail,0),location());
        }

//Name End

//Literal Start

Literal
    = SimpleLiteral
    / NullLiteral

SimpleLiteral
    = NumericLiteral
    / StringLiteral
    / BooleanLiteral
    / DateTimeLiteral

NullLiteral
    = $NullToken
        {
            return new ast.LiteralNode(null, location());
        }

BooleanLiteral
    = $TrueToken
        {
            return new ast.LiteralNode(true, location());
        }
    / $FalseToken
        {
            return new ast.LiteralNode(false, location());
        }

Digit
    = [0-9]

Digits
    = [0-9]+

NumericLiteral
    = negative:("-")? __ number:DecimalNumber
        {
            return new ast.LiteralNode(Number((negative || "") + number),location());
        }

DecimalNumber
    = integer:Digits "." decimal:Digits
        {
            return integer.join("") + "." + decimal.join("");
        }
    / "." decimal:Digits
        {
            return "." + decimal.join("");
        }
     / integer:Digits
        {
            return integer.join("");
        }

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return new ast.LiteralNode(chars.join(""),location());
    }
  / "'" chars:SingleStringCharacter* "'" {
       return new ast.LiteralNode(chars.join(""),location());
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation

LineContinuation
  = "\\" LineTerminatorSequence { return ""; }

EscapeSequence
  = CharacterEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b"; }
  / "f"  { return "\f"; }
  / "n"  { return "\n"; }
  / "r"  { return "\r"; }
  / "t"  { return "\t"; }
  / "v"  { return "\v"; }

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

DateTimeLiteral
  = symbol: DateTimeKeyword "(" __ head:Expression tail:(__ "," __ Expression)* __ ")"
    {
        return new ast.DateTimeLiteralNode(symbol[0], buildList(head, tail, 3), location());
    }


//Literal End

//SimplePositiveUnaryTest Start

SimplePositiveUnaryTest
    = head:(UnaryOperator __)? tail:Endpoint __ !(ArithmeticOperator/ReservedWord/"..")
        {
             return new ast.SimplePositiveUnaryTestNode(extractOptional(head,0),tail,location());
        }
     / Interval

UnaryOperator
    = "<="
    / ">="
    / "<"
    / ">"

ArithmeticOperator
    = "+"
    / "-"
    / "*" !"*"
    / "/"
    / "**"

Interval
    = start:IntervalStart !(IntervalStart / IntervalEnd) __ first:Endpoint __ ".." __ second:Endpoint __ end:IntervalEnd
        {
            return new ast.IntervalNode(start,first,second,end,location());
        }

IntervalStart
    = OpenIntervalStart
        {
            return new ast.IntervalStartLiteralNode("<",location());
        }
    / ClosedIntervalStart
        {
            return new ast.IntervalStartLiteralNode("<=",location());
        }

IntervalEnd
    = OpenIntervalEnd
        {
            return new ast.IntervalEndLiteralNode(">",location());
        }
    / ClosedIntervalEnd
        {
            return new ast.IntervalEndLiteralNode(">=",location());
        }

OpenIntervalStart
    = "("
    / "]"

ClosedIntervalStart
    = "["

OpenIntervalEnd
    = ")"
    / "["

ClosedIntervalEnd
    = "]"

Endpoint
    = SimpleValue

SimpleValue
    = QualifiedName
    / SimpleLiteral

QualifiedName
    = head:Name tail: (__ "->" __ Name)*
        {
             return new ast.QualifiedNameNode(buildList(head,tail,3),location());
        }

//SimplePositiveUnaryTest End

//SimpleUnaryTests Start

SimpleUnaryTests
	= expr:SimplePositiveUnaryTests
		{
			return new ast.SimpleUnaryTestsNode(expr,null,location());
		}
	/ not:$NotToken __ "(" __ expr:SimplePositiveUnaryTests __ ")"
		{
			return new ast.SimpleUnaryTestsNode(expr,not,location());
		}
	/ "-"
		{
			return new ast.SimpleUnaryTestsNode(null,null,location());
		}

SimplePositiveUnaryTests
	= head: PositiveUnaryTest
	tail: (__ "," __ PositiveUnaryTest)*
	{
		return buildList(head,tail,3);
	}

//SimpleUnaryTests End

//PositiveUnaryTests Start

PositiveUnaryTest
	= SimplePositiveUnaryTest
	/ head: NullLiteral
  {
    return new ast.SimplePositiveUnaryTestNode(null,head,location());
  }

PositiveUnaryTests
	= head:PositiveUnaryTest
	tail:(__ "," __ PositiveUnaryTest)*
	{
		return buildList(head,tail,3);
	}

//PositiveUnaryTests End

//UnaryTests Start

UnaryTests
	= expr:PositiveUnaryTests
		{
			return ast.UnaryTestsNode(expr,null,location());
		}
	/ not:$NotToken __ "(" __ expr:PositiveUnaryTests __ ")"
		{
			return ast.UnaryTestsNode(expr,not,location());
		}
	/ "-"
		{
		 	return ast.UnaryTestsNode(null,null,location());
		}

//UnaryTests End

TxtExph
	= FilterExpression
	/ FunctionInvocation

LeftExph
	= TxtExpi

FilterExpression
    = head:LeftExph __ "[" __ tail:Expression __ "]"
        {
            return new ast.FilterExpressionNode(head,tail,location());
        }

FunctionInvocation
    = fnName:LeftExph __ "(" params:(__ (NamedParameters/PositionalParameters))? __ ")"
        {
            return new ast.FunctionInvocationNode(fnName,extractOptional(params,1),location());
        }

NamedParameters
    = head:NamedParameter tail:(__ "," __ NamedParameter)*
        {
            return new ast.NamedParametersNode(buildList(head,tail,3),location());
        }

NamedParameter
    = head:Name __ ":" __ tail:Expression
        {
             return new ast.NamedParameterNode(head,tail,location());
        }

PositionalParameters
    = head:Expression tail:(__ "," __ Expression)*
        {
            return new ast.PositionalParametersNode(buildList(head,tail,3),location());
        }


TxtExpg
	= PathExpression

LeftExpg
	= TxtExph
	/ LeftExph

PathExpression
    = head:LeftExpg tail: (__ "." __ Name)+
        {
            return new ast.PathExpressionNode(buildList(head,tail,3),location());
        }

TxtExpf
	= InstanceOf

LeftExpf
	= TxtExpg
	/ LeftExpg


InstanceOf
	= expr:LeftExpf __ $InstanceOfToken __ type:QualifiedName
		{
			return new ast.InstanceOfNode(expr,type,location());
		}

TxtExpe
	= ArithmeticExpression

LeftExpe
	= TxtExpf
	/ LeftExpf

ArithmeticExpression
	= Additive
	/ Multiplicative
	/ Exponentiation
	/ ArithmeticNegation

ArithmeticNegation
    = $("-") __ expr:Expression
        {
            return buildBinaryExpression(null, [[null,"-",null,expr]], location());
        }

UnaryExpression
    = LeftExpe
    / ArithmeticNegation

Exponentiation
  	= head:UnaryExpression
    tail:(__ $("**") __ UnaryExpression)*
    { return buildBinaryExpression(head, tail, location()); }

MultiplicativeOperator
	= $("*" !"*")
	/ $"/"

Multiplicative
    =  head:Exponentiation
    tail:(__ MultiplicativeOperator __ Exponentiation)*
    { return buildBinaryExpression(head, tail, location()); }

Additive
    = head:Multiplicative
    tail:(__ $("+"/"-") __ Multiplicative)*
    { return buildBinaryExpression(head, tail, location()); }

TxtExpd
	= Comparision

LeftExpd
	= TxtExpe
	/ LeftExpe

ComparisionOperator
    = "="
    / "!="
    / $"<" !"="
    / "<="
    / $">" !"="
    / ">="

Comparision
	= head:LeftExpd tail:(__ ComparisionOperator __ LeftExpd)+
	  { return buildComparisionExpression(head,tail,location()); }
	/ head:LeftExpd __ operator:$BetweenToken __ first:LeftExpd __ and:AndToken __ second:LeftExpd
        {
            return new ast.ComparisionExpressionNode(operator,head,first,second,location());
        }
    / head:LeftExpd __ operator:$InToken __ tail:PositiveUnaryTest
        {
            return new ast.ComparisionExpressionNode(operator,head,tail,null,location());
        }
    / head:LeftExpd __ operator:$InToken __ "(" __ tail:PositiveUnaryTests __ ")"
        {
            return new ast.ComparisionExpressionNode(operator,head,tail,null,location());
        }

TxtExpc
	= Conjunction

LeftExpc
	= TxtExpd
	/ LeftExpd

Conjunction
	= head:LeftExpc tail:(__ $AndToken __ LeftExpc)+
		{
			return buildLogicalExpression(head,tail,location());
		}

TxtExpb
	= Disjunction

LeftExpb
	= TxtExpc
	/ LeftExpc

Disjunction
	= head:LeftExpb tail:(__ $OrToken __ LeftExpb)+
		{
			return buildLogicalExpression(head,tail,location());
		}

TxtExpa
	= FunctionDefinition
	/ ForExpression
	/ IfExpression
	/ QuantifiedExpression

LeftExpa
	= TxtExpb
	/ LeftExpb

FunctionDefinition
    = FunctionToken "(" params:(__ FormalParameters)? __ ")" __ body:FunctionBody
        {
            return new ast.FunctionDefinitionNode(extractOptional(params,1),body,location());
        }

FunctionBody
    = extern:(ExternalToken __)? expr:Expression
        {
            return new ast.FunctionBodyNode(expr,extractOptional(extern,0),location());
        }

FormalParameters
    = head:Name tail:(__ "," __ Name)*
        {
            return buildList(head,tail,3);
        }

ForExpression
    = $ForToken __ head:InExpressions __ $ReturnToken __ tail:Expression
        {
            return new ast.ForExpressionNode(head,tail,location());
        }

InExpressions
    = head:InExpression tail:(__ "," __ InExpression)*
        {
            return buildList(head,tail,3);
        }

InExpression
    = head:Name __ InToken __ tail:Expression
        {
            return new ast.InExpressionNode(head,tail,location());
        }

IfExpression
    = $IfToken __ condition:Expression __ $ThenToken __ thenExpr:Expression __ $ElseToken __ elseExpr:Expression
        {
            return new ast.IfExpressionNode(condition,thenExpr,elseExpr,location());
        }

QuantifiedExpression
    = quantity:$(SomeToken/EveryToken) WhiteSpace+ head:InExpressions __ $SatisfiesToken __ tail:Expression
        {
            return new ast.QuantifiedExpressionNode(quantity,head,tail,location());
        }

BoxedExpression
    = List
    / FunctionDefinition
    / Context

List
    = "[" __ head:Expression tail:(__ "," __ Expression)* __ "]"
        {
            return new ast.ListNode(buildList(head,tail,3),location());
        }

Context
    = "{" entries:(__ ContextEntries)? __ "}"
        {
            return new ast.ContextNode(extractOptional(entries,1),location());
        }

Key
    = Name
    / StringLiteral

ContextEntry
    = head:Key __ ":" __ tail:Expression
        {
            return new ast.ContextEntryNode(head,tail,location());
        }
    ;

ContextEntries
    = head:ContextEntry tail:(__ "," __ ContextEntry)*
        {
            return buildList(head,tail,3);
        }

//Tokens and Whitespace Start

ReservedWord
  = Keyword
  / DateTimeKeyword
  / NullLiteral
  / BooleanLiteral

DateTimeKeyword
  = "date and time"               !NamePartChar
  / "time"                        !NamePartChar
  / "date"                        !NamePartChar
  / "duration"                    !NamePartChar
  / "years and months duration"   !NamePartChar
  / "days and time duration"      !NamePartChar

Keyword
    = TrueToken
    / FalseToken
    / NullToken
    / AndToken
    / OrToken
    / NotToken
    / ForToken
    / ReturnToken
    / InstanceOfToken
    / InToken
    / IfToken
    / ThenToken
    / ElseToken
    / SomeToken
    / EveryToken
    / SatisfiesToken
    / BetweenToken
    / FunctionToken
    / ExternalToken

SourceCharacter
  = .

//WhiteSpace
WhiteSpace "whitespace"
    = "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"
    / Zs

// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
__
    = (WhiteSpace)*

// Tokens

TrueToken       =   $("true"/"TRUE"/"True")             !NamePartChar
FalseToken      =   $("false"/"FALSE"/"False")          !NamePartChar
NullToken       =   "null"                              !NamePartChar
AndToken        =   "and"                               !NamePartChar
OrToken         =   "or"                                !NamePartChar
NotToken        =   "not"                               !NamePartChar
ForToken        =   "for"                               !NamePartChar
ReturnToken     =   "return"                            !NamePartChar
InToken         =   "in"                                !NamePartChar
IfToken         =   "if"                                !NamePartChar
ThenToken       =   "then"                              !NamePartChar
ElseToken       =   "else"                              !NamePartChar
SomeToken       =   "some"                              !NamePartChar
EveryToken      =   "every"                             !NamePartChar
SatisfiesToken  =   "satisfies"                         !NamePartChar
BetweenToken    =   "between"                           !NamePartChar
InstanceOfToken =   "instanceof"                        !NamePartChar
FunctionToken   =   "function"                          !NamePartChar
ExternalToken   =   "external"                          !NamePartChar

//Tokens and Whitespace End
