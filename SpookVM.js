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
	ACCESS_IS_ARRAY: 502,
	ACCESS_ARRAY_INDEX: 503,
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

class VM {
	constructor(quads, vars, funcs, constants){
		this.quads = quads;
		this.cursor = 0;
		this.vars = vars;
		this.funcs = funcs;
		this.const = constants
		this.funcStack = [];
		this.prepareFunction = -1;
		this.prepareMemory = { vars: [], temps: [] }
		this.error = false;
		this.output = [];
		this.jumps = [];

		// Global memory
		this.memory = this.vars ? new Array(this.vars.reduce((a,b)=>a+(b.size || 0), 0)) : [];

		for(var i of this.funcs){
			i.memory = {
				vars: [],
				temps: []
			};
			i.return_values = [];
		}
		// this.doQuads();
	}

	doQuads(){
		this.cursor = -1;
		while(this.cursor<this.quads.length){
			this.cursor++;
			var q = this.quads[this.cursor];
			if(!q) break;
			this.executeQuad(q);
			if(this.error){
				break;
			}
		}
		return {
			error: this.error,
			output: this.output
		};
	}

	getQuads(){
		return this.quads;
	}

	currentFunc(offset=0){
		return this.funcStack.length==0 ? -1 : this.funcStack[this.funcStack.length-1-offset];
	}

	getFunctionMemory(){
		return this
	}

	getFunctionVar(dir){
		var fn = this.funcs[this.currentFunc()];
		var var_orig = false;
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
		return var_orig;
	}

	setMemory(dir, val, bankOffset=0){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			// Not proud of this.
			var mem = this.funcs[this.currentFunc()].memory.vars.length-1-bankOffset;
			var var_orig = this.getFunctionVar(dir);
			this.funcs[this.currentFunc()].memory.vars[mem][dir-10000] = var_orig.type=='decimal' ? val : val>0;
			return false;
		}else if(dir>=20000 && dir<100000){ // TEMP
			var temps = this.funcs[this.currentFunc()].memory.temps.length-1-bankOffset;
			this.funcs[this.currentFunc()].memory.temps[temps][dir-20000] = val;
			return false;
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return false;
		}else if(dir>999990 && dir<1000000){ // SPECIALS
			return false;
		}else if(dir>=1000000){
			this.setMemory(this.getMemory(dir-1000000).val, val);
			return false;
		}else{
			this.memory[dir] = val;
			return false;
		}
	}

	getMemory(dir, bankOffset=0){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			var fn = this.funcs[this.currentFunc()];
			var var_memory = fn.memory.vars[fn.memory.vars.length-1-bankOffset][dir-10000];
			var var_orig = this.getFunctionVar(dir);
			return {
				name: var_orig.name,
				val: var_memory,
				array: var_orig.array,
				size: var_orig.size,
				type: var_orig.type,
				dir: var_orig.dir,
				index: dir-var_orig.dir
			};
		}else if(dir>=20000 && dir<100000){ // TEMP
			var fn = this.funcs[this.currentFunc()];
			var val = fn.memory.temps[fn.memory.temps.length-1-bankOffset][dir-20000];
			return {
				name: 't'+(dir-20000),
				val: val,
				dir,
				temp: true,
				type: isNaN(val) ? 'boolean' : 'decimal'
			}
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return {
				name: 'c'+this.const[dir-100000].toString(),
				val: this.const[dir-100000],
				type: isNaN(this.const[dir-100000]) ? 'boolean' : 'decimal',
				dir,
				constant: true
			}
		}else if(dir>=999990 && dir<1000000){ // SPECIALS
			switch(dir){
				case 999990: // INVENTORY
					return { val: this.inventory(), dir, name: 'CHECK_INV', type: 'decimal' };
				case 999991: // CHECK WALL
					return { val: this.wall(), dir, name: 'CHECK_WALL', type: 'boolean' };
				case 999992: // CHECK BOX
					return { val: this.box(), dir, name: 'CHECK_BOX', type: 'boolean' };
			}
		}else if(dir>=1000000){
			return this.getMemory(this.getMemory(dir-1000000).val);
		}else{
			return {
				val: this.memory[dir],
				dir
			}
		}
	}

	executeQuad(quad){
		var q1, q2, q3, q4, line;
		q1 = quad[0];
		q2 = quad[1];
		q3 = quad[2];
		q4 = quad[3];
		line = quad[4];
		// console.log(`[${line}]: ${opGetSymbol(q1)}\t${q2}\t${q3}\t${q4}\t`)
		switch(q1){
			// JUMPS
			case OPERATIONS.GOTO:
				this.cursor = q4-1;
				break;
			case OPERATIONS.RETURN:
				var fn = this.funcs[this.currentFunc()]
				this.funcs[this.currentFunc()].return_values.push(this.getMemory(q4).val);
				break;



			// CONDITIONALS
			case OPERATIONS.GOTOF:
				if(!this.getMemory(q2).val){
					this.cursor = q4-1;
				}
				break;
			case OPERATIONS.GOTOT:
				if(this.getMemory(q2).val){
					this.cursor = q4-1;
				}
				break;


			// CONDITIONAL OPERATIONS
			case OPERATIONS.AND:
				this.setMemory(q4, (this.getMemory(q2).val && this.getMemory(q3).val));
				break;
			case OPERATIONS.NOT:
				this.setMemory(q4, (this.getMemory(q2).val != this.getMemory(q3).val));
				break;
			case OPERATIONS.OR:
				this.setMemory(q4, (this.getMemory(q2).val || this.getMemory(q3).val));
				break;
			case OPERATIONS.EQUALS:
				this.setMemory(q4, (this.getMemory(q2).val == this.getMemory(q3).val));
				break;
			case OPERATIONS.GTRTHN:
				this.setMemory(q4, (this.getMemory(q2).val > this.getMemory(q3).val));
				break;
			case OPERATIONS.LESSTHN:
				this.setMemory(q4, (this.getMemory(q2).val < this.getMemory(q3).val));
				break;
			case OPERATIONS.LESS_EQTHN:
				this.setMemory(q4, (this.getMemory(q2).val <= this.getMemory(q3).val));
				break;
			case OPERATIONS.GTR_EQTHN:
				this.setMemory(q4, (this.getMemory(q2).val >= this.getMemory(q3).val));
				break;



			// ARITMETIC OPERATIONS
			case OPERATIONS.SUM:
				// console.log(this.getMemory(q2).val, '+', this.getMemory(q3).val)
				this.setMemory(q4, this.getMemory(q2).val + this.getMemory(q3).val);
				break;
			case OPERATIONS.MINUS:
				// console.log(this.getMemory(q2).val, '-', this.getMemory(q3).val)
				this.setMemory(q4, this.getMemory(q2).val-this.getMemory(q3).val);
				break;
			case OPERATIONS.MULT:
				// console.log(this.getMemory(q2).val, 'x', this.getMemory(q3).val)
				this.setMemory(q4, this.getMemory(q2).val*this.getMemory(q3).val);
				break;
			case OPERATIONS.DIVIDE:
				// console.log(this.getMemory(q2).val, '/', this.getMemory(q3).val)
				var d1 = this.getMemory(q2).val, d2 = this.getMemory(q3).val
				if(d2==0){
					this.error = { type: ERRORS.OPERATION_DIVIDE_BY_ZERO, line: line };
				}else{
					this.setMemory(q4, this.getMemory(q2).val/this.getMemory(q3).val);
				}
				break;
			case OPERATIONS.ASSIGN:
				if(isNaN(q2)){
					console.log(line)
					var fn = this.funcs.find(a=>a.name==q2);
					var val = fn.return_values.pop();
					this.setMemory(q4, val);
				}else{
					this.setMemory(q4, this.getMemory(q2).val)
				}
				break;



			// FUNCTIONS
			case OPERATIONS.ERA:
				var fx = this.funcs.findIndex(a=>a.name==q2)
				this.prepareFunction = fx;
				var varSize = this.funcs[fx].vars.reduce((a,b)=>a+(parseInt(b.size)||1), 0);
				this.prepareMemory.vars = new Array(varSize);
				this.prepareMemory.temps = new Array(this.funcs[fx].temps);
				break;
			case OPERATIONS.PARAM:
				var param = this.getMemory(q4);
				if(param.array){
					for(var i=0; i<param.size; i++){
						this.prepareMemory.vars[parseInt(q2+i)] = this.getMemory(param.dir+i).val;
					}
				}else{
					this.prepareMemory.vars[q2] = param.val;
				}
				break;
			case OPERATIONS.GOSUB:
				this.jumps.push(this.cursor);
				this.cursor = q4-1;
				this.funcStack.push(this.prepareFunction);
				this.funcs[this.prepareFunction].memory.vars.push(this.prepareMemory.vars);
				this.funcs[this.prepareFunction].memory.temps.push(this.prepareMemory.temps);
				console.log(this.funcs[this.prepareFunction].vars, this.funcs[this.prepareFunction].memory);
				this.prepareMemory.vars = [];
				this.prepareMemory.temps = [];
				this.prepareFunction = -1;
				break;
			case OPERATIONS.ENDPROC:
				var func = this.funcStack.pop();
				var vars = this.funcs[func].memory.vars.pop();
				var temps = this.funcs[func].memory.temps.pop();
				if(this.funcs[func].start) return;
				this.cursor = this.jumps.pop();
				break;



			// SPECIAL FUNCTIONS
			case OPERATIONS.PRINT:
				this.output.push(this.getMemory(q4).val);
				break;
			case OPERATIONS.VERIFY:
				var val = this.getMemory(q2).val;
				if(val>q4 || val<q3){
					this.error = { type: ERRORS.ACCESS_ARRAY_INDEX, line: line };
				}
				break;
			case OPERATIONS.LENGTH:
				this.setMemory(q4, parseInt(this.getMemory(q2).size));
				break;
			case OPERATIONS.RAND:
				var start = this.getMemory(q2).val;
				var end = this.getMemory(q3).val;
				this.setMemory(q4, Math.floor(Math.random() * end) + start);
				break;

			

			// ROBOT FUNCTIONS
			case OPERATIONS.MOVE:
				this.move();
				break;
			case OPERATIONS.ROTATE:
				this.rotate();
				break;
			case OPERATIONS.PICKUP:
				this.pickup();
				break;
			case OPERATIONS.PUTDOWN:
				this.putdown();
				break;
		}
	}

	move(){
		if(this.movefn) this.movefn();
	}

	rotate(){
		if(this.rotatefn) this.rotatefn();
	}

	pickup(){
		if(this.pickupfn) this.pickupfn();
	}

	putdown(){
		if(this.putdownfn) this.putdownfn();
	}

	inventory(){
		if(this.inventoryfn) return this.inventoryfn();
		return 0;
	}

	wall(){
		if(this.wallfn) return this.wallfn();
		return false;
	}

	box(){
		if(this.boxfn) return this.boxfn();
		return false;
	}

	onMove(fn){
		this.movefn = fn;
	}

	onRotate(fn){
		this.rotatefn = fn;
	}

	onPickup(fn){
		this.pickupfn = fn;
	}

	onPutdown(fn){
		this.putdownfn = fn;
	}

	getInventory(fn){
		this.inventoryfn = fn;
	}

	checkWall(fn){
		this.wallfn = fn;
	}

	checkBox(fn){
		this.boxfn = fn;
	}
}

// module.exports = VM