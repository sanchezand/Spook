const spook = require('./spook');
const VM = require('./SpookVM');
const fs = require('fs');

var testCode = fs.readFileSync(__dirname+'/tests/test.ca').toString()
var res = spook.parse(testCode);

if(res.error){
	console.log("ERROR", res.error);
	return;
}

var vm = new VM(res.quads, res.vars, res.funcs, res.const);
var { output, error, moves } = vm.doQuads();

if(error){
	console.log(output);
	console.log(error);
	return;
}

console.log("==========  OUTPUT  ==========");
for(var i=0; i<output.length; i++){
	console.log(`[${i+1}]:`, output[i]);
}