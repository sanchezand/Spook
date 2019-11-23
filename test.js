const spook = require('./spook');
const VM = require('./SpookVM');
const fs = require('fs');

var testCode = fs.readFileSync(__dirname+'/tests/test.ca').toString()
var res = spook.parse(testCode);
var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);
var out = vm.doQuads();

console.log("==========  OUTPUT  ==========");
for(var i=0; i<out.length; i++){
	console.log(`[${i+1}]:`, out[i]);
}