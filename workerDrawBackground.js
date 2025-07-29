function drawBackground(){
    //bgctx.fillStyle = background; //this is a color, maybe in the future this may be an image
    /*switch(Math.floor(Math.max(player.enemyRoom.roomNum-1,0)/10)){
        case 0:
            bgctx.fillStyle='white';
        break
        case 1:
            bgctx.fillStyle='#BBBBBB';
        break
        case 2:
            bgctx.fillStyle='#757575';
        break
    }
    bgctx.fillRect(0,0,c.width,c.height); //make this draw over the rooms, not the entire screen*/
}
function drawTiles(tiles,bgCam){
    let shadowsToDraw = [];
    let i=0;
    while (tiles[i]!=undefined){
        let j=0;
        while (tiles[i][j]!=undefined){
            let tileType = tiles[i][j];
            bgctx.drawImage(tileImages[tileType],i-bgCam.x,j-bgCam.y);
            if (tileType>0){
                if (tileType===2){
                    addRoofEdges(i,j,bgCam);
                }
                addShadows(i,j,shadowsToDraw,bgCam);
            }
            j+=tileSize;
        }
        i+=tileSize;
    }
    for (shadow of shadowsToDraw){
        bgctx.drawImage(tileImages[shadow.type],shadow.x-bgCam.x,shadow.y-bgCam.y);
    }
}
function addShadows(x,y,shadowsToDraw,bgCam){
    if (0===tiles[x+tileSize][y]){
        shadowsToDraw.push({x:x+tileSize,y:y,type:6});
    }
    if (0===tiles[x-tileSize][y]){
        shadowsToDraw.push({x:x-tileImages[8].width,y:y,type:8});
    }
    if (0===tiles[x][y+tileSize]){
        if (1===tiles[x][y]){ //make this also trigger if the one below is a roof
            shadowsToDraw.push({x:x,y:y+tileSize-tileImages[5].height,type:5});
        }
        shadowsToDraw.push({x:x,y:y+tileSize,type:7});
    }
}
function addRoofEdges(x,y,bgCam){
    if (2!=tiles[x+tileSize][y]){
        bgctx.drawImage(tileImages[4],x+tileSize-tileImages[4].width-bgCam.x,y-bgCam.y);
    }
    if (2!=tiles[x-tileSize][y]){
        bgctx.drawImage(tileImages[4],x-bgCam.x,y-bgCam.y);
    }
    if (2!=tiles[x][y+tileSize]){
        bgctx.drawImage(tileImages[3],x-bgCam.x,y+tileSize-tileImages[3].height-bgCam.y);
    }
    if (2!=tiles[x][y-tileSize]){
        bgctx.drawImage(tileImages[3],x-bgCam.x,y-bgCam.y);
    }
}
function drawTiles1(tiles,bgCam){
    for (let j=0;j<=760;j+=40){ //should be 720, but a workaround uses it at 760
        for (let i=0;i<=1360;i+=40){
            let foundTile = false;
            let tileAbove = false;
            for (tile of tiles){
                if (tile.x===i&&tile.y===j){
                    foundTile = true;
                }else if (tile.x===i&&tile.y+tileSize===j){
                    tileAbove = true;
                }
            }
            if (foundTile){
                bgctx.drawImage(tileImages[1],i,j); //wall
                bgctx.drawImage(tileImages[5],i,j+tileSize-tileImages[5].height); //mimics ambient acclusion
                let tile = {x:i, y:j-tileSize};
                bgctx.drawImage(tileImages[2],tile.x,tile.y); //above wall area
                let topOpen = false;
                let rightOpen = false;
                let bottomOpen = false;
                let leftOpen = false;
                for (checkTile of tiles){
                    if (checkTile.x===tile.x){
                        if (checkTile.y-tileSize===tile.y+tileSize){
                            bottomOpen = true;
                        }else if (checkTile.y-tileSize===tile.y-tileSize){
                            topOpen = true;
                        }
                    }
                    if (checkTile.y-tileSize===tile.y){
                        if (checkTile.x===tile.x+tileSize){
                            rightOpen = true;
                        }else if (checkTile.x===tile.x-tileSize){
                            leftOpen = true;
                        }
                    }
                }
                if (!topOpen){
                    bgctx.drawImage(tileImages[3],tile.x,tile.y);
                    //bgctx.drawImage(tileImages)
                }
                if (!leftOpen){
                    bgctx.drawImage(tileImages[4],tile.x,tile.y);
                    bgctx.drawImage(tileImages[8],tile.x-tileImages[8].width,tile.y);
                }
                if (!rightOpen){
                    bgctx.drawImage(tileImages[4],tile.x+tileSize-tileImages[4].width,tile.y);
                    bgctx.drawImage(tileImages[6],tile.x+tileSize,tile.y);
                }
                if (!bottomOpen&&j<680){
                    bgctx.drawImage(tileImages[3],tile.x,tile.y+tileSize-tileImages[3].height);
                    //bgctx.drawImage(tileImages[7],tile.x,tile.y);
                }
            }else{
                bgctx.drawImage(tileImages[0],i,j); //floor
                if (tileAbove){
                    bgctx.drawImage(tileImages[7],i,j);
                }
            }
            if (j>720){
                let tile = {x:i, y:j-tileSize};
                bgctx.drawImage(tileImages[2],tile.x,tile.y); //above wall area
            }
        }
    }
    //drawTile({x:tile.x-bgCam.x,y:tile.y-bgCam.y},topOpen,rightOpen,bottomOpen,leftOpen);
}
function drawTile(pos,topOpen,rightOpen,bottomOpen,leftOpen){ //accounting for cam is done before this function
    bgctx.drawImage(tileImages[0],pos.x,pos.y); //main tile
    /*if (!topOpen){
        bgctx.drawImage(tileImages[2],pos.x,pos.y);
    }
    if (!bottomOpen){
        bgctx.drawImage(tileImages[7],pos.x,pos.y+(tileSize-tileImages[7].height));
    }
    if (!leftOpen){
        let image = tileImages[topOpen && bottomOpen ? 9 : topOpen ? 0 : bottomOpen ? 6 : 3]; //this is basically just a string of if else
        bgctx.drawImage(image,pos.x,pos.y);
    }
    if (!rightOpen){
        let image = tileImages[topOpen && bottomOpen ? 10 : topOpen ? 2 : bottomOpen ? 8 : 5]; //this is basically just a string of if else
        bgctx.drawImage(image,pos.x+(tileSize-image.width),pos.y);
    }*/
    /*bgctx.fillStyle = 'black';
    bgctx.globalAlpha = .5;
    bgctx.fillRect(pos.x,pos.y,tileSize,tileSize);
    bgctx.globalAlpha = 1;*/
}
function drawWalls(wallsCam,draw3d){
    let i = 0;
    //this is an example of a crisp line, I can't figure out how to get the walls to look like this
    /*bgctx.beginPath();
    bgctx.moveTo(100.5,100);
    bgctx.lineTo(100.5,200);
    bgctx.stroke();*/
    for (wall of walls){
        i++;
        //this draws the wall id
        //bgctx.fillText(i,(mid.x-wallsCam.x)*wallsCam.zoom,(mid.y-wallsCam.y)*wallsCam.zoom);
        if (!draw3d){
            bgctx.beginPath();
            bgctx.moveTo(((wall.first.x-wallsCam.x)*wallsCam.zoom),(wall.first.y-wallsCam.y)*wallsCam.zoom);
            bgctx.lineTo((wall.second.x-wallsCam.x)*wallsCam.zoom,(wall.second.y-wallsCam.y)*wallsCam.zoom);
            bgctx.stroke();
        }else{
            let newFirst = accountForZ(wall.first,47);
            let newSecond = accountForZ(wall.second,47);
            let newFirst2 = accountForZ(wall.first,53);
            let newSecond2 = accountForZ(wall.second,53);
            bgctx.beginPath();
            bgctx.moveTo(newFirst.x,newFirst.y);
            bgctx.lineTo(newSecond.x,newSecond.y);
            bgctx.moveTo(newFirst2.x,newFirst2.y);
            bgctx.lineTo(newSecond2.x,newSecond2.y);
    
            bgctx.moveTo(newFirst.x,newFirst.y);
            bgctx.lineTo(newFirst2.x,newFirst2.y);
            bgctx.moveTo(newSecond.x,newSecond.y);
            bgctx.lineTo(newSecond2.x,newSecond2.y);
            bgctx.stroke();
        }
    }
}
let backgroundCanvas = new OffscreenCanvas(1400,750);
let bgctx = backgroundCanvas.getContext('2d');
let tileSize = null;
let tiles = null;
let walls = null;
let tileImages = null;
let roomIndex = null;
self.onmessage = async function(event) {
    /*if (event.data.type==='init'){
        backgroundCanvas = event.data.canvas;
        bgctx = backgroundCanvas.getContext('2d');
    }else{*/
        tileSize = event.data.tileSize;
        tiles = event.data.tiles;
        walls = event.data.walls;
        tileImages = event.data.tileImages;
        roomIndex = event.data.roomIndex;
        bgctx.clearRect(0,0,backgroundCanvas.width,backgroundCanvas.height);
        //drawBackground();
        drawTiles(tiles,{zoom:1,x:30,y:30});
        drawWalls({zoom:1,x:-50,y:-50},false); //the doorlength is 50 and they get cut off if this isn't here(it's offset when being drawn)

        const bitmap = await backgroundCanvas.transferToImageBitmap();

        self.postMessage({ bitmap,roomIndex }, [bitmap]);
    //}
};