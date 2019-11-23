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
	constructor(quads, vars, funcs, constants, temps){
		this.quads = quads;
		this.cursor = 0;
		this.vars = vars;
		this.funcs = funcs;
		this.const = constants
		this.funcStack = [];
		this.prepareFunction = -1;
		this.prepareMemory = { vars: [], temps: [] }
		this.error = false;
		this.moves = [];
		this.output = [];
		this.jumps = [];

		// Global memory
		this.memory = new Array(this.vars.reduce((a,b)=>a+(b.size || 0), 0));

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

		for(var q of this.quads){
			// console.log(`${this.cursor}:\t ${opGetSymbol(q[0])}\t${q[1]}\t${q[2]}\t${q[3]}\t`)
		}

		console.log("\n\n=============== QUADS ================\n");
		while(this.cursor<this.quads.length){
			this.cursor++;
			var q = this.quads[this.cursor];
			if(!q) break;
			// console.log(`${this.cursor}:\t ${opGetSymbol(q[0])}\t${q[1]}\t${q[2]}\t${q[3]}\t`)
			this.executeQuad(q);
			if(this.error){
				console.log("\n\n=============== ERROR ================");
				break;
			}
		}
		
		console.log("========================");
		for(var i of this.vars){
			if(i.function)continue;
			if(i.array){
				console.log(i.name, '=', this.memory.slice(i.dir, i.dir+i.size))
			}else{
				console.log(i.name, '=', this.memory[i.dir])
			}
		}
		console.log("");
		console.log(this.const);

		return this.output;
	}

	currentFunc(offset=0){
		return this.funcStack.length==0 ? -1 : this.funcStack[this.funcStack.length-1-offset];
	}

	getFunctionMemory(){
		return this
	}

	getMoves(){
		return this.moves;
	}

	setMemory(dir, val, bankOffset=0){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			// Not proud of this.
			var mem = this.funcs[this.currentFunc()].memory.vars.length-1-bankOffset;
			this.funcs[this.currentFunc()].memory.vars[mem][dir-10000] = val;
		}else if(dir>=20000 && dir<100000){ // TEMP
			var temps = this.funcs[this.currentFunc()].memory.temps.length-1-bankOffset;
			this.funcs[this.currentFunc()].memory.temps[temps][dir-20000] = val;
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return;
		}else if(dir>999990 && dir<1000000){ // SPECIALS
			return;
		}else if(dir>=1000000){
			this.setMemory(this.getMemory(dir-1000000).val, val);
		}else{
			this.memory[dir] = val;
		}
	}

	getMemory(dir, bankOffset=0){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			var fn = this.funcs[this.currentFunc()];
			var var_memory = fn.memory.vars[fn.memory.vars.length-1-bankOffset][dir-10000];
			return {
				val: var_memory
			};
		}else if(dir>=20000 && dir<100000){ // TEMP
			var fn = this.funcs[this.currentFunc()];
			var val = fn.memory.temps[fn.memory.temps.length-1-bankOffset][dir-20000];
			return {
				name: 't'+(dir-20000),
				val: val,
				dir,
				temp: true
			}
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return {
				name: 'c'+this.const[dir-100000].toString(),
				val: this.const[dir-100000],
				dir,
				constant: true
			}
		}else if(dir>999990 && dir<1000000){ // SPECIALS
			switch(dir){
				case 999990: // INVENTORY
					return { val: 0, dir };
				case 999991: // CHECK WALL
					return { val: true, dir };
				case 999992: // CHECK BOX
					return { val: false, dir };
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
		var q1, q2, q3, q4;
		q1 = quad[0];
		q2 = quad[1];
		q3 = quad[2];
		q4 = quad[3];
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
				this.setMemory(q4, this.getMemory(q2).val/this.getMemory(q3).val);
				break;
			case OPERATIONS.ASSIGN:
				if(isNaN(q2)){
					var fn = this.funcs.find(a=>a.name==q2);
					var val = fn.return_values.pop();
					// console.log("Return:", val)
					this.setMemory(q4, val);
				}else{
					this.setMemory(q4, this.getMemory(q2).val)
				}
				break;



			// FUNCTIONS
			case OPERATIONS.ERA:
				var fx = this.funcs.findIndex(a=>a.name==q2)
				this.prepareFunction = fx;
				this.prepareMemory.vars = new Array(this.funcs[fx].vars.reduce((a,b)=>a+(b.size||1), 0));
				this.prepareMemory.temps = new Array(this.funcs[fx].temps);
				break;
			case OPERATIONS.PARAM:
				this.prepareMemory.vars[q2] = this.getMemory(q4).val;
				break;
			case OPERATIONS.GOSUB:
				this.jumps.push(this.cursor);
				this.cursor = q4-1;
				this.funcStack.push(this.prepareFunction);
				// console.log("\n\n"+this.funcs[this.prepareFunction].name, ":",this.prepareMemory);
				this.funcs[this.prepareFunction].memory.vars.push(this.prepareMemory.vars);
				this.funcs[this.prepareFunction].memory.temps.push(this.prepareMemory.temps);
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
				// console.log(q4, this.funcs[this.currentFunc()].memory, this.getMemory(q4));
				this.output.push(this.getMemory(q4).val);
				break;
			case OPERATIONS.VERIFY:
				var val = this.getMemory(q2).val;
				if(val<q3 || val>q4){
					this.error = true;
				}
				break;
			case OPERATIONS.LENGTH:
				this.setMemory(q4, this.vars[q2].size);
				break;
			case OPERATIONS.VALDIR:
				// var dir = this.getMemory(q2).val;
				this.setMemory(q4, this.getMemory(q2).val);
				break;

			

			// ROBOT FUNCTIONS
			case OPERATIONS.MOVE:
				this.moves.push(0);
				break;
			case OPERATIONS.ROTATE:
				this.moves.push(1);
				break;
			case OPERATIONS.PICKUP:
				this.moves.push(2);
				break;
			case OPERATIONS.PUTDOWN:
				this.moves.push(3);
				break;
		}
	}
}

module.exports = VM