const spook = require('./spook');
const VM = require('./SpookVM');

var testCode = `
fun fibonacci(n:decimal)
	def a, b, temp : decimal
	a = 1
	b = 0
	while n>=0 do
		temp = a
		a = a+b
		b = temp
		n = n-1
	end
	return b
end

fun start()
	print(fibonacci(9))
end
`

function fibonacci(num){
	var a = 1, b = 0, temp;
	while (num >= 0){
	  	temp = a;
	  	a = a + b;
	  	b = temp;
	 	num--;
	}
	return b;
 }

var res = spook.parse(testCode);

var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);

var out = vm.doQuads();

console.log("CALC:", out)
console.log("REAL: ", fibonacci(9))