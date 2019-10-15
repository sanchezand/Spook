/* description: Parses end executes mathematical expressions. */

%{
	var GLOBAL_TABLE = [];
	var SCOPE_TABLE = [];
	
	var scope = -1;

	function addVar(name, type, array_size=false){
		var val = {
			name,
			type,
			val: type=='bool' ? false : -1
		}
		if(array_size){
			val.size = array_size;
			val.val = Array(array_size).fill(type=='bool' ? false : -1)
		}
		if(scope<=-1){
			if(GLOBAL_TABLE.find(a=>a.name==name)) return false;
			GLOBAL_TABLE.push(val);
		}
		else{
			if(SCOPE_TABLE[scope].find(a=>a.name==name)) return false;
			SCOPE_TABLE[scope].push(val);
		}
		return true;
	}

	function getValFromType(val, type){
		if(type=='bool'){
			return val > 0;
		}else{
			return parseFloat(val);
		}
	}

	function setVar(name, val, pos=false){
		if(scope<=-1){
			var ix = GLOBAL_TABLE.findIndex(a=>a.name==name);
			if(ix==-1) return false;
			if(GLOBAL_TABLE[ix].size && pos===false) return false;
			if(pos!==false){
				if(pos>GLOBAL_TABLE[ix].size-1) return false;
				GLOBAL_TABLE[ix].val[pos] = getValFromType(val, GLOBAL_TABLE[ix].type);
			}else{
				GLOBAL_TABLE[ix].val = getValFromType(val, GLOBAL_TABLE[ix].type);
			}
		}else{
			var ix = SCOPE_TABLE[scope].findIndex(a=>a.name==name);
			if(ix==-1) return false;
			if(SCOPE_TABLE[scope][ix].size && !pos) return false;
			if(pos!==false){
				if(pos>SCOPE_TABLE[scope][ix].size-1) return false;
				SCOPE_TABLE[scope][ix].val[pos] = getValFromType(val, SCOPE_TABLE[scope][ix].type);
			}else{
				SCOPE_TABLE[scope][ix].val = getValFromType(val, SCOPE_TABLE[scope][ix].type);
			}
		}
	}

	function getVar(name){
		if(scope<=-1){
			return GLOBAL_TABLE.find(a=>a.name==name);
		}else{
			return SCOPE_TABLE[scope].find(a=>a.name==name);
		}
	}
%}


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
		console.log("Global:", GLOBAL_TABLE);
		console.log("Scope:", SCOPE_TABLE);
	}
	;

statements:
	| statements statement
	;

vars:
	DEF idlist ':' type {
		console.log("Defined:", $2, $4)
		for(var i of $2){
			var added = addVar(i, $4);
			if(!added) throw new Error('Error adding var '+i);
		}
	}
	| DEF idlist ':' type '[' NUMBER ']' {
		console.log("Defined:", $2, $4, '['+$6+']')
		for(var i of $2){
			var added = addVar(i, $4, parseInt($6))
			if(!added) throw new Error('Error adding var '+i);
		}
	}
	;

assign:
	NAME ASSIGN expression {
		console.log('Assign:', $1, '=', $3);
		setVar($1, $3);
	}
	| NAME '[' expression ']' ASSIGN expression {
		console.log('Assign:', $1+'['+$3+']', '=', $6);
		setVar($1, $6, $3);
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
		$$ = getVar($1).val;
	}
	| NAME '[' expression ']' {
		//Get val array in var table 
		var val = getVar($1);
		var pos = parseInt($3);
		if(!val.size || pos>val.size-1){
			// THROW ERROR
			throw new Error('Index out of bounds');
		}
		$$ = val.val[pos];
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