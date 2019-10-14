function Editor(canvas){
	canvas.selectable = false;
	var self = this;
	this.mouseX = 0;
	this.mouseY = 0;
	this.gridX = 0;
	this.gridY = 0;
	this.gridSize = 30;

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.stage = {
		walls: [],
		boxes: []
	}

	canvas.addEventListener('mousemove', function(e){
		var m = getMousePos(canvas, e);
		self.mouseMove(m.x, m.y);
	});
	
}

Editor.prototype.mouseMove = function(x, y){
	this.mouseX = x;
	this.mouseY = y;
}

Editor.prototype.drawGrid = function(){
	var rows = 16, cols = 28;

	this.ctx.fillStyle = "#000000";
	for(var i=0; i<cols; i++){
		for(var j=0; j<rows; j++){
			this.ctx.fillRect(20+(i*this.gridSize), 10+(j*this.gridSize), 5, 5);
		}
	}

	// DRAW MOUSE GRID SELECT
	this.ctx.fillStyle = "#00000032";
	var x = Math.min(Math.max(Math.floor((this.mouseX)/cols), 0), cols);
	var y = Math.min(Math.max(Math.floor((this.mouseY)/rows), 0), rows);
	console.log(x, y)

	var pX = Math.floor(20+(x*this.gridSize)-(this.gridSize/4));
	var pY = Math.floor(10+(y*this.gridSize)-(this.gridSize/4));
	console.log(pX, pY)
	this.ctx.fillRect(pX, pY, 20, 20);
}

Editor.prototype.draw = function(){
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.drawGrid();
}

Editor.prototype.loop = function(){
	this.draw();
}

Editor.prototype.start = function(){
	var self = this;
	setInterval(function(){
		self.loop();
	}, 1000/60);
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}