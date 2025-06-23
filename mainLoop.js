let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
c.style.margin = "30px 10px";
//ctx.imageSmoothingEnabled = false;

ctx.fillStyle='black';
ctx.font='48px Courier New';
ctx.fillText('Loading...',c.width/2.5,c.height/2);

//wallsExport is to be able to export and import "walls" as a string, not an array of objects
//I could've just used JSON.stringify and JSON.parse
let wallsExport = '';
let tilesExport = '';
//let wallsImport = ',1250.-50.-50.-50,1250.600.1250.-50,-50.600.1250.600,-50.-50.-50.600'
//let wallsImport = ",650.0.0.0,1400.0.750.0,0.300.0.0,0.750.0.450,650.750.0.750,1400.750.750.750,1400.450.1400.750,1400.0.1400.300";
let basicRoomTemplate = ',0.0.600.0,700.0.1300.0,600.0.600.-50,700.0.700.-50,1300.0.1300.275,1300.375.1300.650,1300.275.1350.275,1300.375.1350.375,0.650.600.650,700.650.1300.650,600.650.600.700,700.650.700.700,0.0.0.275,0.375.0.650,0.275.-50.275,0.375.-50.375';
let wallsImport = '';
//let tilesImport = ",665.-35,700.-35,0.315,0.350,0.385,665.735,700.735,1400.315,1400.350,1400.385";
let tilesImport = "";
//,450.350.600.350,600.300.600.350,600.250.600.300,450.250.600.250,700.350.700.250,850.250.700.250,850.350.700.350,700.250.700.300,700.350.700.300,850.350.700.350
let emptyRoom = JSON.parse("{\"walls\":[],\"spawnPoints\":[]}");
let teleportingBossRoom = JSON.parse("{\"walls\":[{\"first\":{\"x\":600,\"y\":350},\"second\":{\"x\":600,\"y\":150}},{\"first\":{\"x\":200,\"y\":200},\"second\":{\"x\":450,\"y\":200}},{\"first\":{\"x\":450,\"y\":500},\"second\":{\"x\":200,\"y\":500}},{\"first\":{\"x\":800,\"y\":450},\"second\":{\"x\":550,\"y\":450}},{\"first\":{\"x\":850,\"y\":150},\"second\":{\"x\":850,\"y\":350}},{\"first\":{\"x\":1050,\"y\":550},\"second\":{\"x\":800,\"y\":550}},{\"first\":{\"x\":1150,\"y\":450},\"second\":{\"x\":1150,\"y\":200}},{\"first\":{\"x\":950,\"y\":250},\"second\":{\"x\":1050,\"y\":250}},{\"first\":{\"x\":1200,\"y\":100},\"second\":{\"x\":950,\"y\":100}}],\"spawnPoints\":[{\"x\":1000,\"y\":200},{\"x\":700,\"y\":250},{\"x\":300,\"y\":350},{\"x\":250,\"y\":100},{\"x\":650,\"y\":550},{\"x\":950,\"y\":400},{\"x\":1200,\"y\":600},{\"x\":100,\"y\":550},{\"x\":100,\"y\":250},{\"x\":550,\"y\":100},{\"x\":800,\"y\":50}]}");
let bossRoom = JSON.parse("{\"walls\":[{\"first\":{\"x\":800,\"y\":100},\"second\":{\"x\":500,\"y\":100}},{\"first\":{\"x\":100,\"y\":450},\"second\":{\"x\":100,\"y\":200}},{\"first\":{\"x\":1200,\"y\":450},\"second\":{\"x\":1200,\"y\":200}},{\"first\":{\"x\":800,\"y\":550},\"second\":{\"x\":500,\"y\":550}}],\"spawnPoints\":[]}");
let experimentRoom = JSON.parse("{\"walls\":[{\"first\":{\"x\":750,\"y\":650},\"second\":{\"x\":750,\"y\":0}},{\"first\":{\"x\":550,\"y\":650},\"second\":{\"x\":550,\"y\":0}}],\"spawnPoints\":[{\"x\":1000,\"y\":600},{\"x\":150,\"y\":600},{\"x\":50,\"y\":350},{\"x\":1250,\"y\":350}]}");
let guardRoom = JSON.parse("{\"walls\":[],\"spawnPoints\":[{\"x\":550,\"y\":250},{\"x\":750,\"y\":250}]}");
let roomOptions = [
    JSON.parse("{\"walls\":[{\"first\":{\"x\":550,\"y\":200},\"second\":{\"x\":550,\"y\":650}},{\"first\":{\"x\":800,\"y\":450},\"second\":{\"x\":800,\"y\":0}},{\"first\":{\"x\":1000,\"y\":550},\"second\":{\"x\":1000,\"y\":300}},{\"first\":{\"x\":350,\"y\":450},\"second\":{\"x\":350,\"y\":100}},{\"first\":{\"x\":350,\"y\":450},\"second\":{\"x\":100,\"y\":450}}],\"spawnPoints\":[{\"x\":300,\"y\":400},{\"x\":500,\"y\":600},{\"x\":1150,\"y\":150},{\"x\":1150,\"y\":600}]}"),
    JSON.parse("{\"walls\":[{\"first\":{\"x\":850,\"y\":400},\"second\":{\"x\":850,\"y\":650}},{\"first\":{\"x\":450,\"y\":500},\"second\":{\"x\":450,\"y\":650}},{\"first\":{\"x\":450,\"y\":400},\"second\":{\"x\":450,\"y\":250}},{\"first\":{\"x\":200,\"y\":250},\"second\":{\"x\":850,\"y\":250}},{\"first\":{\"x\":200,\"y\":400},\"second\":{\"x\":200,\"y\":250}},{\"first\":{\"x\":200,\"y\":500},\"second\":{\"x\":0,\"y\":500}},{\"first\":{\"x\":1050,\"y\":400},\"second\":{\"x\":850,\"y\":400}},{\"first\":{\"x\":850,\"y\":100},\"second\":{\"x\":850,\"y\":250}},{\"first\":{\"x\":400,\"y\":0},\"second\":{\"x\":400,\"y\":150}}],\"spawnPoints\":[{\"x\":950,\"y\":500},{\"x\":100,\"y\":600},{\"x\":350,\"y\":300},{\"x\":450,\"y\":50},{\"x\":1250,\"y\":50},{\"x\":100,\"y\":100},{\"x\":700,\"y\":150}]}"),
]
let walls = [];
let editorSpawnPoints = [];
let shop = {x:Infinity,y:Infinity};
shop.inShop=false;
let sheild = {
    angle:0,
    width:70,
    height:20,
    color:'gray',
    firstSide:null,
    secondSide:null,
    sheildStart:null
};
let PFBoxes = [];//path finding boxes
let boxSize = 35;
const doorWidth = 100;
const doorLength = 50
const roomWidth = 1300;
const roomHeight = 650;
let margin=new newPoint(10,30);
let HUDHeight = 0;
let cam = {
    x:0,
    y:0,
    zoom:1
}
let devMode = sessionStorage.getItem('devMode');
if (devMode==='true'){
    devMode=true;
}else{
    devMode=false;
}
//devMode=true;
let screenShake=0;
let screenSize=1;
//cam.zoom=Math.min((c.height-HUDHeight)/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
//cam.zoom=Math.min(window.innerHeight/((doorLength*2)+roomHeight),window.innerWidth/((doorLength*2)+roomWidth));
let money = 0;
let savedwallBoxes = [];
function importWalls(imported,goal){
    let wallsStrings = imported.split(',');
    wallsStrings.splice(0,1);
    for (let i = 0; i<wallsStrings.length;i++){
        let wallsValues = wallsStrings[i].split('.');
        goal.push(new newWall(Number(wallsValues[0]),Number(wallsValues[1]),Number(wallsValues[2]),Number(wallsValues[3])));
    }
}
function importTiles(){
    let tilesStrings = tilesImport.split(',');
    tilesStrings.splice(0,1);
    for (let i = 0; i<tilesStrings.length;i++){
        let tilesValues = tilesStrings[i].split('.');
        savedwallBoxes.push(new newPoint(Number(tilesValues[0]),Number(tilesValues[1]),));
    }
}
importWalls(wallsImport,walls);
importTiles();
let dashSpeed = null;
let circlesToDraw = [];
let textToDraw = [];
let rectsToDraw = [];
let bullets = [];
let bossChainEnemies = []; //this will have every boss in the same list, so it won't work if rooms are skipped
let guns = [2,6,7,45,48,49];
let gunsLabels = [];
for (gun of guns){
    gunsLabels.push(new newPowerUpPreset(gun,false).labels[0]);
}
let bulletPowerUps = [6,7,37,45,49,51];
let waterBullets = [];
let changePlayerColor = false;
let mode =7;
//this is outdated
/*modes:
0:normal gameplay
1:The game is paused and goes by 1 full frame at a time
2:editor mode
3:room editor mode
*/
//let enemies = [];
let enemyRooms = [];
let wallsCopy = [];
let particles = [];
let player = newEnemyPreset(new newPoint(roomWidth/2,roomHeight-200),1,1,'',1,new newPoint());
//enemies.push(player);
let explosionImages = [new Image(),new Image(),new Image(),new Image()];
for (let i=0;i<4;i++){
    explosionImages[i].src='Explosion_Frames/Explosion_'+(i+1)+'.png';
}
let playerImages = {
    back:new Image(),
    front:new Image(),
    left:new Image(),
    right:new Image(),
    imagesList:null,
    chargingList:[new Image(),new Image(),new Image(),new Image(),new Image(),new Image()],
}
for (let i=0;i<6;i++){
    playerImages.chargingList[i].src = 'Player_Images/Player_Charging_'+(-(i-6))+'.png';
}
playerImages.front.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.right.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.left.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.back.src = 'Player_Images/Player_front_V2_cropped.png';

let enemyImages = {
    nonMoving:[],
    nonMovingOffset:[],//array of points that the image uses to aline itself
}
for (let i=0;i<8;i++){
    enemyImages.nonMoving.push(new Image());
    enemyImages.nonMoving[i].src = 'Enemy_Images/Non_Moving/'+i+'.png';
}
enemyImages.nonMovingOffset[0] = new newPoint(-4,0)
enemyImages.nonMovingOffset[1] = new newPoint(-4,0)
enemyImages.nonMovingOffset[2] = new newPoint(-4,0)
enemyImages.nonMovingOffset[3] = new newPoint(-4,0)
enemyImages.nonMovingOffset[4] = new newPoint(-4,0)
enemyImages.nonMovingOffset[5] = new newPoint(-9,0)
enemyImages.nonMovingOffset[6] = new newPoint(-12,0)
enemyImages.nonMovingOffset[7] = new newPoint(-7,0)
let tileImages = [
    new Image(),new Image(),new Image(), //organized into 3 by 3 grid of box of tiles
    new Image(),new Image(),new Image(),
    new Image(),new Image(),new Image(),
]
tileImages[0].src = 'Tile_Images/Top_Left_Border.png';
tileImages[2].src = 'Tile_Images/Top_Right_Border.png';
tileImages[4].src = 'Tile_Images/Not_Border.png'; //middle
tileImages[6].src = 'Tile_Images/Bottom_Left_Border.png';
tileImages[8].src = 'Tile_Images/Bottom_Right_Border.png';
let pipeImage = new Image();
pipeImage.src = 'Tile_Images/Pipe.png';
let pipeCorner = new Image();
pipeCorner.src = 'Tile_Images/Top_Left_Pipe_Corner.png';

let bulletImage=new Image();
bulletImage.src='Bullet_test.png';
playerImages.imagesList=[playerImages.front,playerImages.right,playerImages.back,playerImages.left];
let targetImage = new Image();
targetImage.src='Target.png';
let powerUpIconImage = new Image();
powerUpIconImage.src = 'powerUpIcon.png';
let bombImage = new Image();
bombImage.src = 'Bomb.png';
let lockImage = new Image();
lockImage.src = 'Lock.png';
let shopImage = new Image();
shopImage.src = 'Shop.png';
let soulImage = new Image();
soulImage.src = 'Soul.png';
let creditCardImage = new Image();
creditCardImage.src = 'Credit_Card.png';
let portalImage = new Image();
portalImage.src = 'Portal.png';
let shootingAngle = 0;
let maximumDashCoolDown = 20;
let dashCooldown = 0;
let powerUpSpace = 2;
let minorPowerUpSpace = 5;
let powerUpsGrabbed = [];
let minorPowerUpsGrabbed = [];
let permanentMinorPowerUps = [];
let upgrader = newPowerUpPreset(28,false);
let buttons = [];
let getDuplicateMinorPowerUps = false;
let healthToMoneyRatio = 0;
let maximumMinions = 1;
//enemies.push(new newEnemy(roomWidth/2,roomHeight,null,20,'brown',1,2,5));
let camTarget = new newPoint(c.width/2,(c.height-HUDHeight)/2);
let collisionRepeat = 1;
let lastMousePos = null;
let autoAimStrength = 0.1;
let minionsDropLoot = false;
let minionDamage = .5;
let minionReloadSpeed = 120;
let maxHealthDrop = 1;
let maxMoneyDrop = 1;
let aimAssist = 0; //the actual value is set in when updating player stats every frame
let screenShakeLimit = 3;
let bombsHealYou = false;
let showHUD = {
    majorPowerUps:false,
    minorPowerUps:false,
    sellButton:false,
    money:false,
    health:false,
}
let beatGame = false;
let timerGo = false;
let rerollButton = new newButton((c.width/2)-300,(c.height/2)+140,170,29,'Reroll for $4','24px impact',function(thisButton){
    let price = (playerEnemyRoom.rerollNum+1)*4;
    if (money>=price){
        money-=price;
        playerEnemyRoom.rerollNum++;
        thisButton.text = 'Reroll for $'+(price+4); //2 is added as the button was just clicked
        playerEnemyRoom.powerUps = []; //resets the power ups. Will be regenerated in the power up select code
    }
},function(thisButton){
    thisButton.color = '#F7F7F7';
})
rerollButton.everyFrame = function(thisButton){
    thisButton.text='Reroll for $'+((playerEnemyRoom.rerollNum+1)*2);
}
let skipButton = new newButton((c.width/2)+120,(c.height/2)+140,180,29,'Leave and Gain $2','24px impact',function(thisButton){
    money+=2;
    switchMode(0);
},function(thisButton){
    thisButton.color = '#F7F7F7';
})
let canRerollMinor = false;
let maxNumMinorsToGrab = 1;
function offSetByCam(point,passedCam){
    if (passedCam===undefined){
        passedCam=cam;
    }
    return new newPoint((point.x-cam.x)*cam.zoom,(point.y-cam.y)*cam.zoom)
}
function removeFromEnemyRooms(enemy){
    for (enemyRoom of enemyRooms){
        for (let i=0;i<enemyRoom.enemies.length;i++){
            if (enemyRoom.enemies[i]===enemy){
                enemyRoom.enemies.splice(i,1);
                i--;
            }
        }
    }
}
function addToEnemyRooms(enemy){
    let enemyRoom = enemyRooms.find((enemyRoomDuplicate) => isSamePoint(floorPoint(enemy.room,1),floorPoint(enemyRoomDuplicate,1)))
    if (enemyRoom===undefined){
        enemy.x=enemy.lastPosition.x; //if enemy moved so fast they moved into an area that has no room in a frame, they get teleported back their lastposition, which is hopefully a safe position
        enemy.y=enemy.lastPosition.y; //player can clip into other actual rooms if going too fast
        //showHUD.roomNum=true;
        enemy.room = new newPoint((enemy.x+doorLength)/(roomWidth+(doorLength*2)),(enemy.y+doorLength)/(roomHeight+(doorLength*2)));
        addToEnemyRooms(enemy); //hopefully this doesn't make an infinite loop
    }else{
        if (enemy.PFType===16||enemy.PFType===7){
            enemyRoom.enemyPickUps.push(enemy)
        }else{
            if (enemy===player){
                enemyRoom.enemies.splice(0,0,enemy)
            }else{
                enemyRoom.enemies.push(enemy);
            }
        }
        enemy.enemyRoom=enemyRoom;
    }
}
function enemyWallCollision(enemyRoom){
    if (enemyRoom===undefined){
        for (targetEnemyRoom of enemyRooms){
            enemyWallCollision(targetEnemyRoom);
        }
    }else{
        let enemyRoomIndex = enemyRooms.findIndex((checkEnemyRoom)=>checkEnemyRoom===enemyRoom);
        let wallsCheck = enemyRoom.walls;
        let enemiesCheck = enemyRoom.enemies;
        if (enemyRoomIndex>0){
            wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex-1].walls);
            enemiesCheck = enemiesCheck.concat(enemyRooms[enemyRoomIndex-1].enemies);
        }
        if (enemyRoomIndex<enemyRooms.length-1){
            wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex+1].walls);
            enemiesCheck = enemiesCheck.concat(enemyRooms[enemyRoomIndex+1].enemies);
        }
        //enemiesCheck = enemiesCheck.concat(enemyRoom.enemyPickUps);
        let extraWallsCheck = wallsCheck.concat(enemyRoom.extraWalls);
        for(enemy of enemiesCheck){
            if (enemy.PFType===36&&enemy.gunCooldown<=0){
                continue;
            }
            let thisWallsCheck = extraWallsCheck;
            if (enemy.team===0&&enemyRoom.useExtraWalls!=1){
                thisWallsCheck=wallsCheck;
            }
            for (let i=0;i<2;i++){
                for (wall of thisWallsCheck){
                    let boundingPassed = false;
                    //this makes it so it checks each x or y movement individualy (kind of)
                    if (i===0){
                        boundingPassed = boundingBox(wall.first,wall.second,enemy,enemy.size,enemy.size/50);
                    }else if (i===1){
                        boundingPassed = boundingBox(wall.first,wall.second,enemy,enemy.size/50,enemy.size)
                    }
                    if (boundingPassed){
                        let xDis2 = wall.first.x-wall.second.x;
                        let yDis2 = wall.first.y-wall.second.y;
                        let angle3 = Math.atan(yDis2/xDis2);
    
                        let xDis1 = (wall.first.x-enemy.x);
                        let yDis1 = (wall.first.y-enemy.y);
                        let angle1 = Math.atan(yDis1/xDis1);
                        let angle2 = angle3-angle1;
                        let dis1 = findDis(wall.first,enemy);
                        let finDis = dis1*Math.sin(angle2);
                        if (Math.abs(finDis)<=enemy.size){
                            if ((finDis>0)^(enemy.x>wall.first.x)){
                                angle4 = (angle3+Math.PI/2);
                            }else{
                                angle4 = (angle3-Math.PI/2);
                            }
                            //addCircle(dupPoint(enemy),'yellow');
                            enemy.y+=Math.sin(angle4)*(enemy.size-Math.abs(finDis));
                            enemy.x+=Math.cos(angle4)*(enemy.size-Math.abs(finDis));
                            //addCircle(dupPoint(enemy),'purple');
                            if (enemy.PFType===36){
                                enemy.momentum = subtractFromPoint(enemy,enemy.lastPosition);
                            }
                        }
                    }
                }
            }
        }
    }
}
function updateWallsList(listOfWalls){
    wallsExport = '';
    for (wall of listOfWalls){
        wallsExport = wallsExport +','+ wall.first.x.toString();
        wallsExport = wallsExport +'.'+ wall.first.y.toString();
        wallsExport = wallsExport +'.'+ wall.second.x.toString();
        wallsExport = wallsExport +'.'+ wall.second.y.toString();
    }
    return wallsExport
}
function updateTilesList(toBeExported,exportLocation){
    exportLocation = '';
    for (tile of toBeExported){
        exportLocation = exportLocation +','+ tile.x.toString();
        exportLocation = exportLocation +'.'+ tile.y.toString();
    }
    return exportLocation
}
let dashFramesLeft = 0;
let dashDirection = null;
let wallBoxes = [];
function removeDuplicates(arr) {
    let unique = [];
    arr.forEach(element => {
        if (!unique.includes(element)) {
            unique.push(element);
        }
    });
    return unique;
}
function generateWallBoxes(precision,wallsToGenerate,wallBoxes){
    if (precision===undefined){
        precision=1;
    }
    wallBoxes = [];
    savedwallBoxes.forEach(wallTile =>{wallBoxes.push(wallTile)});
    for (wall of wallsToGenerate){
        let currentPoint = new newPoint(wall.first.x,wall.first.y);
        let wallAngle = findAngle(wall.first,wall.second)+Math.PI;
        //wallAngle=-wallAngle;
        /*if ((wall.first.x<wall.second.x)){
            wallAngle=-wallAngle;
        }*/
        let roundedNum = floorPoint(wall.first,boxSize);
        if (wallBoxes.find((element) => element.x===roundedNum.x&&element.y===roundedNum.y)===undefined){
            wallBoxes.push(roundedNum);
        }
        roundedNum = floorPoint(wall.second,boxSize);
        if (wallBoxes.find((element) => element.x===roundedNum.x&&element.y===roundedNum.y)===undefined){
            wallBoxes.push(roundedNum);
        }
        let wallDis = findDis(wall.first,wall.second);
        for (let i = 0;i<(wallDis/(boxSize/precision));i++){
            roundedNum = floorPoint(currentPoint,boxSize);
            if (wallBoxes.find((element) => element.x===roundedNum.x&&element.y===roundedNum.y)===undefined){
                wallBoxes.push(roundedNum);
            }
            currentPoint.x+=Math.sin(wallAngle)*boxSize/precision;
            currentPoint.y+=Math.cos(wallAngle)*boxSize/precision;
        }
    }
    return wallBoxes
}
let mouseInc = 50;
function editor(){
    for (spawner of editorSpawnPoints){
        drawCircle(spawner.x,spawner.y,'red');
    }
    let roundedMouse = new newPoint(roundTo(mouseShifted.x,mouseInc),roundTo(mouseShifted.y,mouseInc));
    let enemyRoom = enemyRooms.find((room)=>sameRoomPos(room,turnIntoRoomPos(roundedMouse)));
    drawCircle(roundedMouse.x,roundedMouse.y,'yellow');
    if (lastMousePos!=null){
        drawCircle(lastMousePos.x,lastMousePos.y,'green');
        //drawCircle(roundedMouse.x,lastMousePos.y,'red');
        //drawCircle(lastMousePos.x,roundedMouse.y,'red');
    }
    if (keys['c']){
        if (lastMousePos===null){
            if (keysUsed['c']){
                lastMousePos = new newPoint(roundedMouse.x,roundedMouse.y);
                keysUsed['c']=false;
            }
        }else{
            if (keysUsed['c']){
                walls.push(new newWall(
                    roundedMouse.x,roundedMouse.y,
                    roundTo(lastMousePos.x,mouseInc),roundTo(lastMousePos.y,mouseInc)
                    ));
                enemyRoom.walls.push(walls[walls.length-1]);
                lastMousePos = null;
                keysUsed['c']=false;
                enemyRoom.wallBoxes = generateWallBoxes(2,enemyRoom.walls,enemyRoom.wallBoxes);
            }
        }
    }
    if (keys['v']){
        let i = 0
        for (wall of walls){
            if ((wall.first.x===roundedMouse.x&&wall.first.y===roundedMouse.y)||(wall.second.x===roundedMouse.x&&wall.second.y===roundedMouse.y)){
                walls.splice(i,1);
                let roomWallIndex = enemyRoom.walls.findIndex((wallCheck)=>wallCheck===wall);
                if (roomWallIndex!=-1){
                    enemyRoom.walls.splice(roomWallIndex,1);
                }
                break
            }
            i++;
        }
        wallBoxes = generateWallBoxes(2,walls,wallBoxes);
    }
    if (keysUsed['h']){
        keysUsed['h']=false;
        editorSpawnPoints.push(dupPoint(roundedMouse));
    }
    if (keysUsed['g']){
        keysUsed['g']=false;
        for (let i=0;i<editorSpawnPoints.length;i++){
            spawner=editorSpawnPoints[i];
            if (isSamePoint(roundedMouse,spawner)){
                editorSpawnPoints.splice(i,1);
                i--;
            }
        }
    }
    roundedMouse = new newPoint(roundTo(mouseShifted.x-boxSize/2,boxSize),roundTo(mouseShifted.y-boxSize/2,boxSize));
    if (keys['x']&&devMode){
        let boxIndex = wallBoxes.findIndex((element) => element.x===roundedMouse.x&&element.y===roundedMouse.y);
        if (boxIndex ===-1){
            savedwallBoxes.push(roundedMouse);
            wallBoxes.push(roundedMouse);
            //generateWallBoxes(2);
        }
    }
    if (keys['z']){
        let boxIndex = savedwallBoxes.findIndex((element) => element.x===roundedMouse.x&&element.y===roundedMouse.y);
        let boxIndex2 = wallBoxes.findIndex((element) => element.x===roundedMouse.x&&element.y===roundedMouse.y);
        if (boxIndex!=-1){
            savedwallBoxes.splice(boxIndex,1);
            wallBoxes.splice(boxIndex2,1);
            //generateWallBoxes(2);
        }
    }
}
function camControl(snapToRooms,target,updateScreenSize,keepAspectRatio,resetScreen,screenShake){
    if (updateScreenSize){
        if (keepAspectRatio){
            const aspectRatio = 1400/750;
            if ((window.innerWidth/1400)<(window.innerHeight/750)){
                c.width=(window.innerWidth-20)-((margin.x)*2)-((margin.y*aspectRatio)*2);
                c.height=((window.innerWidth/aspectRatio)-20)-((margin.y)*2)+HUDHeight;
            }else{
                c.width=((window.innerHeight*aspectRatio)-20)-((margin.x)*2)-((margin.y*aspectRatio)*2);
                c.height=((window.innerHeight)-20)-((margin.y)*2)+HUDHeight;
            }
        }else{
            //cam.zoom=Math.min(window.innerHeight/((doorLength*2)+roomHeight),window.innerWidth/((doorLength*2)+roomWidth));
            //margin= new newPoint(30,10);
            c.width=(window.innerWidth-20)-((margin.x)*2);
            c.height=(window.innerHeight-20)-((margin.y)*2)+HUDHeight;
        }
        screenSize= Math.min((c.height-HUDHeight)/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
        cam.zoom=screenSize;
        c.style.margin = margin.y+"px "+margin.x+"px";
    }
    if (resetScreen){
        c.width=1400;
        c.height=750+HUDHeight;
        screenSize= Math.min((c.height-HUDHeight)/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
        cam.zoom=screenSize;
        c.style.margin = margin.y+"px "+margin.x+"px";
    }
    if (keys['u']&&devMode){
        cam.zoom*=1+(.1*deltaTime);
    }
    if (keys['y']&&devMode){
        cam.zoom/=1+(.1*deltaTime);
    }
    if (!snapToRooms){
        cam.x = (target.x-(c.width/2/cam.zoom));
        cam.y = (target.y-((c.height-HUDHeight)/2/cam.zoom));
    }else{
        cam.x=(floorTo((target.x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
        cam.y=(floorTo((target.y+50),(roomHeight+(doorLength*2)))-50)-((c.height-HUDHeight)/2/cam.zoom)+(roomHeight/2)+doorLength;

        let z = target.x%(roomWidth+(2*doorLength));
        let u = (roomWidth+(2*doorLength))/(doorLength*2);
        if (z>roomWidth/2){
            z-=roomWidth+(2*doorLength);
        }else if (z<-((2*doorLength)+(roomWidth/2))){
            z-=roomWidth+(2*doorLength);
        }
        if (z<0&&z>=-doorLength){
            cam.x-=(z)*-u;
        }else if(z<-doorLength&&z>-doorLength*2){
            cam.x+=((z)*u)+roomWidth+(doorLength*2);
        }
        
        z = target.y%(roomHeight+(2*doorLength));
        u = (roomHeight+(2*doorLength))/(doorLength*2);
        if (z>roomHeight/2){
            z-=roomHeight+(2*doorLength);
        }else if (z<-((2*doorLength)+(roomHeight/2))){
            z-=roomHeight+(2*doorLength);
        }
        if (z<0&&z>=-doorLength){
            cam.y-=(z)*-u;
        }else if(z<-doorLength&&z>-doorLength*2){
            cam.y+=((z)*u)+roomHeight+(doorLength*2);
        }
    }
    let shakeStrength = 3;
    if (screenShake>0){
        cam.x+=(Math.random()*shakeStrength*screenShake)-(shakeStrength*screenShake)/2;
        cam.y+=(Math.random()*shakeStrength*screenShake)-(shakeStrength*screenShake)/2;
    }
}
function isBetween(x1,x2,inBetween){
    if (x1===inBetween){
        return true
    }else if (x2===inBetween){
        return true
    }
    if (x1>=inBetween){
        if (x2<=inBetween){
            return true
        }else{
            return false
        }
    }else{
        if (x2>=inBetween){
            return true
        }else{
            return false
        }
    }
}
function rayCast(start,otherPosition,checkBounding,enemyRoomWalls,returnWall){
    if (enemyRoomWalls===undefined){
        for (trueEnemyRoom of enemyRooms){
            return rayCast(start,otherPosition,checkBounding,trueEnemyRoom.walls,returnWall);
        }
    }else{
        let disMoved = findDis(start,otherPosition);
        let playerSlope = (otherPosition.y-start.y)/(otherPosition.x-start.x);
        let xIntercept = null;
        let yIntercept = null;

        let corner =  start;
        let oldCorner = otherPosition;
        for (wall of enemyRoomWalls){
            if (!checkBounding||boundingBox(wall.first,wall.second,enemy,enemy.size+disMoved,enemy.size+disMoved)){
                if (wall.first.y===wall.second.y){
                    yIntercept = wall.first.y;
                    //The line is straight so it will always be wall.first.y
                    xIntercept = ((yIntercept-corner.y)/playerSlope)+corner.x;
                    if (isBetween(wall.first.x,wall.second.x,xIntercept)&&isBetween(corner.x,oldCorner.x,xIntercept)&&isBetween(corner.y,oldCorner.y,yIntercept)){
                        if (returnWall){
                            return wall
                        }else{
                            return new newPoint(xIntercept,yIntercept);
                        }
                    }
                }
                if (wall.first.x===wall.second.x){
                    xIntercept = wall.first.x;
                    yIntercept = ((xIntercept-corner.x)*playerSlope) +corner.y;
                    if (isBetween(wall.first.y,wall.second.y,yIntercept)&&isBetween(corner.y,oldCorner.y,yIntercept)&&isBetween(corner.x,oldCorner.x,xIntercept)){
                        if (returnWall){
                            return wall
                        }else{
                            return new newPoint(xIntercept,yIntercept);
                        }
                    }
                }
            }
        }
    }
}
function rayCast1(start,otherPosition,checkBounding,enemyRoom){
    if (enemyRoom===undefined){
        for (trueEnemyRoom of enemyRooms){
            return rayCast1(start,otherPosition,trueEnemyRoom);
        }
    }else{
        let disMoved = findDis(start,otherPosition);
        let playerSlope = (otherPosition.y-start.y)/(otherPosition.x-start.x);
        let xIntercept = null;
        let yIntercept = null;
        let oldCorner = null;
        let corner = null;
        let timesToRepeat = 1;
        for (i=0;i<timesToRepeat;i++){
            corner =  start;
            oldCorner = otherPosition;
            for (wall of enemyRoom.walls){
                if ((!checkBounding||boundingBox(wall.first,wall.second,enemy,enemy.size+disMoved,enemy.size+disMoved)&&(!isSamePoint(start,otherPosition)))){
                    x1=corner.x;
                    y1=corner.y;
                    x2=oldCorner.x;
                    y2=oldCorner.y;
                    x3=wall.first.x;
                    y3=wall.first.y;
                    x4=wall.second.x;
                    y4=wall.second.y;

                    let denominator = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4))
                    if (denominator===0){
                        addCircle(start,'red');
                    }else{
                        let tValue = (((x1-x3)*(y3-y4))-((y1-y3)*(x3-x4)))/denominator;
                        let uValue = (((x1-x2)*(y1-y3))-((y1-y2)*(x1-x3)))/denominator;
                        if (isBetween(0,1,uValue)&&isBetween(0,1,tValue)){
                            return wall;
                        }
                    }

                    //formula for infinite lines I found on wikipedia
                    /*let denominator = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));
                    if (denominator!=0){
                        xIntercept=((((x1*y2)-(y1*x2))*(x3-x4))-((x1-x2)*((x3*y4)-(y3*x4))))/denominator;
                        yIntercept=((((x1*y2)-(y1*x2))*(y3-y4))-((y1-y2)*((x3*y4)-(y3*x4))))/denominator;
                        if (isBetween(wall.first.y,wall.second.y,yIntercept)&&isBetween(wall.first.x,wall.second.x,xIntercept)&&isBetween(corner.x,oldCorner.x,xIntercept)&&isBetween(corner.y,oldCorner.y,yIntercept)){
                            return wall
                        }
                    }else{
                        addCircle(start,'red');
                    }*/
                }
            }
        }
    }
}
function boxCollision(checkBounding){
    for(enemyRoom of enemyRooms){
        let enemyRoomIndex = enemyRooms.findIndex((checkEnemyRoom)=>checkEnemyRoom===enemyRoom);
        let wallsCheck = enemyRoom.walls;
        if (enemyRoomIndex>0){
            wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex-1].walls);
        }
        if (enemyRoomIndex<enemyRooms.length-1){
            wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex+1].walls);
        }
        let extraWallsCheck = wallsCheck.concat(enemyRoom.extraWalls);
        for(enemy of enemyRoom.enemies){
            let thisWallsCheck = extraWallsCheck;
            if (enemy.team===0&&enemyRoom.useExtraWalls!=1){
                thisWallsCheck=wallsCheck;
            }
            let intersection = rayCast(enemy,enemy.lastPosition,checkBounding,thisWallsCheck,true);
            if (intersection!=undefined){
                //addCircle(findMidPoint(intersection.first,intersection.second),'blue');
                if (wall.first.y===wall.second.y){
                    if (enemy.lastPosition.y<enemy.y){
                        enemy.y=intersection.first.y-(enemy.size);
                    }else{
                        enemy.y=intersection.first.y+(enemy.size);
                    }
                }else if (wall.first.x===wall.second.x){
                    if (enemy.lastPosition.x<enemy.x){
                        enemy.x=intersection.first.x-(enemy.size);
                    }else{
                        enemy.x=intersection.first.x+(enemy.size);
                    }
                }
            }
        }
    }
}
function bulletWallCollision(bulletsToRemove){
    for(let j=0;j<bullets.length;j++){
        let bullet = bullets[j];
        let xIntercept = null;
        let yIntercept = null;
        let secondCorner = null;

        let timesToRepeat = 1;
        if (bullet.realWidth!=0){
            //the rectangular bullet has 4 sides + 4 corners - the two bottom corners which I skip because they cause bugs
            timesToRepeat=6;
        }
        let bulletSlope = null;
        let bulletMovement = new newPoint(0,0);
        //this is a vector that shows where the bullet moved this frame and is used to figure out where each corner was last frame
        //addCircle(bullet.lastPosition,'blue');
        bulletMovement = subtractFromPoint(bullet,bullet.lastPosition);
        if (bullet.timeLeft===bullet.maximumTime){
            bulletMovement = new newPoint(Math.sin(bullet.direction)*(bullet.tailLength),Math.cos(bullet.direction)*(bullet.tailLength));
        }
        //addCircle(bullet.lastPosition,'red');
        //addCircle(subtractFromPoint(bullet,bulletMovement),'orange');
        for (enemyRoom of enemyRooms){
            if (!sameRoomPos(enemyRoom,turnIntoRoomPos(bullet))){ //if done this way, a bullet shot really fast into a room with no walls will phase through the walls in the original room
                continue;
            }
            let enemyRoomIndex = enemyRooms.findIndex((checkEnemyRoom)=>checkEnemyRoom===enemyRoom);
            let wallsCheck = enemyRoom.walls;
            if (enemyRoomIndex>0){
                wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex-1].walls);
            }
            if (enemyRoomIndex<enemyRooms.length-1){
                wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex+1].walls);
            }
            if (enemyRoom.useExtraWalls===1){
                wallsCheck=wallsCheck.concat(enemyRoom.extraWalls);
            }
            for (k=0;k<timesToRepeat;k++){
                if (timesToRepeat===1){
                    k=4;
                }
                switch (k){
                    case 0:
                        //left side
                        sideAngle = bullet.direction;
                        corner = addToPoint(bullet,Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2);
                        secondCorner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2));
                    break
                    case 1:
                        //top side
                        sideAngle = bullet.direction+Math.PI/2;
                        corner = addToPoint(bullet,Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2);
                        secondCorner = addToPoint(bullet,Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2);
                    break
                    case 2:
                        //right side
                        sideAngle = bullet.direction+Math.PI;
                        corner = addToPoint(bullet,Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2);
                        secondCorner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2));
                    break
                    case 3:
                        //bottom side
                        sideAngle = bullet.direction-Math.PI/2;
                        corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2));
                        secondCorner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2));
                    break
                    case 4:
                        //top left
                        corner = addToPoint(bullet,Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2)
                    break
                    case 5:
                        //top right
                        corner = addToPoint(bullet,Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2,Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2);
                    break
                    case 6:
                        //bottom right(skipped)
                        corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2));
                    break
                    case 7:
                        //bottom left(skipped)
                        corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2));
                    break
                }
                if (k>3){
                    secondCorner = subtractFromPoint(corner,bulletMovement);
                }
                bulletSlope = (secondCorner.y-corner.y)/(secondCorner.x-corner.x);
                //addCircle(corner,'red');
                //addCircle(secondCorner,'pink');
                let intersection;
                let wallHit;
                intersection = rayCast(corner,secondCorner,false,wallsCheck,false); //this is inefficent, having both running at the same time checking every wall twice for no point FIX IT
                wallHit = rayCast(corner,secondCorner,false,wallsCheck,true);
                if (intersection!=undefined||wallHit!=undefined){
                    //addCircle(corner,'red',5); //this looks really cool with a wide bullet
                    //addCircle(secondCorner,'pink',5)
                    bullet.wallEffect(wallHit,bullet,intersection,bulletsToRemove)
                }
            }
        }
    }
}
function bulletWallCollision1(){
    let bulletsToRemove = [];
    let bulletsAlreadyRemoved = [];
    for (enemyRoom of enemyRooms){
        let i=0;
        for (bullet of bullets){
            for (let j=0;j<2;j++){
                let checkPoint = null;
                bulletMovement = subtractFromPoint(bullet,bullet.lastPosition);
                if (j===0){
                    checkPoint=dupPoint(bullet);
                }else{
                    checkPoint = offsetPointByAngle(bullet,bullet.direction+Math.PI,bullet.tailLength);
                }
                let intersection = rayCast(checkPoint,addTwoPoints(checkPoint,bulletMovement),false,enemyRoom.walls);
                if (intersection!=undefined){
                    if (bulletsAlreadyRemoved.findIndex((otherBullet)=>otherBullet===bullet)===-1){
                        bulletsAlreadyRemoved.push(bullet);
                        bulletsToRemove.push(i);
                        screenShake+=1;
                    }
                }
            }
            i++;
        }
    }
    for (let i=0;i<bulletsToRemove.length;i++){
        bullets.splice(bulletsToRemove[0],1);
        bulletsToRemove.splice(0,1);
    }
}
function makeSheildSides(sheild){
    sheild.firstSide = addToPoint(sheild.sheildStart,Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2);
    sheild.secondSide = subtractFromPoint(sheild.sheildStart,new newPoint(Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2));
    return sheild
}
function randomVector(multiplier){
    return new newPoint((Math.random()-.5)*multiplier*2,(Math.random()-.5)*multiplier*2)
}
function enemyStatusEffects(enemy){
    for (let i=0;i<enemy.statusEffects.length;i++){
        let statusEffect = enemy.statusEffects[i];
        statusEffect.coolDown-=deltaTime;
        if (statusEffect.coolDown<0){
            switch (statusEffect.type){
                case 0:
                    particles.push(new newParticle(enemy.x,enemy.y,5,'blue',1,randomVector(10),1.3));
                    break
                case 1:
                    enemy.health-=statusEffect.var1;//the damage value is stored in var1
                    enemy.invinceable=enemy.maximumInvinceable;
                    particles.push(new newParticle(enemy.x,enemy.y,5,'yellow',1,randomVector(10),1.3));
                    break
                case 2:
                    enemy.speed*=statusEffect.var1;
                    enemy.gunCoolDownMax/=statusEffect.var1;
                    enemy.bulletSpeed*=statusEffect.var1;
                    enemy.color = '#237D87';
                    break
            }
            statusEffect.coolDown=statusEffect.coolDownMax;
        }
        statusEffect.timeLeft-=deltaTime;
        if (statusEffect.timeLeft<0){
            enemy.statusEffects.splice(i,1);
            i--;
        }
    }
}
function dropEnemyLoot(enemy,mainEnemyRoom,lootMultiplier){
    //let numMoney = Math.floor(Math.random()*mainEnemyRoom.difficulty);
    let numMoney = Math.floor(Math.random()*(maxMoneyDrop+2)*lootMultiplier);
    for (let i=0;i<numMoney;i++){
        let moneyPos = new newPoint();
        do{
            moneyPos = addToPoint(dupPoint(enemy),(Math.random()*50)-25,(Math.random()*50)-25);
        }while(rayCast(enemy,moneyPos,false,mainEnemyRoom.walls))
        addToEnemyRooms(newEnemyPreset(moneyPos,16));
    }
    //this is actually the num of health orbs
    numMoney = Math.floor(Math.random()*(maxHealthDrop+1)*lootMultiplier);
    for (let i=0;i<numMoney;i++){
        let moneyPos = new newPoint();
        do{
            moneyPos = addToPoint(dupPoint(enemy),(Math.random()*50)-25,(Math.random()*50)-25);
        }while(rayCast(enemy,moneyPos,false,mainEnemyRoom.walls))
        addToEnemyRooms(newEnemyPreset(moneyPos,7));
    }
}
function shootBullet(bulletTemplate,direction,owner,bulletSpreadNum,shotSpread,accuracy,pos,offset,skipParticles){
    bulletTemplate.owner = null; //this is to stop the stringify from looping 
    for (let i=0;i<bulletSpreadNum;i++){
        let bullet = JSON.parse(JSON.stringify(bulletTemplate));
        bullet.effects = [];
        for (effect of bulletTemplate.effects){
            bullet.effects.push(effect);
        }
        bullet.wallEffect=bulletTemplate.wallEffect;
        bullet.drawBullet=bulletTemplate.drawBullet;
        bullet.everyFrame=bulletTemplate.everyFrame;
        bullet.enemiesLeft=bulletTemplate.enemiesLeft;
        bullet.enemyKillPower=bulletTemplate.enemyKillPower;
        let thisBulletDirection = direction;
        if ((i%2)===1){
            thisBulletDirection-=(Math.floor((i+1)/2)/10)*shotSpread;
        }else{
            thisBulletDirection+=(Math.floor((i+1)/2)/10)*shotSpread;
        }
        thisBulletDirection+=(Math.random()-.5)*accuracy;
        bullet.x=pos.x-Math.sin(thisBulletDirection)*(-offset-bullet.tailLength+1);
        bullet.y=pos.y-Math.cos(thisBulletDirection)*(-offset-bullet.tailLength+1);
        bullet.lastPosition=dupPoint(pos);
        bullet.direction=thisBulletDirection;
        bullet.owner=owner;
        bullets.push(bullet);
        //bullet.lastposition ends up being bugged
    }
    if (!skipParticles){
        let particlePos = new newPoint(pos.x-Math.sin(direction)*((-offset)),pos.y-Math.cos(direction)*((-offset))); //find and then subtract the guns barrel length to make the smoke come out of the barrel
        for (let i=0;i<3;i++){
            let particleDirection = direction + ((Math.random()-.5)*Math.PI/4);
            particles.push(new newParticle(particlePos.x,particlePos.y,5,'grey',0,new newPoint(Math.sin(particleDirection)*10,Math.cos(particleDirection)*10),1.2));
        }
    }
}
function aimCustomGun(enemy,target,damage,bulletSpeed,bulletLength,bulletSpreadNum,shotSpread,accuracy,bulletColor,bulletRange,bulletKillPower,bulletType,effect){
    let bulletDirection = findAngle(target,enemy);
    if (bulletType ===undefined){
        bulletType = 0;
    }
    if (effect===undefined){
        effect = function(enemyHit,thisBullet){
            enemyHit.health-=thisBullet.damage;
            enemyHit.invinceable=enemyHit.maximumInvinceable;
            screenShake+=1;
        }
    }
    let bullet = new newBullet(0,0,bulletSpeed,0,bulletColor,bulletLength,5,bulletType,bulletRange,bulletKillPower,dupPoint(enemy),enemy,damage,'',bulletSpreadNum,shotSpread);
    shootBullet(bullet,bulletDirection,enemy,bulletSpreadNum,shotSpread,accuracy,dupPoint(enemy),enemy.size);
}
let minionTargets = [];
function aimGun(enemy,target,bulletColor,overPowered,enemyRoom,skipRayCast){
    if (overPowered===undefined){
        overPowered=0;
    }
    enemy.gunAngle = findAngle(target,enemy);
    if(enemy.gunCooldown<0){
        //screenShake+=enemy.bulletLength*(2 +(enemy.bulletSpreadNum/5))/60;
        screenShake+=2+(enemy.bulletSpreadNum/5);
        let intersection = undefined;
        if (!skipRayCast){
            intersection = rayCast(enemy,target,false,enemyRoom.walls);
        }
        if (intersection===undefined){
            enemy.gunCooldown=enemy.gunCoolDownMax;
            overPowered+=Math.max(Math.floor(deltaTime/enemy.gunCoolDownMax),1);
            overPowered--;
            aimCustomGun(enemy,target,enemy.damage,enemy.bulletSpeed,enemy.bulletLength,enemy.bulletSpreadNum,enemy.shotSpread,enemy.accuracy,bulletColor,enemy.bulletRange,enemy.bulletKillPower);
        }
    }
}
function spawnMoney(){
    let numMoney = 10000;
    for (let i=0;i<numMoney;i++){
        let enemy = newEnemyPreset(addToPoint(player,50,50),16,1,'',1,undefined);
        player.enemyRoom.enemyPickUps.push(enemy);
    }
    console.log(numMoney);
}
function moveBullets(bulletsToRemove){
    for (let i=0;i<bullets.length;i++){
        let bullet=bullets[i];
        bullet.everyFrame(bullet,bulletsToRemove);
        /*let homingStrength = bullet.owner.bulletHomingStrength
        if (homingStrength>0){
            let closestEnemy = findClosestEnemy(bullet,undefined,bullet.owner,true,true);
            if (closestEnemy===undefined){
                continue;
            }
            let enemyAngle = findAngle(closestEnemy,bullet);
            if (Math.abs(enemyAngle-bullet.direction)<homingStrength){
                bullet.direction=enemyAngle;
            }else{
                if ((enemyAngle-bullet.direction)<0){
                    bullet.direction-=homingStrength;
                }else{
                    bullet.direction+=homingStrength;
                }
            }
        }*/
    }
}
function singleBulletEnemyCollision(bullet){ //all this code it copied to bullet enemy collision so there can be multiple bullet enemy collisions in a frame
    //bullet.room = new newPoint((bullet.x+doorLength)/(roomWidth+(doorLength*2)),(bullet.y+doorLength)/(roomHeight+(doorLength*2)));
    for (let i = enemies.length-1;i>=0;i--){ //this will be broken as the list "enemies" no longer exists
        let enemy = enemies[i];
        if (bullet.enemiesHit.find((enemyCheck)=>enemyCheck===enemy)!=undefined){
            continue;
        }
        //this rotates the creature to be aligned with the bullet which is a rotated rectangle.
        let rotatedPoint = addToPoint(bullet,Math.sin(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet),Math.cos(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet))
        //Now the bullet can be desrcibed in relation to rotatedPoint as a axis aligned bounding box
        let topLeft = new newPoint(bullet.x-bullet.realWidth/2,bullet.y-bullet.tailLength);
        let bottomRight = new newPoint(bullet.x+bullet.realWidth/2,bullet.y);
        let closestPoint = new newPoint(Math.max(topLeft.x,Math.min(rotatedPoint.x,bottomRight.x)),Math.max(topLeft.y,Math.min(rotatedPoint.y,bottomRight.y)));
        if (findDis(closestPoint,rotatedPoint)<enemy.size){
            return enemy
        }else if (bullet.maximumTime!=bullet.timeLeft+1){
            //If it isn't the first frame after the bullet spawning, then the bullet will check if it went through anyboby.
            topLeft.y -= bullet.speed;
            closestPoint = new newPoint(Math.max(topLeft.x,Math.min(rotatedPoint.x,bottomRight.x)),Math.max(topLeft.y,Math.min(rotatedPoint.y,bottomRight.y)));
            if (findDis(closestPoint,rotatedPoint)<enemy.size){
                return enemy
            }
        }
    }
}
function bulletEnemyCollision(){
    for (bullet of bullets){
        if (bullet.type===1){
            continue;
        }
        let bulletRoom = turnIntoRoomPos(bullet);
        if(!sameRoomPos(player.enemyRoom,bulletRoom)){
            continue; //the bullet is out of the players room. This stops you from killing enemies offscreen
        }
        for (enemyRoom of enemyRooms){
            if(!sameRoomPos(enemyRoom,bulletRoom)){
                continue;
            }
            for (let i = enemyRoom.enemies.length-1;i>=0;i--){
                let enemy = enemyRoom.enemies[i];
                if (bullet.enemiesHit.find((enemyCheck)=>enemyCheck===enemy)!=undefined){
                    continue;
                }
                //this rotates the creature to be aligned with the bullet which is a rotated rectangle.
                let rotatedPoint = addToPoint(bullet,Math.sin(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet),Math.cos(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet))
                //Now the bullet can be desrcibed in relation to rotatedPoint as a axis aligned bounding box
                let topLeft = new newPoint(bullet.x-bullet.realWidth/2,bullet.y-bullet.tailLength);
                let bottomRight = new newPoint(bullet.x+bullet.realWidth/2,bullet.y);
                let closestPoint = new newPoint(Math.max(topLeft.x,Math.min(rotatedPoint.x,bottomRight.x)),Math.max(topLeft.y,Math.min(rotatedPoint.y,bottomRight.y)));
                for (let j=0;j<2;j++){
                    if (j===1){
                        if (bullet.maximumTime===bullet.timeLeft+1){
                            continue;
                        }
                        topLeft.y -= bullet.speed;
                        closestPoint = new newPoint(Math.max(topLeft.x,Math.min(rotatedPoint.x,bottomRight.x)),Math.max(topLeft.y,Math.min(rotatedPoint.y,bottomRight.y)));
                    }
                    if (findDis(closestPoint,rotatedPoint)<enemy.size){
                        if (enemy!=bullet.owner&&(enemy.team!=2)&&enemy.PFType!=36){
                            if ((enemy.invinceable<1||enemy!=player)&&bullet.owner.team!=enemy.team){
                                if (bullet.enemiesHit.find((enemyCheck)=>enemyCheck===enemy)!=undefined){
                                    continue;
                                }
                                for (effect of bullet.effects){
                                    effect(enemy,bullet);
                                }
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }
}
function sheildEnemyCollision(){
    sheildBullet = new newBullet(sheild.firstSide.x,sheild.firstSide.y,0,sheild.angle+Math.PI/2,sheild.color,sheild.width,sheild.height,0,30,Infinity,undefined,player)
    let enemy = singleBulletEnemyCollision(sheildBullet);
    if (enemy!=undefined){
        if (enemy!=sheildBullet.owner&&(enemy.team!=2)){
            sheildBullet.enemiesLeft--;
            if (enemy.invinceable<1&&sheildBullet.owner.team!=enemy.team&&dashFramesLeft>0){
                enemy.health--;
                enemy.invinceable=enemy.maximumInvinceable;
                //this is a placeholder way to make it obvious the enemy was hit
                enemy.color='red';
            }
        }
    }
}
function addCircle(point,color,size){
    circlesToDraw.push({
        x:point.x,
        y:point.y,
        color:color,
        size:size,
    })
}
function addAutoRect(point,texts,font,maxWidth,isMoveable,autoCenter){
    if (maxWidth===undefined){
        maxWidth=c.width;
    }
    let finalWidth = 1;
    let finalHeight = 1;
    let textToDraw = [];
    ctx.font = font;
    for (text of texts){
        let metrics = ctx.measureText(text);
        let height = metrics.fontBoundingBoxAscent+metrics.fontBoundingBoxDescent;
        addText(text,new newPoint(5,metrics.fontBoundingBoxAscent+finalHeight),font,'black',maxWidth,textToDraw);
        if (metrics.width>finalWidth){
            finalWidth = metrics.width;
        }
        finalHeight+=height;
    }
    if (autoCenter){
        point.x=(c.width/2)-((finalWidth+10)/2)
    }
    rectsToDraw.push(new newRect(point,finalWidth+10,finalHeight,'white',textToDraw,isMoveable));
}
function addText(message,point,font,color,maxWidth,textList){ //the point is just an offset from the rect's point
    if (message===''){
        return;
    }
    if (color===undefined){
        color='black';
    }
    if (font===undefined){
        font='32px Courier New';
    }
    textList.push({ //maybe add a way to follow the cam
        x:point.x,
        y:point.y,
        color:color,
        font:font,
        message:message,
        maxWidth:maxWidth
    })
}
function drawText(){
    for (text of textToDraw){
        ctx.font = text.font;
        ctx.fillStyle = text.color;
        ctx.fillText(text.message,text.x,text.y,text.maxWidth);
    }
}
function findClosestEnemy(pos,enemiesToCheck,enemy,isBullet,doRayCast,wallsToCheck){
    let closestEnemy = undefined;
    if (enemiesToCheck===undefined){
        let closestDis=Infinity;
        for (enemyRoom of enemyRooms){
            if (sameRoomPos(enemyRoom,enemy.room)){
                let enemyCheck = findClosestEnemy(pos,enemyRoom.enemies,enemy,isBullet,doRayCast,enemyRoom.walls);
                if (enemyCheck===undefined){
                    continue;
                }
                let currentDis = findDis(pos,enemyCheck);
                if (enemyCheck.team!=enemy.team&&(enemyCheck!=enemy)&&(enemyCheck.team!=2)&&currentDis<closestDis){
                    closestEnemy=enemyCheck;
                    closestDis=currentDis;
                }
            }
        }
    }else{
        let closestDis=Infinity;
        if (enemiesToCheck.length===0){
            return undefined;
        }
        for (enemyCheck of enemiesToCheck){
            let currentDis = findDis(pos,enemyCheck);
            if (enemyCheck.team!=enemy.team&&(enemyCheck!=enemy)&&(enemyCheck.team!=2)&&currentDis<closestDis){
                if (!isBullet){
                    if (doRayCast){
                        if (undefined===rayCast(enemyCheck,pos,false,wallsToCheck)){
                            closestEnemy=enemyCheck;
                            closestDis=currentDis;
                        }
                    }else{
                        closestEnemy=enemyCheck;
                        closestDis=currentDis;
                    }
                }else if (undefined===pos.enemiesHit.find((checkEnemy)=>checkEnemy===enemyCheck)){
                    if (doRayCast){
                        if (undefined===rayCast(enemyCheck,pos,false,wallsToCheck)){
                            closestEnemy=enemyCheck;
                            closestDis=currentDis;
                        }
                    }else{
                        closestEnemy=enemyCheck;
                        closestDis=currentDis;
                    }
                }
            }
        }
    }
    return closestEnemy
}
let heldPowerUp = null;
//0 means there is no power up
function findEligiblePowerUps(){
    let powerUps = {
        minor:[],
        major:[]
    }
    let offLimitsPowerUps = [4,8,9,13,19,28,29,32,34,36,46,56,57,62,63];
    for (let i=0;i<100;i++){
        let returnedPowerUp = newPowerUpPreset(i,false);
        if (returnedPowerUp===null||offLimitsPowerUps.includes(i)){
            continue
        }else if (returnedPowerUp instanceof newMajorPowerUp){
            powerUps.major.push(i);
        }else if (returnedPowerUp instanceof newMinorPowerUp){
            powerUps.minor.push({PFType:i,rarity:returnedPowerUp.rarity});
        }
    }
    return powerUps;
}
let targetNumOfRooms=32;//there is are some extra for the totorial rooms
let eligibleMajorPowerUps = [];
let eligibleMinorPowerUps = [];
function fullEnemyWallColl(){
        //box collision checks for situations where the player would move right throught the wall, and wallColl just checks if the player is in the wall right now
        //it is ran twice so corners can check both walls then the other
        boxCollision(false);
        boxCollision(false);
        for (enemyRoom of enemyRooms){
            if (sameRoomPos(enemyRoom,turnIntoRoomPos(player))||true){
                for (let i =0; i <collisionRepeat; i++){
                    enemyWallCollision(enemyRoom);
                }
            }
        }
}
function resetMajorStats(majorPowerUp){
    //majorPowerUp.coolDownMax=majorPowerUp.originalCoolDownMax;
    /*for (minorPowerUp of majorPowerUp.minorPowerUps){
        minorPowerUp.modifier(majorPowerUp,minorPowerUp);
    }*/
    switch (majorPowerUp.PFType){
        case 2:
            majorPowerUp.var1=15;
            majorPowerUp.var2=100;
            break
        case 7:
            majorPowerUp.var1=0;
            break
        case 44:
            majorPowerUp.var1 = 1;
            break
    }
    majorPowerUp.labels = [...majorPowerUp.originalCopy.labels];
    majorPowerUp.coolDownMax=majorPowerUp.originalCopy.coolDownMax;
    majorPowerUp.damage=majorPowerUp.originalCopy.damage;
    majorPowerUp.healthToHeal=majorPowerUp.originalCopy.healthToHeal;
    majorPowerUp.shotSpread=majorPowerUp.originalCopy.shotSpread;
    majorPowerUp.range=majorPowerUp.originalCopy.range;
    majorPowerUp.bulletKillPower=majorPowerUp.originalCopy.bulletKillPower;
    majorPowerUp.extraBulletEffects=[];
    majorPowerUp.earlyBulletEffects=[]; //this shouldn't cause any issues, but if the original copy is not an empty list, it might behave wrong
    majorPowerUp.extraOnClickEffects=[];
    let checkPowerUps = minorPowerUpsGrabbed.concat(permanentMinorPowerUps);
    if (heldPowerUp instanceof newMinorPowerUp){
        checkPowerUps = checkPowerUps.concat(heldPowerUp);
    }
    for (minorPowerUp of checkPowerUps){
        minorPowerUp.modifier(majorPowerUp,minorPowerUp);
    }
    //majorPowerUp.coolDown.coolDownMax=roundTo(majorPowerUp.coolDownMax,100); //I need to figure out a way to stop the floating point weirdness from showing to the player
}
function updatePlayerStats(){
    for (enemyRoom of enemyRooms){
        for (enemy of enemyRoom.enemies){
            if (enemy.originalCopy!=undefined){
                enemy.gunCoolDownMax = enemy.originalCopy.gunCoolDownMax;
                enemy.bulletSpeed = enemy.originalCopy.bulletSpeed;
            }
        }
    }
    player.targetSpeed=player.originalCopy.targetSpeed;
    player.maxHealth=player.originalCopy.maxHealth;
    player.size=player.originalCopy.size;
    getDuplicateMinorPowerUps = false;
    maxHealthDrop=1;
    maxMoneyDrop = 1;
    healthToMoneyRatio = 0;
    screenShakeLimit=3;
    bombsHealYou=false;
    canRerollMinor=false;
    maxNumMinorsToGrab = 1;
    if (controller===undefined){
        aimAssist=.1;
    }else{
        aimAssist=.4;
    }
    if (devMode){
        //minorPowerUpSpace=Math.max(minorPowerUpsGrabbed.length,5);
        powerUpSpace=powerUpsGrabbed.length;
    }else{
        //minorPowerUpSpace=5;
        powerUpSpace=2;
    }
    minorPowerUpSpace=5;
    upgrader.upgradeEffect(player,upgrader);
    for (majorPowerUp of powerUpsGrabbed){
        resetMajorStats(majorPowerUp);
    }
    for (majorPowerUp of player.enemyRoom.shopPowerUps){ //this updates the shops power ups so you can see the stats
        resetMajorStats(majorPowerUp);
    }
}
function updatePlayerStats1(){
    maximumMinions=1;
    autoAimStrength=0.1;
    minionsDropLoot=false;
    minionDamage=.5;
    minionReloadSpeed=120;
    let baseStats=newEnemyPreset(new newPoint(0,0),1);
    for (let i= 0;i<=5;i++){
        if (i<powerUpsGrabbed.length){
            newEnemyPreset(new newPoint(0,0),powerUpsGrabbed[i]).upgradeEffect(baseStats,player);
        }
    }
    /*for (powerUp of powerUpsGrabbed){
        newEnemyPreset(new newPoint(0,0),powerUp).upgradeEffect(baseStats);
    }*/
    enemy=player;
    enemy.gunCoolDownMax=baseStats.gunCoolDownMax;
    //enemy.health=baseStats.health;
    enemy.maxHealth=baseStats.maxHealth;
    enemy.targetSpeed=baseStats.targetSpeed;
    enemy.damage=baseStats.damage;
    enemy.bulletSpeed=baseStats.bulletSpeed;
    enemy.bulletSpreadNum=baseStats.bulletSpreadNum;
    enemy.bulletKillPower=baseStats.bulletKillPower;
    enemy.accuracy=baseStats.accuracy;
    enemy.bulletRange=baseStats.bulletRange;
    enemy.bulletLength=baseStats.bulletLength;
    enemy.shotSpread=baseStats.shotSpread;
    enemy.bulletLength=baseStats.bulletLength;
    enemy.bulletHomingStrength=baseStats.bulletHomingStrength;
    if (enemy.health>enemy.maxHealth){
        enemy.health=enemy.maxHealth;
    }
}
function findEnemyRoom(enemy){
    return enemyRooms.find((enemyRoom)=>undefined!=enemyRoom.enemies.find((enemyCheck)=>enemyCheck===enemy))
}
function findEnemyRoomIndex(enemy){
    return enemyRooms.findIndex((enemyRoom)=>undefined!=enemyRoom.enemies.find((enemyCheck)=>enemyCheck===enemy))
}
function moveParticles(){
    for (particle of particles){
        particle.moveParticle(particle);
    }
    for (particle of particlesToRemove){ //this is different from how the other lists do it, but it should be fine because nothing else will effect particles
        let index = particles.findIndex((passed)=>passed===particle);
        particles.splice(index,1);
    }
}
function giveAllPowerUps(){
    powerUpsGrabbed=[];
    minorPowerUpsGrabbed=[];
    powerUpSpace = eligibleMajorPowerUps.length;
    minorPowerUpSpace = eligibleMinorPowerUps.length;
    for (powerUp of eligibleMajorPowerUps){
        powerUpsGrabbed.push(newPowerUpPreset(powerUp));
    }
    for (powerUp of eligibleMinorPowerUps){
        minorPowerUpsGrabbed.push(newPowerUpPreset(powerUp.PFType));
    }
    upgrader.var2 = Math.max(eligibleMinorPowerUps.length,upgrader.var2);//makes space for all the power ups
    money=9999;
    showHUD.majorPowerUps=true;
    showHUD.minorPowerUps=true;
    showHUD.sellButton=true;
    showHUD.health=true;
}
function startGame(weaponChoice){
    if (wallsImport===''){
        generateRooms(targetNumOfRooms,10);
    }
    wallBoxes = generateWallBoxes(2,walls,wallBoxes);//after the room generates, the lag is so much if holding 'w' you can "teleport" into the first room
    for (enemyRoom of enemyRooms){
        for (enemy of enemyRoom.enemies){
            enemy.enemyRoom = enemyRoom;
        }
    }
    //eligibleMajorPowerUps = [0,1,2,3,5,6,7];
    //let eligibleMinorPowerUps = [9,10];
    let powerUps = findEligiblePowerUps();
    eligibleMajorPowerUps = powerUps.major;
    eligibleMinorPowerUps = powerUps.minor;
    switch(weaponChoice){
        case 0:
            //no weapon
        break
        case 1:
            //shotgun
            powerUpsGrabbed.push(newPowerUpPreset(6,false));
            //eligibleMajorPowerUps=[0,1,2,22,23];
        break
        case 2:
            //sniper
            powerUpsGrabbed.push(newPowerUpPreset(7,false));
            //eligibleMajorPowerUps=[0,1,2,22,23];
        break
        case 3:
            //bombs
            powerUpsGrabbed.push(newPowerUpPreset(2,false));
            //eligibleMajorPowerUps = [0,1,2,22,23,24];
        break
        case 4:
            //debug
            powerUpsGrabbed.push(newPowerUpPreset(32,false));
            //eligibleMajorPowerUps = [0,1,2,22,23,24];
        break
        case 9:
            //eligibleMajorPowerUps = [6,8,11,12,13,19,20,21,25,26,27,28,30,31,32,33,34];
            //eligibleMajorPowerUps = [0,1,2,22,23,24];
            //permanentMinorPowerUps.push(newPowerUpPreset(26,false));//this is just to get a look at how it will look
            powerUpSpace = eligibleMajorPowerUps.length;
            minorPowerUpSpace = eligibleMinorPowerUps.length;
            for (powerUp of eligibleMajorPowerUps){
                powerUpsGrabbed.push(newPowerUpPreset(powerUp));
            }
            for (powerUp of eligibleMinorPowerUps){
                minorPowerUpsGrabbed.push(newPowerUpPreset(powerUp.PFType));
            }
            money=1000;
        break
    }
    while (powerUpsGrabbed.length<powerUpSpace){
        powerUpsGrabbed.push(newPowerUpPreset(34,false));
    }
    switchMode(0);
}
function updateShopPos(){
    let firstEnemy = player.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
    if (firstEnemy===undefined&&player.enemyRoom.roomNum>1){
        let roomPos = turnRoomIntoRealPos(player.enemyRoom);
        let enemyRoomWalls=player.enemyRoom.walls;
        shop.x=roomPos.x+100;
        shop.y=roomPos.y+100;
        let shopWalls = [new newWall(0,40,100,40),new newWall(0,40,0,0),new newWall(0,0,100,0),new newWall(100,40,100,0),new newWall(0,20,100,20)]; //the 5th wall is in the middle and pushes you out so you don't get stuck inside the shop
        shopWalls = shiftWallsBy(shopWalls,100,170);
        let prospectWalls = shiftWallsBy(shopWalls,roomPos.x,roomPos.y);
        if (!(isSamePoint(enemyRoomWalls[0].first,prospectWalls[0].first)&&isSamePoint(enemyRoomWalls[0].second,prospectWalls[0].second))){
            for (let i=prospectWalls.length-1;i>=0;i--){ //it counts backwards so the first wall is added last/at the beginning of the list so the previous line sees it
                wall = prospectWalls[i];
                enemyRoomWalls.splice(0,0,wall);
            }
            for (pickUp of playerEnemyRoom.enemyPickUps){
                if (boundingBox(prospectWalls[1].second,prospectWalls[3].first,pickUp,0,0)){
                    pickUp.x = 50+roomPos.x+100;
                    pickUp.y = 50+roomPos.y+170;
                }
            }
        }
        if (boundingBox(addToPoint(shop,-5,115),addToPoint(shop,115,165),player,0,0)){
            shop.inShop=true;
        }else{
            shop.inShop=false;
        }
    }else{
        shop.x=Infinity;//this just makes it draw nowhere/offscreen
    }
}
function findPlayerGunAngle(){
    gunAngle=findAngle(mouseShifted,player);
    if (controller!=undefined){
        let movementTarget = dupPoint(player);
        let axes = controller.axes;
        let skipped = true
        if (Math.abs(axes[2])>.3){ //this adds a deadzone
            movementTarget.x+=axes[2];
            skipped = false;
        }
        if (Math.abs(axes[3])>.3){
            movementTarget.y+=axes[3];
            skipped = false;
        }
        if (skipped){
            movementTarget = addToPoint(movementTarget,Math.sin(shootingAngle),Math.cos(shootingAngle));
        }
        gunAngle = findAngle(movementTarget,player);
    }
    let closestAngle = Infinity;
    for (enemy of player.enemyRoom.enemies){
        if (enemy===player){
            continue;
        }
        if (enemy.team!=1){
            continue;//maybe change this so it also auto aims toward teammates(to shoot bombs)
        }
        let angle = findAngle(enemy,player);
        if (Math.abs(gunAngle-angle)<Math.abs(gunAngle-closestAngle)){
            closestEnemy = enemy;
            closestAngle = angle;
        }
    }
    if (Math.abs(gunAngle-closestAngle)<aimAssist){
        gunAngle=closestAngle;
    }
}
function updateEnemiesEnemyRoom(){
    for (enemyRoom of enemyRooms){
        for (enemy of enemyRoom.enemies){
            enemy.lastRoom=enemy.room;
            enemy.room = new newPoint((enemy.x+doorLength)/(roomWidth+(doorLength*2)),(enemy.y+doorLength)/(roomHeight+(doorLength*2)));
            if (enemy.enemyRoomEnemyLink===undefined){ //this is done in a completely different loop to make sure the link(usually the player) moves rooms before the things linked to it
                if ((!isSamePoint(floorPoint(enemy.lastRoom,1),floorPoint(enemy.room,1)))||enemy===player){
                    removeFromEnemyRooms(enemy);
                    addToEnemyRooms(enemy);
                }
            }
        }
    }
    for (enemyRoom of enemyRooms){
        for (enemy of enemyRoom.enemies){ //this might not work for a frame if there is an enemy linked to an enemy who is linked to yet another enemy
            if (enemy.enemyRoomEnemyLink!=undefined){
                let oldEnemyRoom = enemy.enemyRoom;
                let enemyIndex = oldEnemyRoom.enemies.findIndex((enemy2) => enemy===enemy2);
                if (enemyIndex!=-1){
                    oldEnemyRoom.enemies.splice(enemyIndex,1);
                }
                let enemyRoom = enemy.enemyRoomEnemyLink.enemyRoom;
                if (undefined===enemyRoom.enemies.find((enemyCheck)=>enemyCheck===enemy)){
                    enemyRoom.enemies.push(enemy);
                    enemy.enemyRoom = enemyRoom;
                }
            }
        }
    }
}
let playerEnemyRoom = null;
let timeSpentInRoom = 0;
let background = '#FFFFFF';
let screenTint = {color:'white',opacity:0};
let flippedControls = false;
let doBulletWallCollision = true;
let drawEnemyCheck = function(enemy){
    return true;
}
let playerNoStop = false;
function challengeRooms(){
    timeSpentInRoom+=deltaTime;
    if (playerEnemyRoom!=player.enemyRoom){
        playerEnemyRoom = player.enemyRoom;
        timeSpentInRoom = 0;
    }
    challengeRoom = playerEnemyRoom.challengeRoom
    if (timeSpentInRoom<60){
        if (((playerEnemyRoom.roomNum%10)===1||(beatGame&&(playerEnemyRoom.roomNum%5)===1))&&playerEnemyRoom.roomNum!=1){
            addAutoRect(new newPoint(c.width/2,(c.height/2)-50),['ENEMY DAMAGE UP'],'48px Courier New',undefined,false,true);
        }
        if (challengeRoom!=0){
            addAutoRect(new newPoint(c.width/2,(c.height/2)+20),['GLITCHED ROOM'],'48px Courier New',undefined,false,true);
        }
    }
    flippedControls=false;
    doBulletWallCollision = true;
    drawEnemyCheck = function(enemy){
        return true;
    }
    playerNoStop=false;
    background = '#FFFFFF';
    screenTint = {color:'white',opacity:0};
    let firstEnemy = playerEnemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
    if (firstEnemy!=undefined){ //makes the challenges stop once you beat a room
        switch(challengeRoom){ //0 means no challenge room
            case 1:
                playerEnemyRoom.timer1-=deltaTime;
                if (playerEnemyRoom.timer1<-25){
                    playerEnemyRoom.timer1=25;
                    for (let i=0;i<10;i++){
                        let spawnPoint = randomPosInRoom(playerEnemyRoom,10);//the 10 is the size of the bomb
                        let bomb = newEnemyPreset(spawnPoint,36,0,undefined,playerEnemyRoom.enemies[1].damage/*first enemy is player, so this enemy is not the player and tells the bombs the damage of the room*/,spawnPoint);
                        bomb.originalCopy.gunCoolDownMax=30;
                        bomb.gunCoolDownMax=bomb.originalCopy.gunCoolDownMax;
                        bomb.gunCooldown=bomb.gunCoolDownMax;
                        bomb.team=1;//the enemies team
                        playerEnemyRoom.enemies.push(bomb);
                    }
                }
            break
            case 2:
                if ((timeSpentInRoom%60)>40){
                    deltaTime*=3;
                }else{
                    deltaTime/=3;
                }
            break
            case 3:
                drawEnemyCheck = function(enemy){
                    return enemy.PFType!=1;
                }
            break
            case 4:
                for (powerUp of powerUpsGrabbed){
                    powerUp.range/=4;
                }
            break
            case 5:
                player.size*=2;
            break
            case 6:
                deltaTime*=2;//speeds up time by 2. This might speed up things not meant to speed up like timer
            break
            //unused challenges
            case 1:
                if ((!player.inDoorWay)&&(timeSpentInRoom>10)){
                    flippedControls=true; //controlls are flipped. this is handled in the player's script
                }
            break 
            case 1:
                drawEnemyCheck = function(enemy){ //bad. can't see pink enemies. maybe make all enemies have particles when they move
                    return enemy.team===0;
                }
            break
            case 1:
                doBulletWallCollision = false; //bullets can go through walls
            break
            case 1: //icey. Not finished, needs to affect player controls
                screenTint.color = '65E1FF';
                screenTint.opacity = .3;
            break
            case 1://lights out
                background = '#1E1E1E'; //maybe bad as the player can't see much. Maybe make more mechanics that make lights out work better
            break
            case 1:
                drawEnemyCheck = function(enemy){
                    return false;
                }
            break
            case 1:
                playerNoStop=true;
            break
        }
    }
}
let frameNum = 0;
let enemiesToRemove = [];
let bulletsToRemove = [];
let particlesToRemove = [];
let gunAngle = 0;
let pressedLastFrame=false;
function repeat(){
    frameNum++;
    mouseShifted.x=((mouse.x+10)/cam.zoom)+(cam.x);
    mouseShifted.y=((mouse.y/cam.zoom)+cam.y);
    if (screenShake>0){
        screenShake-=deltaTime;
    }
    enemiesToRemove=[];
    bulletsToRemove=[];
    particlesToRemove=[];
    if (keysUsed['8']&&devMode){
        let portal = newEnemyPreset(new newPoint(0,0),13,0,'',0,player);
        portal.effect(player,portal,enemiesToRemove);
    }
    if (devMode){
        player.health=player.maxHealth;
    }
    if (keysToggle['l']&&devMode){
        powerUpsGrabbed = [newPowerUpPreset(7,false),newPowerUpPreset(38,false)];
        minorPowerUpsGrabbed.splice(0,5,newPowerUpPreset(20),newPowerUpPreset(33),newPowerUpPreset(33),newPowerUpPreset(33),newPowerUpPreset(33));
        player.health=player.maxHealth;
        money=9999;
        showHUD.majorPowerUps=true;
        showHUD.minorPowerUps=true;
        showHUD.health=true;
        showHUD.sellButton=true;
    }
    if (keys['9']&&devMode){
        giveAllPowerUps();
    }
    updatePlayerStats();
    challengeRooms();
    findPlayerGunAngle();
    moveBullets(bulletsToRemove);
    if ((frameNum%targetRenderFPS)===0){
        PFBoxes=[];
    }
    /*for (enemy of enemies){
        enemy.lastPosition=dupPoint(enemy);
        //enemy.enemyRoom=mainEnemyRoom;
    }*/
    enemyMovement(enemiesToRemove);
    updateShopPos();
    if (!(keysToggle['n']&&devMode)){
        fullEnemyWallColl();
        if (!keys['t']){
            enemyCollisionEffects(enemiesToRemove);
            enemyCollision(enemiesToRemove);
        }
        fullEnemyWallColl();
    }
    updateEnemiesEnemyRoom();
    gunEnemyMovement(player);
    //drawBullets(cam,false);
    moveParticles();
    if ((!(keysToggle['n']&&devMode))&&doBulletWallCollision){
        bulletWallCollision(bulletsToRemove);
    }
    for (enemyToRemove of enemiesToRemove){
        enemyToRemove.deleted=true; //this may need to go inside the if statement
        removeFromEnemyRooms(enemyToRemove);
        /*let enemyIndex = enemies.findIndex((passed)=>passed===enemyToRemove);
        if (enemyIndex!=-1){
            enemies.splice(enemyIndex,1);
        }*/
    }
    for (bulletToRemove of bulletsToRemove){
        if (bulletToRemove.deleted===false){ //deleted might not actually be needed, but I'm too scared to remove it
            bulletToRemove.deleted=true;
            let index = bullets.findIndex((passed)=>passed===bulletToRemove);
            if (index!=-1){
                bullets.splice(index,1);
            }
        }
    }
    bulletEnemyCollision();
    //sheildEnemyCollision();
    for (let i=0;i<bullets.length;i++){
        bullet =bullets[i];
        if (bullet.enemiesLeft<1){
            bullets.splice(i,1);
            i--;
        }
    }
    //this bool says whether or not to follow the player
    if (screenShake>screenShakeLimit){
        screenShake=screenShakeLimit;
    }
    //updatePlayerStats();
    if (player.health>player.maxHealth){
        player.health=player.maxHealth;
    }
    camControl(true,player,false,false,keys['z']||frameNum===1,screenShake);
    //10 is added because if I didn't the mouse position would be slightly different from what it looks like
    //mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
    if (keysUsed['h']&&devMode){
        keysUsed['h']=false;
        player.x=mouseShifted.x;
        player.y=mouseShifted.y;
        player.lastPosition.x=mouseShifted.x;
        player.lastPosition.y=mouseShifted.y;
        buttons.push(rerollButton,skipButton);
    }
    if (player.health<=0){
        for (let i=0;i<40;i++){
            particles.push(new newParticle(player.x,player.y,7,player.defaultColor,0,new newPoint((Math.random()-.5)*20,(Math.random()-.5)*20),1.05));
        }
        timerGo = false;
        //enemiesToRemove.push(player);
        player.size=0;
        switchMode(6);
    }
}
function switchMode(modeTarget){
    if (modeTarget===8){
        showHUD.majorPowerUps=true;
    }
    if (modeTarget===mode&&modeTarget!=0){
        switchMode(0);
    }else if(modeTarget===0){
        if (mode===3){
            let spawnerExport = null;
            console.log(JSON.stringify({walls:walls,spawnPoints:editorSpawnPoints}));
            spawnerExport=updateTilesList(editorSpawnPoints,spawnerExport);
            walls=wallsCopy;
            wallBoxes = generateWallBoxes(2,walls,wallBoxes);
        }else if (mode===8&&playerEnemyRoom.roomNum===0&&!beatGame){ //counts out boss rush
            buttons.push(rerollButton,skipButton);
        }
        mode=0;
    }else if (modeTarget===3){
        if (mode!=4&&mode!=5){
            wallsCopy=walls;
            walls=[];
            editorSpawnPoints=[];
        }
        mode=3;
        wallBoxes = generateWallBoxes(2,walls,wallBoxes);
    }else if (modeTarget===1&&mode===3){
        mode=4;
        //importWalls(basicRoomTemplate,walls);
        wallBoxes = generateWallBoxes(2,walls,wallBoxes);
    }else if (modeTarget===1&&mode===4){
        switchMode(5);
    }else if(modeTarget===1&&mode===5){
        switchMode(4);
    }else if (modeTarget===2){
        mode=2;
        camTarget=dupPoint(player);
    }else{
        mode=modeTarget;
    }
}
let controllerXLastFrame = false;
function updateControllerMouse(){
    mouse.x=Math.max(Math.min(c.width-20,mouse.x),0);
    mouse.y=Math.max(Math.min(c.height-10,mouse.y),10);
    if (controller.buttons[1].pressed){
        if (!controllerXLastFrame){
            mouse.show=!mouse.show;
        }
        controllerXLastFrame=true;
    }else{
        controllerXLastFrame=false;
    }
    if (mouse.show){
        if (controller.buttons[7].pressed||controller.buttons[6].pressed){
            if (!pressedLastFrame){
                mousePressed = true;
                mouseClickUsed = true;
            }
            pressedLastFrame=true;
        }else{
            pressedLastFrame=false;
        }
    
        let axes = controller.axes;
        if (Math.abs(axes[2])>.1){ //this adds a deadzone
            mouse.x+=axes[2]*30*deltaTime;
        }
        if (Math.abs(axes[3])>.1){
            mouse.y+=axes[3]*30*deltaTime;
        }
    }
}
function repeat2(){
    if (timerGo){
        timer+=deltaTime;
    }
    if (controller!=undefined){
        updateControllerMouse();
    }
    if (mode!=1){
        circlesToDraw = [];
    }
    rectsToDraw = [];
    if (keysUsed['6']&&keys['7']){
        devMode=!devMode;
    }
    keysUsed['6']=false;
    if (keysUsed['m']&&devMode){
        keysUsed['m']=false;
        switchMode(2);
    }
    if (keysUsed['p']&&devMode){
        keysUsed['p']=false;
        switchMode(1);
    }
    if (keysUsed['r']&&devMode&&mode!=6){
        keysUsed['r']=false;
        switchMode(3);
    }
    if (mode===0||mode===4){
        repeat();
        renderEverything(keys['g']&&devMode,cam);
        drawHUD();
        if (controller!=undefined&&mouse.show){
            drawMouse();
        }
    }else if (mode===1||mode===5){
        if (keysUsed['o']){
            bulletsToRemove=[];
            circlesToDraw = [];
            repeat();
            renderEverything(false,cam);
            drawHUD();
            keysUsed['o']=false;
        }else{
            renderEverything(false,cam);
            drawHUD();
        }
    }else if (mode===2){
        let camSpeed=10;
        if (keys[' ']){
            camSpeed*=10;
        }
        if(keys['w']){
            camTarget.y-=camSpeed;
        }
        if(keys['s']){
            camTarget.y+=camSpeed;
        }
        if(keys['a']){
            camTarget.x-=camSpeed;
        }
        if(keys['d']){
            camTarget.x+=camSpeed;
        }
        camControl(false,camTarget);
        //mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
        mouseShifted.x=((mouse.x+10)/cam.zoom)+(cam.x);
        mouseShifted.y=((mouse.y/cam.zoom)+cam.y);
        editor();
        renderEverything(false,cam);
        updateWallsList(walls);
        updateTilesList(savedwallBoxes,tilesExport);
    }else if (mode===3){
        let camSpeed=10;
        if (keys[' ']){
            camSpeed*=10;
        }
        if(keys['w']){
            camTarget.y-=camSpeed;
        }
        if(keys['s']){
            camTarget.y+=camSpeed;
        }
        if(keys['a']){
            camTarget.x-=camSpeed;
        }
        if(keys['d']){
            camTarget.x+=camSpeed;
        }
        camControl(false,camTarget);
        //mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
        mouseShifted.x=((mouse.x+10)/cam.zoom)+(cam.x);
        mouseShifted.y=((mouse.y/cam.zoom)+cam.y);
        if (keysUsed['b']){
            keysUsed['b']=false;
            if (walls.length<1){
                walls=[];
                importWalls(basicRoomTemplate,walls);
            }else{
                walls=[];
            }
        }
        editor();
        renderEverything(!keysToggle['i'],cam);
        updateWallsList(walls);
        updateTilesList(savedwallBoxes,tilesExport);
    }else if (mode===6){
        //camControl(true,player,false,!false,keys['z'],0);
        moveParticles();
        renderEverything(false,cam);
        drawHUD();
        ctx.fillStyle='#000000';
        ctx.font = '48px Courier New';
        let deathMessage = 'You Died! Press R To Play Again!';
        let metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(c.height/2));
        ctx.font = '32px Courier New';
        deathMessage = 'You Got All The Way To Room '+player.enemyRoom.roomNum;
        if (beatGame){
            deathMessage+=' in the Boss Rush!';
        }else{
            deathMessage+='!';
        }
        metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(2.5*c.height/4));
        if (keys['r']){
            location.reload(); //this isn't a great way to do it. better would be to reset all the values so it doesn't have to actually reload
        }
    }else if (mode===7){
        //weapon select menu
        camControl(true,player,false,!false,keys['z'],screenShake);
        ctx.font='48px Courier New';
        ctx.fillText('Press a number to chose a weapon',(c.width/4),(c.height/4));
        ctx.font='30px Courier New';
        ctx.fillText('Press 1 to use The Shotgun',(c.width/16),(c.height/2));
        ctx.fillText('Press 2 to use The Sniper',(c.width/3),(c.height/2));
        ctx.fillText('  Press 3 to use Grenade Gun',(2*(c.width/3)),(c.height/2));
        //add a little image of the weapon below it
        if (keys['1']||(mouseClickUsed&&mouse.x<c.width/3)){
            startGame(1);
        }
        if (keys['2']||(mouseClickUsed&&mouse.x>c.width/3&&mouse.x<(2*c.width/3))){
            startGame(2);
        }
        if (keys['3']||(mouseClickUsed&&mouse.x>(2*c.width/3))){
            startGame(3);
        }
        if (keys['4']&&devMode){
            startGame(4);
        }
        if (keys['9']&&devMode){
            startGame(9);
        }
    }else if(mode===8){
        /*if (controller!=undefined){
            if (controller.buttons[7].pressed||controller.buttons[6].pressed){
                mousePressed = true;
                mouseClickUsed = true;
            }
        }*/
        camControl(true,player,false,true,false,0);
        moveParticles();
        if (keys['9']&&devMode){
            giveAllPowerUps();
        }
        updatePlayerStats();
        renderEverything(false,cam);
        if (particles.length===0){
            powerUpSelect();
        }
        drawHUD();
        if (controller!=undefined&&mouse.show){
            drawMouse();
        }
    }
    if (keysToggle['1']){ //the timer
        ctx.fillStyle='black';
        ctx.font = '32px Courier New';
        let seconds = roundTo2((timer/30)%60,100);
        let minutes = Math.floor((timer/30)/60);
        if (seconds===Math.round(seconds)){
            seconds+='.0';
        }
        if (seconds<10){
            seconds = '0'+seconds;
        }
        ctx.fillText(minutes+':'+seconds,250,c.height-10);
    }
}
let timer = 0;
let deltaTime = 0;
let previousFps = [];
let computingStartTime = 0;
function repeat3(){
    computingStartTime = Date.now();
    ctx.clearRect(0,0,c.width,(c.height-HUDHeight));
    repeat2();
    deltaTime = (Date.now()-startTime)/(1000/targetFPS);
    if ((Math.abs(1-screenSize)<.3)&&devMode){ //this just makes it so if the screen is deformed, it just won't draw the debug info
        ctx.fillStyle='black';
        ctx.font = '24px serif';
        ctx.fillText('deltaTime:'+roundTo2(deltaTime,100),1200,20);
        ctx.fillText('target com time:'+Math.round(1000/targetRenderFPS),1000,20);
        ctx.fillText('computing Time:'+(Date.now()-computingStartTime),1000,45);
    }
    startTime = Date.now();
    mouseClickUsed=false;
}
let startTime = Date.now();
//Example of a deep clone
//let oldWalls = JSON.parse(JSON.stringify(walls))
const targetFPS = 30;
const targetRenderFPS = 60;
startGame(0);//this is to skip the rest and start you with no weapon
setInterval(repeat3,1000/targetRenderFPS);