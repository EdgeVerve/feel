Start
    = __ program:(StartExpression __)?
        {
            log(`Start ${text()}`);
            return new ast.ProgramNode(extractOptional(program,0),location(), text(), rule());
        }

StartExpression
	= Expression
  / SimpleUnaryTests

Expression
	= BoxedExpression
	/ TextualExpression

TextualExpression
    = TxtExpa // function definition | for expression | if expression | quantified expression |
    / TxtExpb // disjunction |
    / TxtExpc // conjunction |
    / TxtExpd // comparison |
    / TxtExpe // arithmetic expression |
    / TxtExpf // instance of |
    / TxtExpg // path expression |
    / TxtExph // filter expression | function invocation |
    / TxtExpi // literal | simple positive unary test | name | "(" , textual expression , ")"

SimpleExpression
  = ArithmeticExpression
  / SimpleValue

SimpleExpressions
  =   head:SimpleExpression tail:(__ "," __ SimpleExpression)*
        {
          log(`SimpleExpressions (${text()})`);
          return new ast.SimpleExpressionsNode(buildList(head,tail,3), location(), text(), rule());
        }

TxtExpi
	="(" __ expr:TextualExpression __ ")"
		{
      log(`TxtExpi (${text()})`);
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
            log(`NameStart (${text()})`);
            return buildList(head,tail,0);
        }

NamePart
    = head:NamePartChar tail:(NamePartChar)*
        {
            log(`NamePart (${text()})`);
            return buildList(head,tail,0);
        }

Name
    = "time zone"
    / !ReservedWord head:NameStart tail:(__ (!ReservedWord) __ NamePart)*
        {
            log(`Name (${text()})`);
            return new ast.NameNode(buildName(head,tail,0),location(), text(), rule());
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
            return new ast.LiteralNode(null, location(), text(), rule());
        }

BooleanLiteral
    = $TrueToken
        {
            return new ast.LiteralNode(true, location(), text(), rule());
        }
    / $FalseToken
        {
            return new ast.LiteralNode(false, location(), text(), rule());
        }

Digit
    = [0-9]

Digits
    = [0-9]+

NumericLiteral
    = negative:("-")? __ number:DecimalNumber
        {
            log(`NumericLiteral (${text()})`);
            return new ast.LiteralNode(Number((negative || "") + number),location(), text(), rule());
        }

DecimalNumber
    = integer:Digits "." decimal:Digits
        {
            log(`DecimalNumber:1 (${text()})`);
            return integer.join("") + "." + decimal.join("");
        }
    / "." decimal:Digits
        {
            log(`DecimalNumber:2 (${text()})`);
            return "." + decimal.join("");
        }
     / integer:Digits
        {
            log(`DecimalNumber:3 (${text()})`);
            return integer.join("");
        }

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      log(`StringLiteral:1 (${text()})`);
      return new ast.LiteralNode(chars.join(""),location(), text(), rule());
    }
  / "'" chars:SingleStringCharacter* "'" {
       log(`StringLiteral:2 (${text()})`)
       return new ast.LiteralNode(chars.join(""),location(), text(), rule());
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { log(`DoubleStringCharacter:1 (${text()})`); return text(); }
  / "\\" sequence:EscapeSequence { log(`DoubleStringCharacter:2 (${text()})`); return sequence; }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { log(`SingleStringCharacter:1 (${text()})`); return text(); }
  / "\\" sequence:EscapeSequence { log(`SingleStringCharacter:2 (${text()})`); return sequence; }
  / LineContinuation

LineContinuation
  = "\\" LineTerminatorSequence { log('LineContinuation'); return ""; }

EscapeSequence
  = CharacterEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { log('SingleEscapeCharacter:1');return "\b"; }
  / "f"  { log('SingleEscapeCharacter:2');return "\f"; }
  / "n"  { log('SingleEscapeCharacter:3');return "\n"; }
  / "r"  { log('SingleEscapeCharacter:4');return "\r"; }
  / "t"  { log('SingleEscapeCharacter:5');return "\t"; }
  / "v"  { log('SingleEscapeCharacter:6');return "\v"; }

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
        log(`DateTimeLiteral (${text()})`);
        return new ast.DateTimeLiteralNode(symbol[0], buildList(head, tail, 3), location(), text(), rule());
    }


//Literal End

//SimplePositiveUnaryTest Start

SimplePositiveUnaryTest
    = head:(UnaryOperator __)? tail:Endpoint __ !(ArithmeticOperator/ReservedWord/"..")
        {
             log(`SimplePositiveUnaryTest (${text()})`);
             return new ast.SimplePositiveUnaryTestNode(extractOptional(head,0),tail,location(), text(), rule());
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
            log(`Interval (${text()})`);
            return new ast.IntervalNode(start,first,second,end,location(), text(), rule());
        }

IntervalStart
    = OpenIntervalStart
        {
            log(`IntervalStart:1 (${text()})`);
            return new ast.IntervalStartLiteralNode("<",location(), text(), rule());
        }
    / ClosedIntervalStart
        {
            log(`IntervalStart:2 (${text()})`);
            return new ast.IntervalStartLiteralNode("<=",location(), text(), rule());
        }

IntervalEnd
    = OpenIntervalEnd
        {
            log(`IntervalEnd:1 (${text()})`);
            return new ast.IntervalEndLiteralNode(">",location(), text(), rule());
        }
    / ClosedIntervalEnd
        {
            log(`IntervalEnd:2 (${text()})`);
            return new ast.IntervalEndLiteralNode(">=",location(), text(), rule());
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
             log(`QualifiedName (${text()})`);
             return new ast.QualifiedNameNode(buildList(head,tail,3),location(), text(), rule());
        }

//SimplePositiveUnaryTest End

//SimpleUnaryTests Start

SimpleUnaryTests
	= expr:SimplePositiveUnaryTests
		{
      log(`SimpleUnaryTests:1 (${text()})`);
			return new ast.SimpleUnaryTestsNode(expr,null,location(), text(), rule());
		}
	/ not:$NotToken __ "(" __ expr:SimplePositiveUnaryTests __ ")"
		{
      log(`SimpleUnaryTests:2 (${text()})`);
			return new ast.SimpleUnaryTestsNode(expr,not,location(), text(), rule());
		}
	/ "-"
		{
      log(`SimpleUnaryTests:3 (${text()})`);
			return new ast.SimpleUnaryTestsNode(null,null,location(), text(), rule());
		}

SimplePositiveUnaryTests
	= head: PositiveUnaryTest
	tail: (__ "," __ PositiveUnaryTest)*
	{
    log(`SimplePositiveUnaryTests (${text()})`);
		return buildList(head,tail,3);
	}

//SimpleUnaryTests End

//PositiveUnaryTests Start

PositiveUnaryTest
	= SimplePositiveUnaryTest
	/ head: NullLiteral
  {
    log(`PositiveUnaryTest (${text()})`);
    return new ast.SimplePositiveUnaryTestNode(null,head,location(), text(), rule());
  }

PositiveUnaryTests
	= head:PositiveUnaryTest
	tail:(__ "," __ PositiveUnaryTest)*
	{
    log(`PositiveUnaryTests (${text()})`);
		return buildList(head,tail,3);
	}

//PositiveUnaryTests End

//UnaryTests Start

UnaryTests
	= expr:PositiveUnaryTests
		{
      log(`UnaryTests:1 (${text()})`);
			return ast.UnaryTestsNode(expr,null,location(), text(), rule());
		}
	/ not:$NotToken __ "(" __ expr:PositiveUnaryTests __ ")"
		{
      log(`UnaryTests:2 (${text()})`);
			return ast.UnaryTestsNode(expr,not,location(), text(), rule());
		}
	/ "-"
		{
      log(`UnaryTests:3 (${text()})`);
		 	return ast.UnaryTestsNode(null,null,location(), text(), rule());
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
            log(`FilterExpression (${text()})`);
            return new ast.FilterExpressionNode(head,tail,location(), text(), rule());
        }

FunctionInvocation
    = fnName:LeftExph __ "(" params:(__ (NamedParameters/PositionalParameters))? __ ")"
        {
            log(`FunctionInvocation (${text()})`);
            return new ast.FunctionInvocationNode(fnName,extractOptional(params,1),location(), text(), rule());
        }

NamedParameters
    = head:NamedParameter tail:(__ "," __ NamedParameter)*
        {
            log(`NamedParameters (${text()})`);
            return new ast.NamedParametersNode(buildList(head,tail,3),location(), text(), rule());
        }

NamedParameter
    = head:Name __ ":" __ tail:Expression
        {
             log(`NamedParameter (${text()})`);
             return new ast.NamedParameterNode(head,tail,location(), text(), rule());
        }

PositionalParameters
    = head:Expression tail:(__ "," __ Expression)*
        {
            log(`PositionalParameters (${text()})`);
            return new ast.PositionalParametersNode(buildList(head,tail,3),location(), text(), rule());
        }


TxtExpg
	= PathExpression

LeftExpg
	= TxtExph
	/ LeftExph

PathExpression
    = head:LeftExpg tail: (__ "." __ Expression)+
        {
            log(`PathExpression (${text()})`);
            return new ast.PathExpressionNode(buildList(head,tail,3),location(), text(), rule());
        }

TxtExpf
	= InstanceOf

LeftExpf
	= TxtExpg
	/ LeftExpg


InstanceOf
	= expr:LeftExpf __ $InstanceOfToken __ type:QualifiedName
		{
      log(`InstanceOf (${text()})`);
			return new ast.InstanceOfNode(expr,type,location(), text(), rule());
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
            log(`ArithmeticNegation (${text()})`);
            return buildBinaryExpression(null, [[null,"-",null,expr]], location(), text(), rule());
        }

UnaryExpression
    = LeftExpe
    / ArithmeticNegation

Exponentiation
  	= head:UnaryExpression
    tail:(__ $("**") __ UnaryExpression)*
    {
      log(`Exponentiation (${text()})`);
      return buildBinaryExpression(head, tail, location(), text(), rule());
    }

MultiplicativeOperator
	= $("*" !"*")
	/ $"/"

Multiplicative
    =  head:Exponentiation
    tail:(__ MultiplicativeOperator __ Exponentiation)*
    { log(`Multiplicative (${text()})`); return buildBinaryExpression(head, tail, location(), text(), rule()); }

Additive
    = head:Multiplicative
    tail:(__ $("+"/"-") __ Multiplicative)*
    { log(`Additive (${text()})`); return buildBinaryExpression(head, tail, location(), text(), rule()); }

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
	  { log(`Comparision:1 (${text()})`);return buildComparisionExpression(head,tail,location(), text(), rule()); }
	/ head:LeftExpd __ operator:$BetweenToken __ first:LeftExpd __ and:AndToken __ second:LeftExpd
        {
            log(`Comparision:2 (${text()})`);
            return new ast.ComparisionExpressionNode(operator,head,first,second,location(), text(), rule());
        }
    / head:LeftExpd __ operator:$InToken __ tail:PositiveUnaryTest
        {
            log(`Comparision:3 (${text()})`);
            return new ast.ComparisionExpressionNode(operator,head,tail,null,location(), text(), rule());
        }
    / head:LeftExpd __ operator:$InToken __ "(" __ tail:PositiveUnaryTests __ ")"
        {
            log(`Comparision:4 (${text()})`);
            return new ast.ComparisionExpressionNode(operator,head,tail,null,location(), text(), rule());
        }

TxtExpc
	= Conjunction

LeftExpc
	= TxtExpd
	/ LeftExpd

Conjunction
	= head:LeftExpc tail:(__ $AndToken __ LeftExpc)+
		{
      log(`Conjunction (${text()})`);
			return buildLogicalExpression(head,tail,location(), text(), rule());
		}

TxtExpb
	= Disjunction

LeftExpb
	= TxtExpc
	/ LeftExpc

Disjunction
	= head:LeftExpb tail:(__ $OrToken __ LeftExpb)+
		{
      log(`Disjunction (${text()})`);
			return buildLogicalExpression(head,tail,location(), text(), rule());
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
            log(`FunctionDefinition (${text()})`);
            return new ast.FunctionDefinitionNode(extractOptional(params,1),body,location(), text(), rule());
        }

FunctionBody
    = extern:(ExternalToken __)? expr:Expression
        {
            log(`FunctionBody (${text()})`);
            return new ast.FunctionBodyNode(expr,extractOptional(extern,0),location(), text(), rule());
        }

FormalParameters
    = head:Name tail:(__ "," __ Name)*
        {
            log(`FormalParameters (${text()})`);
            return buildList(head,tail,3);
        }

ForExpression
    = $ForToken __ head:InExpressions __ $ReturnToken __ tail:Expression
        {
            log(`ForExpression (${text()})`);
            return new ast.ForExpressionNode(head,tail,location(), text(), rule());
        }

InExpressions
    = head:InExpression tail:(__ "," __ InExpression)*
        {
            log(`InExpressions (${text()})`);
            return buildList(head,tail,3);
        }

InExpression
    = head:Name __ InToken __ tail:Expression
        {
            log(`InExpression (${text()})`);
            return new ast.InExpressionNode(head,tail,location(), text(), rule());
        }

IfExpression
    = $IfToken __ condition:Expression __ $ThenToken __ thenExpr:Expression __ $ElseToken __ elseExpr:Expression
        {
            log(`IfExpression (${text()})`);
            return new ast.IfExpressionNode(condition,thenExpr,elseExpr,location(), text(), rule());
        }

QuantifiedExpression
    = quantity:$(SomeToken/EveryToken) WhiteSpace+ head:InExpressions __ $SatisfiesToken __ tail:Expression
        {
            log(`QuantifiedExpression (${text()})`);
            return new ast.QuantifiedExpressionNode(quantity,head,tail,location(), text(), rule());
        }

BoxedExpression
    = List
    / FunctionDefinition
    / Context

List
    = "[" __ list:ListEntries? __ "]"
        {
            log(`List (${text()})`);
            return new ast.ListNode(list,location(), text(), rule());
        }

ListEntries
    = head:Expression tail:(__ "," __ Expression)*
      {
        log(`ListEntries (${text()})`);
        return buildList(head,tail,3);
      }

Context
    = "{" entries:(__ ContextEntries)? __ "}"
        {
            log(`Context (${text()})`);
            return new ast.ContextNode(extractOptional(entries,1),location(), text(), rule());
        }

Key
    = Name
    / StringLiteral

ContextEntry
    = head:Key __ ":" __ tail:Expression
        {
            log(`ContextEntry (${text()})`);
            return new ast.ContextEntryNode(head,tail,location(), text(), rule());
        }
    ;

ContextEntries
    = head:ContextEntry? tail:(__ "," __ ContextEntry)*
        {
            log(`ContextEntries (${text()})`);
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
