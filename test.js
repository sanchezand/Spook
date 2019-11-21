const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
def a : decimal
def b,c : bool

fun start()
	a = 0
	b = a<2
	c = a==1
	if b AND c then
		print(a)
	end
end
`

var testCode2 = `
def a,b,c : decimal
def ki : decimal[10]

fun start()
	a = 2
	b = 3
	c = a*b
end
`

var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

vm.doQuads();