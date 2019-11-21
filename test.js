const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
def a : decimal[3]

fun start()
	a[0] = 1
	a[1] = 2
	a[2] = a[0] + a[1]
end
`

var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

vm.doQuads();