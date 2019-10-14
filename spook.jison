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
	statements EOF
	;

statements:
	| statements statement
	;

assign:
	NAME ASSIGN expression {
		// console.log($1) // name of the var
		// console.log($3) // value of the val
	}
	| NAME [ expression ] ASSIGN expression {
		
	}
	;

expression:
	exp
	| exp compOp exp
	;

exp:
	termino
	| termino addSub exp
	;

termino:
	factor
	| factor multDiv termino
	;

factor:
	'(' expression ')'
	| addSub val
	| val
	;

val:
	NUMBER
	| BOOLEAN
	| NAME
	;

idlist:
	NAME
	| NAME ',' idlist;

fcargs:
	'(' ')'
	;

functioncall:
	NAME fcargs;

vars:
	DEF idlist ':' type {

	}
	| DEF idlist ':' type [ NUMBER ]
	;

conditional:
	IF expression THEN statements END
	| IF expression THEN statements ELSE statements END
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