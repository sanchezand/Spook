const spook = require('./spook');
const VM = require('./SpookVM');

var num = 10

var testCode = `
fun fiboLoop(n:decimal)
	def a, b, temp : decimal
	a = 1
	b = 0
	while n>0 do
		temp = a
		a = a+b
		b = temp
		n = n-1
	end
	return b
end

fun fiboArray(n:decimal)
	def fib : decimal[100]
	def i : decimal
	i = 2
	fib[0] = 0
	fib[1] = 1
	while i<=n do
		fib[i] = fib[i-1] + fib[i-2]
		i = i+1
	end
	return fib[n]
end

fun fiboRecursion(n: decimal)
	if n<2 then
		return n
	end
	def a,b : decimal
	a = fiboRecursion(n-1)
	b = fiboRecursion(n-2)
	return a+b
end


fun start()
	def n : decimal
	n = 10

	print(fiboLoop(n))
	print(fiboArray(n))
	print(fiboRecursion(n))
end
`
var res = spook.parse(testCode);
var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);
var out = vm.doQuads();

console.log("CALC:", out)