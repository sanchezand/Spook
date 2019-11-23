const spook = require('./spook');
const VM = require('./SpookVM');

var num = 10

var testCode = `
fun fiboRecursion(n: decimal)
	if n<2 then
		return n
	end
	return fiboRecursion(n-1)+fiboRecursion(n-2)
end


fun start()
	print(fiboRecursion(${num}))
end
`
var res = spook.parse(testCode);
var vm = new VM(res.quads, res.vars, res.funcs, res.const, res.temps);
var out = vm.doQuads();

function F(n){
	if(n<2){
		return n
	}
   return F(n-1) + F(n-2)
}

console.log("CALC:", out)
console.log("REAL: ", F(num))