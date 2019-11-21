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
		this.error = false;

		// STACKS
		this.jumps = [];

		// MEMORY
		this.temps = new Array(parseInt(temps));
		this.memory = new Array(this.vars.reduce((a,b)=>a+(b.size || 0), 0));

		for(var i of this.funcs){
			i.memory = [];
			i.return_values = [];
		}

		// for(var i of this.vars){
		// 	if(i.array){
		// 		i.val = new Array(parseInt(i.size));
		// 	}else{
		// 		i.val = -1;
		// 	}
		// }

		// this.doQuads();
	}

	currentFunc(){
		return this.funcStack.length==0 ? -1 : this.funcStack[this.funcStack.length-1];
	}

	getFunctionMemory(){
		return this
	}

	doQuads(){
		this.cursor = -1;
		console.log("QUADS =================")
		while(this.cursor<this.quads.length){
			this.cursor++;
			var q = this.quads[this.cursor];
			if(!q) break;
			console.log(`${this.cursor}:\t ${opGetSymbol(q[0])}\t${q[1]}\t${q[2]}\t${q[3]}\t`)
			this.executeQuad(q);
			if(this.error){
				console.log("ERR");
				return;
			}
		}
		console.log("========================");
		for(var i of this.vars){
			if(i.name=='start')continue;
			if(i.array){
				console.log(i.name, '=', this.memory.slice(i.dir, i.dir+i.size))
			}else{
				console.log(i.name, '=', this.memory[i.dir])
			}
		}
		console.log("");
		for(var i=0; i<this.temps.length; i++){
			console.log('t'+i, '=', this.temps[i]);
		}
	}

	setMemory(dir, val){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			var mem = this.funcs[this.currentFunc()].memory.length-1;
			var variable = this.funcs[this.currentFunc()].memory[mem].findIndex(a=>a.dir==dir);
			this.funcs[this.currentFunc()].memory[mem][variable] = val;
			// Not proud of this.
		}else if(dir>=20000 && dir<100000){ // TEMP
			this.temps[dir-20000] = val;
			return;
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return;
		}else if(dir>999990 && dir<1000000){ // SPECIALS
			return;
		}else if(dir>=1000000){
			this.memory[this.getMemory(dir-1000000).val] = val;
		}else{
			this.memory[dir] = val;
		}
	}

	getMemory(dir){
		if(dir>=10000 && dir<20000){ // FUNCTION VAR
			var mem = this.funcs[this.currentFunc()].memory;
			var variable = mem[mem.length-1][dir-10000];
			return variable;
		}else if(dir>=20000 && dir<100000){ // TEMP
			return {
				name: 't'+(dir-20000),
				val: this.temps[dir-20000],
				dir,
				temp: true
			}
		}else if(dir>=100000 && dir<999990){ // CONSTANT
			return {
				name: this.const[dir-100000].toString(),
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
			return this.getMemory(this.temps[dir-1020000]);
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
				this.funcs[this.currentFunc()].return_values.push(q4);
				break;
			case OPERATIONS.GOSUB:
				this.jumps.push(this.cursor);
				this.cursor = q4-1;
				break;
			case OPERATIONS.ENDPROC:
				this.funcStack.pop();
				this.cursor = this.jumps.pop();
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
				this.setMemory(q4, this.getMemory(q2).val+this.getMemory(q3).val);
				break;
			case OPERATIONS.MINUS:
				this.setMemory(q4, this.getMemory(q2).val-this.getMemory(q3).val);
				break;
			case OPERATIONS.MULT:
				this.setMemory(q4, this.getMemory(q2).val*this.getMemory(q3).val);
				break;
			case OPERATIONS.DIVIDE:
				this.setMemory(q4, this.getMemory(q2).val/this.getMemory(q3).val);
				break;
			case OPERATIONS.ASSIGN:
				if(isNaN(q2)){
					var fn = this.funcs.find(a=>a.name==q2);
					var mem = this.getMemory(fn.return_values.pop());
					this.setMemory(q4, mem.val);
				}else{
					this.setMemory(q4, this.getMemory(q2).val)
				}
				break;



			// FUNCTIONS
			case OPERATIONS.ERA:
				var fx = this.funcs.findIndex(a=>a.name==q2)
				this.funcs[fx].memory.push(this.funcs[fx].vars);
				this.funcStack.push(fx);
				break;
			case OPERATIONS.PARAM:
				this.funcs[this.currentFunc()].memory[this.funcs[this.currentFunc()].memory.length-1][q2].val = this.getMemory(q4).val;
				break;



			// SPECIAL FUNCTIONS
			case OPERATIONS.PRINT:
				console.log("PRINT", this.getMemory(q4).val)
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
				break;
			case OPERATIONS.ROTATE:
				break;
			case OPERATIONS.PICKUP:
				break;
			case OPERATIONS.PUTDOWN:
				break;
		}
	}
}

module.exports = VM