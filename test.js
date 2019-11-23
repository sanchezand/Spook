const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
fun fiboRecursion(n: decimal)
	if n<2 then
		return n
	else
		def a,b : decimal
		a = fiboRecursion(n-1)
		b = fiboRecursion(n-2)
		return a+b
	end
end

fun start()
	print(fiboRecursion(9))
end
`
var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

var out = vm.doQuads();

console.log("CALC:", out)
// console.log("REAL: ", test(9))