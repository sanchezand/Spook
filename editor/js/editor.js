var playerImg = new Image;
playerImg.src = "assets/arrow.png";
function Editor(canvas){
	canvas.selectable = false;
	var self = this;
	this.mouseX = 0;
	this.mouseY = 0;
	this.gridX = 0;
	this.gridY = 0;
	this.gridSize = 30;
	this.mode = 0;
	this.selected_pos = [0,0];
	this.ending = [11,11];
	this.dimensions = 13;
	this.notification = false;
	this.inventory = 0;

	this.selection = {
		x: 0,
		y: 0
	}

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.stage = {
		walls: [],
		boxes: [],
		player: [0,0],
		playerRotation: 0
	}

	canvas.addEventListener('mousemove', function(e){
		var m = getMousePos(canvas, e);
		self.mouseMove(m.x, m.y);
	});
	canvas.addEventListener('mousedown', function(e){
		e.preventDefault();
		self.mouseDown(e.button>0);
	})
}

Editor.prototype.reset = function(){
	this.stage = {
		walls: [],
		boxes: [],
		player: [0,0],
		playerRotation: 0
	}
}

Editor.prototype.setMode = function(mode){
	this.mode = mode;
}

Editor.prototype.generateLink = function(){
	var walls = [];
	for(var i of this.stage.walls){
		walls.push(i[0]==i[2] ? 'x,'+i[0]+','+i[1]+','+i[3] : 'y,'+i[1]+','+i[0]+','+i[2]);
	}
	var boxes = [];
	for(var i of this.stage.boxes){
		boxes.push(i.join(','));
	}
	var q = []
	if(walls.length>0) q.push('w='+walls.join(';'));
	if(boxes.length>0) q.push('b='+boxes.join(';'));
	q.push('p='+this.stage.player.join(',')+','+this.stage.playerRotation);	
	q.push('e='+this.ending.join(','));	
	return q.join('&');
}

Editor.prototype.moveForward = function(){
	var newX = this.stage.player[0], newY = this.stage.player[1];
	switch(this.stage.playerRotation){
		case 0:
			newY = Math.max(this.stage.player[1]-1, 0);
			break;
		case 1:
			newX = Math.min(this.stage.player[0]+1, 11);
			break;
		case 2:
			newY = Math.min(this.stage.player[1]+1, 11);
			break;
		case 3:
			newX = Math.max(this.stage.player[0]-1, 0);;
			break;
	}
	if(!this.checkWall()){
		this.stage.player[0] = newX;
		this.stage.player[1] = newY;
	}
}

Editor.prototype.rotate = function(){
	this.stage.playerRotation = this.stage.playerRotation==3 ? 0 : this.stage.playerRotation+1;
}

Editor.prototype.pickup = function(){
	var ix = this.stage.boxes.findIndex(a=>a[0]==this.stage.player[0] && a[1]==this.stage.player[1]);
	if(ix==-1) return;
	this.stage.boxes[ix][2] -= 1;
	this.inventory += 1;
	if(this.stage.boxes[ix][2]<=0){
		this.stage.boxes.splice(ix, 1);
	}
}

Editor.prototype.mouseMove = function(x, y){
	this.mouseX = x;
	this.mouseY = y;
}

Editor.prototype.mouseDown = function(remove){
	if(this.mode==0){ // START PLACE
		if(remove){
			this.removeWall(this.selection.x, this.selection.y);
			return;
		}
		this.selected_pos = [
			this.selection.x,
			this.selection.y
		]
		this.mode = 1;
	}else if(this.mode==1){ // END PLACE
		if(!remove){
			this.placeWall(this.selected_pos[0], this.selected_pos[1], this.selection.x, this.selection.y);
		}
		this.mode = 0;
	}else if(this.mode==2){ // PLACE BOX
		this.placeBox(this.selection.x, this.selection.y, remove);
	}else if(this.mode==3){ // PLACE GODART
		this.placePlayer(this.selection.x, this.selection.y);
	}else if(this.mode==4){ // PLACE ENDING
		this.placeEnd(this.selection.x, this.selection.y);
	}
}

Editor.prototype.drawGrid = function(){
	this.ctx.fillStyle = "#000000";
	for(var i=0; i<this.dimensions; i++){
		for(var j=0; j<this.dimensions; j++){
			this.ctx.fillRect((20+i*this.gridSize), 20+(j*this.gridSize), 5, 5);
		}
	}
}

Editor.prototype.onChange = function(fn){
	this.notification = fn;
}
Editor.prototype.notifyChange = function(){
	if(this.notification) this.notification(this.generateLink());
}

Editor.prototype.placeWall = function(x1, y1, x2, y2){
	if(x1==x2 && y1==y2) return;
	// if(x1==x2){ // VERTICAL WALL
	// 	for(var i of this.stage.walls){

	// 	}
	// }else{ // HORIZONTAL WALL
	// 	for(var i of this.stage.walls){
			
	// 	}
	// }
	this.stage.walls.push([x1, y1, x2, y2]);
	this.notifyChange();
}

Editor.prototype.removeWall = function(x,y){
	var ix = -1;
	do{
		ix = this.stage.walls.findIndex(a=>{
			if(a[0]==a[2]){ // VERTICAL WALL
				return a[0]==x && y>=Math.min(a[1], a[3]) && y<=Math.max(a[1], a[3]);
			}else if(a[1]==a[3]){ // HORIZONTAL WALL
				return a[1]==y && x>=Math.min(a[0], a[2]) && x<=Math.max(a[0], a[2]);
			}
		});
		if(ix!=-1) this.stage.walls.splice(ix, 1);
	}while(ix!=-1);
	this.notifyChange();
}

Editor.prototype.placeBox = function(x,y, remove, amount){
	var ix = this.stage.boxes.findIndex(a=>(a[0]==x && a[1]==y));
	if(!remove){
		if(ix==-1) this.stage.boxes.push([x, y, amount ? amount : 1]);
		else this.stage.boxes[ix][2] += 1;
	}else if(ix!=-1){
		this.stage.boxes.splice(ix, 1);
	}
	this.notifyChange();
}

Editor.prototype.placePlayer = function(x,y,rot){
	if(rot){
		console.log(rot);
		this.stage.playerRotation = Math.min(Math.max(rot, 0), 4);
		console.log(this.stage.playerRotation);
	}
	if(this.stage.player[0]==x && this.stage.player[1]==y && !rot){
		this.stage.playerRotation = this.stage.playerRotation==3 ? 0 : this.stage.playerRotation+1;
	}else{
		this.stage.player = [parseInt(x),parseInt(y)];
	}
	this.notifyChange();
}

Editor.prototype.placeEnd = function(x,y){
	this.ending = [x,y];
	this.notifyChange();
}

Editor.prototype.getCoords = function(x, y){
	return {
		x: Math.floor(20+(x*this.gridSize)-(this.gridSize/4)),
		y: Math.floor(20+(y*this.gridSize)-(this.gridSize/4))
	}
}

Editor.prototype.canMove = function(){
	
}

Editor.prototype.getInventory = function(){
	return this.inventory;
}

Editor.prototype.checkBox = function(){
	for(var i of this.stage.boxes){
		if(i[0]==this.stage.player[0] && i[1]==this.stage.player[1]){
			return true;
		}
	}
	return false;
}

Editor.prototype.wallBetween = function(x1, y1, x2, y2){
	var type = x1==x2 ? 0 : 1;

	for(var i of this.stage.walls){
		var xLeft = Math.min(i[0], i[2]);
		var xRight = Math.max(i[0], i[2]);
		var yTop = Math.min(i[1], i[3]);
		var yBottom = Math.max(i[1], i[3]);
		if(type==0 && i[0]==i[2] && x1==i[0]){
			if(yTop<=y1 && yBottom>=y1 && yTop<=y2 && yBottom>=y2){
				return true;
			}
		}else if(type==1 && i[1]==i[3] && y1==i[1]){
			if(xLeft<=x1 && xRight>=x1 && xLeft<=x2 && xRight>=x2){
				return true;
			}
		}
	}
	return false;
}

Editor.prototype.checkWall = function(){
	var x = this.stage.player[0], y = this.stage.player[1];
	switch(this.stage.playerRotation){
		case 0: 
			return this.wallBetween(x, y, x+1, y) || y==0;
		case 1:
			return this.wallBetween(x+1, y, x+1, y+1) || x==11;
		case 2:
			return this.wallBetween(x, y+1, x+1, y+1) || y==11;
		case 3:
			return this.wallBetween(x, y, x, y+1) || x==0;
	}
	return false;
}

Editor.prototype.drawStage = function(){
	for(var i of this.stage.walls){
		var start = this.getCoords(i[0], i[1]);
		var end = this.getCoords(i[2], i[3]);
		this.ctx.beginPath();
		this.ctx.moveTo(start.x+10, start.y+10);
		this.ctx.lineTo(end.x+10, end.y+10);
		this.ctx.lineWidth = 2;
		this.ctx.stroke();
	}

	var endX = Math.floor(35+(this.ending[0]*this.gridSize)-(this.gridSize/4));
	var endY = Math.floor(35+(this.ending[1]*this.gridSize)-(this.gridSize/4));
	this.ctx.fillStyle = "#3c63b0";
	this.ctx.fillRect(endX, endY, 20, 20);

	for(var i of this.stage.boxes){
		var pX = Math.floor(35+(i[0]*this.gridSize)-(this.gridSize/4));
		var pY = Math.floor(35+(i[1]*this.gridSize)-(this.gridSize/4));
		this.ctx.fillStyle = "#9C9C9C";
		this.ctx.fillRect(pX, pY, 20, 20);
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText(i[2], pX+10, pY+16); 
	}

	var playerX = Math.floor(35+(this.stage.player[0]*this.gridSize)-(this.gridSize/4));
	var playerY = Math.floor(35+(this.stage.player[1]*this.gridSize)-(this.gridSize/4));
	this.ctx.drawImage(playerImg, this.stage.playerRotation*100, 0, 100, 100, playerX, playerY, 20, 20);

	this.ctx.font = "18px Arial";
	this.ctx.textAlign = "center";
	for(var i of this.stage.boxes){		
		var pX = Math.floor(35+(i[0]*this.gridSize)-(this.gridSize/4));
		var pY = Math.floor(35+(i[1]*this.gridSize)-(this.gridSize/4));
		this.ctx.fillStyle = "#000000";
		this.ctx.fillText(i[2], pX+10, pY+16); 
	}


}

Editor.prototype.drawConstructWalls = function(){
	// DRAW MOUSE GRID SELECT
	this.ctx.fillStyle = "#00000032";
	var x = Math.min(Math.max(Math.floor((this.mouseX-20)/(this.dimensions*2.2)), 0), this.dimensions-1);
	var y = Math.min(Math.max(Math.floor((this.mouseY-20)/(this.dimensions*2.2)), 0), this.dimensions-1);

	if(this.mode==1){
		if(Math.abs(this.selected_pos[0]-x)>Math.abs(this.selected_pos[1]-y)){
			y = this.selected_pos[1];
		}else{
			x = this.selected_pos[0];
		}
	}

	this.selection = { x: x, y: y }

	var pX = Math.floor(20+(x*this.gridSize)-(this.gridSize/4));
	var pY = Math.floor(20+(y*this.gridSize)-(this.gridSize/4));

	if(this.mode==1){
		var pX_selected = Math.floor(20+(this.selected_pos[0]*this.gridSize)-(this.gridSize/4));
		var pY_selected = Math.floor(20+(this.selected_pos[1]*this.gridSize)-(this.gridSize/4));
		this.ctx.beginPath();
		this.ctx.moveTo(pX_selected+10, pY_selected+10);
		this.ctx.lineTo(pX+10, pY+10);
		this.ctx.lineWidth = 2;
		this.ctx.stroke();
	}

	this.ctx.fillRect(pX, pY, 20, 20);
}

Editor.prototype.drawPlace = function(){
	this.ctx.fillStyle = "#00000032";
	var x = Math.min(Math.max(Math.floor((this.mouseX-10)/(this.dimensions*2.42)), 0), this.dimensions-2);
	var y = Math.min(Math.max(Math.floor((this.mouseY-10)/(this.dimensions*2.42)), 0), this.dimensions-2);

	this.selection = { x: x, y: y }

	var pX = Math.floor(35+(x*this.gridSize)-(this.gridSize/4));
	var pY = Math.floor(35+(y*this.gridSize)-(this.gridSize/4));

	this.ctx.fillRect(pX, pY, 20, 20);
}

Editor.prototype.draw = function(){
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.drawStage();
	this.drawGrid();
	if(this.mode<2){
		this.drawConstructWalls();
	}else{
		this.drawPlace();
	}
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