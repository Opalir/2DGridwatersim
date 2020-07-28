let mouseX = 0;
let mouseY = 0;
let mouseGridX = 0;
let mouseGridY = 0;
let Lmousedown=false;
let Rmousedown=false;

canvas.addEventListener('mousemove', function(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
	mouseGridX = Math.floor(mouseX/TILE_SIZE);
	mouseGridY = Math.floor(mouseY/TILE_SIZE);
});
canvas.addEventListener('mousedown', function(e) {
	if(e.button == 0)Lmousedown = true;
	if(e.button == 2)Rmousedown = true;
});
canvas.addEventListener('mouseup', function(e) {
	if(e.button == 0)Lmousedown = false;
	if(e.button == 2)Rmousedown = false;
});
document.getElementById('changeMode').addEventListener('input', function(e){
	tiled=!tiled;
	refresh();
});
function getInputs(){
	if(Lmousedown){
		const pointSize = 10;
		for(let i =0;i<pointSize;i++){
			for(let j =0;j<pointSize;j++){
				level[mouseGridX+i][mouseGridY+j] = LIQUID;
			}
		}
		
	}
	if(Rmousedown){	
		const pointSize = 5;
		for(let i =-1;i<pointSize+1;i++){
			for(let j =-1;j<pointSize+1;j++){
				if(i>=0&&j>=0&&i<pointSize&&j<pointSize)nextLevel[mouseGridX+i][mouseGridY+j] = WALL;
				changedTile[mouseGridX+i][mouseGridY+j] = 1;
			}
		}
	}
	
}
document.addEventListener("contextmenu", function(e){
	e.preventDefault();
});