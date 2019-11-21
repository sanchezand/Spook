const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
def a,b : decimal

fun start()
	a = 2
	b = 3
	if a<=b then
		print(a)
	end
end
`
var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

vm.doQuads();