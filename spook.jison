/* description: Parses end executes mathematical expressions. */

%{
	var QUADS = [];
	var VARS = [];
	var TEMPS = [];
	var CONST = [];

	var opStack = [];
	var valStack = [];

	var OPERATIONS = {
		ASSIGN: 0,
		SUM: 1,
		MINUS: 2,
		MULT: 3,
		DIVIDE: 4,
		AND: 5,
		NOT: 6,
		OR: 7,
		EQUALS: 8,
		GTRTHN: 9,
		LESSTHN: 10,
		ASSIGN: 11,
		GOTO: 12,
		GOTOF: 13,
		GOTOT: 14,
		PRINT: 15,

	}

	// Declares the start of the if statement
	function declareIf(){
 
	}

	// Executes right after "then"
	function startIf(){

	}

	// Exists a scope. Afer an "end"
	function exitScope(){

	}

	// Declares a function. After "fun"
	function delcareFunction(){

	}

	// Declares a repeat. After "repeat"
	function declareRepeat(){

	}

	// Declares that a loop started. After "do"
	function beginDo(){

	}

	function addConstant(val){
		var dir = CONST.length+100000;
		CONST.push(val);
		return dir;
	}

	function getConstant(dir){
		if(dir<100000) return -1;
		return CONST[dir];
	}

	// Add temporary var and return its direction.
	function addTemp(val){
		var dir = TEMPS.length+10000;
		TEMPS.push(val);
		return dir;
	}

	function getTemp(dir){
		if(dir<10000 || dir>=100000) return -1;
		return TEMPS[dir];
	}

	// Defines a variable
	function defineVariable(name, type, size=false){
		var dir = VARS.length;
		var newVal = {
			name, type, val: 0
		}
		VARS.push(newVal);
		return dir;
	}

	// Set the variable value, index is optional for array
	function setVariable(dir, value){
		VARS[dir] = value;
	}

	// Get a variable value
	function getVariable(dir){
		if(dir==-1) return false;
		if(dir>=10000 && dir<100000){ // TEMP
			return {
				name: 't'+(dir-10000),
				val: TEMPS[dir-10000],
				dir,
				temp: true
			}
		}else if(dir>=100000){ // CONSTANT
			return {
				name: CONST[dir-100000].toString(),
				val: CONST[dir-10000],
				dir,
				constant: true
			}
		}else{
			return {
				...VARS[dir],
				dir
			}
		}
	}

	function getVariableFromName(name){
		var ix = VARS.findIndex(a=>a.name==name);
		var val = VARS[ix]; 
		return {
			...val,
			dir: ix
		}
	}

	function addQuad(opCode, dir1, dir2, dir3){
		QUADS.push([opCode, dir1, dir2, dir3]);
		return dir3;
	}

	function solveQuad(quad){
		var val;
		var leftVal = getVariable(quad[1]).val;
		var rightVal = getVariable(quad[2]).val;
		switch(quad[0]){
			case 1: return setVariable(quad[3], leftVal + rightVal);
			case 2: return setVariable(quad[3], leftVal - rightVal);
			case 3: return setVariable(quad[3], leftVal * rightVal);
			case 4: return setVariable(quad[3], leftVal / rightVal);
			case 5: return setVariable(quad[3], leftVal && rightVal);
			case 6: return setVariable(quad[3], leftVal == rightVal);
			case 7: return setVariable(quad[3], leftVal);
		}
	}

	function opGetSymbol(op){
		var t = ['+','-','x','/','AND','!=','OR','==','>','<','='];
		return t[parseInt(op-1)];
	}

	function prettyQuads(){
		var q = []
		for(var i of QUADS){
			var v1 = getVariable(i[1]);
			var v2 = getVariable(i[2]);
			var v3 = getVariable(i[3]);
			q.push([
				opGetSymbol(i[0]),
				(v1 ? ((v1.temp && v1.val) ? v1.val : v1.name) : -1),
				(v2 ? ((v2.temp && v2.val) ? v2.val : v2.name) : -1),
				(v3 ? ((v3.temp && v3.val) ? v3.val : v3.name) : -1)
			])
		}
		return q;
	}

	function addOperator(op){
		opStack.push(op);
	}

	function generateQuad(){
		var peek = opStack.pop();
		var temp;
		var valDer = valStack.pop(), valIz = valStack.pop();

		if(peek==OPERATIONS.ASSIGN){
			temp = valIz;
		}else{
			temp = addTemp();
		}

		addQuad(peek, (valIz || -1), valDer, temp)
		valStack.push(temp);
		return { dir: temp }
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
"else"							return 'ELSE'
"=="								return 'EQUALS'
">"								return 'GTRTHN'
"<"								return 'LESTHN'
"(not|NOT)"						return 'NOT'
"(and|AND)"						return 'AND'
"(or|OR)"						return 'OR'

"if"								{ declareIf(); return 'IF' }
"then"							{ startIf(); return 'THEN' }
"end"								{ exitScope(); return 'END' }
"fun"								{ declareFunction(); return 'FUNCTION' }
"repeat"							{ declareRepeat(); return 'REPEAT' }
"do"								{ beginDo(); return 'DO' }

"return"							return 'RETURN'
"print"							return 'OUT'
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

%start start

%% /* language grammar */

start:
	statements EOF {
		console.log(prettyQuads());
		return prettyQuads();
	}
	;

statements:
	// EMPTY
	| statements statement
	;

vars:
	DEF idlist ':' type {
		for(var i of $2){
			var added = defineVariable(i, $4);
			if(!added) {
				// THROW ERROR
			}

		}
	}
	| DEF idlist ':' type '[' NUMBER ']' {
		for(var i of $2){
			var added = defineVariable(i, $4, parseInt($6))
			if(!added){
				// THROW ERROR
			}
		}
	}
	;

assign:
	NAME postName assignOp expression {
		$$ = generateQuad();
	}
	| NAME '[' expression ']' ASSIGN expression {

	}
	;

postName: 
	{
		var assignVar = getVariableFromName($1);
		if(!assignVar){
			// THROW ERROR
		}
		valStack.push(assignVar.dir)
	};

expression:
	exp {
		$$ = $1;
	}
	| exp compOp exp{
		// var temp = addTemp();
		// addQuad($2, $1.dir, $3.dir, temp);
		// $$ = temp;
		generateQuad();
	}
	;

exp:
	termino postTermino {
		$$ = $1
	}
	| termino postTermino addSub exp
	;

postTermino: 
	{
		if([OPERATIONS.SUM, OPERATIONS.MINUS].indexOf(opStack[opStack.length-1])!=-1){
			$$ = generateQuad();
		}
	};

termino:
	factor postFactor {
		$$ = $1
	}
	| factor postFactor multDiv termino
	;

postFactor: 
	{
		if([OPERATIONS.MULT, OPERATIONS.DIVIDE].indexOf(opStack[opStack.length-1])!=-1){
			$$ = generateQuad();
		}
	};
	
factor:
	'(' expression ')' {
		$$ = $2;
	}
	| '-' val {
		CONST[$2.dir-100000] = CONST[$2.dir-100000] * -1;
		$$ = $2;
	}
	| val {
		valStack.push($1.dir);
	}
	;

val:
	NUMBER {
		var dir = addConstant(parseFloat($1));
		$$ = { dir };
	}
	| BOOLEAN {
		var dir = addConstant($1 == 'true');
		$$ = { dir };
	}
	| id
	;
	
id:
	NAME {
		var val = getVariableFromName($1);
		$$ = val;
	}
	| NAME '[' expression ']' {
		var val = getVariableFromName($1);
		var valFromArray = {
			dir: val.dir,
			index: parseInt($3),
			val: val.val[parseInt($3)]
		}
		$$ = valFromArray;
	}
	| NAME '(' expressionlist ')' {
		// FUNCTION CALL
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

idlist:
	NAME {
		$$ = [ $1 ];
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
		
	}
	| OUT '(' expression ')'{
		console.log($3)
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
	| id
	;

type:
	DECIMAL | BOOL;

addSub:
	'+' { 
		addOperator(OPERATIONS.SUM);
		$$ = OPERATIONS.SUM
	} 
	| '-' { 
		addOperator(OPERATIONS.MINUS);
		$$ = OPERATIONS.MINUS
	}
	;

multDiv:
	'*' { 
		addOperator(OPERATIONS.MULT);
		$$ = OPERATIONS.MULT
	}
	| '/' { 
		addOperator(OPERATIONS.DIVIDE);
		$$ = OPERATIONS.DIVIDE
	}
	;

compOp:
	EQUALS { 
		addOperator(OPERATIONS.EQUALS);
		$$ = OPERATIONS.EQUALS
	} 
	| GTRTHN { 
		addOperator(OPERATIONS.GTRTHN);
		$$ = OPERATIONS.GTRTHN
	}
	| LESTHN { 
		addOperator(OPERATIONS.LESSTHN);
		$$ = OPERATIONS.LESSTHN
	}
	| AND {
		addOperator(OPERATIONS.AND);
		$$ = OPERATIONS.AND;
	}
	| OR {
		addOperator(OPERATIONS.OR);
		$$ = OPERATIONS.OR;
	}
	| NOT { 
		addOperator(OPERATIONS.NOT);
		$$ = OPERATIONS.NOT
	}
	;

assignOp: 
	ASSIGN {
		addOperator(OPERATIONS.ASSIGN);
		$$ = OPERATIONS.ASSIGN;
	};