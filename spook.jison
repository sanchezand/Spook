/* description: Parses end executes mathematical expressions. */

%{
	var QUADS = [];
	var VARS = [];
	var TEMPS = 0;
	var CONST = [];
	var FUNCS = [];

	var opStack = [];
	var valStack = [];
	var jumpStack = [];
	var count = 0;

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

		ERA: 16,
		GOSUB: 17,
		ENDPROG: 18,
		RETURN: 19,
		PARAM: 20
	}

	// Executes right after "then"
	function startIf(){
		var cond = valStack.pop();
		addQuad(OPERATIONS.GOTOF, cond, -1, null);
		jumpStack.push(count-1);
	}

	// Executes before if "end"
	function endIf(){
		var jump = jumpStack.pop();
		QUADS[jump][3] = count;
	}

	// Executes before if "else"
	function elseIf(){
		var f = jumpStack.pop();
		addQuad(OPERATIONS.GOTO, -1, -1, null);
		jumpStack.push(count-1);
		QUADS[f][3] = count;
	}

	// Declares a function. After "fun"
	function delcareFunction(){

	}

	// Declares a repeat. After "repeat"
	function defineLoop(){
		jumpStack.push(count);
	}

	// Declares that a loop started. After "do"
	function startLoop(){
		addQuad(OPERATIONS.GOTOF, valStack.pop(), -1, null);
		jumpStack.push(count-1);
	}

	// Declares that a loop has ended. Before "end"
	function endLoop(){
		var f = jumpStack.pop();
		var ret = jumpStack.pop();
		addQuad(OPERATIONS.GOTO, -1, -1, ret);
		QUADS[f][3] = count;
	}

	function functionCall(name, params){
		addQuad(OPERATIONS.ERA, name, -1, -1);
		for(var i=0; i<params.length; i++){
			addQuad(OPERATIONS.PARAM, i, -1, params[i].dir)
		}
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
	function addTemp(){
		var dir = TEMPS+10000;
		TEMPS++;
		return dir;
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
		count += 1;
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
		var t = [
			'+','-','x','/','AND','!=','OR','==','>','<','=', 
			'GOTO', 'GOTOF', 'GOTOT', 'PRINT',
			'ERA', 'GOSUB', 'ENDPROG', 'RETURN', 'PARAM'
		];
		return t[parseInt(op-1)];
	}

	function prettyQuads(qu){
		if(!qu) qu = QUADS;
		var q = []
		for(var i of qu){
			var v1 = getVariable(i[1]);
			var v2 = getVariable(i[2]);
			var v3 = getVariable(i[3]);
			if(i[0]==OPERATIONS.PARAM){
				v1 = false;
				v2 = false;
			}
			if(i[0]==OPERATIONS.ERA){
				v1 = { name: i[1] };
				v2 = false;
				v3 = false;
			}
			q.push([
				opGetSymbol(i[0]),
				(v1 ? ((v1.temp && v1.val) ? v1.val : v1.name) : -1),
				(v2 ? ((v2.temp && v2.val) ? v2.val : v2.name) : -1),
				i[0]>=12 && i[0]<=14 ? i[3] : (v3 ? ((v3.temp && v3.val) ? v3.val : v3.name) : -1)
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

		addQuad(peek, peek==OPERATIONS.ASSIGN ? valDer : valIz, peek==OPERATIONS.ASSIGN ? -1 : valDer, temp)
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

"if"								return 'IF'
"then"							return 'THEN'
"end"								return 'END'
"fun"								return 'FUNCTION'
"repeat"							return 'REPEAT'
"do"								return 'DO'

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
		console.log(QUADS);
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
		$$ = { dir: valStack[valStack.length-1] };
	}
	| exp compOp exp{
		// var temp = addTemp();
		// addQuad($2, $1.dir, $3.dir, temp);
		// $$ = temp;
		$$ = generateQuad();
	}
	;

exp:
	termino postTermino {
		$$ = ($2 || $1)
	}
	| termino postTermino addSub exp {
	}
	;

postTermino: 
	{
		if([OPERATIONS.SUM, OPERATIONS.MINUS].indexOf(opStack[opStack.length-1])!=-1){
			$$ = generateQuad();
		}else $$ = false;
	};

termino:
	factor postFactor {
		$$ = ($2 || $1)
	}
	| factor postFactor multDiv termino {
		
	}
	;

postFactor: 
	{
		if([OPERATIONS.MULT, OPERATIONS.DIVIDE].indexOf(opStack[opStack.length-1])!=-1){
			$$ = generateQuad();
		}else $$ = false;
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
		// var val = getVariableFromName($1);
		// var valFromArray = {
		// 	dir: val.dir,
		// 	index: parseInt($3),
		// 	val: val.val[parseInt($3)]
		// }
		// $$ = valFromArray;
	}
	| NAME '(' expressionlist ')' {
		// FUNCTIONCALL
		functionCall($1, $3);
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
	IF expression startIf THEN statements endIf END 
	| IF expression startIf THEN statements ELSE elseIf statements endIf END
	;

startIf: {
	startIf();
};

endIf: {
	endIf();
};

elseIf: {
	elseIf();
};

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
	'(' ')' {
		$$ = []
	}
	| '(' funparams1 ')' {
		$$ = $2;
	}
	;

funparams1:
	NAME ':' type funparams2 {
		$$ = [ { name: $1, type: $3 }, ...$4 ]
	}
	;

funparams2:
	{
		$$ = []
	}
	| ',' NAME ':' type funparams2 {
		$$ = [ { name: $2, type: $4 }, ...$5 ]
	}
	;

function:
	FUNCTION NAME funparams defineFunction statements return expression endFunc
	| FUNCTION NAME funparams defineFunction statements endFunc
	; 

defineFunction: {
	// param list = $1

};

endFunc: 
	END {

	};

loop:
	REPEAT defineLoop expression DO startLoop statements endLoop END;

defineLoop: {
	defineLoop();
};

startLoop: {
	startLoop();
};

endLoop: {
	endLoop();
};



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