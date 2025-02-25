let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
c.style.margin = "30px 10px";
let keys = {};
let keysUsed = {};
let keysToggle = {};
document.addEventListener('keydown', (event) => {
    //remember when using this to set the thing to false after used
    let keyPressed = event.key.toLowerCase();
    if (!keys[keyPressed]){
        keysUsed[keyPressed] = true;
        keysToggle[keyPressed] = !keysToggle[keyPressed];
    }
    keys[keyPressed]=true;
});
document.addEventListener('keyup', (event) => {
    let keyPressed = event.key.toLowerCase();
    keys[keyPressed]=false;
});
let buttonsArray = [false, false, false, false, false, false, false, false, false];
let mousePressed = false;
let mouseClickUsed = true;
document.onmousedown = function(e) {
    buttonsArray[e.button] = true;
    mousePressed = true;
    mouseClickUsed = false;
};
document.onmouseup = function(e) {
    buttonsArray[e.button] = false;
    mousePressed = false;
};
class newPoint {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}
class newPathBox {
    constructor(x,y,gCost,hCost,fCost,parent,inOpenList){
        this.x=x;
        this.y=y;
        this.gCost=gCost;
        this.hCost=hCost;
        this.fCost=fCost;
        this.parent=parent;
        this.inOpenList=inOpenList;
    }
}
class newEnemy {
    constructor(x,y,speed,size,color,PFType,target,gunCoolDownMax,health,label,effect,bulletSpreadNum,shotSpread,bulletKillPower,maximumInvinceable){
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.size=size;
        this.defaultColor=color;
        this.color=color;
        this.PFType=PFType;
        this.room= new newPoint((x+doorLength)/(roomWidth+(doorLength*2)),(y+doorLength)/(roomHeight+(doorLength*2)));
        this.lastRoom=new newPoint(0,0);
        this.gunCoolDownMax=gunCoolDownMax;
        //this.gunCooldown=Math.floor(((Math.random()/2)+.5)*gunCoolDownMax);
        this.gunCooldown=Math.floor(Math.random()*gunCoolDownMax);
        this.health=health;
        this.lastPosition=new newPoint(x,y);
        this.maxHealth = health;
        if (effect===undefined){
            effect=function(){}
        }
        this.effect = effect;
        if (bulletSpreadNum===undefined){
            bulletSpreadNum=1;
        }
        this.bulletSpreadNum = bulletSpreadNum;
        if (shotSpread===undefined){
            shotSpread=1;
        }
        this.shotSpread=shotSpread;
        if(bulletKillPower===undefined){
            bulletKillPower=1;
        }
        this.bulletKillPower=bulletKillPower
        //this.maximumInvinceable=30;
        //this.maximumInvinceable=0;
        if (maximumInvinceable===undefined){
            maximumInvinceable=0;
        }
        this.maximumInvinceable=maximumInvinceable;
        this.invinceable=0;
        if (label===undefined){
            label = '';
        }
        this.label=label;
        this.targetSpeed=speed;
        if (target===undefined){
            target = enemies[0];
        }
        this.target = target;
        let team=1;
        if (target===enemies[0]){
            if (PFType===6||PFType===14){
                team=2;
            }
            if (PFType===1){
                team=0;
            }
        }else{
            team=0;
        }
        this.team=team;
    }
}
function newEnemyPreset(pos,PFType,power,message,enemyPower,target){
    let enemy = null;
    if (message===undefined){
        message='';
    }
    switch (PFType){
        case 0:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower),20,'pink',0,target,60,1+(enemyPower*3),'',function(touchedEnemy,thisEnemy,enemiesToRemove,alreadyRan){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2){
                    /*let enemyRoom = enemyRooms.find((room)=>sameRoomPos(room,turnIntoRoomPos(thisEnemy)));
                    console.log(enemyRoom);
                    enemyWallCollision(enemyRoom);
                    if (alreadyRan===undefined){
                        if (findDis(thisEnemy,touchedEnemy)<(thisEnemy.size+touchedEnemy.size)){
                            thisEnemy.effect(touchedEnemy,thisEnemy,enemiesToRemove,true);
                        }
                    }else{*/
                        touchedEnemy.health--;
                        touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                    //}
                }
            });
        break
        case 1:
            enemy =new newEnemy(pos.x,pos.y,10,20,'blue',1,target,30,5,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (dashFramesLeft>0&&touchedEnemy.invinceable<1&&touchedEnemy.team!=thisEnemy.team){
                    touchedEnemy.health--;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+dashFramesLeft+1;
                    touchedEnemy.color='red';
                }
            },1,1.5,1,15);
        break
        case 2:
            enemy = new newEnemy(pos.x,pos.y,0,20,'black',2,target,75-(enemyPower),2+(enemyPower/2),'');
        break
        case 3:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/2),20,'grey',3,target,30-(enemyPower*2.5),3+(enemyPower/5),'');
        break
        case 4:
            enemy = new newEnemy(pos.x,pos.y,3,20,'green',4,target,45-(enemyPower*3),1+(enemyPower),'');
        break
        case 5:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/3),20,'lime',5,target,70-(enemyPower*3),1+(2*Math.pow(2,enemyPower/4)),'');
        break
        //here speed will be used as a placeholder for power
        case 6:
            enemy = new newEnemy(pos.x,pos.y,power,0,'yellow',6,target,Infinity,Infinity,'Increases Health',function(touchedEnemy,thisEnemy,enemiesToRemove){
                touchedEnemy.maxHealth+=thisEnemy.targetSpeed;
                touchedEnemy.health+=thisEnemy.targetSpeed+2;
                enemiesToRemove.push(thisEnemy);
                if (touchedEnemy.health>touchedEnemy.maxHealth){
                    touchedEnemy.health=touchedEnemy.maxHealth;
                }
            })
        break
        case 7:
            enemy = new newEnemy(pos.x,pos.y,power,10,'yellow',6,target,Infinity,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                //gunMaxCoolDown is a timer until it despawns on this one
                if (touchedEnemy.PFType===1){
                    touchedEnemy.health+=1;
                    enemiesToRemove.push(thisEnemy);
                    if (touchedEnemy.health>touchedEnemy.maxHealth){
                        touchedEnemy.health=touchedEnemy.maxHealth;
                    }
                }
            })
        break
        case 8:
            enemy = new newEnemy(pos.x,pos.y,power,0,'gray',6,target,Infinity,Infinity,'Reduces Gun Cooldown',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (thisEnemy.targetSpeed===1){
                    touchedEnemy.gunCoolDownMax/=1.25;
                }else{
                    touchedEnemy.gunCoolDownMax/=1.5;
                }
                enemiesToRemove.push(thisEnemy);
            })
        break
        case 9:
            enemy = new newEnemy(pos.x,pos.y,power,0,'black',6,target,Infinity,Infinity,'Shoot More Bullets',function(touchedEnemy,thisEnemy,enemiesToRemove){
                touchedEnemy.bulletSpreadNum+=thisEnemy.targetSpeed;
                enemiesToRemove.push(thisEnemy);
            })
        break
        case 10:
            enemy = new newEnemy(pos.x,pos.y,2+(enemyPower),20,'magenta',10,target,60-(enemyPower*2),4);
        break
        case 11:
            enemy = new newEnemy(pos.x,pos.y,power,0,'orange',6,target,Infinity,Infinity,'Reduce Bullet Spread',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (enemy.targetSpeed===1){
                    touchedEnemy.shotSpread/=1.25;
                }else{
                    touchedEnemy.shotSpread/=1.5;
                }
                enemiesToRemove.push(thisEnemy);
            })
        break
        case 12:
            enemy = new newEnemy(pos.x,pos.y,power,0,'red',6,target,Infinity,Infinity,'Kills More Enemies',function(touchedEnemy,thisEnemy,enemiesToRemove){
                touchedEnemy.bulletKillPower++;
                enemiesToRemove.push(thisEnemy);
            })
        break
        case 13:
            enemy = new newEnemy(pos.x,pos.y,power,0,'blue',6,target,Infinity,Infinity,'Increases Speed',function(touchedEnemy,thisEnemy,enemiesToRemove){
                touchedEnemy.targetSpeed+=2;
                enemiesToRemove.push(thisEnemy);
            })
        break
        case 14:
            //placeholder for text
            enemy = new newEnemy(pos.x,pos.y,0,0,'white',14,target,Infinity,Infinity,message);
        break
        case 15:
            //boss
            enemy = new newEnemy(pos.x,pos.y,3,40,'black',4,target,45-(enemyPower*5),1+(2*Math.pow(2,enemyPower/2)),'',undefined,Math.floor(enemyPower/1.5));
        break
        case 16:
            //money
            enemy = new newEnemy(pos.x,pos.y,0,10,'green',6,target,Infinity,Infinity,'$',function(touchedEnemy,thisEnemy,enemiesToRemove){
                money++;
                enemiesToRemove.push(thisEnemy);
            });
        break
        case 17:
            enemy = new newEnemy(pos.x,pos.y,2+(enemyPower/2),20,'turquoise',17,target,45-(enemyPower*3),1+(2*Math.pow(2,enemyPower/5)),'');
        break
        case 18:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower*1.5),20,'#800020',0,target,60,1+(enemyPower),'',function(touchedEnemy,thisEnemy,enemiesToRemove,alreadyRan){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy===thisEnemy.target)){
                    /*let enemyRoom = enemyRooms.find((room)=>sameRoomPos(room,turnIntoRoomPos(thisEnemy)));
                    console.log(enemyRoom);
                    enemyWallCollision(enemyRoom);
                    if (alreadyRan===undefined){
                        if (findDis(thisEnemy,touchedEnemy)<(thisEnemy.size+touchedEnemy.size)){
                            thisEnemy.effect(touchedEnemy,thisEnemy,enemiesToRemove,true);
                        }
                    }else{*/
                        touchedEnemy.health--;
                        touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                    //}
                }
            });
        break
        case 19:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#EE4B2B',6,target,Infinity,Infinity,'Reduce Dash Cooldown',function(touchedEnemy,thisEnemy,enemiesToRemove){
                maximumDashCoolDown/=1.5;
                enemiesToRemove.push(thisEnemy);
            })
        break
    }
    return enemy
}
class newBullet {
    constructor(x,y,speed,direction,color,tailLength,visualWidth,type,maximumTime,enemyKillPower,lastPosition,owner){
        this.x=x;
        this.y=y;
        this.speed=speed;
        this.direction=direction;
        this.color=color;
        this.type=type;
        this.tailLength=tailLength;
        this.visualWidth=visualWidth;
        this.realWidth=0;
        this.maximumTime=maximumTime;
        this.timeLeft=maximumTime;
        this.enemyKillPower=enemyKillPower;
        this.enemiesLeft = enemyKillPower;
        this.owner = owner;
        if (lastPosition===undefined){
            this.lastPosition=new newPoint(owner.x-Math.sin(direction)*(speed-enemy.size-30),owner.y-Math.cos(direction)*(speed-enemy.size-30));
        }else{
            this.lastPosition=lastPosition;
        }
    }
}
let mouse = new newPoint(0,0);
let mouseShifted = mouse;
document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    let eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    mouse.x = event.pageX-30;
    mouse.y = event.pageY-40;
}
class newWall {
    constructor(x1,y1,x2,y2){
        this.first = new newPoint(x1,y1);
        this.second = new newPoint(x2,y2);
    }
}
//wallsExport is to be able to export and import "walls" as a string, not an array of objects
//I could've just used JSON.stringify and JSON.parse
let wallsExport = '';
let tilesExport = '';
//let wallsImport = ",50.700.50.50,1350.700.50.700,1350.50.1350.700,50.50.1350.50,350.550.350.50,550.250.550.700,450.300.350.550,350.50.450.300,400.550.550.250,550.700.400.550,600.50.400.150,850.550.600.50,750.550.750.700,800.450.800.50,900.50.850.550,1150.600.850.550,900.50.1150.600";
//let wallsImport = ",650.0.0.0,1400.0.750.0,0.300.0.0,0.750.0.450,650.750.0.750,1400.750.750.750,1400.450.1400.750,1400.0.1400.300";
let basicRoomTemplate = ',0.0.600.0,700.0.1300.0,600.0.600.-50,700.0.700.-50,1300.0.1300.275,1300.375.1300.650,1300.275.1350.275,1300.375.1350.375,0.650.600.650,700.650.1300.650,600.650.600.700,700.650.700.700,0.0.0.275,0.375.0.650,0.275.-50.275,0.375.-50.375';
let wallsImport = '';
//let tilesImport = ",665.-35,700.-35,0.315,0.350,0.385,665.735,700.735,1400.315,1400.350,1400.385";
let tilesImport = "";
//,100.310.200.310
//,450.350.600.350,600.300.600.350,600.250.600.300,450.250.600.250,700.350.700.250,850.250.700.250,850.350.700.350,700.250.700.300,700.350.700.300,850.350.700.350
let roomOptionsImport = '//,800.100.500.100,100.450.100.200,1200.450.1200.200,800.550.500.550,350.250.350.150,350.500.350.400,950.250.950.150,950.500.950.400/,550.200.550.650,800.450.800.0,1000.550.1000.300,350.450.350.100,350.450.100.450/,850.400.850.650,450.500.450.650,450.400.450.250,200.250.850.250,200.400.200.250,200.500.0.500,1050.400.850.400,850.100.850.250,400.0.400.150';
let spawnPointsImport = '///,300.400,500.600,1150.150,1150.600/,950.500,100.600,350.300,450.50,1250.50,100.100,700.150';
let roomOptions = [];
let walls = [];
let editorSpawnPoints = [];
let shop = new newPoint(Infinity,Infinity);
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
let cam = {
    x:0,
    y:0,
    zoom:1
}
let screenShake=0;
let screenSize=1;
//cam.zoom=Math.min(c.height/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
//cam.zoom=Math.min(window.innerHeight/((doorLength*2)+roomHeight),window.innerWidth/((doorLength*2)+roomWidth));
let money = 0;
let savedwallBoxes = [];
function importRoomOptions(){
    let roomOptionsStrings = roomOptionsImport.split('/');
    let spawnOptionsStrings = spawnPointsImport.split('/');
    roomOptionsStrings.splice(0,1);
    spawnOptionsStrings.splice(0,1);
    //It will do the amount of room options, not matter how many rooms worth of spawn points there are
    for (let j=0;j<roomOptionsStrings.length;j++){
        let wallsStrings = roomOptionsStrings[j].split(',');
        //this might cause issues if there are more wall options than spawn options
        let spawnStrings = spawnOptionsStrings[j].split(',');
        wallsStrings.splice(0,1);
        spawnStrings.splice(0,1);
        let roomWalls = [];
        let spawnPoints = []
        for (let i = 0; i<wallsStrings.length;i++){
            let wallsValues = wallsStrings[i].split('.');
            roomWalls.push(new newWall(Number(wallsValues[0]),Number(wallsValues[1]),Number(wallsValues[2]),Number(wallsValues[3])));
        }
        for (let i = 0; i<spawnStrings.length;i++){
            let spawnValues = spawnStrings[i].split('.');
            spawnPoints.push(new newPoint(Number(spawnValues[0]),Number(spawnValues[1])));
            //editorSpawnPoints.push(new newPoint(Number(spawnValues[0]),Number(spawnValues[1])));
        }
        roomOptions.push({walls:roomWalls,spawnPoints:spawnPoints});
    }
}
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
importRoomOptions();
let dashSpeed = null;
let circlesToDraw = [];
let bullets = [];
let changePlayerColor = false;
let mode =0;
/*modes:
0:normal gameplay
1:The game is paused and goes by 1 full frame at a time
2:editor mode
3:room editor mode
4:Maybe add a function by function step mode
*/
/*PFTypes:
0:move towards straight in the direction of the player
1:The player's controls, moves with the botton inputs
2:placeholder and should never move
3:Actual pathfinding using the aStar algoritm
4:basic PFType 0, but shoots when it has a clear line of sight
5:basic PFType 3, but shoots when it has a clear line of sight

6:Health power up
*/
let enemies = [];
let enemyRooms = [];
let wallsCopy = [];
/*let player = {
    x:roomWidth/2,
    y:roomHeight,
    speed:null,
    size:20,
    color:'brown',
}*/
//this is the player
enemies.push(newEnemyPreset(new newPoint(roomWidth/2,roomHeight-200),1));
let maximumDashCoolDown = 20;
let dashCooldown = 0;
//enemies.push(new newEnemy(roomWidth/2,roomHeight,null,20,'brown',1,2,5));
let camTarget = new newPoint(c.width/2,c.height/2);
let collisionRepeat = 1;
let lastMousePos = null;
let knobs = ['bullet speed','enemy speed','enemy health','enemy size','bullet width','reload speed','num bullets in shot spread','bullet volley num','bullet damage','invincable time','slowing bullets','bullet range','pathfinding','homing bullets'];
function findKnob(){
    return knobs[Math.floor(Math.random()*knobs.length)]
}
function addToPoint(point,addX,addY){
    return new newPoint(point.x+addX,point.y+addY)
}
function addTwoPoints(point1,point2){
    return new newPoint(point1.x+point2.x,point1.y+point2.y)
}
function multiplyPoints(point1,point2){
    return new newPoint(point1.x*point2.x,point1.y*point2.y)
}
function multiplyPoint(point,multiplier){
    return new newPoint(point.x*multiplier,point.y*multiplier)
}
function subtractFromPoint(point1,point2){
    return new newPoint(point1.x-point2.x,point1.y-point2.y)
}
function subtractNumFromPoint(point,num){
    return new newPoint(point.x-num,point.y-num)
}
function findDis(point1,point2){
    return Math.sqrt(Math.pow((point1.x-point2.x),2)+Math.pow((point1.y-point2.y),2))
}
function isSamePoint(point1,point2){
    return point1.x===point2.x&&point1.y===point2.y
}
function dupPoint(point){
    return new newPoint(point.x,point.y);
    //This duplicates the point to create immutibility idk
}
function absPoint(point){
    return new newPoint(Math.abs(point.x),Math.abs(point.y))
}
function findAngle(point1,point2){
    let value = Math.asin(Math.abs(point1.x-point2.x)/findDis(point1,point2));
    if (point1.y<point2.y){
        value= Math.PI/2+(Math.PI/2-value)
    }
    if (point1.x<point2.x){
        value= -value
    }
    if (isNaN(value)){
        return 0
    }else{
        return value
    }
}
function roundTo(num,divisor){
    return Math.round(num / divisor)*divisor
}
function roundTo2(num,multiplier){
    return Math.round(num * multiplier)/multiplier
}
function floorTo(num,divisor){
    return Math.floor(num / divisor)*divisor
}
function floorPoint(point,divisor){
    if (divisor===undefined){
        divisor=1;
    }
    return new newPoint(Math.floor(point.x / divisor)*divisor,Math.floor(point.y / divisor)*divisor)
}
function roundPoint(point,divisor){
    return new newPoint(Math.round(point.x / divisor)*divisor,Math.round(point.y / divisor)*divisor)
}
function boundingBox(point1,point2,check,extraX,extraY){
    //is, "check," inside box specified by point 1 and 2
    //'extra' makes the bounding box bigger by the specified amount
    let xUpperBound = Math.max(point1.x, point2.x)+extraX;
    let xLowerBound = Math.min(point1.x, point2.x)-extraX;
    let yUpperBound = Math.max(point1.y, point2.y)+extraY;
    let yLowerBound = Math.min(point1.y, point2.y)-extraY;
    if (check.x>xLowerBound&&check.x<xUpperBound&&check.y>yLowerBound&&check.y<yUpperBound){
        return true
    }
}
function turnIntoRoomPos(point){
    return new newPoint((point.x+doorLength)/(roomWidth+(doorLength*2)),(point.y+doorLength)/(roomHeight+(doorLength*2)))
}
function sameRoomPos(point,roomPos){
    return isSamePoint(floorPoint(point,1),floorPoint(roomPos,1))
}
function drawCircle(x,y,color,doNotFollowCam,size){
    ctx.save();
    ctx.strokeStyle=color;
    ctx.beginPath();
    let trueSize=5
    if (size!=undefined){
        trueSize=size
    }
    if (doNotFollowCam){
        ctx.arc(x,y,trueSize*cam.zoom,0,Math.PI*2);
    }else{
        ctx.arc((x-cam.x)*cam.zoom,(y-cam.y)*cam.zoom,trueSize*cam.zoom,0,Math.PI*2);
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
function offSetByCam(point,passedCam){
    if (passedCam===undefined){
        passedCam=cam;
    }
    return new newPoint((point.x-cam.x)*cam.zoom,(point.y-cam.y)*cam.zoom)
}
function drawPic(x,y,xScale,yScale,image1){
    base_image = new Image();
    base_image.src = image1;
    base_image.onload = function(){
      ctx.drawImage(base_image, x, y,xScale,yScale);
    }
}
function wait(timeMs){
    let startTime = Date.now();
    while((startTime+timeMs)<Date.now){
        let waster = Math.sin(Math.cos(Date.now));
        waster++;
    }
}
function removeFromEnemyRooms(enemy){
    let enemyRoom = enemyRooms.find((enemyRoomDuplicate) => sameRoomPos(enemyRoomDuplicate,enemy.lastRoom));
    if (enemyRoom!=undefined){
        let enemyIndex = enemyRoom.enemies.findIndex((enemy2) => enemy===enemy2);
        //console.log(enemyRoom);
        if (enemyIndex>-1){
            enemyRoom.enemies.splice(enemyIndex,1);
        }
    }
}
function addToEnemyRooms(enemy){
    let enemyRoom = enemyRooms.find((enemyRoomDuplicate) => isSamePoint(floorPoint(enemy.room,1),floorPoint(enemyRoomDuplicate,1)))
    if (enemyRoom!=undefined){
        enemyRoom.enemies.push(enemy);
    }
}
smileImage = new Image();
smileImage.src = 'smile.png';
function drawEnemies(cam){
    for (enemyRoom of enemyRooms){
        let enemyNum = 0;
        for (enemy of enemyRoom.enemies){
            ctx.beginPath();
            let screenEnemyPos = offSetByCam(enemy);
            ctx.arc(screenEnemyPos.x,screenEnemyPos.y,enemy.size*cam.zoom,0,Math.PI*2);
            ctx.fillStyle = enemy.color;
            ctx.fill();
            ctx.stroke();
            
            //draws a line between lastpos and current pos
            /*ctx.beginPath();
            ctx.moveTo(offSetByCam(enemy.lastPosition).x,offSetByCam(enemy.lastPosition).y);
            ctx.lineTo(offSetByCam(enemy).x,offSetByCam(enemy).y);
            ctx.strokeStyle='black';
            ctx.stroke();*/
            //ctx.drawImage(smileImage,screenEnemyPos.x-(cam.zoom*enemy.size),screenEnemyPos.y-(cam.zoom*enemy.size),enemy.size*2,enemy.size*2);
            if (keysToggle['i']){
                ctx.fillStyle='black';
                ctx.font = enemy.size*2*cam.zoom+'px serif';
                ctx.fillText(enemyNum,screenEnemyPos.x-(cam.zoom*enemy.size/2),screenEnemyPos.y+(cam.zoom*enemy.size/2));
                enemyNum++;
            }
            if (keysToggle['j']){
                ctx.fillStyle='black';
                ctx.font = enemy.size*2*cam.zoom+'px serif';
                ctx.fillText(enemy.health,screenEnemyPos.x-(cam.zoom*enemy.size/2),screenEnemyPos.y+(cam.zoom*enemy.size/2));
            }
            ctx.fillStyle='black';
            ctx.font = 30*cam.zoom+'px serif';
            //const messages =['PFType 0','PFType 1','PFType 2','PFType 3','PFType 4','PFType 5','PFType 6','PFType 7','PFType 8','PFType 9','PFType 10','PFType 11','PFType 12','PFType 13','PFType 14','PFType 15','PFType 16'];
            //const messages =['','','','','','','More Health','','Faster Reload Time','More bullets','','Lowers Shot Spread','More Enemies Can Be Killed By 1 Bullet','Move Faster','PFType 14','PFType 15','PFType 16'];
            let message = '';
            if (enemy.size!=0||enemy.PFType===14){
                //message = messages[enemy.PFType];
                message=enemy.label;
            }
            ctx.fillText(message,screenEnemyPos.x-(cam.zoom*((13*message.length)/2)),screenEnemyPos.y-(cam.zoom*40));
            //this is drawing the sheild
            /*if (enemy===enemies[0]){
                ctx.save();
                ctx.strokeStyle = sheild.color;
                ctx.lineWidth = sheild.height;
                ctx.beginPath();
                ctx.moveTo(offSetByCam(sheild.secondSide).x,offSetByCam(sheild.secondSide).y);
                ctx.lineTo(offSetByCam(sheild.firstSide).x,offSetByCam(sheild.firstSide).y);
                ctx.stroke();
                ctx.restore();
            }*/
            //this would draw a box/circle over the player that indicates their health or could be used to indicate reload time
            if (enemy===enemies[0]&&false){
                ctx.beginPath();
                //let startAngle = 0;
                //let endAngle = Math.PI*2*enemy.health/enemy.maxHealth;
                let circleRatio = enemy.health/enemy.maxHealth;
                /*let angleDis = Math.PI*((-Math.pow(circleRatio-1,2))+1);
                let startAngle = Math.PI/2-angleDis;
                let endAngle = Math.PI/2+angleDis;

                ctx.arc(screenEnemyPos.x,screenEnemyPos.y,enemy.size*cam.zoom/2,startAngle,endAngle);*/
                ctx.rect(screenEnemyPos.x-enemy.size/2,screenEnemyPos.y+enemy.size/2,enemy.size,-(enemy.size*circleRatio));
                ctx.fillStyle='red';
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}
let d = 50;
function acountForZ(point,z){
    return new newPoint((((point.x-cam.x)-c.width/2)*d)/z+c.width/2,(((point.y-cam.y)-c.height/2)*d)/z+c.height/2)
}
function findMidNumber(num1,num2){
    return Math.min(num1,num2)+Math.abs((num1-num2)/2)
}
function findMidPoint(point1,point2){
    return new newPoint(Math.min(point1.x,point2.x)+Math.abs((point1.x-point2.x)/2),Math.min(point1.y,point2.y)+Math.abs((point1.y-point2.y)/2));
}
function drawWalls(cam,draw3d){
    let i = 0;
    //for (enemyRoom of enemyRooms){
        for (wall of walls){
            i++;
            //this is for debug
            //drawCircle(wall.first.x,wall.first.y,'red');
            //drawCircle(wall.second.x,wall.second.y,'red');
            let mid = findMidPoint(wall.first,wall.second);
            /*ctx.beginPath();
            ctx.moveTo((((mid.x)-cam.x)*cam.zoom),((mid.y)-cam.y)*cam.zoom);
            ctx.lineTo(((mid.x+(5*i))-cam.x)*cam.zoom,((mid.y+(5*i))-cam.y)*cam.zoom);
            ctx.stroke();*/
    
            //this draws the wall id
            //ctx.fillText(i,(mid.x-cam.x)*cam.zoom,(mid.y-cam.y)*cam.zoom);
            if (!draw3d){
                ctx.beginPath();
                ctx.moveTo(((wall.first.x-cam.x)*cam.zoom),(wall.first.y-cam.y)*cam.zoom);
                ctx.lineTo((wall.second.x-cam.x)*cam.zoom,(wall.second.y-cam.y)*cam.zoom);
                ctx.stroke();
            }else{
                let newFirst = acountForZ(wall.first,47);
                let newSecond = acountForZ(wall.second,47);
                let newFirst2 = acountForZ(wall.first,53);
                let newSecond2 = acountForZ(wall.second,53);
                ctx.beginPath();
                ctx.moveTo(newFirst.x,newFirst.y);
                ctx.lineTo(newSecond.x,newSecond.y);
                ctx.moveTo(newFirst2.x,newFirst2.y);
                ctx.lineTo(newSecond2.x,newSecond2.y);
        
                ctx.moveTo(newFirst.x,newFirst.y);
                ctx.lineTo(newFirst2.x,newFirst2.y);
                ctx.moveTo(newSecond.x,newSecond.y);
                ctx.lineTo(newSecond2.x,newSecond2.y);
                ctx.stroke();
            }
        }
    //}
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
        for (enemy of enemiesCheck){
            for (let i=0;i<2;i++){
                for (wall of wallsCheck){
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
                            if (!keys['n']){
                                //addCircle(dupPoint(enemy),'yellow');
                                enemy.y+=Math.sin(angle4)*(enemy.size-Math.abs(finDis));
                                enemy.x+=Math.cos(angle4)*(enemy.size-Math.abs(finDis));
                                //addCircle(dupPoint(enemy),'purple');
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
function findHCost(HTarget,pos){
    return Math.abs(HTarget.x-pos.x)+Math.abs(HTarget.y-pos.y)
}
function pivotArray(arr,lowerBound,upperBound){
    //lower is inclusive, upper is exclusive
    let pivot = upperBound-1;
    let switchSpot = lowerBound;
    for (let checker=lowerBound;checker<upperBound;checker++){
        //change so it comparess fCost of both
        if (arr[checker].fCost<=arr[pivot].fCost){
            //this is so when both fCost is the same, it prioritizes making progress closer to the target
            if (arr[checker].fCost===arr[pivot].fCost){
                if (checker!=pivot){
                    if (arr[checker].hCost<=arr[pivot].hCost){
                        const holder = arr[checker];
                        arr[checker] = arr[switchSpot];
                        arr[switchSpot] = holder;
                        switchSpot++;
                    }
                }
            }else{
                const holder = arr[checker];
                arr[checker] = arr[switchSpot];
                arr[switchSpot] = holder;
                switchSpot++;
            }
        }
    }
    /*if (switchSpot!=lowerBound){
        switchSpot++;
    }*/
    /*if (switchSpot=upperBound){
        switchSpot--;
    }*/
    const holder = arr[pivot];
    arr[pivot] = arr[switchSpot];
    arr[switchSpot] = holder;
    return {
        pivot:switchSpot,
        returnedArray:arr
    }
}
function recursive(arr,lowerBound,upperBound){
    //this case means the list is 1 or 0 long and is already sorted by defenition
    if (upperBound-lowerBound<2){
        return arr
    }else{
        const pivot = pivotArray(arr,lowerBound,upperBound);
        recursive(arr,lowerBound,pivot.pivot);
        recursive(arr,pivot.pivot,upperBound);
    }
}
function quickSort(arr){
    recursive(arr,0,arr.length);
    return arr
}
function checkSorted(arr){
    let i =0;
    let lastItem = -Infinity;
    for (item in arr){
        if(item.fCost<lastItem){
            console.log(i+' messed up')
        }
        if (item.fCost!=item.gCost+item.hCost){
            console.log({...item});
        }
        i++
    }
}
function updatePFBoxes(startingPoint,actualTarget,enemyRoom){
    let target = floorPoint(actualTarget,boxSize);
    //let startInWall = false;
    //unfinished code
    /*if (wallBoxes.find((element) => element.x===PFBoxes[0].x&&element.y===PFBoxes[0].y)!=undefined){
        startInWall = true;
    }*/
    for (box of PFBoxes){
        box.hCost=findHCost(target,box);
        box.fCost=box.hCost+box.gCost;
        if (isSamePoint(target,box)/*&&!box.inOpenList*/){
            //this is just to quit the function
            return true
        }
    }
    quickSort(PFBoxes);
    let done = 0;
    while (done<200){
        done++
        /*if (findDis(target,start)>500){
            //If the target is far away, don"t even bother trying to navigate to it.
            break
        }*/
        let i = 0;
        let current2Point = null;
        //This finds the first box in the list thats in the open list
        do {
            current2Point = PFBoxes[i];
            i++;
            //if there are no more boxes to check, there is no path to the goal
            if (current2Point === undefined){
                break
            }
        }while(current2Point.inOpenList===false)
        if (current2Point === undefined){
            break
        }
        current2Point.inOpenList=false;
        for (let i = 0;i<4;i++){
            //this clones the item to avoid shananagins
            let currentPoint = {...current2Point};
            switch (i){
                case 0: currentPoint.x+=boxSize;
                break;
                case 1: currentPoint.y+=boxSize;
                break;
                case 2: currentPoint.x-=boxSize;
                break;
                case 3: currentPoint.y-=boxSize;
                break;
            }
            //check the object is not in a wall, if not, continue
            if (enemyRoom.wallBoxes.find((element) => isSamePoint(element,currentPoint))===undefined){
                //check if it's already in the list
                currentPoint.gCost+=boxSize;
                currentPoint.hCost = findHCost(target,currentPoint);
                currentPoint.fCost = currentPoint.gCost+currentPoint.hCost;
                currentPoint.inOpenList=true;
                currentPoint.parent = new newPoint (current2Point.x,current2Point.y);
                if ((PFBoxes.find((element) => isSamePoint(element,currentPoint))===undefined)&&sameRoomPos(turnIntoRoomPos(currentPoint),enemyRoom)){
                    //add it to the list
                    addPFBox(currentPoint);
                }else{
                    //this checks if the pathfinding algoritm has found a faster way to get to that box
                    let oldBoxIndex = PFBoxes.findIndex((element) => isSamePoint(element,currentPoint)&&element.gCost>currentPoint.gCost);

                    if (oldBoxIndex!=-1){
                        PFBoxes.splice(oldBoxIndex,1);
                        addPFBox(currentPoint);
                    }
                }
            }
        }
        //if found target, break
        if (isSamePoint(target,current2Point)){
            break
        }
    }
    if (done>99){
        //console.log('never found');
    }
}
function addPFBox(PFBox){
    let posInList = PFBoxes.find((element) => element.fCost>PFBox.fCost);
    if (posInList===undefined){
        PFBoxes.push(PFBox);
    }else{
        PFBoxes.splice(posInList,0,PFBox);
    }
    quickSort(PFBoxes);
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
    if (keysUsed['0']){
        keysUsed['0']=false;
        enemies.push(newEnemyPreset(roundedMouse,0));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['1']){
        keysUsed['1']=false;
        enemies.push(newEnemyPreset(roundedMouse,1));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['2']){
        keysUsed['2']=false;
        enemies.push(newEnemyPreset(roundedMouse,2));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['3']){
        keysUsed['3']=false;
        enemies.push(newEnemyPreset(roundedMouse,3));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['4']){
        keysUsed['4']=false;
        enemies.push(newEnemyPreset(roundedMouse,4));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['5']){
        keysUsed['5']=false;
        enemies.push(newEnemyPreset(roundedMouse,5));
        addToEnemyRooms(enemies[enemies.length-1]);
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
    if (keys['x']){
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
function drawDebug(cam){
    if (changePlayerColor){
        if (mousePressed){
            enemies[0].color='black'
        }else{
            enemies[0].color='brown'
        }
    }
    //draw the boxes for a visual
    //gCost hCost fCost are the things
    if (keysToggle['i']){
        for (spawner of editorSpawnPoints){
            drawCircle(spawner.x,spawner.y,'red');
        }
    }
    if (keysToggle['k']){
        for (enemyRoom of enemyRooms){
            for (box of enemyRoom.wallBoxes){
                ctx.beginPath();
                ctx.rect((box.x-cam.x)*cam.zoom,(box.y-cam.y)*cam.zoom,boxSize*cam.zoom,boxSize*cam.zoom);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.stroke();
            }
        }
        if (PFBoxes.length>0){
            for (box of PFBoxes){
                ctx.beginPath();
                ctx.rect((box.x-cam.x)*cam.zoom,(box.y-cam.y)*cam.zoom,boxSize*cam.zoom,boxSize*cam.zoom);
                if (box.inOpenList){
                    ctx.fillStyle = 'blue';
                }else{
                    ctx.fillStyle = 'green';
                }
                ctx.fill();
                ctx.stroke();
                if (keysToggle['i']){
                    ctx.font = 10*cam.zoom+"px serif";
                    ctx.fillStyle = 'black';
                    ctx.fillText('h:'+box.hCost, (box.x-cam.x+2)*cam.zoom, (box.y-cam.y+boxSize/2-6)*cam.zoom);
                    ctx.fillText('g:'+box.gCost, (box.x-cam.x+2)*cam.zoom, (box.y-cam.y+boxSize/2+4)*cam.zoom);
                    ctx.fillText('f:'+box.fCost, (box.x-cam.x+2)*cam.zoom, (box.y-cam.y+boxSize/2+14)*cam.zoom);
                }
            }
            let lowestDistance = Infinity;
            for (box of PFBoxes){
                if (findDis(addToPoint(box,boxSize/2,boxSize/2),enemy)<lowestDistance&&!box.inOpenList){
                    lowestDistance=addToPoint(box,boxSize/2,boxSize/2);
                    //lowestBox = box;
                }
            }
            if (box.parent!='end'){
                box = PFBoxes.find((element) => element.x===box.parent.x&&element.y===box.parent.y);
            }
            ctx.beginPath();
            ctx.moveTo((-cam.x+box.x+boxSize/2)*cam.zoom,(-cam.y+box.y+boxSize/2)*cam.zoom);
            //let previusBox = box;
            /*for (;;){
                box = PFBoxes.find((element) => element.x===box.parent.x&&element.y===box.parent.y);
                if (box===undefined){
                    break;
                }
                ctx.lineTo((-cam.x+box.x+boxSize/2)*cam.zoom,(-cam.y+box.y+boxSize/2)*cam.zoom);
                previusBox = box;
            }
            ctx.stroke();*/
        }
    }
}
function shiftWallsBy(wallsList,x,y){
    for (wall of wallsList){
        wall.first.x+=x;
        wall.first.y+=y;
        wall.second.x+=x;
        wall.second.y+=y;
    }
    return wallsList
}
let powerUpsSpawned = [];
const eligiblePowerUps = [6,8,9,11,13,19];
function generateRoom(topOpen,rightOpen,bottomOpen,leftOpen,roomPos,roomNum,difficulty){
    //let enemiesPerRoom = 0;
    //this makes a new list with a placeholder enemy that will always be in the room
    //this aligns the cordinates as (-1,1) is the room one to the left of the beginning, not at the actual cordiate (-1,0)
    let enemyRoom = turnIntoRoomPos(roomPos);
    enemyRoom.enemies=[];
    enemyRoom.walls=[];
    enemyRoom.wallBoxes = [];
    enemyRoom.difficulty = difficulty;
    enemyRoom.roomNum=roomNum;
    //enemyRooms.push([newEnemyPreset(addToPoint(roomPos,roomWidth/2,roomHeight/2),2)]);
    enemyRooms.push(enemyRoom);
    //enemies.push(enemyRooms[enemyRooms.length-1][0]);
    let roomOption = 0;
    if (roomNum===1){
        roomOption = roomOptions[0];
    }else if ((roomNum%10)===0){
        roomOption = roomOptions[1];
    }else{
        //the ones are there to skip the first and second item which is just a blank room and boss rome rescectively
        roomOption = roomOptions[Math.floor(Math.random()*(roomOptions.length-2))+2];
    } 
    enemyRoom.walls = JSON.parse(JSON.stringify(roomOption.walls));
    let room = enemyRoom.walls;
    for(spawnPoint of roomOption.spawnPoints){
        editorSpawnPoints.push(addToPoint(spawnPoint,roomPos.x,roomPos.y));
    }
    let numOfEnemies=0;
    if (roomOption.spawnPoints.length>0){
        numOfEnemies = Math.floor(((Math.random()/2)+.5)*(difficulty))+1;
    }
    const enemyPosition = addToPoint(roomPos,roomWidth/2,roomHeight/2);
    if (roomNum!=1){
        let powerUpSeed = Math.random();
        let powerUpType=null;
        let currentPowerUpOptions = [...eligiblePowerUps];
        let powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===powerUpsSpawned[powerUpsSpawned.length-1])
        currentPowerUpOptions.splice(powerUpToRemove,1);
        if (undefined===powerUpsSpawned.find((powerUpOption)=>powerUpOption===9)){
            powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===11);
            currentPowerUpOptions.splice(powerUpToRemove,1);
        }
        powerUpType=currentPowerUpOptions[Math.floor(powerUpSeed*currentPowerUpOptions.length)];
        powerUpsSpawned.push(powerUpType);
        let power = 2;
        enemies.push(newEnemyPreset(enemyPosition,powerUpType,power,undefined,0));
        //enemyRooms[enemyRooms.length-1].push(enemies[enemies.length-1]);
        enemyRoom.enemies.push(enemies[enemies.length-1]);
    }
    if ((roomNum%10)===0){
        enemies.push(newEnemyPreset(enemyPosition,15,undefined,undefined,difficulty));
        enemyRoom.enemies.push(enemies[enemies.length-1]);
    }
    for (let i = 0;i<numOfEnemies;i++){
        let randomNum = Math.floor(Math.random()*roomOption.spawnPoints.length);
        let enemyPos = roomOption.spawnPoints[randomNum];
        //this adds the newest enemy to both lists
        let enemyRandomNum = Math.random();
        let enemyType = 4;
        let scaledRandomNum = ((-Math.pow(3,-((enemyRandomNum*difficulty))))+1);
        if (roomNum===2){
            enemyType=2;
        }else if (roomNum<5){
            if (scaledRandomNum<.3){
                enemyType=2
            }else{
                enemyType=4;
            }
        }else if(roomNum<6){
            if (scaledRandomNum<.7){
                enemyType = 4;
            }else {
                enemyType = 10;
            }
        }else{
            if (scaledRandomNum<.6){
                enemyType = 4;
            }else if (scaledRandomNum<.85){
                enemyType = 10;
            }else if (scaledRandomNum<.90){
                enemyType = 3;
            }else if (scaledRandomNum<.95){
                enemyType = 0;
            }else if (scaledRandomNum<.98){
                enemyType = 5;
            }else if (scaledRandomNum<.99){
                enemyType=18;
            }else{
                enemyType = 17;
            }
        }
        enemies.push(newEnemyPreset(addTwoPoints(enemyPos,roomPos),enemyType,undefined,undefined,difficulty));
        //enemyRooms[enemyRooms.length-1].push(enemies[enemies.length-1]);
        enemyRoom.enemies.push(enemies[enemies.length-1]);
    }
    if (roomNum===1){
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,150),14,0,'Move with WASD'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,200),14,0,'Shoot with the Mouse'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,250),14,0,'Hold to shoot continuously'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,300),14,0,'Dash with the Space Bar'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,350),14,0,'Hit the space bar with your left hand thumb you psycho'));
    }
    //door length is twice as long to cover the entire wall and make a seamless wall
    if (topOpen){
        room.push(new newWall(0,0,roomWidth/2-(doorWidth/2),0));
        room.push(new newWall(roomWidth/2+(doorWidth/2),0,roomWidth,0));
        room.push(new newWall(roomWidth/2-(doorWidth/2),0,roomWidth/2-(doorWidth/2),-(doorLength)));
        room.push(new newWall(roomWidth/2+(doorWidth/2),0,roomWidth/2+(doorWidth/2),-(doorLength)));
        //these tiles only work with a specific room size and boxSize
        /*savedwallBoxes.push(new newPoint(roundTo(roomWidth/2+roomPos.x,boxSize),roundTo(-35+roomPos.y,boxSize)));
        savedwallBoxes.push(new newPoint(roundTo(roomWidth/2-boxSize+roomPos.x,boxSize),roundTo(-35+roomPos.y,boxSize)));*/
    }else{
        room.push(new newWall(0,0,roomWidth,0));
    }
    if (rightOpen){
        room.push(new newWall(roomWidth,0,roomWidth,roomHeight/2-(doorWidth/2)));
        room.push(new newWall(roomWidth,roomHeight/2+(doorWidth/2),roomWidth,roomHeight));
        room.push(new newWall(roomWidth,roomHeight/2-(doorWidth/2),roomWidth+(doorLength),roomHeight/2-(doorWidth/2)));
        room.push(new newWall(roomWidth,roomHeight/2+(doorWidth/2),roomWidth+(doorLength),roomHeight/2+(doorWidth/2)));
        //these tiles only work with a specific room size and boxSize
        //savedwallBoxes.push(new newPoint(1330+roomPos.x,280+roomPos.y));
        //savedwallBoxes.push(new newPoint(1330+roomPos.x,315+roomPos.y));
        /*savedwallBoxes.push(new newPoint(roundTo(roomWidth+roomPos.x,boxSize),roundTo(roomHeight/2+roomPos.y,boxSize)));
        savedwallBoxes.push(new newPoint(roundTo(roomWidth+roomPos.x,boxSize),roundTo(roomHeight/2-boxSize+roomPos.y,boxSize)));*/
    }else{
        room.push(new newWall(roomWidth,0,roomWidth,roomHeight));
    }
    if (bottomOpen){
        room.push(new newWall(0,roomHeight,roomWidth/2-(doorWidth/2),roomHeight));
        room.push(new newWall(roomWidth/2+(doorWidth/2),roomHeight,roomWidth,roomHeight));
        room.push(new newWall(roomWidth/2-(doorWidth/2),roomHeight,roomWidth/2-(doorWidth/2),roomHeight+(doorLength)));
        room.push(new newWall(roomWidth/2+(doorWidth/2),roomHeight,roomWidth/2+(doorWidth/2),roomHeight+(doorLength)));
        //these tiles only work with a specific room size and boxSize
        /*savedwallBoxes.push(new newPoint(roundTo(roomWidth/2+roomPos.x,boxSize),roundTo(roomHeight+roomPos.y,boxSize)));
        savedwallBoxes.push(new newPoint(roundTo(roomWidth/2-boxSize+roomPos.x,boxSize),roundTo(roomHeight+roomPos.y,boxSize)));*/
    }else{
        room.push(new newWall(0,roomHeight,roomWidth,roomHeight));
    }
    if (leftOpen){
        room.push(new newWall(0,0,0,roomHeight/2-(doorWidth/2)));
        room.push(new newWall(0,roomHeight/2+(doorWidth/2),0,roomHeight));
        room.push(new newWall(0,roomHeight/2-(doorWidth/2),-(doorLength),roomHeight/2-(doorWidth/2)));
        room.push(new newWall(0,roomHeight/2+(doorWidth/2),-(doorLength),roomHeight/2+(doorWidth/2)));
        //these tiles only work with a specific room size and boxSize
        /*savedwallBoxes.push(new newPoint(roundTo(-35+roomPos.x,boxSize),roundTo(roomHeight/2+roomPos.y,boxSize)));
        savedwallBoxes.push(new newPoint(roundTo(-35+roomPos.x,boxSize),roundTo(roomHeight/2-boxSize+roomPos.y,boxSize)));*/
    }else{
        room.push(new newWall(0,0,0,roomHeight));
    }
    enemyRoom.walls=shiftWallsBy(enemyRoom.walls,roomPos.x,roomPos.y);
    enemyRoom.wallBoxes=generateWallBoxes(2,enemyRoom.walls,enemyRoom.wallBoxes);
    return enemyRoom.walls;
}
let finishedRooms=null;
let roomsToMake=null;
let offLimitRooms = [];
let repeatedNum=0;
function generateRooms(targetNumOfRooms,finalDifficulty){
    //the actual nomber of rooms will be 0-3 more than than targetNumOfRooms sometimes
    //if the targetNumOfRooms is big, it will take a while to generate, it has probbally not crashed
    let deadEnds = [];
    //about half of the rooms will be dead ends
    let originalLength = enemies.length;
    //this clears the walls list and adds a cap to the beggining, but only on the bottom, if the beggining is different, the numbers need to change
    //walls = [new newWall(700,700,600,700)];
    walls = [];
    roomsToMake = [{
        x:0,
        y:0,
        parentDirection:null
    }];
    finishedRooms = [];
    //this is set to one because the first room exists as a room
    let numOfRooms = 1;
    let done = false;
    while(!done){
        let room = roomsToMake[0];
        //These are the door directions that will be drawn/added to the current room
        let up = false;
        let right = false;
        let down = false;
        let left = false;
        switch(room.parentDirection){
            case 0:up = true;
            break;
            case 1:right = true;
            break;
            case 2:down = true;
            break;
            case 3:left = true;
            break;
        }
        let notOptions = [];
        notOptions.push(room.parentDirection);
        let listofListCheck = [finishedRooms,roomsToMake,offLimitRooms];
        for (listCheck of listofListCheck){
            for (roomCheck of listCheck){
                for (let i=0;i<4;i++){
                    let prospectRoom = {...room};
                    switch(i){
                        case 0: prospectRoom.y-=1;
                        break;
                        case 1:prospectRoom.x+=1;
                        break;
                        case 2:prospectRoom.y+=1
                        break;
                        case 3:prospectRoom.x-=1;
                        break;
                    }
                    if ((prospectRoom.x===roomCheck.x)&&(prospectRoom.y===roomCheck.y)){
                        if (roomCheck.y>room.y){
                            notOptions.push(2);
                        }else if (roomCheck.y<room.y){
                            notOptions.push(0);
                        }else if (roomCheck.x>room.x){
                            notOptions.push(1);
                        }else if (roomCheck.x<room.x){
                            notOptions.push(3);
                        }else{
                        }
                    }
                }
            }
        }
        let options = [];
        for (let i = 0;i<4;i++){
            if (notOptions.find(passed => passed===i)===undefined){
                options.push(i);
            }
        }
        if (room.parentDirection===null){
            options=[0];
        }
        let numOfDoors = Math.floor(Math.random()*(options.length+1));
        //lot of other changes would need to be made to make more sprawling room generation, mostly making it so rooms are added to the back of the list using .push, nit the front
        //Right now it generates the first path, then generates all the side dead ends, which makes it so there aren't long paths the break off that don't lead anywhere
        if (options.length>0){
            if (targetNumOfRooms>numOfRooms){
                //numOfDoors = Math.floor(Math.random()*(options.length))+1;
                numOfDoors=1;
            }else if (targetNumOfRooms<=numOfRooms){
                numOfDoors = 0;
            }else if (roomsToMake.length===1){
                //this is so the maze never fizzles out by pure chance before it wants to, also catches the first room
                numOfDoors = Math.floor(Math.random()*(options.length))+1;
            }
        }else{
            numOfDoors=0;
        }
        if (numOfRooms>500){
            numOfDoors=0;
        }
        numOfRooms+=numOfDoors;
        for(let i=0;i<numOfDoors;i++){
            let randomNum = Math.floor(Math.random()*(options.length));
            let doorPos = options[randomNum];
            notOptions.push(randomNum);
            options.splice(randomNum,1);
            switch(doorPos){
                case 0:
                    up = true;
                    roomsToMake.splice(0,0,{x:room.x,y:room.y-1});
                break;
                case 1:
                    right = true;
                    roomsToMake.splice(0,0,{x:room.x+1,y:room.y});
                break;
                case 2:
                    down = true;
                    roomsToMake.splice(0,0,{x:room.x,y:room.y+1});
                break;
                case 3:
                    left = true;
                    roomsToMake.splice(0,0,{x:room.x-1,y:room.y});
                break;
            }
            if (doorPos<2){
                doorPos+=2;
            }else{
                doorPos-=2;
            }
            roomsToMake[0].parentDirection = doorPos;
            //roomsToMake[roomsToMake.length-1].parentDirection = doorPos;
            //0 should be roomsToMake.length-1
        }
        let roomPos = new newPoint((roomWidth+(doorLength*2))*room.x,(roomHeight+(doorLength*2))*room.y);
        let deadEnd = numOfDoors===0;
        roomsToMake[numOfDoors].roomPos=roomPos;
        roomsToMake[numOfDoors].up=up;
        roomsToMake[numOfDoors].right=right;
        roomsToMake[numOfDoors].down=down;
        roomsToMake[numOfDoors].left=left;
        roomsToMake[numOfDoors].deadEnd=deadEnd;
        if (deadEnd){
            deadEnds.push(dupPoint(room));
        }
        repeatedNum++;
        if (deadEnd&&numOfRooms<targetNumOfRooms&&repeatedNum<10000){
            //this still might not work and the maze might end early if it can't back out of a deadend
            //this might be broken and triggering when it's not supposed to
            console.log('stepped in: '+numOfRooms);
            roomsToMake.splice(numOfDoors,1)[0];
            offLimitRooms.push(finishedRooms.pop());
            roomsToMake.push(finishedRooms.pop());
            numOfRooms-=2;
            /*let roomIndex = finishedRooms.length-1;
            while(finishedRooms[roomIndex].deadEnd){
                roomIndex--;
                numOfRooms--;
                if (roomIndex<0){
                    console.log('too low index');
                }else{
                    roomsToMake.push(finishedRooms.pop());
                }
            }*/
            //console.log(JSON.parse(JSON.stringify(finishedRooms)));
        }else{
            finishedRooms.push(roomsToMake.splice(numOfDoors,1)[0]);
        }
        //fyi these splices change the lists
        /*finishedRooms.push(roomsToMake[0]);
        roomsToMake.splice(0,1);*/
        if (roomsToMake.length<=0){
            done = true;
        }
    }
    let i=0;
    for (room of finishedRooms){
        i++;
        walls = walls.concat(generateRoom(room.up,room.right,room.down,room.left,room.roomPos,i,((i/targetNumOfRooms)*(finalDifficulty-1))+1));
    }
    for (let i=0;i<originalLength;i++){
        addToEnemyRooms(enemies[i]);
    }
    if (numOfRooms!=targetNumOfRooms){
        console.log(numOfRooms);
    }
    //console.log(deadEnds);
}
function camControl(snapToRooms,target,updateScreenSize,keepAspectRatio,resetScreen,screenShake){
    if (updateScreenSize){
        if (keepAspectRatio){
            const aspectRatio = 1400/750;
            if ((window.innerWidth/1400)<(window.innerHeight/750)){
                c.width=(window.innerWidth-20)-((margin.x)*2)-((margin.y*aspectRatio)*2);
                c.height=((window.innerWidth/aspectRatio)-20)-((margin.y)*2);
            }else{
                c.width=((window.innerHeight*aspectRatio)-20)-((margin.x)*2)-((margin.y*aspectRatio)*2);
                c.height=((window.innerHeight)-20)-((margin.y)*2);
            }
        }else{
            //cam.zoom=Math.min(window.innerHeight/((doorLength*2)+roomHeight),window.innerWidth/((doorLength*2)+roomWidth));
            //margin= new newPoint(30,10);
            c.width=(window.innerWidth-20)-((margin.x)*2);
            c.height=(window.innerHeight-20)-((margin.y)*2);
        }
        screenSize= Math.min(c.height/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
        cam.zoom=screenSize;
        c.style.margin = margin.y+"px "+margin.x+"px";
    }
    if (resetScreen){
        c.width=1400;
        c.height=750;
        screenSize= Math.min(c.height/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
        cam.zoom=screenSize;
        c.style.margin = margin.y+"px "+margin.x+"px";
    }
    if (keys['u']){
        cam.zoom*=1+(.1*deltaTime);
    }
    if (keys['y']){
        cam.zoom/=1+(.1*deltaTime);
    } 
    if (enemies.length===0){
        cam.x=0;
        cam.y=0;
    }else{
        if (!snapToRooms){
            cam.x = (target.x-(c.width/2/cam.zoom));
            cam.y = (target.y-(c.height/2/cam.zoom));
        }else{
            cam.x=(floorTo((target.x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
            cam.y=(floorTo((target.y+50),(roomHeight+(doorLength*2)))-50)-(c.height/2/cam.zoom)+(roomHeight/2)+doorLength;
    
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
    }
    let shakeStrength = 5;
    if (screenShake>0){
        cam.x+=(Math.random()*shakeStrength*screenShake)-shakeStrength/2;
        cam.y+=(Math.random()*shakeStrength*screenShake)-shakeStrength/2;
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
            return rayCast(start,otherPosition,trueEnemyRoom.walls);
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
                            }                        }
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

        for(enemy of enemyRoom.enemies){
            let intersection = rayCast(enemy,enemy.lastPosition,checkBounding,wallsCheck,true);
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
            /*let disMoved = findDis(enemy,enemy.lastPosition);
            let playerSlope = (enemy.lastPosition.y-enemy.y)/(enemy.lastPosition.x-enemy.x);
            let xIntercept = null;
            let yIntercept = null;
            let oldCorner = null;
            let corner = null;
            //let timesToRepeat = Math.floor(enemy.width/smallestPlatform*2)+2
            let timesToRepeat = 1;
            for (i=0;i<timesToRepeat;i++){
            /*if (i>1){
                    corner = new point(enemy.x-(enemy.width-20)/2+(smallestPlatform/2*(i-1)),enemy.y+20);
                    oldCorner = new point(enemy.lastPosition.x-(enemy.width-20)/2+(smallestPlatform/2*(i-1)),enemy.lastPosition.y+20);
                }else{
                    corner = new point(enemy.x+(enemy.width*i)-(enemy.width-20)/2,enemy.y+20);
                    oldCorner = new point(enemy.lastPosition.x+(enemy.width*i)-(enemy.width-20)/2,enemy.lastPosition.y+20);     
                }
                corner =  new newPoint(enemy.x,enemy.y);
                oldCorner = new newPoint(enemy.lastPosition.x,enemy.lastPosition.y);
                //drawCircle(corner.x,corner.y,'red',false);
                //drawCircle(oldCorner.x,oldCorner.y,'pink',false);
                for (wall of enemyRoom.walls){
                    if (!checkBounding||boundingBox(wall.first,wall.second,enemy,enemy.size+disMoved,enemy.size+disMoved)){
                        if (wall.first.y===wall.second.y){
                            yIntercept = wall.first.y;
                            //The line is straight so it will always be wall.first.y
                            xIntercept = ((yIntercept-corner.y)/playerSlope)+corner.x;
                            if (isBetween(wall.first.x,wall.second.x,xIntercept)&&isBetween(corner.x,oldCorner.x,xIntercept)&&isBetween(corner.y,oldCorner.y,yIntercept)){
                                //corner and playerSlope needs to be changed because the enemy has moved
                                if (oldCorner.y<corner.y){
                                    enemy.y=wall.first.y-(enemy.size);
                                    corner =  new newPoint(enemy.x,enemy.y);
                                    playerSlope = (enemy.lastPosition.y-enemy.y)/(enemy.lastPosition.x-enemy.x);
                                }else{
                                    enemy.y=wall.first.y+(enemy.size);
                                    corner =  new newPoint(enemy.x,enemy.y);
                                    playerSlope = (enemy.lastPosition.y-enemy.y)/(enemy.lastPosition.x-enemy.x);
                                }
                            }
                        }
                        if (wall.first.x===wall.second.x){
                            xIntercept = wall.first.x;
                            yIntercept = ((xIntercept-corner.x)*playerSlope) +corner.y;
                            if (isBetween(wall.first.y,wall.second.y,yIntercept)&&isBetween(corner.y,oldCorner.y,yIntercept)&&isBetween(corner.x,oldCorner.x,xIntercept)){
                                if (oldCorner.x<corner.x){
                                    enemy.x=wall.first.x-(enemy.size);
                                    corner =  new newPoint(enemy.x,enemy.y);
                                    playerSlope = (enemy.lastPosition.y-enemy.y)/(enemy.lastPosition.x-enemy.x);
                                }else{
                                    enemy.x=wall.first.x+(enemy.size);
                                    corner =  new newPoint(enemy.x,enemy.y);
                                    playerSlope = (enemy.lastPosition.y-enemy.y)/(enemy.lastPosition.x-enemy.x);
                                }
                            }
                        }
                    }
                }
            }*/
        }
    }
}
function bulletWallCollision1(){
    let bulletsToRemove = [];
    let bulletsAlreadyRemoved = [];
    for (enemyRoom of enemyRooms){
        let i=0;
        for (bullet of bullets){
            let intersection = rayCast(bullet,bullet.lastPosition,false,enemyRoom.walls);
            if (intersection!=undefined){
                if (bulletsAlreadyRemoved.findIndex((otherBullet)=>otherBullet===bullet)===-1){
                    bulletsAlreadyRemoved.push(bullet);
                    bulletsToRemove.push(i);
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
function bulletWallCollision(){
    for(let j=0;j<bullets.length;j++){
        let bullet = bullets[j];
        let xIntercept = null;
        let yIntercept = null;
        let secondCorner = null;
        let corner = null;
        //the rectangular bullet has 4 sides + 4 corners
        let timesToRepeat = 8;
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
        for (i=0;i<timesToRepeat;i++){
            switch (i){
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
                    //bottom right
                    corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2));
                break
                case 7:
                    //bottom left
                    corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction+Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction+Math.PI/2)*bullet.realWidth/2));
                break
            }
            if (i>3){
                secondCorner = subtractFromPoint(corner,bulletMovement);
            }
            bulletSlope = (secondCorner.y-corner.y)/(secondCorner.x-corner.x);
            //corner =  new newPoint(enemy.x,enemy.y);
            //secondCorner = new newPoint(enemy.lastPosition.x,enemy.lastPosition.y);
            //addCircle(corner,'red');
            //addCircle(secondCorner,'pink');
            let deleted = false;
            for (enemyRoom of enemyRooms){
                for (wall of enemyRoom.walls){
                    if (!deleted){
                        if (wall.first.y===wall.second.y){
                            yIntercept = wall.first.y;
                            //The line is straight so it will always be wall.first.y
                            xIntercept = ((yIntercept-corner.y)/bulletSlope)+corner.x;
                            if (isBetween(wall.first.x,wall.second.x,xIntercept)&&isBetween(corner.x,secondCorner.x,xIntercept)&&isBetween(corner.y,secondCorner.y,yIntercept)){
                                //bullet.color='blue';
                                //If the bullet bounces off or something, remember to change corner and slope so this works
                                //addCircle(bullet,'red');
                                i=8;
                                bullets.splice(j,1);
                                j--;
                                deleted = true;
                            }
                        }
                        if (wall.first.x===wall.second.x){
                            xIntercept = wall.first.x;
                            yIntercept = ((xIntercept-corner.x)*bulletSlope)+corner.y;
                            if (isBetween(wall.first.y,wall.second.y,yIntercept)&&isBetween(corner.y,secondCorner.y,yIntercept)&&isBetween(corner.x,secondCorner.x,xIntercept)){
                                //bullet.color='blue';
                                //addCircle(bullet,'red');
                                i=8;
                                bullets.splice(j,1);
                                j--;
                                deleted = true;
                            }
                        }
                    }
                }
            }
        }
    }
}
function makeSheildSides(sheild){
    sheild.firstSide = addToPoint(sheild.sheildStart,Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2);
    sheild.secondSide = subtractFromPoint(sheild.sheildStart,new newPoint(Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2));
    return sheild
}
function enemyMovement(enemiesToRemove){
    let start = floorPoint(enemies[0],boxSize);
    dashCooldown-=deltaTime;
    PFBoxes.push(new newPathBox(start.x,start.y,0,findHCost(start,enemies[0]),findHCost(start,enemies[0]),'end',true));

    let roomChange=new newPoint(0,0);
    let z = enemies[0].x%(roomWidth+(2*doorLength));
    let u = (roomWidth+(2*doorLength))/(doorLength*2);
    if (z>roomWidth/2){
        z-=roomWidth+(2*doorLength);
    }else if (z<-((2*doorLength)+(roomWidth/2))){
        z-=roomWidth+(2*doorLength);
    }
    if (z<0&&z>=-doorLength){
        roomChange.x--;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.x++;
    }
    
    z = enemies[0].y%(roomHeight+(2*doorLength));
    u = (roomHeight+(2*doorLength))/(doorLength*2);
    if (z>roomHeight/2){
        z-=roomHeight+(2*doorLength);
    }else if (z<-((2*doorLength)+(roomHeight/2))){
        z-=roomHeight+(2*doorLength);
    }
    if (z<0&&z>=-doorLength){
        roomChange.y--;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.y++;
    }

    /*let enemyRoomIndex = enemyRooms.findIndex((checkEnemyRoom)=>checkEnemyRoom===enemyRoom);
    let wallsCheck = enemyRoom.walls;
    if (enemyRoomIndex>0){
        wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex-1].walls);
    }
    if (enemyRoomIndex<enemyRooms.length-1){
        wallsCheck = wallsCheck.concat(enemyRooms[enemyRoomIndex+1].walls);
    }*/
    for (mainEnemyRoom of enemyRooms){
        if(!isSamePoint(floorPoint(mainEnemyRoom,1),floorPoint(enemies[0].room,1))&&!isSamePoint(floorPoint(mainEnemyRoom,1),floorPoint(addTwoPoints(enemies[0].room,roomChange),1))){
            continue;
        }
        let enemyRoom =mainEnemyRoom.enemies;
        for (let i =0;i<enemyRoom.length;i++){
            let enemy=enemyRoom[i];
            if(enemy.health<1){
                let numMoney = Math.floor(Math.random()*mainEnemyRoom.difficulty)+1;
                numMoney=0;
                for (let i=0;i<numMoney;i++){
                    enemies.push(newEnemyPreset(addToPoint(dupPoint(enemy),(Math.random()*100)-10,(Math.random()*20)-10),16));
                    addToEnemyRooms(enemies[enemies.length-1]);
                }
                if (Math.random()<.8){
                    enemies.push(newEnemyPreset(enemy,7));
                    addToEnemyRooms(enemies[enemies.length-1]);
                }
                enemyRoom.splice(i,1);
                i--;
                enemies.splice(enemies.findIndex((newEnemy)=>newEnemy===enemy),1);
                continue;
            }
            enemy.color=enemy.defaultColor;
            enemy.gunCooldown-=deltaTime;
            enemy.invinceable-=deltaTime;
            if (enemy.invinceable>0){
                enemy.color='red';
            }
            enemy.speed=enemy.targetSpeed*deltaTime;
            enemy.lastRoom=enemy.room;
            //enemy.lastPosition = new newPoint(enemy.x,enemy.y);
            enemy.room = new newPoint((enemy.x+doorLength)/(roomWidth+(doorLength*2)),(enemy.y+doorLength)/(roomHeight+(doorLength*2)));
            if (!isSamePoint(floorPoint(enemy.lastRoom,1),floorPoint(enemy.room,1))){
                removeFromEnemyRooms(enemy);
                addToEnemyRooms(enemy);
            }
            let targetIndex = enemyRoom.findIndex((enemyCheck)=>enemyCheck===enemy.target)
            if ((targetIndex===-1)&&enemy.target!=enemies[0]&&enemy!=enemies[0]){
                let closestEnemy=undefined;
                closestDis=Infinity;
                for (enemyCheck of enemyRoom){
                    let currentDis = findDis(enemies[0],enemyCheck);
                    if (enemyCheck.team!=enemy.team&&(enemyCheck!=enemy)&&(enemyCheck.PFType!=6)&&currentDis<closestDis){
                        closestEnemy=enemyCheck;
                        closestDis=currentDis;
                    }
                }
                //let firstEnemy = enemyRoom.enemies.find((enemyCheck)=>(enemyCheck!=enemy)&&(enemyCheck.PFType!=6));
                if (closestEnemy!=undefined){
                    enemy.target=closestEnemy;
                }else{
                    enemiesToRemove.push(enemy);
                }
            }
            if (enemy.PFType===0||enemy.PFType===4){
                enemyAngle = findAngle(enemy,enemy.target);
                enemy.x-=Math.sin(enemyAngle)*enemy.speed;
                enemy.y-=Math.cos(enemyAngle)*enemy.speed;
            }else if (enemy.PFType===1){
                if (keysUsed['t']){
                    //use at your own risk, may remove enemies from the list so it might eventually remove the player
                    keysUsed['t']=false;
                    enemyRoomIndex=0;
                    while(!sameRoomPos(enemyRooms[enemyRoomIndex],enemy.room)){
                        let enemyRoomEnemies = enemyRooms[enemyRoomIndex].enemies;
                        if (enemyRoomEnemies.length>0){
                            if (enemyRoomEnemies[0].team===2){
                                enemyRoomEnemies[0].effect(enemy,enemyRoomEnemies[0],enemiesToRemove);
                            }
                        }
                        enemyRoomIndex++;
                    }
                }
                //this does the oppisite of finding the room, it takes a room and turns it into a real cordinate
                shop = addToPoint(subtractNumFromPoint(multiplyPoints(floorPoint(enemy.room,1),new newPoint(roomWidth+(doorLength*2),roomHeight+(doorLength*2))),doorLength),200,300);
                if (keysToggle['b']){
                    enemy.speed = 50;
                }
                let movementTarget = new newPoint(0,0);
                if (dashFramesLeft>0){
                    /*dashFramesLeft-=deltaTime;
                    dashSpeed-=((10*deltaTime)-dashFramesLeft);
                    enemy.x-=Math.sin(dashDirection)*dashSpeed*deltaTime;
                    enemy.y-=Math.cos(dashDirection)*dashSpeed*deltaTime;
                    console.log(findDis(enemy,enemy.lastPosition));*/
                    //this makes you invincable whan you dash
                    enemy.invinceable=dashFramesLeft;
                    dashFramesLeft-=1;
                    dashSpeed-=(10-dashFramesLeft);
                    enemy.x-=Math.sin(dashDirection)*dashSpeed;
                    enemy.y-=Math.cos(dashDirection)*dashSpeed;
                    enemy.color='red';
                }else{
                    if(keys['w']){
                        movementTarget.y--;
                    }
                    if(keys['s']){
                        movementTarget.y++;
                    }
                    if(keys['a']){
                        movementTarget.x--;
                    }
                    if(keys['d']){
                        movementTarget.x++;
                    }
                }
                let movementAngle = findAngle(new newPoint(0,0),movementTarget);
                if (movementTarget.x!=0||movementTarget.y!=0){
                    enemy.x-=Math.sin(movementAngle)*enemy.speed;
                    enemy.y-=Math.cos(movementAngle)*enemy.speed;
                }
                if (!isSamePoint(new newPoint(0,0),movementTarget)){
                    //sheild.angle=movementAngle+Math.PI;
                }
                /*sheild.angle=findAngle(enemy,mouseShifted)+Math.PI;
                sheild.sheildStart = addToPoint(enemy,Math.sin(sheild.angle)*50,Math.cos(sheild.angle)*50);
                makeSheildSides(sheild);
                //sheild.firstSide = addToPoint(sheild.sheildStart,Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2);
                //sheild.secondSide = subtractFromPoint(sheild.sheildStart,new newPoint(Math.sin(sheild.angle+Math.PI/2)*sheild.width/2,Math.cos(sheild.angle+Math.PI/2)*sheild.width/2));
                let firstIntersection = rayCast(enemy.lastPosition,sheild.firstSide,false,mainEnemyRoom.walls);
                let secondIntersection = rayCast(enemy.lastPosition,sheild.secondSide,false,mainEnemyRoom.walls);
                if (firstIntersection!=undefined&&secondIntersection!=undefined){
                    sheild.color='yellow';
                    sheild.sheildStart=findMidPoint(firstIntersection,secondIntersection);
                    makeSheildSides(sheild);
                }else{
                    if (firstIntersection!=undefined){
                        sheild.color='green';
                        sheild.firstSide=firstIntersection;
                        sheild.secondSide = subtractFromPoint(sheild.firstSide,new newPoint(Math.sin(sheild.angle+Math.PI/2)*sheild.width,Math.cos(sheild.angle+Math.PI/2)*sheild.width));
                    }else if (secondIntersection!=undefined){
                        sheild.color='red';
                        sheild.secondSide=secondIntersection;
                        sheild.firstSide = addToPoint(sheild.secondSide,Math.sin(sheild.angle+Math.PI/2)*sheild.width,Math.cos(sheild.angle+Math.PI/2)*sheild.width);
                    }else{
                        sheild.color='grey';
                    }
                }
                let intersection = rayCast(sheild.secondSide,sheild.firstSide,false,mainEnemyRoom.walls,false);*/
                keysToggle['e']=false;
                if (keysUsed[' ']||(keysToggle['e']&&mousePressed)){
                    if ((!isSamePoint(movementTarget,new newPoint(0,0))||(keysToggle['e']&&mousePressed))&&dashCooldown<0){
                        screenShake+=3;
                        dashSpeed = 60;
                        dashFramesLeft = 6;
                        dashCooldown=maximumDashCoolDown;
                        if ((!keysToggle['e'])||true){
                            dashDirection = movementAngle;
                        }else{
                            dashDirection = findAngle(mouseShifted,enemy)+Math.PI;
                        }
                    }
                    keysUsed[' ']=false;
                }
                //let closestBox = floorPoint(enemy,boxSize);
                //let endBox = PFBoxes.find((box)=>)
            }else if(enemy.PFType===2){

            }else if (enemy.PFType===3||enemy.PFType===5||enemy.PFType===17){
                let intersection = rayCast(enemy,enemy.target,false,mainEnemyRoom.walls);
                if (enemy.PFType===3&&intersection===undefined){

                }else if (enemy.PFType===17&&intersection===undefined){
                    enemyAngle = findAngle(enemy,enemy.target);
                    enemy.x-=Math.sin(enemyAngle)*enemy.speed*1.5;
                    enemy.y-=Math.cos(enemyAngle)*enemy.speed*1.5;
                }else{
                    updatePFBoxes(enemy.target,enemy,mainEnemyRoom);
                    let lowestDistance = Infinity;
                    let lowestBox = null;
                    //let enemyOnGrid = floorPoint(enemy,boxSize);
                    for (box of PFBoxes){
                        if (findDis(addToPoint(box,boxSize/2,boxSize/2),enemy)<lowestDistance&&!box.inOpenList){
                            lowestDistance=findDis(box,enemy);
                            lowestBox = box;
                        }
                    }
                    if (lowestBox===null){
                        pathTarget=enemy.target;
                    }else{
                        if (lowestBox.parent==='end'){
                            pathTarget=enemy.target;
                        }else{
                            pathTarget = addToPoint(lowestBox.parent,boxSize/2,boxSize/2);
                        }
                    }
                    if (keysToggle['i']){
                        addCircle(pathTarget,'red');
                        addCircle(addToPoint(lowestBox,boxSize/2,boxSize/2),'pink');
                    }
                    
                    //theoretically checking the distance makes sure we are only moving to ones near us, but it also causes new bugs
                    //if (findDis(pathTarget,enemy)<(boxSize*2)||keys['j']){
                        if (Math.abs(pathTarget.x-enemy.x)<enemy.speed){
                            enemy.x = pathTarget.x;
                        }
                        if (Math.abs(pathTarget.y-enemy.y)<enemy.speed){
                            enemy.y = pathTarget.y;
                        }
                        let yDis = pathTarget.y-enemy.y;
                        let xDis = pathTarget.x-enemy.x;
                        //this is to avoid 2 guys moving into each other and both blocking the other
                        //enemy.x+=(Math.random()-.5)/1
                        //enemy.y+=(Math.random()-.5)/1
        
                        if (Math.abs(yDis)>Math.abs(xDis)){
                            if(xDis<0){
                                enemy.x-=enemy.speed;
                            }else if(xDis>0){
                                enemy.x+=enemy.speed;
                            }else if(yDis<0){
                                enemy.y-=enemy.speed;
                            }else if(yDis>=0){
                                enemy.y+=enemy.speed;
                            }else{
                                console.log('help I cant move');
                            }
                        } else /*if (Math.abs(yDis)<=Math.abs(xDis))*/{
                            if(yDis<0){
                                enemy.y-=enemy.speed;
                            }else if(yDis>0){
                                enemy.y+=enemy.speed;
                            }else if(xDis<0){
                                enemy.x-=enemy.speed;
                            }else if(xDis>=0){
                                enemy.x+=enemy.speed;
                            }else{
                                console.log('help I cant move even more');
                            }
                        }
                    //}
                }
            }else if (enemy.PFType===7){
                if (enemy.gunCooldown<0){
                    enemiesToRemove.push(enemy);
                }
            }else if (enemy.PFType===10){
                let xDis=enemy.x-enemy.target.x;
                let yDis=enemy.y-enemy.target.y;
                if (Math.abs(xDis)<enemy.speed){
                    enemy.x=enemy.target.x;
                }
                if (Math.abs(yDis)<enemy.speed){
                    enemy.y=enemy.target.y;
                }
                xDis=enemy.x-enemy.target.x;
                yDis=enemy.y-enemy.target.y;
                if ((Math.abs(xDis)>Math.abs(yDis)||xDis===0)&&yDis!=0){
                    if (yDis>0){
                        enemy.y-=enemy.speed;
                    }else{
                        enemy.y+=enemy.speed;
                    }
                }else{if (xDis>0){
                        enemy.x-=enemy.speed;
                    }else{
                        enemy.x+=enemy.speed;
                    }
                }
            }
            //enemy.room.x=(floorTo((enemies[0].x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
            //enemy.room.y=(floorTo((enemies[0].y+50),(roomHeight+(doorLength*2)))-50)-(c.height/2/cam.zoom)+(roomHeight/2)+doorLength
        }
    }
}
function aimGun(enemy,target,bulletColor,overPowered,enemyRoom,skipRayCast){
    if (overPowered===undefined){
        overPowered=0;
    }
    if(enemy.gunCooldown<0){
        screenShake+=3 +(enemy.bulletSpreadNum/5);
        let intersection = undefined
        if (!skipRayCast){
            intersection = rayCast(enemy,target,false,enemyRoom.walls);
        }
        if (intersection===undefined){
            enemy.gunCooldown=enemy.gunCoolDownMax;
            if (enemy===enemies[0]&&keysToggle['q']&&false){
                let closestEnemy=undefined;
                closestDis=Infinity;
                for (enemyCheck of enemyRoom.enemies){
                    let currentDis = findDis(target,enemyCheck);
                    if (enemyCheck.team!=enemy.team&&(enemyCheck!=enemy)&&(enemyCheck.team!=2)&&currentDis<closestDis){
                        closestEnemy=enemyCheck;
                        closestDis=currentDis;
                    }
                }
                //let firstEnemy = enemyRoom.enemies.find((enemyCheck)=>(enemyCheck!=enemy)&&(enemyCheck.PFType!=6));
                if (closestEnemy!=undefined){
                    enemyRoom.enemies.push(newEnemyPreset(enemy,0,undefined,'',1,closestEnemy));
                    enemies.push(enemyRoom.enemies[enemyRoom.enemies.length-1]);
                }
                return
            }
            let bulletDirection = findAngle(target,enemy);
            let bulletLength = 60;
            let bulletSpeed = 30;
            //right now the bullet spwawns right next to the player then is moved on the first frame to be bulletSpeed away
            //the -30 is there to spawn the bullet 30 units away from the players edge
            for (let i=0;i<enemy.bulletSpreadNum+overPowered;i++){
                //let thisBulletDirection = bulletDirection+((i/2)*(i%2-.99999999)/(Math.abs(i%2-1)+.00000001))/5;
                let thisBulletDirection =bulletDirection;
                if ((i%2)===1){
                    thisBulletDirection-=(Math.floor((i+1)/2)/10)*enemy.shotSpread;
                }else{
                    thisBulletDirection+=(Math.floor((i+1)/2)/10)*enemy.shotSpread;
                }
                bullets.push(new newBullet(enemy.x-Math.sin(thisBulletDirection)*(-enemy.size-bulletLength-30),enemy.y-Math.cos(thisBulletDirection)*(-enemy.size-bulletLength-30),bulletSpeed,thisBulletDirection,bulletColor,bulletLength,5,0,60,enemy.bulletKillPower,dupPoint(enemy),enemy));
            }
        }
    }
}
function enemyCollisionEffects(enemiesToRemove){
    //enemies2 is the enemies in this room or should be processed
    for (mainEnemyRoom of enemyRooms){
        if (!sameRoomPos(mainEnemyRoom,enemies[0].room)){
            continue
        }
        let enemyRoom = mainEnemyRoom.enemies;
        for (enemy1 of enemyRoom){
            for (enemy2 of enemyRoom){
                //this makes it so the placeholder enemy and power ups that haveb't really gotton spawned yet don't get activated
                if (enemy1.size===0||enemy2.size===0){
                    continue;
                }
                let skip=false;
                //this makes sure we are checking 2 different enemies
                //It also checks that the enemies are in the same room
                for (removedEnemy of enemiesToRemove){
                    if (enemy1===removedEnemy||enemy2===removedEnemy){
                        skip = true;
                    }
                }
                if (skip){
                    continue;
                }
                if (enemy1!=enemy2){
                    let enemyDis = findDis(enemy1,enemy2);
                    if ((enemyDis<enemy1.size+enemy2.size)&&(rayCast(enemy1,enemy2,false,mainEnemyRoom.walls,false)===undefined)){
                        enemy1.effect(enemy2,enemy1,enemiesToRemove);
                        enemy2.effect(enemy1,enemy2,enemiesToRemove);
                    }else if (enemy.PFType===6&&enemyDis<=Math.max(enemy1.size,20)+Math.max(enemy2.size,20)){
                        enemy1.effect(enemy2,enemy1,enemiesToRemove);
                        enemy2.effect(enemy1,enemy2,enemiesToRemove);
                    }
                }
            }
        }
    }
}
function enemyCollision(enemiesToRemove){
    //enemies2 is the enemies in this room or should be processed
    for (mainEnemyRoom of enemyRooms){
        //this could be made faster by only checking loaded rooms near the player
        /*if (!sameRoomPos(mainEnemyRoom,enemies[0].room)){
            continue
        }*/
        let enemyRoom = mainEnemyRoom.enemies;
        let firstEnemy = enemyRoom.find((enemy)=>enemy.PFType!=6&&enemy.PFType!=1);
        if (firstEnemy===undefined&&enemyRoom.length>0){
            if (enemyRoom[0].size===0){
                enemyRoom[0].size=30;
            }
        }
        for (enemy1 of enemyRoom){
            for (enemy2 of enemyRoom){
                //this makes it so the placeholder enemy and power ups that haveb't really gotton spawned yet don't get activated
                //change the size 10
                if (enemy1.size===0||enemy2.size===0||enemy1.team===2||enemy2.team===2){
                    continue;
                }
                let skip=false;
                //this makes sure we are checking 2 different enemies
                //It also checks that the enemies are in the same room
                for (removedEnemy of enemiesToRemove){
                    if (enemy1===removedEnemy||enemy2===removedEnemy){
                        skip = true;
                    }
                }
                if (skip){
                    continue;
                }
                if (enemy1!=enemy2){
                    let enemyDis = findDis(enemy1,enemy2);
                    if (enemyDis<enemy1.size+enemy2.size){
                        /*if (enemy2.PFType===1){
                            enemy1.effect(enemy2,enemy1,enemiesToRemove);
                        }
                        if (enemy1.PFType===1){
                            enemy2.effect(enemy1,enemy2,enemiesToRemove);
                        }*/
                        let enemyAngle = findAngle(enemy1,enemy2);
                        enemyDis-=enemy1.size+enemy2.size;
                        //size ratio would make bigger enemies move less and vice versa, but it's kinda buggy
                        let sizeRatio = 1;
                        //let sizeRatio = enemy1.size/enemy2.size;
                        //this makes it so each enemy only moves back half the distance
                        enemyDis/=2;
                        enemy1.x-=Math.sin(enemyAngle)*enemyDis/sizeRatio;
                        enemy1.y-=Math.cos(enemyAngle)*enemyDis/sizeRatio;
                        enemy2.x+=Math.sin(enemyAngle)*enemyDis*sizeRatio;
                        enemy2.y+=Math.cos(enemyAngle)*enemyDis*sizeRatio;
                    }
                }
            }
        }
    }
}
function drawBullets(cam){
    for (bullet of bullets){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((bullet.x-cam.x)*cam.zoom,(bullet.y-cam.y)*cam.zoom);
        let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
        let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
        ctx.lineTo((tailX-cam.x)*cam.zoom,(tailY-cam.y)*cam.zoom);

        //ctx.moveTo((bullet.x-cam.x)*cam.zoom,(bullet.y-cam.y)*cam.zoom);
        //ctx.lineTo(((bullet.x)-cam.x)*cam.zoom,((bullet.y-bullet.tailLength)-cam.y)*cam.zoom);

        ctx.strokeStyle=bullet.color;
        ctx.lineWidth=bullet.visualWidth*cam.zoom;
        ctx.stroke();
        ctx.restore();
        //drawCircle(bullet.y,bullet.x,'yellow',false);
    }
}
function moveBullets(){
    for (let i=0;i<bullets.length;i++){
        let bullet=bullets[i];
        bullet.timeLeft-=deltaTime;
        bullet.lastPosition = new newPoint(bullet.x,bullet.y);
        bullet.x+=Math.sin(bullet.direction)*bullet.speed*deltaTime;
        bullet.y+=Math.cos(bullet.direction)*bullet.speed*deltaTime;
        if (bullet.timeLeft<1||bullet.enemiesLeft<1){
            bullets.splice(i,1);
            i--;
        }
    }
}
function singleBulletEnemyCollision(bullet){
    //bullet.room = new newPoint((bullet.x+doorLength)/(roomWidth+(doorLength*2)),(bullet.y+doorLength)/(roomHeight+(doorLength*2)));
    for (let i = 0;i<enemies.length-1;i++){
        let enemy = enemies[i];
        //this rotates the creature to be aligned with the bullet which is a rotated rectangle.
        let rotatedPoint = addToPoint(bullet,Math.sin(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet),Math.cos(-bullet.direction+findAngle(enemy,bullet))*findDis(enemy,bullet))
        //Now the bullet can be desrcibed in relation to rotatedPoint as a axis aligned bounding box
        let topLeft = new newPoint(bullet.x-bullet.visualWidth/2,bullet.y-bullet.tailLength);
        let bottomRight = new newPoint(bullet.x+bullet.visualWidth/2,bullet.y);
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
        let enemy = singleBulletEnemyCollision(bullet);
        //the PFType checks that the enemy isn't an upgrade
        //let enemyIndex = enemies.findIndex((enemyCheck)=>enemyCheck===enemy);
        //let bulletOwnerIndex = enemies.findIndex((enemyCheck)=>enemyCheck===bullet.owner);
        if (enemy!=undefined){
            if (enemy!=bullet.owner&&(enemy.team!=2)){
                bullet.enemiesLeft--;
                if (enemy.invinceable<1&&bullet.owner.team!=enemy.team){
                    screenShake+=2;
                    enemy.health--;
                    enemy.invinceable=enemy.maximumInvinceable;
                    //this is a placeholder way to make it obvious the enemy was hit
                    enemy.color='red';
                }
            }
        }
    }
}
function sheildEnemyCollision(){
    sheildBullet = new newBullet(sheild.firstSide.x,sheild.firstSide.y,0,sheild.angle+Math.PI/2,sheild.color,sheild.width,sheild.height,0,30,Infinity,undefined,enemies[0])
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
function drawCircles(cam){
    for (circle of circlesToDraw){
        drawCircle(circle.x,circle.y,circle.color,false,circle.size);
    }
}
function gunEnemyMovement(target){
    for (mainEnemyRoom of enemyRooms){
        if(!isSamePoint(floorPoint(mainEnemyRoom,1),floorPoint(target.room,1))){
            continue;
        }
        let enemyRoom=mainEnemyRoom.enemies;
        for (let i =0;i<enemyRoom.length;i++){
            let enemy=enemyRoom[i];
            if (enemy.PFType===1){
                if (keys['v']){
                    aimGun(enemy,mouseShifted,'red',62*(1/enemy.shotSpread),mainEnemyRoom,true);
                }else if (mousePressed&&!keysToggle['e']){
                    //mouseClickUsed=true;
                    aimGun(enemy,mouseShifted,'red',undefined,mainEnemyRoom,true);
                }
            }else if(enemy.PFType===10||enemy.PFType===4||enemy.PFType===5||enemy.PFType===3||enemy.PFType===2||enemy.PFType===17){
                aimGun(enemy,target,'blue',undefined,mainEnemyRoom,true);
            }
        }
    }
}
function drawHUD(){
    const TEXT_SIZE = 30*screenSize;
    ctx.font=TEXT_SIZE+'px serif';
    ctx.fillStyle='black';
    ctx.fillText(/*'Money:'+money+*/'  Health:'+enemies[0].health+'/'+enemies[0].maxHealth,c.width-(TEXT_SIZE*20*screenSize),TEXT_SIZE*screenSize);
    if (enemies[0].health===7&&enemies[0].maxHealth===11){
        ctx.fillText('SLUUURRRPEE',c.width-(TEXT_SIZE*9),TEXT_SIZE*2);
    }
    //ctx.fillText('Money:'+money,c.width-(TEXT_SIZE*11),TEXT_SIZE*.8);

    ctx.font = 48*screenSize+'px serif';
    ctx.fillText('FPS:'+roundTo(1000/(Date.now()-startTime),1),50*screenSize,45*screenSize);
    //ctx.fillText('Max Health:'+enemies[0].maxHealth,c.width-(TEXT_SIZE*11),TEXT_SIZE*.8);
}
function drawShop(){
    const gradient = ctx.createLinearGradient(shop.x, shop.y, shop.x, shop.y+20);

    // Add three color stops
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "blue");

    ctx.fillStyle = 'maroon';
    ctx.fillRect(shop.x,shop.y,10,50);
    ctx.fillRect(shop.x+90,shop.y,10,50);
    ctx.fillStyle = gradient;
    //ctx.fillRect(shop.x,shop.y,100,10);
    ctx.beginPath();
    ctx.moveTo(shop.x,shop.y);
    ctx.lineTo(shop.x+100,shop.y);
    ctx.lineTo(shop.x+90,shop.y+15);
    ctx.lineTo(shop.x+10,shop.y+15);
    //ctx.lineTo(shop.x,shop.y);
    ctx.fill();

    ctx.fillStyle='red';
    ctx.fillRect(shop.x,shop.y+60,100,50);
    ctx.fillStyle='black';
    ctx.font = '40px serif';
    ctx.fillText('Shop',shop.x+10,shop.y+95);
    ctx.fillStyle='blue';
    ctx.beginPath();
    ctx.arc(shop.x+50,shop.y+60,20,0,Math.PI,true);
    ctx.fill();
    ctx.stroke();
}
function fullEnemyWallColl(){
        //box collision checks for situations where the player would move right throught the wall, and wallColl just checks if the player is in the wall right now
        //it is ran twice so corners can check both walls then the other
        boxCollision(false);
        boxCollision(false);
        for (enemyRoom of enemyRooms){
            if (sameRoomPos(enemyRoom,turnIntoRoomPos(enemies[0]))){
                for (let i =0; i <collisionRepeat; i++){
                    enemyWallCollision(enemyRoom);
                }
            }
        }
}
function renderEverything(skipPlayers,camera){
    //the camera mechanic is unfinished and probally doesn't work cause variables share names
    drawDebug(camera);
    drawWalls(camera,false);
    /*for (enemyRoom of enemyRooms){
        if (enemyRoom.length>1){
            enemyRoom[1].color = 'orange'
        }
    }*/
    if (!skipPlayers){
        drawEnemies(camera);
    }
    drawBullets(camera);
    //drawShop();
    drawCircles(camera);
    //drawHUD doesn't need the camera because it is a special snowflake that doesn't draw following the camera
    drawHUD();
}
let frameNum = 0;
let enemiesToRemove = [];
function repeat(){
    frameNum++;
    if (screenShake>0){ 
        screenShake-=deltaTime;
    }
    enemiesToRemove=[];
    if (keysToggle['l']){
        enemies[0].health++;
    }
    circlesToDraw = [];
    moveBullets();
    if ((frameNum%30)===0){
        PFBoxes=[];
    }
    for (enemy of enemies){
        enemy.lastPosition=dupPoint(enemy);
    }
    enemyMovement(enemiesToRemove);
    if (!keys['n']){
        fullEnemyWallColl();
        for (let i = 0; i<1; i++){
            enemyCollisionEffects(enemiesToRemove);
            enemyCollision(enemiesToRemove);
        }
        fullEnemyWallColl();
    }
    gunEnemyMovement(enemies[0]);
    if (!keys['n']){
        bulletWallCollision();
    }
    for (enemyToRemove of enemiesToRemove){
        removeFromEnemyRooms(enemyToRemove);
        enemies.splice(enemies.findIndex((passed)=>passed===enemyToRemove),1);
    }
    bulletEnemyCollision();
    //sheildEnemyCollision();
    //this bool says whether or not to follow the player
    if (screenShake>25){
        screenShake=25;
    }
    camControl(true,enemies[0],keysToggle['c'],!keysToggle['x'],keys['z'],screenShake);
    //10 is added because if I didn't the mouse position would be slightly different from what it looks like
    mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
    if (keysUsed['h']){
        keysUsed['h']=false;
        enemies[0].x=mouseShifted.x;
        enemies[0].y=mouseShifted.y;
        enemies[0].lastPosition.x=mouseShifted.x;
        enemies[0].lastPosition.y=mouseShifted.y;
    }
    if (enemies[0].health<1){
        switchMode(6);
    }
}
function switchMode(modeTarget){
    //if (mode!=0&&modeTarget!=0){
        //switchMode(0);
    if (modeTarget===mode&&modeTarget!=0){
        switchMode(0);
    }else if(modeTarget===0){
        if (mode===3){
            let spawnerExport = null;
            console.log('copy everyting after the 5 on the second line')
            console.log(wallsExport);
            console.log(updateTilesList(editorSpawnPoints,spawnerExport));
            spawnerExport=updateTilesList(editorSpawnPoints,spawnerExport);
            walls=wallsCopy;
            wallBoxes = generateWallBoxes(2,walls,wallBoxes);
        }
        mode=0;
    }else if (modeTarget===3){
        if (mode!=4&&mode!=5){
            wallsCopy=walls;
            walls=[];
            editorSpawnPoints=[];
            importWalls(basicRoomTemplate,walls);
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
        camTarget=dupPoint(enemies[0]);
    }else{
        mode=modeTarget;
    }
}
function repeat2(){
    if (keysUsed['m']){
        keysUsed['m']=false;
        switchMode(2);
    }
    if (keysUsed['p']){
        keysUsed['p']=false;
        switchMode(1);
    }
    if (keysUsed['r']){
        keysUsed['r']=false;
        switchMode(3);
    }
    if (mode===0||mode===4){
        repeat();
        renderEverything(false,cam);
    }else if (mode===1||mode===5){
        if (keysUsed['o']){
            repeat();
            renderEverything(false,cam);
            keysUsed['o']=false;
        }else{
            renderEverything(false,cam);
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
        mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
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
        mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
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
        ctx.fillStyle='black';
        ctx.font = '48px serif';
        ctx.fillText('You Died! Reload The Page To Play Again!',300,(c.height/2));
    }
}
let deltaTime = 0;
let computingStartTime = 0;
function repeat3(){
    computingStartTime = Date.now();
    ctx.clearRect(0,0,c.width,c.height);
    repeat2();
    deltaTime = (Date.now()-startTime)/(1000/targetFPS);
    if (Math.abs(1-screenSize)<.3){
        //this just makes it so if the screen is deformed, it just won't draw the debug info
        ctx.fillStyle='black';
        ctx.font = '24px serif';
        ctx.fillText('deltaTime:'+roundTo2(deltaTime,100),400,20);
        ctx.fillText('target com time:'+Math.round(1000/targetRenderFPS),200,20);
        ctx.fillText('computing Time:'+(Date.now()-computingStartTime),200,45);
    }
    startTime = Date.now();
    //wait(100);
}
let startTime = Date.now();
//Example of a deep clone
//let oldWalls = JSON.parse(JSON.stringify(walls))
generateRooms(30,10);
wallBoxes = generateWallBoxes(2,walls,wallBoxes);
const targetFPS = 30;
const targetRenderFPS = 30;
setInterval(repeat3,1000/targetRenderFPS);