/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%


\s+                   		/* skip whitespace */
(true|false)					return 'BOOLEAN'
"def"						 		return 'DEF'
"*"                   		return '*'
"/"                   		return '/'
"-"                   		return '-'
"+"                   		return '+'
"("                   		return '('
")"                   		return ')'
","						 		return ','
":"						 		return ':'
"["						 		return '['
"="								return 'ASSIGN'
"]"						 		return ']'
"decimal"						return 'DECIMAL'
"bool"						 	return 'BOOL'
"if"								return 'IF'
"then"							return 'THEN'
"end"								return 'END'
"else"							return 'ELSE'
"=="								return 'EQUALS'
">"								return 'GTRTHN'
"<"								return 'LESTHN'
"NOT"								return 'NOT'
"fun"								return 'FUNCTION'
"return"							return 'RETURN'
"repeat"							return 'REPEAT'
"do"								return 'DO'
"OUT"								return 'OUT'
"forward"						return 'FORWARD'
"rotateRight"					return 'ROTRIGHT'
"pickUp"							return 'PICKUP'
"putDown"						return 'PUTDOWN'
"detectBox"						return 'DETECT_BOX'
"detectWall"					return 'DETECT_WALL'
"inventory"						return 'INVENTORY'
[0-9]+("."[0-9]+)?\b  		return 'NUMBER'
[a-zA-Z][a-zA-Z_]*			return 'NAME'
<<EOF>>							return 'EOF'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'

%start start

%% /* language grammar */

start:
	statements EOF {
		
	}
	;

statements:
	| statements statement
	;

assign:
	NAME ASSIGN expression {
		console.log('Assign:', $1, '=', $3);
	}
	| NAME '[' expression ']' ASSIGN expression {
		console.log('Assign:', $1+'['+$3+']', '=', $6);
	}
	;

expression:
	exp {
		$$ = $1;
	}
	| exp compOp exp{
		$$ = $2=='*' ? $1*$3 : $1/$3;
		if($2=='>'){
			$$ = $1 > $3;
		}else if($2=='<'){
			$$ = $1 < $3;
		}else if($2=='=='){
			$$ = $1 == $3;
		}else if($3=='!='){
			$$ = $1 != $3;
		}
	}
	;

exp:
	termino {
		$$ = $1
	}
	| termino addSub exp {
		$$ = $2=='+' ? $1+$3 : $1-$3;
	}
	;

termino:
	factor {
		$$ = $1
	}
	| factor multDiv termino{
		$$ = $2=='*' ? $1*$3 : $1/$3;
	}
	;

factor:
	'(' expression ')' {
		$$ = $2;
	}
	| addSub val {
		$$ = parseFloat($2) * ($1=='-' ? -1 : 1);
	}
	| val {
		$$ = $1
	}
	;

expressionlist2:
	{
		$$ = []
	}
	| ',' expression expressionlist2 {
		$$ = [ $2, ...$3 ]
	};

expressionlist:
	{ // Empty expression list
		$$ = []
	}
	| expression expressionlist2 {
		$$ = [$1, ...$2]
	};

id:
	NAME {
		// Get val from var table.
	}
	| NAME '[' expression ']' {
		//Get val array in var table 
	}
	| NAME '(' expressionlist ')' {
		// Calc val from function call
		console.log("FuncCall:", $1, $3)
	}
	;

val:
	NUMBER {
		$$ = parseFloat($1)
	}
	| BOOLEAN {
		$$ = $1 === 'true'
	}
	| id
	;

idlist:
	NAME {
		$$ = [$1]
	}
	| NAME ',' idlist{
		$$ = [$1, ...$3]
	};

vars:
	DEF idlist ':' type {
		console.log("Defined:", $2, $4)
	}
	| DEF idlist ':' type '[' NUMBER ']' {
		console.log("Defined:", $2, $4, '['+$6+']')
	}
	;

conditional:
	IF expression THEN statements END {

	}
	| IF expression THEN statements ELSE statements END {

	}
	;

actions:
	FORWARD '(' ')'{
		// yy.moves.push(0);
	}
	| ROTRIGHT '(' ')'{
		// yy.moves.push(1);
	}
	| PICKUP '(' ')'{
		// yy.moves.push(2);
	}
	| PUTDOWN '(' ')'{
		// yy.moves.push(3);
	}
	| DETECT_BOX '(' ')'{
		
	}
	| DETECT_WALL '(' ')'{

	}
	| INVENTORY '(' ')'{
		$$ = yy.inventory
	}
	;

funparams:
	'(' ')'
	| '(' funparams1 ')'
	;

funparams1:
	NAME ':' type funparams2
	;

funparams2:
	|
	',' NAME ':' type funparams2
	;

function:
	FUNCTION NAME funparams statements return expression END
	| FUNCTION NAME funparams statements END
	; 

loop:
	REPEAT expression DO statements END;

statement:
	vars
	| assign
	| conditional
	| functioncall
	| actions
	| function
	| loop
	;

type:
	DECIMAL | BOOL;

addSub:
	'+' | '-';

multDiv:
	'*' | '/';

compOp:
	EQUALS | GTRTHN | LESTHN | NOT;