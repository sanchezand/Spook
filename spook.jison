/* description: Parses end executes mathematical expressions. */

%{
	var QUADS = [];
	var VARS = [];
	var CONST = [];
	var FUNCS = [];
	var TEMPS = 0;

	var opStack = [];
	var valStack = [];
	var jumpStack = [];
	var elseStack = [];
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
		RAND: 13,
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

	var ERRORS = {
		COMPILER_ERROR: 0,
		MISSING_START: 1,

		ASSIGN_INCORRECT_TYPE: 100,
		ASSIGN_NO_VAR: 101,
		ASSIGN_TO_ARRAY: 102,
		ASSIGN_TO_NOT_ARRAY: 103,

		DECLARE_REDECLARATION: 200,

		OPERATION_INCOMPATIBLE_TYPES: 300,
		OPERATION_INCOMPATIBLE_OPERATION: 301,
		OPERATION_DIVIDE_BY_ZERO: 302,

		METHOD_NO_METHOD: 400,
		METHOD_REDECLARATION: 401,
		METHOD_REDECLARATION_VARIABLE: 402,
		METHOD_PARAM_LENGTH: 403,

		ACCESS_NO_VAR: 500,
		ACCESS_NOT_ARRAY: 501,
		ACCESS_IS_ARRAY: 502
	}

	function begin(){
		QUADS = [];
		VARS = [];
		CONST = [];
		FUNCS = [];

		opStack = [];
		valStack = [];
		jumpStack = [];
		count = 0;
		currFunc = -1;
	}

	function declareStart(){
		if(QUADS[1][3]!=null) return;
		QUADS[1][3] = count;
	}

	// Executes right after "then"
	function startIf(line){
		var cond = valStack.pop();
		addQuad(OPERATIONS.GOTOF, cond, -1, null, line);
		jumpStack.push(count-1);
	}

	// Executes before if "end"
	function endIf(){
		var jump = jumpStack.pop();
		QUADS[jump][3] = count;
	}

	// Executes before if "else"
	function elseIf(line){
		var f = jumpStack.pop();
		addQuad(OPERATIONS.GOTO, -1, -1, null, line);
		jumpStack.push(count-1);
		QUADS[f][3] = count;
	}

	// Declares a function. After "fun"
	function declareFunction(name, params){
		if(FUNCS.findIndex(a=>a.name==name)!=-1){
			return { error: ERRORS.METHOD_REDECLARATION };
		}
		if(VARS.findIndex(a=>a.name==name)!=-1){
			return { error: ERRORS.METHOD_REDECLARATION_VARIABLE };
		}
		var vars = [];
		for(var i of params){
			// var j = defineVariable(`${name}#${i.name}`, i.type)
			// console.log(vars.findIndex(a=>a.name==i.name))
			if(vars.findIndex(a=>a.name==i.name)!=-1) return { error: ERRORS.DECLARE_REDECLARATION };
			vars.push({ ...i, dir: vars.length+10000 });
		}
		FUNCS.push({
			name,
			params,
			vars,
			dir: count,
			temps: 0,
			start: name=='start'
		});
		currFunc = FUNCS.length-1;
		VARS.push({
			name, type: 'func', val: -1, function: true
		});
		return { dir: FUNCS.length-1, error: false };
	}

	// Declares a repeat. After "repeat"
	function defineLoop(){
		jumpStack.push(count);
	}

	// Declares that a loop started. After "do"
	function startLoop(line){
		addQuad(OPERATIONS.GOTOF, valStack.pop(), -1, null, line);
		jumpStack.push(count-1);
	}

	// Declares that a loop has ended. Before "end"
	function endLoop(line){
		var f = jumpStack.pop();
		var ret = jumpStack.pop();
		addQuad(OPERATIONS.GOTO, -1, -1, ret, line);
		QUADS[f][3] = count;
	}

	function functionCall(name, params, line){
		var func = FUNCS.find(a=>a.name==name);
		if(!func){
			return { error: ERRORS.METHOD_NO_METHOD };
		}
		if(func.params.length!=params.length){
			return { error: ERRORS.METHOD_PARAM_LENGTH };
		}
		addQuad(OPERATIONS.ERA, name, -1, -1, line);
		var size = 0;
		for(var i=0; i<params.length; i++){
			addQuad(OPERATIONS.PARAM, size, -1, params[i].dir, line)
			size += parseInt(func.params[i].size);
			valStack.pop();
		}
		addQuad(OPERATIONS.GOSUB, -1, -1, func.dir, line);

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
		var dir = FUNCS[currFunc].temps+20000;
		FUNCS[currFunc].temps++;
		return dir;
	}

	// Defines a variable
	function defineVariable(name, type, size=false){
		var bank = currFunc==-1 ? VARS : FUNCS[currFunc].vars
		if(bank.findIndex(a=>a.name==name)!=-1) return false;
		var dir = bank.reduce((a,b)=>a+(b.size||1), 0) + (currFunc==-1 ? 0 : 10000);
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
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			var fn = FUNCS[currFunc];
			var var_orig;
			for(var i of fn.vars.sort((a,b)=>a.dir-b.dir)){
				if(i.array){
					if(dir>=i.dir && dir<(i.dir+i.size)){
						var_orig = i;
						break;
					}
				}else{
					if(i.dir==dir){
						var_orig = i;
						break;
					}
				}
			}
			return {
				name: var_orig.name,
				array: var_orig.array,
				size: var_orig.size,
				type: var_orig.type,
				index: dir-var_orig.dir,
				dir,
			};
		}else if(dir>=20000 && dir<100000){ // TEMP
			return {
				name: 't'+(dir-20000),
				val: FUNCS[currFunc].temps[dir-20000],
				dir,
				temp: true,
				type: isNaN(FUNCS[currFunc].temps[dir-20000]) ? 'bool' : 'decimal'
			}
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return {
				name: 'c'+CONST[dir-100000].toString(),
				val: CONST[dir-100000],
				dir,
				constant: true,
				type: isNaN(CONST[dir-100000]) ? 'bool' : 'decimal'
			}
		}else if(dir>999990 && dir<1000000){ // SPECIALS
			var name;
			var type = 'bool';
			switch(dir){
				case 999990: // INVENTORY
					name = 'INV';
					type = 'decimal';
				break;
				case 999991: // CHECK WALL
					name = 'WALL'
				break;
				case 999992: // CHECK BOX
					name = 'BOX'
				break;
			}
			return { name, dir, type }
		}else if(dir>=1000000){
			var v = getVariable(dir-1000000);;
			v.name = '(' + v.name + ')';
			return v;
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

	function addQuad(opCode, dir1, dir2, dir3, line){
		// console.log(`${count}:\t ${opGetSymbol(opCode)}\t${dir1}\t${dir2}\t${dir3}\t`)
		QUADS.push([opCode, dir1, dir2, dir3, line]);
		count += 1;
		return dir3;
	}

	function opGetSymbol(op){
		var t = [
			'=', '+','-','x','/','AND','!=','OR','==','>','<','>=','<=',
			'RAND', 'GOTO', 'GOTOF', 'GOTOT', 'PRINT',
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

	function generateQuad(line){
		var peek = opStack.pop();
		var temp;
		var valDer = valStack.pop(), valIz = valStack.pop();

		// var varD = getVariable(valDer);
		// // console.log(varD)
		// if(varD.type!='decimal' && !varD.temp) return { error: ERRORS.OPERATION_INCOMPATIBLE_OPERATION };
		// var varI = getVariable(valIz);
		// // console.log(varI)
		// if(varI.type!='decimal' && !varI.temp) return { error: ERRORS.OPERATION_INCOMPATIBLE_OPERATION };
	
		if(peek==OPERATIONS.ASSIGN){
			temp = valIz;
		}else{
			temp = addTemp();
		}
		addQuad(peek, peek==OPERATIONS.ASSIGN ? valDer : valIz, peek==OPERATIONS.ASSIGN ? -1 : valDer, temp, line)
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
'elseif'							return 'ELSEIF'
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
"while"							return 'REPEAT'
"do"								return 'DO'

"return"							return 'RETURN'
"print"							return 'OUT'
"length"							return 'LEN'
"rand"							return 'RAND'
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

%start start

%%

begin: {
	begin();
	addQuad(OPERATIONS.ERA, 'start', -1, -1, -1);
	addQuad(OPERATIONS.GOSUB, -1, -1, null, -1);
};

start:
	begin declarations EOF {
		// console.log(VARS);
		// for(var i of FUNCS){
		// 	console.log(i.name, i.vars);
		// }
		// // console.log(FUNCS);
		// // console.log(QUADS);
		var j = 0;
		if(QUADS[1][3]==null) return { error: { line: 1, type: ERRORS.MISSING_START } }
		for(var i of QUADS){
			console.log(`[${i[4]}]: ${j}:\t ${i[0]}\t${i[1]}\t${i[2]}\t${i[3]}\t`)
			j++;
		}
		return {
			quads: QUADS,
			// pretty: prettyQuads(),
			funcs: FUNCS,
			vars: VARS,
			const: CONST
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
			if(added === false) {
				return { error: { line: @1.first_line, type: ERRORS.DECLARE_REDECLARATION } }
			}
		}
	}
	| DEF idlist ':' type '[' NUMBER ']' {
		for(var i of $2){
			var added = defineVariable(i, $4, parseInt($6))
			if(added === false){
				return { error: { line: @1.first_line, type: ERRORS.DECLARE_REDECLARATION } }
			}
		}
	}
	;

assign:
	NAME assignOp expression {
		var assignVar = getVariableFromName($1);
		if(!assignVar){
			return { error: { line: @1.first_line, type: ERRORS.ASSIGN_NO_VAR } }
		}
		if(assignVar.array){
			return { error: { line: @1.first_line, type: ERRORS.ASSIGN_TO_ARRAY } }
		}
		addQuad(OPERATIONS.ASSIGN, $3.dir, -1, assignVar.dir, @1.first_line);
	}
	| NAME '[' startP expression endP ']' assignOp expression {
		var assignVar = getVariableFromName($1);
		if(!assignVar){
			return { error: { line: @1.first_line, type: ERRORS.ASSIGN_NO_VAR } }
		}
		if(!assignVar.array){
			return { error: { line: @1.first_line, type: ERRORS.ASSIGN_TO_NOT_ARRAY } }
		}
		var t = addTemp();
		addQuad(OPERATIONS.VERIFY, $4.dir, 0, assignVar.size-1, @1.first_line);
		addQuad(OPERATIONS.SUM, $4.dir, addConstant(assignVar.dir), t, @1.first_line);
		valStack.pop();
		addQuad(OPERATIONS.ASSIGN, $8.dir, -1, t+1000000, @1.first_line);
	}
	;



// expression:
// 	exp compOp exp{
// 		var temp = addTemp();
// 		$$ = addQuad($2, $1.dir, $3.dir, temp);
// 		valStack.push(temp);
// 		$$ = { dir: valStack[valStack.length-1] };
// 	}
// 	| exp {
// 		$$ = { dir: valStack[valStack.length-1] };
// 	}
// 	;



compList2:
	{
		$$ = []
	}
	| compOp exp compList2 {
		$$ = [ [$1, $2.dir], ...$3 ]
		opStack.pop();
		valStack.pop();
	};

compList:
	exp compList2 {
		$$ = [$1.dir, ...$2]

		if($2.length>0){
			valStack.pop();
		}
	};

expression:
	compList {
		var arr = $1.slice(1);
		var init = $1[0];
		for(var i of arr){
			var t = addTemp();
			addQuad(i[0], init, i[1], t, @1.first_line);
			init = t;
		}
		if(arr.length>0){
			valStack.push(init);
			$$ = { dir: init };
		}else{
			$$ = { dir: valStack[valStack.length-1] }
		}
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
			var q = generateQuad(@1.first_line);
			if(q.error){
				return { error: { line: @1.first_line, type: q.error } };
			}else{
				$$ = q;
			}
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
			var q = generateQuad(@1.first_line);
			if(q.error){
				return { error: { line: @1.first_line, type: q.error } };
			}else{
				$$ = q;
			}
		}else $$ = false;
	};
	
startP: {
	opStack.push('(')
};

endP: {
	var p = opStack.pop();
	if(p!='('){
		return { error: { line: @1.first_line, type: ERRORS.COMPILER_ERROR } }
	}
};

factor:
	'(' startP expression endP ')' {
		$$ = $3;
	}
	| val {
		valStack.push($1.dir);
	}
	;

val:
	'-' NUMBER {
		var dir = addConstant(-1*$2);
		$$ = { dir }
	}
	| NUMBER {
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
	NAME '[' startP expression endP ']' {
		var val = getVariableFromName($1);
		if(!val){
			return { error: { line: @1.first_line, type: ERRORS.ACCESS_NO_VAR } }
		}
		if(!val.array){
			return { error: { line: @1.first_line, type: ERRORS.ACCESS_NOT_ARRAY } }
		}
		var t = addTemp();
		addQuad(OPERATIONS.VERIFY, $4.dir, 0, val.size-1, @1.first_line);
		addQuad(OPERATIONS.SUM, $4.dir, addConstant(val.dir), t, @1.first_line);
		valStack.pop();
		$$ = { dir: t+1000000 }
	}
	| NAME {
		var val = getVariableFromName($1);
		if(!val){
			return { error: { line: @1.first_line, type: ERRORS.ACCESS_NO_VAR } }
		}
		$$ = val;
	}
	| queries
	| NAME '(' startP expressionlist endP ')' {
		var fc = functionCall($1, $4, @1.first_line);
		if(fc.error){
			return { error: { line: @1.first_line, error: fc.error } }
		}else if(fc.return){
			var t = addTemp();
			addQuad(OPERATIONS.ASSIGN, fc.name, -1, t, @1.first_line);
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

conditionalElse:
	| ELSE statements
	;

conditionalElseIf:
	| ELSEIF expression startIf THEN statements endIf conditionalElseIf
	;

conditional:
	IF beginIf expression startIf THEN statements endIf conditionalElseIf conditionalElse END {
		for(i of elseStack[elseStack.length-1]){
			QUADS[i][3] = count;
		}
		elseStack.pop();
	}
	;

beginIf: {
	elseStack.push([]);
};

startIf: {
	startIf(@1.first_line);
};

endIf: {
	elseStack[elseStack.length-1].push(count);
	addQuad(OPERATIONS.GOTO, -1, -1, null, @1.first_line);
	endIf(@1.first_line);
};

else: {
	elseIf(@1.first_line);
};

actions:
	FORWARD '(' ')' {
		addQuad(OPERATIONS.MOVE, -1, -1, -1, @1.first_line);
	}
	| ROTRIGHT '(' ')' {
		addQuad(OPERATIONS.ROTATE, -1, -1, -1, @1.first_line);
	}
	| PICKUP '(' ')' {
		addQuad(OPERATIONS.PICKUP, -1, -1, -1, @1.first_line);
	}
	| PUTDOWN '(' ')' {
		addQuad(OPERATIONS.PUTDOWN, -1, -1, -1, @1.first_line);
	}
	| OUT '(' expression ')' {
		addQuad(OPERATIONS.PRINT, -1, -1, $3.dir, @1.first_line);
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
			return { error: { line: @1.first_line, type: ERRORS.ACCESS_NO_VAR } }
		}
		if(!val.array){
			return { error: { line: @1.first_line, type: ERRORS.ACCESS_NOT_ARRAY } }
		}
		var t = addTemp();
		addQuad(OPERATIONS.LENGTH, val.dir, -1, t, @1.first_line);
		$$ = { dir: t }
	}
	| RAND '(' expression ',' expression ')' {
		var t = addTemp();
		addQuad(OPERATIONS.RAND, $3.dir, $5.dir, t, @1.first_line);
		$$ = { dir: t };
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
		$$ = [ { name: $1, type: $3, array: true, size: parseInt($5) }, ...$7 ]
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
		$$ = [ { name: $2, type: $4, size: parseInt($6) }, ...$8 ]
	}
	;

declareFunction: 
	FUNCTION NAME funparams {
		if($2=='start'){
			declareStart();
		}
		var fn = declareFunction($2, $3);
		if(fn.error===false){
			$$ = fn.dir;
		}else{
			return { error: { line: @1.first_line, type: fn.error } };
		}
	}
	;

function:
	declareFunction statements endFunc
	;

endFunc: 
	END {
		currFunc = -1;
		addQuad(OPERATIONS.ENDPROC, -1, -1, -1, @1.first_line);
	};

loop:
	REPEAT defineLoop expression DO startLoop statements endLoop END;

defineLoop: {
	defineLoop(@1.first_line);
};

startLoop: {
	startLoop(@1.first_line);
};

endLoop: {
	endLoop(@1.first_line);
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
	| RETURN setReturn expression{
		var dir = $3.dir;
		if(!$3.temp){
			var t = addTemp();
			addQuad(OPERATIONS.ASSIGN, dir, -1, t, @1.first_line);
			dir = t;
		}
		addQuad(OPERATIONS.RETURN, -1, -1, dir, @1.first_line);
		addQuad(OPERATIONS.ENDPROC, -1, -1, -1, @1.first_line);
		$$ = $3;
	}
	;

setReturn: {
	FUNCS[currFunc].return = true;
};

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