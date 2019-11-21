/* description: Parses end executes mathematical expressions. */

%{
	var QUADS = [];
	var VARS = [];
	var TEMPS = 0;
	var CONST = [];
	var FUNCS = [];
	var FUNC_RETURN = [];

	var opStack = [];
	var valStack = [];
	var jumpStack = [];
	var count = 0;
	var currFunc = -1;

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
		GTR_EQTHN: 11,
		LESS_EQTHN: 12,
		ASSIGN: 13,
		GOTO: 14,
		GOTOF: 15,
		GOTOT: 16,
		PRINT: 17,

		ERA: 18,
		GOSUB: 19,
		ENDPROC: 20,
		RETURN: 21,
		PARAM: 22,
		VERIFY: 23,
		LENGTH: 24,
		VALDIR: 25,

		MOVE: 26,
		ROTATE: 27,
		PICKUP: 28,
		PUTDOWN: 29
	}

	function begin(){
		QUADS = [];
		VARS = [];
		TEMPS = 0;
		CONST = [];
		FUNCS = [];

		opStack = [];
		valStack = [];
		jumpStack = [];
		count = 0;
		currFunc = -1;
	}

	function declareStart(){
		if(QUADS[0][3]!=null) return;
		QUADS[0][3] = count;
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
	function declareFunction(name, params){
		if(FUNCS.findIndex(a=>a.name==name)!=-1){
			//TODO: THROW ERR
			return;
		}
		if(VARS.findIndex(a=>a.name==name)!=-1){
			//TODO: THROW ERR
			return;
		}
		var vars = [];
		for(var i of params){
			// var j = defineVariable(`${name}#${i.name}`, i.type)
			vars.push({ ...i, dir: vars.length+10000 });
		}
		FUNCS.push({
			name,
			params,
			vars,
			dir: count
		});
		currFunc = FUNCS.length-1;
		VARS.push({
			name, type: 'func', val: -1, function: true
		});
		return FUNCS.length-1;
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
		var func = FUNCS.find(a=>a.name==name);
		if(!func){
			// TODO: THROW ERROR
			console.log("Invalid function");
			return false;
		}
		if(func.params.length!=params.length){
			// TODO: THROW ERROR
			console.log("Incorrect params length");
			return false;
		}
		addQuad(OPERATIONS.ERA, name, -1, -1);
		for(var i=0; i<params.length; i++){
			addQuad(OPERATIONS.PARAM, i, -1, params[i].dir)
		}
		addQuad(OPERATIONS.GOSUB, -1, -1, func.dir);

		if(func.return){
			return FUNCS.find(a=>a.name==name);
		}else{
			return { dir: -1 }
		}
	}

	function addConstant(val){
		var i = CONST.findIndex(a=>val==a);
		if(i!=-1) return i+100000;
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
		var dir = TEMPS+20000;
		TEMPS++;
		return dir;
	}

	// Defines a variable
	function defineVariable(name, type, size=false){
		var bank = currFunc==-1 ? VARS : FUNCS[currFunc].vars
		var dir = bank.reduce((a,b)=>a+b.size, 0) + (currFunc==-1 ? 0 : 10000);
		var newVal = {
			name, type, dir,
		}
		newVal.array = size ? true : false;
		newVal.size = (size || 1);
		if(currFunc==-1){
			VARS.push(newVal);
		}else{
			FUNCS[currFunc].vars.push(newVal);
		}
		return dir;
	}

	// Set the variable value, index is optional for array
	function setVariable(dir, value){
		VARS[dir] = value;
	}

	// Get a variable value
	function getVariable(dir){
		if(dir==-1) return false;
		if(dir>=10000 && dir<10000){ // FUNCTION VAR
			return {
				...FUNCS[currFunc].vars[dir-10000],
				dir
			}
		}else if(dir>=20000 && dir<100000){ // TEMP
			return {
				name: 't'+(dir-20000),
				val: TEMPS[dir-20000],
				dir,
				temp: true
			}
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return {
				name: CONST[dir-100000].toString(),
				val: CONST[dir-100000],
				dir,
				constant: true
			}
		}else if(dir>999990){ // SPECIALS
			var name;
			switch(dir){
				case 999990: // INVENTORY
					name = 'INV'
				break;
				case 999991: // CHECK WALL
					name = 'WALL'
				break;
				case 999992: // CHECK BOX
					name = 'BOX'
				break;
			}
			return { name, dir }
		}else{
			return {
				...VARS[dir],
				dir
			}
		}
	}

	function getVariableFromName(name){
		var ix;
		var isFunc = currFunc!=-1;
		if(isFunc){
			var func = FUNCS[currFunc];
			ix = func.vars.findIndex(a=>a.name==name);
			if(ix==-1) {
				ix = VARS.findIndex(a=>a.name==name);
				return VARS[ix];
			}
			return FUNCS[currFunc].vars[ix];
		}
		ix = VARS.findIndex(a=>a.name==name);
		var val = VARS[ix]; 
		return VARS[ix];
	}

	function addQuad(opCode, dir1, dir2, dir3){
		QUADS.push([opCode, dir1, dir2, dir3]);
		count += 1;
		return dir3;
	}

	function opGetSymbol(op){
		var t = [
			'+','-','x','/','AND','!=','OR','==','>','<','>=','<=','=', 
			'GOTO', 'GOTOF', 'GOTOT', 'PRINT',
			'ERA', 'GOSUB', 'END', 'RET', 'PARAM', 
			'VER', 'LEN', 'VALDIR',
			'MOVE', 'ROT', 'PKUP', 'PDWN'
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
				v1 = { name: i[1] };
				v2 = false;
			}
			if(i[0]==OPERATIONS.ERA){
				v1 = { name: i[1] };
				v2 = false;
				v3 = false;
			}

			
			var v4 = i[0]>=12 && i[0]<=14 ? i[3] : (v3 ? ((v3.temp && v3.val) ? v3.val : v3.name) : -1);
			if(i[0]==OPERATIONS.VERIFY){
				v2 = { name: i[2] };
				v4 = i[3];
			}
			q.push([
				opGetSymbol(i[0]),
				i[1],
				i[2],
				i[3]
				// (v1!==false ? ((v1.temp && v1.val) ? v1.val : v1.name) : -1),
				// (v2!==false ? ((v2.temp && v2.val) ? v2.val : v2.name) : -1),
				// v4
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
"]"						 		return ']'
"decimal"						return 'DECIMAL'
"bool"						 	return 'BOOL'
"else"							return 'ELSE'
"=="								return 'EQUALS'
">="								return 'GTR_EQTHN'
"<="								return 'LESS_EQTHN'
">"								return 'GTRTHN'
"<"								return 'LESTHN'
(not|NOT|\!\=)					return 'NOT'
(and|AND|\&\&)					return 'AND'
(or|OR|\|\|)					return 'OR'

"if"								return 'IF'
"then"							return 'THEN'
"end"								return 'END'
"fun"								return 'FUNCTION'
"repeat"							return 'REPEAT'
"do"								return 'DO'

"return"							return 'RETURN'
"print"							return 'OUT'
"length"							return 'LEN'
"forward"						return 'FORWARD'
"rotateRight"					return 'ROTRIGHT'
"pickUp"							return 'PICKUP'
"putDown"						return 'PUTDOWN'
"detectBox"						return 'DETECT_BOX'
"detectWall"					return 'DETECT_WALL'
"inventory"						return 'INVENTORY'
[0-9]+("."[0-9]+)?\b  		return 'NUMBER'
[a-zA-Z][a-zA-Z_]*			return 'NAME'
"="								return 'ASSIGN'
<<EOF>>							return 'EOF'

/lex

/* operator associations and precedence */

%start start

%% /* language grammar */

begin: {
	begin();
	addQuad(OPERATIONS.GOTO, -1, -1, null);
};

start:
	begin declarations EOF {
		// console.log(VARS);
		// for(var i of FUNCS){
		// 	console.log(i.name, i.vars);
		// }
		// // console.log(FUNCS);
		// // console.log(QUADS);
		// var j = 0;
		// for(var i of prettyQuads()){
		// 	console.log(`${j}:\t ${i[0]}\t${i[1]}\t${i[2]}\t${i[3]}\t`)
		// 	j++;
		// }
		return {
			quads: QUADS,
			pretty: prettyQuads(),
			funcs: FUNCS,
			vars: VARS,
			const: CONST,
			temps: TEMPS
		};
	}
	;

declarations:
	| declaration declarations
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
	NAME assignOp expression {
		var assignVar = getVariableFromName($1);
		if(!assignVar){
			// THROW ERROR
			throw new Error('No such var '+$1 + ' - LINE: '+@1.first_line);
		}
		if(assignVar.array){
			// THROW ERROR
			throw new Error('Var is array '+assignVar.name + ' - LINE: '+@1.first_line);
		}
		addQuad(OPERATIONS.ASSIGN, $3.dir, -1, assignVar.dir);
	}
	| NAME '[' expression ']' ASSIGN expression {
		var assignVar = getVariableFromName($1);
		if(!assignVar){
			// THROW ERROR
			throw new Error('No such var '+$1 + ' - LINE: '+@1.first_line);
		}
		if(!assignVar.array){
			// THROW ERROR
			throw new Error('Var is not array '+assignVar.name + ' - LINE: '+@1.first_line);
		}
		var t = addTemp();
		addQuad(OPERATIONS.VERIFY, $3.dir, 0, assignVar.size-1);
		addQuad(OPERATIONS.SUM, $3.dir, addConstant(assignVar.dir), t);
		var t2 = addTemp();
		addQuad(OPERATIONS.VALDIR, t, -1, t2)
		addQuad(OPERATIONS.ASSIGN, $6.dir, -1, t2);
	}
	;

expression:
	exp compOp exp{
		var temp = addTemp();
		$$ = addQuad($2, $1.dir, $3.dir, temp);
		valStack.push(temp);
		$$ = { dir: valStack[valStack.length-1] };
	}
	| exp {
		$$ = { dir: valStack[valStack.length-1] };
	}
	;

exp:
	termino postTermino {
		$$ = ($2 || $1)
	}
	| termino postTermino addSub exp
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
	| factor postFactor multDiv termino
	;

postFactor: 
	{
		if([OPERATIONS.MULT, OPERATIONS.DIVIDE].indexOf(opStack[opStack.length-1])!=-1){
			$$ = generateQuad();
		}else $$ = false;
	};
	
startP: {
	opStack.push('(')
};

endP: {
	opStack.pop();
};

factor:
	'(' startP expression endP ')' {
		$$ = $3;
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
		if(!val){
			// THROW ERROR
			throw new Error('No such var '+$1 + ' - LINE: '+@1.first_line);
		}
		if(!val.array){
			// THROW ERROR
			throw new Error('Var is not array');
		}
		var t = addTemp();
		addQuad(OPERATIONS.VERIFY, $3.dir, 0, val.size-1);
		addQuad(OPERATIONS.SUM, $3.dir, addConstant(val.dir), t);
		var t2 = addTemp();
		addQuad(OPERATIONS.VALDIR, t, -1, t2)
		$$ = { dir: t2 }
	}
	| queries
	| NAME '(' expressionlist ')' {
		var fc = functionCall($1, $3);
		if(fc.return){
			var t = addTemp();
			addQuad(OPERATIONS.ASSIGN, fc.name, -1, t);
			$$ = { dir: t }
		}else{
			$$ = fc;
		}
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
	FORWARD '(' ')' {
		addQuad(OPERATIONS.MOVE, -1, -1, -1);
	}
	| ROTRIGHT '(' ')' {
		addQuad(OPERATIONS.ROTATE, -1, -1, -1);
	}
	| PICKUP '(' ')' {
		addQuad(OPERATIONS.PICKUP, -1, -1, -1);
	}
	| PUTDOWN '(' ')' {
		addQuad(OPERATIONS.PUTDOWN, -1, -1, -1);
	}
	| OUT '(' expression ')' {
		addQuad(OPERATIONS.PRINT, -1, -1, $3.dir);
	}
	;

queries:
	DETECT_BOX '(' ')'{
		$$ = { dir: 999992 }
	}
	| DETECT_WALL '(' ')'{
		$$ = { dir: 999991 }
	}
	| INVENTORY '(' ')'{
		$$ = { dir: 999990 }
	}
	| LEN '(' NAME ')' {
		var val = getVariableFromName($3);
		if(!val){
			// THROW ERROR
			throw new Error('No such var '+$1 + ' - LINE: '+@1.first_line);
		}
		if(!val.array){
			// THROW ERROR
			throw new Error('Var is not array '+$1 + ' - LINE: '+@1.first_line);
		}
		var t = addTemp();
		addQuad(OPERATIONS.LENGTH, val.dir, -1, t);
		$$ = { dir: t }
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
		$$ = [ { name: $1, type: $3, array: false, size: 1 }, ...$4 ]
	}
	| NAME ':' type '[' NUMBER ']' funparams2 {
		$$ = [ { name: $1, type: $3, array: true, size: $5 }, ...$7 ]

	}
	;

funparams2:
	{
		$$ = []
	}
	| ',' NAME ':' type funparams2 {
		$$ = [ { name: $2, type: $4 }, ...$5 ]
	}
	| ',' NAME ':' type '[' NUMBER ']' funparams2 {
		$$ = [ { name: $2, type: $4, size: $6 }, ...$8 ]
	}
	;

declareFunction: 
	FUNCTION NAME funparams {
		if($2=='start'){
			declareStart();
		}
		$$ = declareFunction($2, $3);
	}
	;

function:
	declareFunction statements endFunc
	;

endFunc: 
	END {
		currFunc = -1;
		addQuad(OPERATIONS.ENDPROC, -1, -1, -1);
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

declaration:
	vars
	| function
	;

statement:
	assign
	| vars
	| conditional
	| loop
	| id
	| actions
	| RETURN expression{
		FUNCS[currFunc].return = true;
		var dir = $2.dir;
		if(!$2.temp){
			var t = addTemp();
			addQuad(OPERATIONS.ASSIGN, dir, -1, t);
			dir = t;
		}
		addQuad(OPERATIONS.RETURN, -1, -1, dir);
		$$ = $2;
	}
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
	| GTR_EQTHN {
		addOperator(OPERATIONS.GTR_EQTHN);
		$$ = OPERATIONS.GTR_EQTHN
	}
	| LESS_EQTHN {
		addOperator(OPERATIONS.LESS_EQTHN);
		$$ = OPERATIONS.LESS_EQTHN
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