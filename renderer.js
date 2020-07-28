

let wallCanvas = new OffscreenCanvas(canvas.width,canvas.height);
let wallCtx = wallCanvas.getContext('2d');

function render(){
	
	if(tiled){
		renderTiled();
	}else{
		renderMarched();
	}
	
	
}
function renderTiled(){
	//ctx.fillStyle="black";
	//ctx.fillRect(0,0,canvas.width,canvas.height);
	let rendered = 0;
	for(let x =0;x<GRID_WIDTH;x++){
		for(let y =0;y<GRID_HEIGHT;y++){
			let type = level[x][y];
			if(type!=lastRendered[x][y]){
				if(type==LIQUID){
					ctx.fillStyle="blue";
				}else if(type==AIR){
					ctx.fillStyle="white";
				}else if(type==WALL){
					ctx.fillStyle="black";
					
				}
				rendered++;
				lastRendered[x][y] = type;
				ctx.fillRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
			}
			
		}
	}
	if(clock%30==0)console.log(rendered);
}
function renderMarched(){
	if(!fill){
		ctx.fillStyle="white";
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	ctx.beginPath();
	calcMarch(LIQUID,ctx);
	ctx.fillStyle="blue";
	ctx.strokeStyle="blue";
	if(fill){
		ctx.fill();
	}else{
		ctx.stroke();
	}
	if(fill){	
		wallCtx.beginPath();
		calcMarch(WALL,wallCtx);
		wallCtx.fillStyle="black";
		wallCtx.strokeStyle="black";
		wallCtx.fill();
		ctx.drawImage(wallCanvas,0,0);
	}else{
		ctx.beginPath();
		calcMarch(WALL,ctx);
		ctx.fillStyle="black";
		ctx.strokeStyle="black";
		ctx.stroke();
	}
	
}
function renderMarchCI(p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,ctx){ //corners internes (3joints)
	let pax = (p1x+p4x)/2;
	let pay = (p1y+p4y)/2;
	
	let pbx = (p1x+p2x)/2;
	let pby = (p1y+p2y)/2;
	
	ctx.moveTo(pax*TILE_SIZE,pay*TILE_SIZE);
	ctx.lineTo(pbx*TILE_SIZE,pby*TILE_SIZE);
	
	if(fill){
		ctx.lineTo(p2x*TILE_SIZE,p2y*TILE_SIZE);
		ctx.lineTo(p3x*TILE_SIZE,p3y*TILE_SIZE);
		ctx.lineTo(p4x*TILE_SIZE,p4y*TILE_SIZE);
	}
}
function renderMarchCE(p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,ctx){ //corners externes (1seul joint)
	let pax = (p1x+p4x)/2;
	let pay = (p1y+p4y)/2;
	
	let pbx = (p1x+p2x)/2;
	let pby = (p1y+p2y)/2;
	
	ctx.moveTo(pax*TILE_SIZE,pay*TILE_SIZE);
	ctx.lineTo(pbx*TILE_SIZE,pby*TILE_SIZE);
	
	if(fill)ctx.lineTo(p1x*TILE_SIZE,p1y*TILE_SIZE);
}
function renderMarchM(p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,ctx){ //Mid line
	let pax = (p1x+p4x)/2;
	let pay = (p1y+p4y)/2;
	
	let pbx = (p2x+p3x)/2;
	let pby = (p2y+p3y)/2;
	
	ctx.moveTo(pax*TILE_SIZE,pay*TILE_SIZE);
	ctx.lineTo(pbx*TILE_SIZE,pby*TILE_SIZE);
	
	if(fill){
		ctx.lineTo(p2x*TILE_SIZE,p2y*TILE_SIZE);
		ctx.lineTo(p1x*TILE_SIZE,p1y*TILE_SIZE);
	}
	
}
function renderMarchF(p1x,p1y,p2x,p2y,p3x,p3y,p4x,p4y,ctx){ //Filled
	let pax1 = (p1x+p4x)/2;
	let pay1 = (p1y+p4y)/2;
	
	let pbx1 = (p3x+p4x)/2;
	let pby1 = (p3y+p4y)/2;
	
	let pax2 = (p1x+p2x)/2;
	let pay2 = (p1y+p2y)/2;
	
	let pbx2 = (p2x+p3x)/2;
	let pby2 = (p2y+p3y)/2;
	
	
	ctx.moveTo(pax1*TILE_SIZE,pay1*TILE_SIZE);
	ctx.lineTo(pbx1*TILE_SIZE,pby1*TILE_SIZE);
	
	if(fill){
		ctx.lineTo(p3x*TILE_SIZE,p3y*TILE_SIZE);
		ctx.lineTo(pbx2*TILE_SIZE,pby2*TILE_SIZE); 
	}else{		
		ctx.moveTo(pbx2*TILE_SIZE,pby2*TILE_SIZE);
	}
	ctx.lineTo(pax2*TILE_SIZE,pay2*TILE_SIZE);
	
	if(fill)ctx.lineTo(p1x*TILE_SIZE,p1y*TILE_SIZE);
}
function calcMarch(type,ctx){
	//let rendered = 0;
	for(let x =0;x<GRID_WIDTH-1;x++){
		for(let y =0;y<GRID_HEIGHT-1;y++){
		//for(let i =0;i<changedTile.length;i++){
			//let x = changedTile[i].x;
			//let y = changedTile[i].y;
			if(fill&&changedTile[x][y]==0)continue;
			let res = 0;
			if(type==LIQUID){
				if(level[x][y+1]!=AIR)res+=1;
				if(level[x+1][y+1]!=AIR)res+=2;
				if(level[x+1][y]!=AIR)res+=4;
				if(level[x][y]!=AIR)res+=8;
			}else{
				if(level[x][y+1]==type)res+=1;
				if(level[x+1][y+1]==type)res+=2;
				if(level[x+1][y]==type)res+=4;
				if(level[x][y]==type)res+=8;
			}
			if(!fill||res!=(type==WALL?lastRenderedWalls[x][y]:lastRendered[x][y])){
				
				if(fill){
					ctx.fillStyle="white";
					ctx.clearRect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
				}
				if(type==LIQUID){
					lastRendered[x][y] =res;
				}else{
					lastRenderedWalls[x][y] =res;
				}
				
				switch(res){
					case 0:
						break;
					case 1:
						renderMarchCE(x,y+1,x+1,y+1,x+1,y,x,y,ctx);
						break;
					case 2:
						renderMarchCE(x+1,y+1,x+1,y,x,y,x,y+1,ctx);
						break;
					case 3:
						renderMarchM(x,y+1,x+1,y+1,x+1,y,x,y,ctx);//
						break;
					case 4:
						renderMarchCE(x+1,y,x,y,x,y+1,x+1,y+1,ctx);
						break;
					case 5:
						renderMarchF(x,y+1,x+1,y+1,x+1,y,x,y,ctx);//
						break;
					case 6:
						renderMarchM(x+1,y+1,x+1,y,x,y,x,y+1,ctx);//
						break;
					case 7:
						renderMarchCI(x,y,x,y+1,x+1,y+1,x+1,y,ctx);//---dans autre sens
						break;
					case 8:
						renderMarchCE(x,y,x,y+1,x+1,y+1,x+1,y,ctx);
						break;
					case 9:
						renderMarchM(x,y,x,y+1,x+1,y+1,x+1,y,ctx);//
						break;
					case 10:
						renderMarchF(x+1,y+1,x+1,y,x,y,x,y+1,ctx);//
						break;
					case 11:
						renderMarchCI(x+1,y,x,y,x,y+1,x+1,y+1,ctx);//---dans autre sens
						break;
					case 12:
						renderMarchM(x+1,y,x,y,x,y+1,x+1,y+1,ctx);//
						break;
					case 13:
						renderMarchCI(x+1,y+1,x+1,y,x,y,x,y+1,ctx);//---dans autre sens
						break;
					case 14:
						renderMarchCI(x,y+1,x+1,y+1,x+1,y,x,y,ctx);//---dans autre sens
						break;
					case 15:
						if(fill){
							ctx.moveTo(x*TILE_SIZE,y*TILE_SIZE);
							ctx.lineTo((x+1)*TILE_SIZE,y*TILE_SIZE);
							ctx.lineTo((x+1)*TILE_SIZE,(y+1)*TILE_SIZE);
							ctx.lineTo(x*TILE_SIZE,(y+1)*TILE_SIZE);
						}
				}
			}		
		}
	}
	//if(clock%30==0)console.log(rendered);
}
function refresh(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	wallCtx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.fillStyle= "black";
	ctx.font= "10px Arial";
	ctx.fillText("Render mode : " + (tiled?"Normal":"Smoothed"),1,47);
	ctx.font= "15px Arial";
	ctx.fillText("Left click to add liquid",1,90);
	ctx.fillText("Right click to add wall",1,108);
	for(let x =0;x<GRID_WIDTH;x++){
		for(let y =0;y<GRID_HEIGHT;y++){
			lastRendered[x][y] = 0;
			lastRenderedWalls[x][y] = 0;
			changedTile[x][y] = 1;
		}
	}
}