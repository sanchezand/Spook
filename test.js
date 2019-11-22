const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
fun fiboRecursion(n: decimal)
	if n<2 then
		return n
	else
		return fiboRecursion(n-1) + fiboRecursion(n-2)
	end
end

fun start()
	def n : decimal
	n = 3

	print(fiboRecursion(n))
end
`

function test(){
	var a = [];
	a[0] = 1
	a[1] = 2
	a[2] = a[1] * 10 - a[0]*2 + a[1] + a[0]*4
	return a[2]
}

var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

var out = vm.doQuads();

console.log("CALC:", out)
console.log("REAL: ", test(9))