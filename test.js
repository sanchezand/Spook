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
var out = vm.doQuads();

console.log("==========  OUTPUT  ==========");
for(var i=0; i<out.length; i++){
	console.log(`[${i+1}]:`, out[i]);
}