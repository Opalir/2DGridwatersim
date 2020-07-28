const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const TILE_SIZE = 5;
const GRID_WIDTH = Math.floor(canvas.width/TILE_SIZE);
const GRID_HEIGHT = Math.floor(canvas.height/TILE_SIZE);

const AIR = 0;
const LIQUID = 1;
const WALL = 2;

let clock = 0;
let speed = 1;
let level = [];
let nextLevel = [];
let lastRendered = [];
let lastRenderedWalls = []; //only for marched
let changedTile = []; //only for marched
init();


function update(){
	let rand = Math.random();
	const deb = rand>0.5?0:GRID_WIDTH-1;
	const add = rand>0.5?1:-1;
	
	let cond = rand>0.5?(x=>x<GRID_WIDTH):(x=>x>=0);
	
	for(let x =deb;cond(x);x+=add){
		for(let y =GRID_HEIGHT-1;y>=0;y--){
			if(x>=GRID_WIDTH-5)level[x][y]=LIQUID;
			if(level[x][y] == LIQUID){	
				let changed = false;
				let goutteX = x;
				let goutteY = y;
				if(goutteY+1<GRID_HEIGHT&&nextLevel[goutteX][goutteY+1]==AIR){	
					goutteY++;
					changed=true;
				}else if(goutteY+1>=GRID_HEIGHT||nextLevel[goutteX][goutteY+1]!=AIR){ //=si sol
					//let dir = Math.round(Math.random()*4)-2;
					let dir = Math.random()>0.5?-1:1;
					if(goutteX+dir<GRID_WIDTH&&goutteX+dir>=0&&nextLevel[goutteX+dir][goutteY]==AIR){
						if(nextLevel[goutteX+dir][goutteY+1]==AIR){	
							goutteX+=dir;
							goutteY++;
						}else{
							goutteX+=dir;
						}
						
						changed=true;
					}
				}
				if(goutteY+1<GRID_HEIGHT&&nextLevel[goutteX][goutteY+1]==AIR){
					goutteY++;
					changed=true;
				}
				if(changed){
					nextLevel[x][y] = AIR;
					nextLevel[goutteX][goutteY] = LIQUID;
					for(let i =-1;i<2;i++){
						for(let j =-1;j<2;j++){
							if(x+i>=0&&x+i<GRID_WIDTH-1&&y+j>=0&&y+j<GRID_HEIGHT-1)changedTile[x+i][y+j]=1;
						}
					}
					for(let i =-1;i<2;i++){
						for(let j =-1;j<2;j++){
							if(goutteX+i>=0&&goutteX+i<GRID_WIDTH-1&&goutteY+j>=0&&goutteY+j<GRID_HEIGHT-1)changedTile[goutteX+i][goutteY+j]=1;
						}
					}
				}
			}
		}
	}
	//copy nextLevel to level
	for(let x =0;x<GRID_WIDTH;x++){
		for(let y =0;y<GRID_HEIGHT;y++){
			level[x][y] = nextLevel[x][y];
		}
	}
}

function init(){ //init level with base map
	for(let x =0;x<GRID_WIDTH;x++){
		level[x] = [];
		nextLevel[x] = [];
		lastRendered[x] = [];
		lastRenderedWalls[x] = [];
		changedTile[x] = [];
		for(let y =0;y<GRID_HEIGHT;y++){
			level[x][y] = AIR;
			nextLevel[x][y] = AIR; 
			lastRendered[x][y] = level[x][y];
			lastRenderedWalls[x][y] = level[x][y];
			changedTile[x][y] = 0;
		}
	}
}
function run(){
	clock++;
	getInputs();
	let deb = Date.now();
	let deb2 = Date.now();
	if(clock%speed==0)update();
	
	if(clock%30==0)console.log("Update :" +(Date.now()-deb) + " ms");
	deb = Date.now();
	render();
	for(let x =0;x<GRID_WIDTH;x++){
		for(let y =0;y<GRID_HEIGHT;y++){
			changedTile[x][y] = 0;
		}
	}
	//changedTile = [];
	if(clock%30==0)console.log("Render :" +(Date.now()-deb) + " ms");
	if(clock%30==0)console.log("TOTAL :" +(Date.now()-deb2) + " ms");
	requestAnimationFrame(run);
}
