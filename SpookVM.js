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
	ENDPROC: 18,
	RETURN: 19,
	PARAM: 20
}

class VM {
	constructor(quads, vars, funcs, constants, temps){
		this.quads = quads;
		this.cursor = 0;
		this.vars = vars;
		this.funcs = funcs;
		this.const = constants

		// STACKS
		this.jumps = [];

		// MEMORY
		this.temps = new Array(parseInt(temps));

		this.doQuads();
	}

	doQuads(){
		this.cursor = -1;
		var count = 0;
		while(this.cursor<this.quads.length){
			this.cursor++;
			var q = this.quads[this.cursor];
			console.log(q);
			this.executeQuad(q);
			count++;
			if(count==5){
				break;
			}
		}
	}

	setMemory(dir, val){

	}

	getMemory(dir){
		if(dir>=10000 && dir<100000){ // TEMP
			dir = dir-10000;
			var vtemp = this.temps[dir];
			return {
				name: 't'+dir,
				dir: dir+10000,
				val: vtemp
			};
		}else if(dir>=100000){ // CONSTANT
			var vconst = this.const[dir-100000];
			return {
				name: 'c'+dir,
				dir: dir+100000,
				val: vconst
			};
		}else{
			return this.vars[dir];
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
				this.cursor = q4;
				console.log("JUMP", q4)
				break;
			case OPERATIONS.RETURN:
				this.cursor = this.jumps.pop();
				console.log("JUMP", this.cursor)
				break;

			// ARITMETIC OPERATIONS
			case OPERATIONS.SUM:

				break;
			case OPERATIONS.MINUS:

				break;
		}
	}
}