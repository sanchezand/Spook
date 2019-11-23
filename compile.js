var {exec} = require('child_process');
var cmd = 'jison "'+__dirname+'/spook.jison" && node "'+__dirname+'/spook.js" "'+__dirname+'/tests/test.ca"'

async function F(){
	var { stdout, stderr} = await exec(cmd);
	console.log(stdout);
}

F().then(done=>{
	// empty
})