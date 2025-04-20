let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let hideMouse = false;
//c.style.cursor='none'
if (hideMouse){
    document.addEventListener("click", function () {
        document.body.requestPointerLock();
    });
}
/*c.addEventListener("click", async () => {
    if(!document.pointerLockElement) {
        try {
            await c.requestPointerLock({
            unadjustedMovement: true,
        });
        } catch (error) {
            if (error.name === "NotSupportedError") {
            // Some platforms may not support unadjusted movement.
            await c.requestPointerLock();
            } else {
            throw error;
            }
        }
    }
});*/
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});//this stops right clicking from opening the right click menu
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
let buttonsArray = [false, false, false, false, false, false, false, false, false];//0 is left click, 1 is middle click, and 2 is right click
let mousePressed = false;
let mouseClickUsed = false;
document.onmousedown = function(e) {
    buttonsArray[e.button] = true;
    mousePressed = true;
    if (e.button===2){
        //if there is a context menu open, uncomment this code
        //keys=[];
        //mousePressed=false;
    }
    mouseClickUsed = true;
}
document.onmouseup = function(e) {
    buttonsArray[e.button] = false;
    mousePressed = false;
}
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
class newMajorPowerUp{
    constructor(PFType,label,color,upgradeEffect,onClickEffect,coolDownMax,damage,range){
        this.PFType=PFType;
        this.label=label;
        this.secondLabel = '';
        this.upgradeEffect=upgradeEffect;//this triggers every frame
        this.onClickEffect=onClickEffect;//this only triggers when the assigned button is pressed
        this.originalCopy = null;
        this.coolDownMax=coolDownMax;
        this.coolDown=0;
        this.damage=damage;
        this.color=color;
        this.minorPowerUps=[];
        this.healthToHeal = 0;
        this.var1 = null;
        this.shotSpread = 2;
        this.range = range;
    }
}
class newMinorPowerUp{
    constructor(PFType,label,color,modifier){
        this.PFType=PFType;
        this.label=label;
        this.secondLabel = '';
        this.color=color;
        this.modifier=modifier;
        this.var1 = null; //this is just a var that a power up can use to store whatever is needed
        this.var2 = null; //this is another var
        this.var3 = null;
        /*this.firstUpdatingLabel = ''; //this is a label that can change, EX: cleared 5 rooms with this power up
        this.varUsedInLabel = 0;
        this.secondUpdatingLabel = '';*/
    }
}
class newEnemy {
    constructor(x,y,speed,size,color,PFType,target,gunCoolDownMax,health,label,effect,bulletSpreadNum,shotSpread,bulletKillPower,maximumInvinceable,bulletLength,bulletRange,damage,bulletSpeed,accuracy,upgradeEffect,bulletHomingStrength,direction){
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
            maximumInvinceable=5;
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
        if (bulletLength===undefined){
            bulletLength=60;
        }
        this.bulletLength=bulletLength;
        if (bulletRange===undefined){
            bulletRange=60;
        }
        this.bulletRange=bulletRange;
        if (damage===undefined){
            damage=1;
        }
        this.damage=damage;
        if (bulletSpeed===undefined){
            bulletSpeed=30;
        }
        this.bulletSpeed=bulletSpeed;
        //higher is less accurate
        if (accuracy===undefined){
            accuracy=0;
        }
        this.accuracy=accuracy;
        if (direction===undefined){
            direction=0;
        }
        this.direction=direction;
        this.inDoorWay=false;
        if (upgradeEffect===undefined){
            upgradeEffect=function(){}
        }
        this.upgradeEffect=upgradeEffect;
        if (bulletHomingStrength===undefined){
            bulletHomingStrength=0;
        }
        this.bulletHomingStrength=bulletHomingStrength;
        this.deleted=false;
        this.grappleTarget = null;
        this.grappleSpeed = 20;
        this.touchedEnemies = [];
        this.momentum = new newPoint(0,0);
        this.friction = 2;
        this.enemyRoom = null;
        this.originalCopy=null;
        this.killCount=0; //this could be updated but it doesn't do anything at the moment
    }
}
let guns = [2,6,7,32];
function newPowerUpPreset(PFType,isEffect){
    if (isEffect===undefined){
        isEffect=true;
    }
    let powerUp = null;
    let isGun = guns.includes(PFType);
    switch(PFType){
        case 0:
            powerUp = new newMajorPowerUp(PFType,'Dash','Lime',function (thisEnemy,thisPowerUp){if (dashFramesLeft<1){thisPowerUp.coolDown-=deltaTime}},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                dashDirection=thisEnemy.direction+Math.PI;
                dashFramesLeft=thisPowerUp.range;
                thisEnemy.health+=thisPowerUp.healthToHeal;
            },20,0,6);
        break
        case 1:
            powerUp = new newMajorPowerUp(PFType,'Grapple Hook','Yellow',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet =  new newBullet(0,0,60,0,'blue',40,5,50,20,1,new newPoint(0,0),thisEnemy,0,'',1,1);
                bullet.effect = function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.grappleTarget=dupPoint(thisBullet.owner);
                }
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    thisBullet.owner.grappleTarget=dupPoint(posOnWall);
                    bulletsToRemove.push(thisBullet);
                }
                bullet.drawBullet = function(bullet){
                    ctx.beginPath();
                    let screenBulletPos = offSetByCam(dupPoint(bullet),cam);
                    ctx.moveTo((bullet.owner.x-cam.x)*cam.zoom,(bullet.owner.y-cam.y)*cam.zoom);
                    ctx.lineTo(screenBulletPos.x,screenBulletPos.y);
                    ctx.strokeStyle=bullet.color;
                    ctx.lineWidth=bullet.visualWidth*cam.zoom;
                    ctx.stroke();
                }
                shootBullet(bullet,findAngle(mouseShifted,thisEnemy),enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,0,enemies[0],enemies[0].size);
                /*aimCustomGun(thisEnemy,mouseShifted,thisPowerUp.damage,60,0,1,1,0,'red',20,1,1,function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.grappleTarget=dupPoint(thisBullet.owner);
                });*/
            },20,0,30);//the range here doesn't actually control anything
        break
        case 2:
            /*powerUp = new newMajorPowerUp(PFType,'Grenade Gun','#4A69BB',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){ //this was an attempt at making bullets into bombs, but it didn't work as well as enemies, so I scraped it
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let speed = Math.min((findDis(mouseShifted,thisEnemy)/4),thisPowerUp.range);
                let bullet = new newBullet(0,0,speed,0,'black',20,20,5,30,1000,new newPoint(),thisEnemy,thisPowerUp.damage,'',1,0);
                bullet.realWidth=bullet.visualWidth;
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    //thisBullet.x=posOnWall.x;
                    //thisBullet.y=posOnWall.y;
                    if (thisBullet.timeLeft>5){
                        thisBullet.x=thisBullet.lastPosition.x;
                        thisBullet.y=thisBullet.lastPosition.y;
                        thisBullet.speed=0;
                    }
                }
                bullet.everyFrame = function(bullet,bulletsToRemove){
                    bullet.timeLeft-=deltaTime;
                    bullet.lastPosition = new newPoint(bullet.x,bullet.y);
                    bullet.x+=Math.sin(bullet.direction)*bullet.speed*deltaTime;
                    bullet.y+=Math.cos(bullet.direction)*bullet.speed*deltaTime;
                    bullet.speed/=1+(deltaTime/3); //this might not work with different fps
                    if (bullet.timeLeft<=5){
                        screenShake++;
                        bullet.visualWidth+=deltaTime*50;
                        bullet.realWidth=bullet.visualWidth;
                        bullet.tailLength+=deltaTime*50;
                        bullet.color='red';
                        bullet.x+=Math.sin(bullet.direction)*deltaTime*25;
                        bullet.y+=Math.cos(bullet.direction)*deltaTime*25;
                    }
                    if (bullet.timeLeft<1||bullet.enemiesLeft<1){
                        bulletsToRemove.push(bullet);
                    }
                }
                bullet.drawBullet = function(bullet){
                    let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
                    let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
                    let midPoint = findMidPoint(new newPoint(tailX,tailY),dupPoint(bullet));
                    addCircle(midPoint,bullet.color,bullet.visualWidth/2);
                }
                bullet.effect = function(enemyHit,thisBullet){
                    if (thisBullet.timeLeft<=5){
                        enemyHit.health-=thisBullet.damage;
                        enemyHit.invinceable=enemyHit.maximumInvinceable;
                        thisBullet.enemiesHit.push(enemyHit);
                    }
                }
                bullet.boringEffect = function(enemyHit,thisBullet){
                    thisBullet.enemiesLeft--;
                }
                shootBullet(bullet,findAngle(mouseShifted,thisEnemy),enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,0,enemies[0],enemies[0].size);
            },40,1,100);*/

            powerUp = new newMajorPowerUp(PFType,'Grenade Gun','#4A69BB',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                //let dropPoint = addToPoint(thisEnemy,Math.sin(thisEnemy.direction)*40,Math.cos(thisEnemy.direction)*40)
                let dropPoint= dupPoint(thisEnemy);
                enemies.push(newEnemyPreset(dropPoint,36,1,undefined,thisPowerUp.damage,mouseShifted));
                addToEnemyRooms(enemies[enemies.length-1]);
            },40,1,0);
        break
        case 3:
            powerUp = new newMajorPowerUp(PFType,'Heal 1HP in a Button Press','#4ABBA8',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                thisEnemy.health+=1;
            },100,0);
        break
        case 4:
            powerUp = new newMajorPowerUp(PFType,'Magnet','#FF7501',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let enemyRoomEnemies = thisEnemy.enemyRoom.enemies;
                for (enemy of enemyRoomEnemies){
                    if (enemy===thisEnemy||enemy.team===2){
                        continue;
                    }
                    if (undefined!=rayCast(enemy,thisEnemy,false,thisEnemy.enemyRoom.walls)){
                        continue;
                    }
                    let angle = findAngle(thisEnemy,enemy);
                    let dis = findDis(thisEnemy,enemy);
                    let force = 0;
                    if (dis<200){
                        force = 15;
                    }else if (dis<400){
                        force = 12;
                    }
                    //force = Math.max(20-(Math.max(dis,60)/40),0);
                    enemy.momentum = new newPoint(Math.sin(angle)*force,Math.cos(angle)*force);
                }
            },30,0,400);
        break
        case 5:
            powerUp = new newMajorPowerUp(PFType,'Push Enemies Away','#FFB475',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let enemyRoomEnemies = thisEnemy.enemyRoom.enemies;
                for (enemy of enemyRoomEnemies){
                    if (enemy===thisEnemy||enemy.team===2){
                        continue;
                    }
                    if (undefined!=rayCast(enemy,thisEnemy,false,thisEnemy.enemyRoom.walls)){
                        continue;
                    }
                    let angle = findAngle(thisEnemy,enemy);
                    let dis = findDis(thisEnemy,enemy);
                    let force = 0;
                    if (dis<200){
                        force = -25;
                    }else if (dis<400){
                        force = -15;
                    }
                    //force = Math.max(20-(Math.max(dis,60)/40),0);
                    enemy.momentum = new newPoint(Math.sin(angle)*force,Math.cos(angle)*force);
                }
            },30,0,400);
        break
        /*case 5:
            powerUp = new newMajorPowerUp(PFType,'Continous Magnet','#FF7501',function(thisEnemy,thisPowerUp){
                let enemyRoomEnemies = thisEnemy.enemyRoom.enemies;
                for (enemy of enemyRoomEnemies){
                    if (enemy===thisEnemy||enemy.team===2){
                        continue;
                    }
                    let angle = findAngle(thisEnemy,enemy);
                    let dis = findDis(thisEnemy,enemy);
                    let force = 0;
                    if (dis<200){
                        force = 2;
                    }else if (dis<400){
                        force = 1;
                    }
                    //force = Math.max(20-(Math.max(dis,60)/40),0);
                    enemy.momentum = new newPoint(Math.sin(angle)*force,Math.cos(angle)*force);
                }
            },function(){},30,0);
        break*/
        case 6:
            powerUp = new newMajorPowerUp(PFType,'Shotgun','#BABFC0',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let target=mouseShifted;
                let movementTarget = dupPoint(enemies[0]);
                if (controller!=undefined){
                    let axes = controller.axes;
                    let skipped = true
                    if (Math.abs(axes[2])>.1){ //this adds a deadzone
                        movementTarget.x+=axes[2];
                        skipped = false;
                    }
                    if (Math.abs(axes[3])>.1){
                        movementTarget.y+=axes[3];
                        skipped = false;
                    }
                    if (skipped){
                        movementTarget = addToPoint(movementTarget,Math.sin(shootingAngle),Math.cos(shootingAngle));
                    }
                    target=movementTarget;
                    shootingAngle = findAngle(target,enemies[0]);
                }
                aimCustomGun(thisEnemy,target,thisPowerUp.damage,30,40,3,thisPowerUp.shotSpread,0,'red',thisPowerUp.range,1);
            },30,.5,7);
        break
        case 7:
            powerUp = new newMajorPowerUp(PFType,'Sniper','grey',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                if (thisPowerUp.var1===null){
                    thisPowerUp.var1=0; //the amount of aim assist there should be
                }
                let target = mouseShifted;
                let targetAngle = findAngle(target,thisEnemy);
                let closestEnemy = undefined;
                if (thisPowerUp.var1!=0){
                    let closestAngle = Infinity;
                    for (enemy of thisEnemy.enemyRoom.enemies){
                        if (enemy===thisEnemy){
                            continue;
                        }
                        if (enemy.team!=1){
                            continue;//maybe change this so it also auto aims toward teammates(to shoot bombs)
                        }
                        let angle = findAngle(enemy,thisEnemy);
                        if (Math.abs(targetAngle-angle)<Math.abs(targetAngle-closestAngle)){
                            closestEnemy = enemy;
                            closestAngle = angle;
                        }
                    }
                    if (Math.abs(targetAngle-closestAngle)>thisPowerUp.var1){
                        closestEnemy=undefined; //the enemy wasn't close enough to the aim assist threshold
                    }
                }
                if (closestEnemy!=undefined){
                    target=closestEnemy;
                }
                aimCustomGun(thisEnemy,target,thisPowerUp.damage,40,60,1,1,0,'red',thisPowerUp.range,Infinity,0);
            },25,2,40);
        break
        case 8:
            powerUp = new newMajorPowerUp(PFType,'Click Here To Sell Item for $1','white',function (){},function(){
                //this is the trash can, it doesn't actually do anything
            },0,0);
        break
        /*case 8:
            powerUp = new newMajorPowerUp(PFType,'Machine Gun','#555555',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                aimCustomGun(thisEnemy,mouseShifted,thisPowerUp.damage,30,40,1,1,.3,'red',20,Infinity);
            },4,.25);
        break*/
        /*case 8:
            powerUp = new newMinorPowerUp(PFType,'Bombs Heal Everyone','#104239',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===2){
                    majorPowerUp.damage= -Math.abs(majorPowerUp);
                }
            })
        break*/  //this wouldn't work because the player usually doesn't take damage from bombs, although that could be changed
        case 9:
            powerUp = new newMinorPowerUp(PFType,'Half cooldown for gun on left click. If no gun','#278978',function (majorPowerUp,thisPowerUp){
                for (powerUp of powerUpsGrabbed){
                    if (guns.includes(powerUp.PFType)){
                        if (majorPowerUp===powerUp){
                            majorPowerUp.coolDownMax/=2;
                        }
                        return;
                    }
                }
            })
            powerUp.secondLabel = 'on left click, half cooldown for gun on right click';
        break
        case 10:
            powerUp = new newMinorPowerUp(PFType,'Decrease Cooldown on Guns by a Third','#414f40',function (majorPowerUp,thisPowerUp){
                if (guns.includes(majorPowerUp.PFType)){
                    majorPowerUp.coolDownMax*=.66666;
                }
            })
        break
        case 11:
            powerUp = new newMinorPowerUp(PFType,'Explosives Deal 50% More Damage','#FF6E6E',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===2){
                    majorPowerUp.damage*=1.5;
                }
            })
        break
        case 12:
            powerUp = new newMinorPowerUp(PFType,'Double Damage for Weapon Bound to Right Click','#FFAC01',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[1]){
                    majorPowerUp.damage*=2;
                }
            })
        break
        case 13:
            powerUp = new newMinorPowerUp(PFType,'Every room cleared without taking damage, halve cooldown on shotgun','#FF6EEC',function (majorPowerUp,thisPowerUp){
                if (enemies[0].health<thisPowerUp.var1){
                    thisPowerUp.var3=1
                }else if (enemies[0].health>thisPowerUp.var1){
                    thisPowerUp.var1=enemies[0].health;
                }
                if (thisPowerUp.var2.roomNum<enemies[0].enemyRoom.roomNum){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    thisPowerUp.var3*=2;
                }
                if (majorPowerUp.PFType===5){
                    majorPowerUp.coolDownMax/=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Divisor: '+thisPowerUp.var3;
            })
            powerUp.var1 = enemies[0].health; //var1 is the starting health
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
            powerUp.var3 = 1; //var3 is the multiplier
        break
        case 14:
            powerUp = new newMinorPowerUp(PFType,'Decrease Cooldown on Everything by a Quarter','#104239',function (majorPowerUp,thisPowerUp){
                majorPowerUp.coolDownMax*=.75;
            })
        break
        case 15:
            powerUp = new newMinorPowerUp(PFType,'Using Dash Heals 1HP','#4cd44e',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===0){
                    majorPowerUp.healthToHeal+=1;
                }
            })
        break
        case 16:
            powerUp = new newMinorPowerUp(PFType,'Aim Assist on Sniper','#5e3b5e',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===7){
                    if (majorPowerUp.var1=null){
                        majorPowerUp.var1 = 0;
                    }
                    majorPowerUp.var1+=.7;
                }
            })
        break
        case 17:
            powerUp = new newMinorPowerUp(PFType,'After Gaining Health, Deal Triple Damage for 3 Seconds','#f0c013',function (majorPowerUp,thisPowerUp){
                if(enemies[0].health>thisPowerUp.var1){
                    thisPowerUp.var2+=90;
                }
                thisPowerUp.var1=enemies[0].health;
                if(thisPowerUp.var2>0){
                    if (majorPowerUp===powerUpsGrabbed[0]){
                        thisPowerUp.var2-=deltaTime;
                    }
                    majorPowerUp.damage*=3;
                }
            })
            powerUp.var1 = enemies[0].health; //var1 is the starting health
            powerUp.var2 = 0; //var2 is the frames left with double damage
        break
        case 18:
            powerUp = new newMinorPowerUp(PFType,'Tighten Bullet Spread','#b260db',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===6){
                    majorPowerUp.shotSpread*=.5;
                }
            })
        break
        case 19:
            powerUp = new newMajorPowerUp(PFType,'Shoot Random Bullets','#BABFC0',function (thisEnemy,thisPowerUp){
                thisPowerUp.coolDown--;
                if (bulletsInClip.length<1&&thisPowerUp.coolDown<0){
                    thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                    for (let i=0;i<5;i++){
                        bulletsInClip.push(newBulletPreset(Math.floor(Math.random()*4),enemies[0],new newPoint(0,0)));
                        //bulletsInClip.push(newBulletPreset(Math.floor(Math.random()*5),enemies[0],new newPoint(0,0)));
                    }
                }
            },function(thisEnemy,thisPowerUp){
                if (bulletsInClip.length>0){
                    thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                    screenShake+=3;
                    let bullet = bulletsInClip.splice(0,1)[0];
                    shootBullet(bullet,findAngle(mouseShifted,thisEnemy),enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,0,enemies[0],enemies[0].size);
                }
            },30,.5);
        break
        case 20:
            powerUp = new newMinorPowerUp(PFType,'Increase Max HP by 5','#f7f74a',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    enemies[0].maxHealth+=5;
                }
            })
        break
        case 21:
            powerUp = new newMinorPowerUp(PFType,'Get Multiple of the Same Power Up','#08a838',function (majorPowerUp,thisPowerUp){
                getDuplicateMinorPowerUps=true;
            })
        break
        case 23:
            powerUp = new newMinorPowerUp(PFType,'-2 Max Health, Double Damage','#277bab',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    enemies[0].maxHealth-=2;
                }
                majorPowerUp.damage*=2;
            })
        break
        case 24:
            powerUp = new newMinorPowerUp(PFType,'If at or below 3HP, Double Damage','#ffcc00',function (majorPowerUp,thisPowerUp){
                if (enemies[0].health<=3){
                    majorPowerUp.damage*=2;
                }
            })
        break
        case 25:
            powerUp = new newMinorPowerUp(PFType,'Move 50% Faster','#000099',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    enemies[0].targetSpeed*=1.5;
                }
            })
        break
        case 26:
            powerUp = new newMinorPowerUp(PFType,'Enemies Can Drop 2 More Health','#660066',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxHealthDrop+=2;
                }
            })
        break
        case 27:
            powerUp = new newMinorPowerUp(PFType,'Every 2 Rooms Cleared, Enemies can Drop 1 More Health','#cc0099',function (majorPowerUp,thisPowerUp){
                if ((enemies[0].enemyRoom.roomNum-thisPowerUp.var2.roomNum)>=2){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    thisPowerUp.var3++;
                }
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxHealthDrop+=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Extra Health: '+thisPowerUp.var3;
            })
            if (enemies[0].enemyRoom===null){ //the game has just started and the player doesn't have what enemyroom it is in yet

            }
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
            powerUp.var3 = 0; //var3 is the extra health
        break
        case 28:
            powerUp = new newMajorPowerUp(PFType,'Click Here With A Small Power Up And Use $5 to Lock It In','White',function(){},function(thisEnemy,thisPowerUp){
                money-=thisPowerUp.var1;
                thisPowerUp.var1+=5;
                thisPowerUp.label = 'Click Here With A Small Power Up And Use $'+thisPowerUp.var1+' to Lock It In';
            });
            powerUp.var1 = 5;
        break
        case 29:
            powerUp = new newMinorPowerUp(PFType,'Every Room Entered, Get $1 for every $5 you have','#99ff66',function (majorPowerUp,thisPowerUp){
                if (thisPowerUp.var2===null){
                    thisPowerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
                }
                if (thisPowerUp.var2!=null){
                    if ((enemies[0].enemyRoom.roomNum-thisPowerUp.var2.roomNum)>=1){
                        thisPowerUp.var2=enemies[0].enemyRoom;
                        money+=Math.floor(money/5);
                    }
                }
            })
        break
        case 30:
            powerUp = new newMinorPowerUp(PFType,'Enemies can Drop 1 More Money','#33cc33',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxMoneyDrop++;
                }
            })
        break
        case 31:
            powerUp = new newMinorPowerUp(PFType,'Double Range on Shotgun','#9999ff',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===6){
                    majorPowerUp.range*=2;
                }
            })
        break
        case 32:
            powerUp = new newMajorPowerUp(PFType,'Water Gun','aqua',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,15,0,'aqua',20,20,5,60,1,new newPoint(),thisEnemy,thisPowerUp.damage,'sploosh',1,0);
                bullet.realWidth = bullet.visualWidth;
                bullet.drawBullet = function(bullet){
                    let midPoint = findBulletMiddle(bullet);
                    addCircle(midPoint,'aqua',bullet.visualWidth/2);
                    midPoint=offSetByCam(midPoint);
                    for (waterBullet of waterBullets){//this looks kind of jank and really cool at the same time
                        if (findDis(waterBullet,bullet)<100){
                            let waterMidPoint = offSetByCam(findBulletMiddle(waterBullet));
                            let bulletAngle = findAngle(bullet,waterBullet);
                            ctx.beginPath();
                            ctx.strokeStyle='aqua';
                            //ctx.fillStyle='aqua';
                            ctx.lineWidth = waterBullet.visualWidth;
                            ctx.moveTo(waterMidPoint.x,waterMidPoint.y);
                            ctx.lineTo(midPoint.x,midPoint.y)
                            ctx.stroke();
                            //ctx.fill();
                            ctx.lineWidth=1;
                            ctx.strokeStyle='black';
                        }
                    }
                    waterBullets.push(bullet);
                }
                shootBullet(bullet,findAngle(mouseShifted,thisEnemy),enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,0,enemies[0],enemies[0].size);
                /*aimCustomGun(thisEnemy,mouseShifted,thisPowerUp.damage,60,0,1,1,0,'red',20,1,1,function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.grappleTarget=dupPoint(thisBullet.owner);
                });*/
            },10,.3,30);//the range here doesn't actually control anything
        break
        case 33:
            powerUp = new newMinorPowerUp(PFType,'Gain a 10% Damage Boost for Every HP You Have','#993300',function (majorPowerUp,thisPowerUp){
                thisPowerUp.secondLabel = 'Current Multiplier: '+(1+(enemies[0].health*.1))+'X';
                majorPowerUp.damage*=1+(enemies[0].health*.1);
            });
        break
        case 34:
            powerUp = new newMajorPowerUp(PFType,'','white',function (thisEnemy,thisPowerUp){},function(thisEnemy,thisPowerUp){
                //this is a placeholder for just an invisible thing to click
            });
        break
        case 35:
            powerUp = new newMinorPowerUp(PFType,'Turn Excess HP Pickups into .5 Money','#ccff33',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    healthToMoneyRatio+=.5;
                }
            })
        break
        //power up idea:
        //each shot that hits an enemy has a 1/4 chance to drop a health pickup
        //spend $1 for a full heal
        //Illigal hacking: First, weapon gets damage boost, but The more you've used a specific instance of a weapon,the less damage it deals
    }
    if (powerUp instanceof newMajorPowerUp&&isEffect){
        let specialEffect = Math.random()*20;
        if (specialEffect<1&&isGun){
            powerUp.secondLabel='Quadruple Damage!!';
            powerUp.damage*=4;
        }else if (specialEffect<4&&isGun){
            powerUp.secondLabel='Double Damage!';
            powerUp.damage*=2;
        }else if (specialEffect<7){
            powerUp.secondLabel='Halve Cooldown!';
            powerUp.coolDownMax*=.5;
        }
    }
    if (powerUp!=null){
        let var1 = powerUp.var1;
        let var2 = powerUp.var2;
        let var3 = powerUp.var3;
        powerUp.var1 = null;
        powerUp.var2 = null;
        powerUp.var3 = null;
        powerUp.originalCopy=JSON.parse(JSON.stringify(powerUp));
        powerUp.var1 = var1;
        powerUp.var2 = var2;
        powerUp.var3 = var3;
    }
    return powerUp;
}
let waterBullets = [];
function newBulletPreset(bulletType,owner,target){
    let bullet= null;
    switch (bulletType){
        case 0:
            //Basic bullet
            bullet = new newBullet(0,0,30,0,'red',40,5,bulletType,30,1,new newPoint(0,0),owner,1,'Your Basic Everyday Killing Bullet');
        break
        case 1:
            //Shotgun bullet
            bullet = new newBullet(0,0,30,0,'dark gray',40,5,bulletType,7,1,new newPoint(0,0),owner,.5,'Your Big Boy Triple Shot',3,2);
        break
        case 2:
            //Exploding bullet
            bullet = new newBullet(0,0,30,0,'aqua',40,5,bulletType,15,1,new newPoint(0,0),owner,.5,'Your BOOM Bullet',1,2);
            bullet.effect = function(enemyHit,thisBullet){
                enemyHit.health-=thisBullet.damage;
                enemyHit.invinceable=enemyHit.maximumInvinceable;
                addToEnemyRooms(newEnemyPreset(thisBullet,36,1,'',1,dupPoint(thisBullet)));
            }
            bullet.wallEffect = function(wallHit,thisBullet,posOnWall){
                addToEnemyRooms(newEnemyPreset(thisBullet.lastPosition,36,1,'',1,dupPoint(thisBullet.lastPosition)));
            }
        break
        case 3:
            //Splitting bullet
            bullet = new newBullet(0,0,30,0,'green',40,5,bulletType,15,1,new newPoint(0,0),owner,.5,'Your War Crime Bullet With Shrapnel',1);
            bullet.effect = function(enemyHit,thisBullet){
                enemyHit.health-=thisBullet.damage;
                enemyHit.invinceable=enemyHit.maximumInvinceable;
                let bullet = newBulletPreset(20,thisBullet.owner,thisBullet.target);
                shootBullet(bullet,Math.random()*10,thisBullet.owner,bullet.bulletSpreadNum,bullet.shotSpread,0,thisBullet.lastPosition,0);
            }
            bullet.wallEffect = function(wallHit,thisBullet,posOnWall){
                let bullet = newBulletPreset(20,thisBullet.owner,thisBullet.target);
                shootBullet(bullet,Math.random()*10,thisBullet.owner,bullet.bulletSpreadNum,bullet.shotSpread,0,thisBullet.lastPosition,0);
            }
        break
        case 4:
            //Bouncing bullet
            bullet = new newBullet(0,0,30,0,'#aa00ff',40,5,bulletType,15,1,new newPoint(0,0),owner,.5,'Your Rubber, Bouncing Bullet',1);
            bullet.wallEffect = function(wallHit,thisBullet,posOnWall){
                let wallAngle = findAngle(wallHit.first,wallHit.second);
                let wallNormal = wallAngle;
                if (findAngle(wallHit.first,thisBullet)<0){
                    wallNormal-=Math.PI/2;
                }else{
                    wallNormal+=Math.PI/2;
                }
                let reflectedAngle = 2*(wallNormal-thisBullet.direction);
                //bullet reflections dont work
                shootBullet(thisBullet,reflectedAngle,thisBullet.owner,1,0,0,thisBullet.lastPosition,0);
                bullets[bullets.length-1].timeLeft = thisBullet.timeLeft;
                bullets[bullets.length-1].timeLeft--;
            }
        break
        case 20:
            //A weak bullet shot by the shrapnel bullet
            bullet = new newBullet(0,0,30,0,'black',40,5,bulletType,15,1,new newPoint(0,0),owner,.5,'Your Shrapnel',4,Math.PI*5);
        break
        case 50:
            //Grapple Hook
            bullet = new newBullet(0,0,60,0,'blue',40,5,bulletType,20,1,new newPoint(0,0),owner,0,'Your Sexy Grapple Hook',1,1);
            bullet.effect = function(enemyHit,thisBullet){
                enemyHit.health-=thisBullet.damage;
                enemyHit.grappleTarget=dupPoint(thisBullet.owner);
            }
            bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){//this is broken, the hook doesn't dissapear on the wall
                thisBullet.owner.grappleTarget=dupPoint(posOnWall);
                bulletsToRemove.push(bullet);
            }
            bullet.drawBullet = function(bullet){
                ctx.beginPath();
                let screenBulletPos = offSetByCam(dupPoint(bullet),cam);
                ctx.moveTo((bullet.owner.x-cam.x)*cam.zoom,(bullet.owner.y-cam.y)*cam.zoom);
                ctx.lineTo(screenBulletPos.x,screenBulletPos.y);
                ctx.strokeStyle=bullet.color;
                ctx.lineWidth=bullet.visualWidth*cam.zoom;
                ctx.stroke();
            }
        break
    }
    return bullet
}
function newEnemyPreset(pos,PFType,power,message,enemyPower,target){
    if (power===undefined){
        power=1;
    }
    if (enemyPower===undefined){
        enemyPower=1;
    }
    if (target===undefined){
        if (PFType===36){
            target=new newPoint(0,0);
        }else{
            target=enemies[0];
        }
    }
    let enemy = null;
    if (message===undefined){
        message='';
    }
    switch (PFType){
        case 0:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower),20,'pink',0,target,60,1+(enemyPower*3),'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2){
                    touchedEnemy.health--;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                }
            });
        break
        case 1:
            enemy =new newEnemy(pos.x,pos.y,12,20,'blue',1,target,30,5,'',undefined,1,1.5,1,15);
        break
        case 2:
            enemy = new newEnemy(pos.x,pos.y,0,20,'black',2,target,75-(enemyPower),2+(enemyPower/2),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20);
        break
        case 3:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/2),20,'grey',3,target,30-(enemyPower*2.5),3+(enemyPower/5),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,50);
        break
        case 4:
            enemy = new newEnemy(pos.x,pos.y,3,20,'green',4,target,45-(enemyPower*3),(2*Math.pow(2,enemyPower/3)),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20+enemyPower);
        break
        case 5:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/3),20,'lime',5,target,70-(enemyPower*3),1+(2*Math.pow(2,enemyPower/4)),'');
        break
        //here speed will be used as a placeholder for power
        case 6:
            enemy = new newEnemy(pos.x,pos.y,power,0,'yellow',6,target,Infinity,Infinity,'Increases Health',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
                touchedEnemy.health+=4;
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){
                touchedEnemy.maxHealth+=2;
            })
        break
        case 7:
            enemy = new newEnemy(pos.x,pos.y,power,10,'yellow',6,target,Infinity,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                //gunMaxCoolDown is a timer until it despawns on this one
                screenShake=1;
                if (touchedEnemy.PFType===1){
                    if (touchedEnemy.health>=touchedEnemy.maxHealth){
                        money+=healthToMoneyRatio;
                    }else{
                        touchedEnemy.health+=1;
                    }
                    enemiesToRemove.push(thisEnemy);
                }
            })
        break
        case 8:
            enemy = new newEnemy(pos.x,pos.y,power,0,'gray',6,target,Infinity,Infinity,'Increase Firing Speed',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(8);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.gunCoolDownMax/=1.5;})
        break
        case 9:
            enemy = new newEnemy(pos.x,pos.y,power,0,'black',6,target,Infinity,Infinity,'Shoot More Bullets',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(9);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.bulletSpreadNum+=2;})
        break
        case 10:
            enemy = new newEnemy(pos.x,pos.y,2+(enemyPower),20,'magenta',10,target,60-(enemyPower*2),4);
        break
        case 11:
            enemy = new newEnemy(pos.x,pos.y,power,0,'orange',6,target,Infinity,Infinity,'Reduce Bullet Spread',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(11);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.shotSpread/=1.5;})
        break
        case 12:
            enemy = new newEnemy(pos.x,pos.y,power,0,'red',6,target,Infinity,Infinity,'Bullets Pierce More Enemies',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(12);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.bulletKillPower++;})
        break
        case 13:
            enemy = new newEnemy(pos.x,pos.y,power,0,'blue',6,target,Infinity,Infinity,'Increases Speed',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(13);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.targetSpeed+=2;})
        break
        case 14:
            //placeholder for text
            enemy = new newEnemy(pos.x,pos.y,0,0,'white',14,target,Infinity,Infinity,message);
        break
        case 15:
            //boss
            enemy = new newEnemy(pos.x,pos.y,3,40,'black',4,target,45-(enemyPower*4.3),1+(8*Math.pow(2,enemyPower/2)),'',undefined,3);
        break
        case 16:
            //money
            enemy = new newEnemy(pos.x,pos.y,0,10,'green',6,target,Infinity,Infinity,'$',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (touchedEnemy.PFType===1){
                    money++;
                    enemiesToRemove.push(thisEnemy);
                }
            });
        break
        case 17:
            enemy = new newEnemy(pos.x,pos.y,2+(enemyPower/2),20,'turquoise',17,target,45-(enemyPower*3),1+(3*Math.pow(2,enemyPower/3)),'');
        break
        case 18:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower*1.5),20,'#800020',0,target,60,1+(enemyPower),'',function(touchedEnemy,thisEnemy,enemiesToRemove,alreadyRan){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy===thisEnemy.target)){
                    touchedEnemy.health--;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                }
            });
        break
        case 19:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#EE4B2B',6,target,Infinity,Infinity,'Reduce Dash Cooldown',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(19);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){maximumDashCoolDown/=1.5;})
        break
        case 20:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#CD9B69',6,target,Infinity,Infinity,'Increases Bullet Speed',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(20);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.bulletSpeed+=10;})
        break
        case 21:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#B79999',6,target,Infinity,Infinity,'Increases Bullet Damage',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(21);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){touchedEnemy.damage*=1.5;})
        break
        case 22: 
            enemy=new newEnemy(pos.x,pos.y,0,20,'red',undefined,undefined,undefined,undefined,'Shotgun',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){
                touchedEnemy.bulletSpreadNum=3;
                touchedEnemy.bulletRange=7;
            })
        break
        case 23: 
            enemy=new newEnemy(pos.x,pos.y,0,20,'red',undefined,undefined,undefined,undefined,'Sniper',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){
                touchedEnemy.damage=1.5;
                touchedEnemy.bulletKillPower=Infinity;
                touchedEnemy.bulletSpeed=40;
            })
        break
        case 24: 
            enemy=new newEnemy(pos.x,pos.y,0,20,'red',undefined,undefined,undefined,undefined,'Machine Gun',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){
                touchedEnemy.bulletLength=30;
                touchedEnemy.gunCoolDownMax=3;
                touchedEnemy.damage=.25;
                //touchedEnemy.bulletRange=20;
                touchedEnemy.bulletRange=100000;
                touchedEnemy.accuracy=.3;
            })
        break
        case 25:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#CD7F32',6,target,Infinity,Infinity,'Double Damage when on half health',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                if (realPlayer.health<=realPlayer.maxHealth/2){
                    touchedEnemy.damage*=2;
                }
            })
        break
        case 26:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#349720',6,target,Infinity,Infinity,'Half damage but twice as fast cooldown',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                touchedEnemy.damage/=2;
                touchedEnemy.gunCoolDownMax/=2
            })
        break
        case 27:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#236616',6,target,Infinity,Infinity,'Double damage but twice as long cooldown',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                touchedEnemy.damage*=2;
                touchedEnemy.gunCoolDownMax*=2;
            })
        break
        case 28:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#1A96B0',6,target,Infinity,Infinity,'Homing bullets',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                touchedEnemy.bulletHomingStrength+=.1;
            })
        break
        case 29:
            //this is the minion
            enemy = new newEnemy(pos.x,pos.y,10,20,'#00C9FF',4,target,minionReloadSpeed,2,'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,minionDamage,30);
        break
        case 30:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#EAFF7E',6,target,Infinity,Infinity,'Summon more Minions',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                maximumMinions+=2;
            })
        break
        case 31:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#FFD3B3',6,target,Infinity,Infinity,'More Aim Assist',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                autoAimStrength+=.2;
            })
        break
        case 32:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#A7AD3E',6,target,Infinity,Infinity,'Minions Drop Loot',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                minionsDropLoot=true;
            })
        break
        case 33:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#78FFA1',6,target,Infinity,Infinity,'Minions reload twice as fast',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                minionReloadSpeed/=2;
            })
        break
        case 34:
            enemy = new newEnemy(pos.x,pos.y,power,0,'#249747',6,target,Infinity,Infinity,'Minions deal double Damage',function(touchedEnemy,thisEnemy,enemiesToRemove){
                screenShake=20;
                enemiesToRemove.push(thisEnemy);
                powerUpsGrabbed.push(PFType);
            },undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy,realPlayer){
                minionDamage*=2;
            })
        break
        case 35: 
            enemy=new newEnemy(pos.x,pos.y,0,20,'red',undefined,undefined,undefined,undefined,'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,function(touchedEnemy){
                //necromancer
                minionDamage*=2;
                minionReloadSpeed/=2;
                maximumMinions+=2;
            })
        break
        case 36: //this is the actual bomb
            //the momentum doesn't go the same distance at different frames rates, but the difference is not that big so I didn't fix it
            let targetSpeed = Math.min((findDis(target,enemies[0])/3.5),100); //100 is the range
            let targetAngle = findAngle(target,enemies[0]);
            let desiredVector = new newPoint(Math.sin(targetAngle)*targetSpeed,Math.cos(targetAngle)*targetSpeed);
            enemy = new newEnemy(pos.x,pos.y,targetSpeed,10,'red',PFType,target,25,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if ((touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2&&thisEnemy.gunCooldown<0){
                    if (undefined===thisEnemy.touchedEnemies.find((enemyCheck)=>enemyCheck===touchedEnemy)){
                        touchedEnemy.health-=thisEnemy.damage;
                        touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                        let angle = findAngle(thisEnemy,touchedEnemy);
                        touchedEnemy.momentum.x-=Math.sin(angle)*13;
                        touchedEnemy.momentum.y-=Math.cos(angle)*13;
                        thisEnemy.touchedEnemies.push(touchedEnemy);
                    }
                }
            },undefined,undefined,undefined,undefined,undefined,undefined,enemyPower,undefined,undefined,undefined,undefined,targetAngle);
            enemy.momentum = dupPoint(desiredVector);
            enemy.friction=3;
            enemy.gunCooldown=enemy.gunCoolDownMax;
        break
    }
    if (PFType!=7&&PFType!=16){//this isnt the best way to do it, it just stops the bad thing
        enemy.originalCopy = JSON.parse(JSON.stringify(enemy));
    }
    return enemy
}
class newBullet {
    constructor(x,y,speed,direction,color,tailLength,visualWidth,type,maximumTime,enemyKillPower,lastPosition,owner,damage,label,bulletSpreadNum,shotSpread){
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
        if (damage===undefined){
            damage=1;
        }
        this.damage=damage;
        this.enemiesHit=[];
        this.boringEffect = function(enemyHit,thisBullet){
            thisBullet.enemiesHit.push(enemyHit);
            thisBullet.enemiesLeft--;
            screenShake+=1;
        } //this will be the things that every bullet does, the boring stuff
        this.effect = function(enemyHit,thisBullet){
            enemyHit.health-=thisBullet.damage;
            enemyHit.invinceable=enemyHit.maximumInvinceable;
        } //this will be what each bullet does, it will be special and change depending on the bullet
        //they're split up because I would have to copy boring effect every time I wanted to make a small actual change between bullets
        this.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
            screenShake+=.7;
            bulletsToRemove.push(thisBullet);
        }
        if (label===undefined){
            label='';
        }
        this.label=label;
        if (bulletSpreadNum === undefined){
            bulletSpreadNum = 1;
        }
        this.bulletSpreadNum = bulletSpreadNum;
        if (shotSpread === undefined){
            shotSpread = 1;
        }
        this.shotSpread = shotSpread;
        this.drawBullet = function(bullet){ //this is the default way to draw bullets
            let useImage = false;
            let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
            let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
            ctx.save();
            let bulletScreenPos = offSetByCam(new newPoint(tailX,tailY));
            if (useImage&&(bullet.type===0)){
                ctx.translate(bulletScreenPos.x,bulletScreenPos.y);
                ctx.rotate(-bullet.direction);
                ctx.drawImage(bulletImage,0,0,cam.zoom*bullet.visualWidth,cam.zoom*bullet.tailLength);
            }else{
                ctx.beginPath();
                ctx.moveTo((bullet.x-cam.x)*cam.zoom,(bullet.y-cam.y)*cam.zoom);
                ctx.lineTo((tailX-cam.x)*cam.zoom,(tailY-cam.y)*cam.zoom);
        
                //ctx.moveTo((bullet.x-cam.x)*cam.zoom,(bullet.y-cam.y)*cam.zoom);
                //ctx.lineTo(((bullet.x)-cam.x)*cam.zoom,((bullet.y-bullet.tailLength)-cam.y)*cam.zoom);
        
                ctx.strokeStyle=bullet.color;
                ctx.lineWidth=bullet.visualWidth*cam.zoom;
                ctx.stroke();
                //drawCircle(bullet.y,bullet.x,'yellow',false);
            }
            ctx.restore();
        }
        this.everyFrame = function(bullet,bulletsToRemove){
            bullet.timeLeft-=deltaTime;
            bullet.lastPosition = new newPoint(bullet.x,bullet.y);
            bullet.x+=Math.sin(bullet.direction)*bullet.speed*deltaTime;
            bullet.y+=Math.cos(bullet.direction)*bullet.speed*deltaTime;
            if (bullet.timeLeft<1||bullet.enemiesLeft<1){
                bulletsToRemove.push(bullet);
            }
        }
        this.deleted = false;
    }
} 
let mouse = new newPoint(0,0);
let mouseShifted = dupPoint(mouse);
if (hideMouse){
    document.onmousemove = handleMouseMove;
}else{
    document.onmousemove = handleMouseMove1;
}
function handleMouseMove(event){
    if (controller===undefined){
        let multiplier = Math.min(3,Math.max(.5,findDis(new newPoint(0,0),new newPoint(event.movementX,event.movementY))));
        mouse.x+=event.movementX*multiplier/4;
        mouse.y+=event.movementY*multiplier/4;
    }else{
        //this is handled elsewhere
    }
}
function handleMouseMove1(event) {
    if (controller===undefined){
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
    }else{
        let axes = controller.axes;
        mouse.x+=axes[2]*2;
        mouse.y+=axes[3]*2;
    }
}
let controller;


var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad; var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);
    var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);
    var b = document.createElement("div");
    b.className = "buttons";
    for (var i=0; i<gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }
    d.appendChild(b);
    var a = document.createElement("div");
    a.className = "axes";
    for (i=0; i<gamepad.axes.length; i++) {
        e = document.createElement("meter");
        e.className = "axis";
        //e.id = "a" + i;
        e.setAttribute("min", "-1");
        e.setAttribute("max", "1");
        e.setAttribute("value", "0");
        e.innerHTML = i;
        a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById("start").style.display = "none";
    document.body.appendChild(d);
    rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}
function updateStatus() {
    controller = controllers[0];
    scangamepads();
    for (j in controllers) {
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");
        for (var i=0; i<controller.buttons.length; i++) {
        var b = buttons[i];
        var val = controller.buttons[i];
        var pressed = val == 1.0;
        var touched = false;
        if (typeof(val) == "object") {
            pressed = val.pressed;
            if ('touched' in val) {
            touched = val.touched;
            }
            val = val.value;
        }
        var pct = Math.round(val * 100) + "%";
        b.style.backgroundSize = pct + " " + pct;
        b.className = "button";
        if (pressed) {
            b.className += " pressed";
        }
        if (touched) {
            b.className += " touched";
        }
        }

        var axes = d.getElementsByClassName("axis");
        for (var i=0; i<controller.axes.length; i++) {
        var a = axes[i];
        a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
        a.setAttribute("value", controller.axes[i]);
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
        controllers[gamepads[i].index] = gamepads[i];
        }
    }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
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
//let wallsImport = ',1250.-50.-50.-50,1250.600.1250.-50,-50.600.1250.600,-50.-50.-50.600'
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
devMode=true;
let screenShake=0;
let screenSize=1;
let weaponChoice=0;
//cam.zoom=Math.min((c.height-HUDHeight)/((doorLength*2)+roomHeight),c.width/((doorLength*2)+roomWidth));
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
let textToDraw = [];
let rectsToDraw = [];
let bullets = [];
let changePlayerColor = false;
let mode =7;
//this is outdated
/*modes:
0:normal gameplay
1:The game is paused and goes by 1 full frame at a time
2:editor mode
3:room editor mode
*/
/*PFTypes:
0:move towards straight in the direction of the player
1:The player's controls, moves with the botton inputs
2:placeholder and should never move
3:Actual pathfinding using the aStar algoritm
4:basic PFType 0, but shoots when it has a clear line of sight
5:basic PFType 3, but shoots when it has a clear line of sights

6:Health power up
*/
let enemies = [];
let enemyRooms = [];
let wallsCopy = [];
//this is the player
enemies.push(newEnemyPreset(new newPoint(roomWidth/2,roomHeight-200),1));
let playerImages = {
    back:new Image(),
    front:new Image(),
    left:new Image(),
    right:new Image(),
    imagesList:null,
}
playerImages.front.src = 'Player_test_forward.png'
playerImages.right.src = 'Player_test_right.png'
playerImages.left.src = 'Player_test_left.png'
playerImages.back.src = 'Player_test_back.png'
let bulletImage=new Image();
bulletImage.src='Bullet_test.png';
playerImages.imagesList=[playerImages.front,playerImages.right,playerImages.back,playerImages.left];
let targetImage = new Image();
targetImage.src='Target.png';
let powerUpIconImage = new Image();
powerUpIconImage.src = 'powerUpIcon.png';
let shootingAngle = 0;
let maximumDashCoolDown = 20;
let dashCooldown = 0;
let powerUpSpace = 2;
let minorPowerUpSpace = 5;
let powerUpsGrabbed = [];
let minorPowerUpsGrabbed = [];
let permanentMinorPowerUps = [];
let upgrader = newPowerUpPreset(28,false);
let bulletsInClip = [];
let getDuplicateMinorPowerUps = false;
let healthToMoneyRatio = 0;
let maximumMinions = 1;
//enemies.push(new newEnemy(roomWidth/2,roomHeight,null,20,'brown',1,2,5));
let camTarget = new newPoint(c.width/2,(c.height-HUDHeight)/2);
let collisionRepeat = 1;
let lastMousePos = null;
let autoAimStrength = 0;
let minionsDropLoot = false;
let minionDamage = .5;
let minionReloadSpeed = 120;
let maxHealthDrop = 1;
let maxMoneyDrop = 1;
let knobs = ['bullet speed','enemy speed','enemy health','enemy size','bullet width','reload speed','num bullets in shot spread','bullet volley num','bullet damage','invincable time','slowing bullets','bullet range','pathfinding','homing bullets'];
function findKnob(){
    return knobs[Math.floor(Math.random()*knobs.length)]
}
function addToPoint(point,addX,addY){
    return new newPoint(point.x+addX,point.y+addY)
}
function offsetPointByAngle(point,angle,dis){
    return addToPoint(point,Math.sin(angle)*dis,Math.cos(angle)*dis)
}
function addTwoPoints(point1,point2){
    return new newPoint(point1.x+point2.x,point1.y+point2.y)
}
function multiplyPoints(point1,point2){
    return new newPoint(point1.x*point2.x,point1.y*point2.y)
}
function dividePoint(point1,divisor){
    return new newPoint(point1.x/divisor,point1.y/divisor);
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
function removeFromEnemyRooms(enemy){
    let enemyRoom = enemyRooms.find((enemyRoomDuplicate) => sameRoomPos(enemyRoomDuplicate,enemy.lastRoom));
    if (enemyRoom!=undefined){
        let enemyIndex = enemyRoom.enemies.findIndex((enemy2) => enemy===enemy2);
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
function drawEnemies(cam){
    for (enemyRoom of enemyRooms){
        let enemyNum = 0;
        for (enemy of enemyRoom.enemies){
            let screenEnemyPos = offSetByCam(enemy);
            if (enemy===enemies[0]){
                if (enemy.direction<0&&enemy.direction>-.1){
                    enemy.direction=0;
                    //this catchs a case where the direction is in this range and the formula doesn't work for some reason
                }
                let movementDirection = enemy.direction;
                movementDirection/=Math.PI*2;
                if (movementDirection<0){
                    movementDirection+=1;
                }
                //now movement direction is between 0 and 1
                movementDirection=Math.floor(movementDirection*4);
                let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size-18));
                //the height has 6 added because of the drop shadow which adds 6 pixels to the height
                ctx.drawImage(playerImages.imagesList[movementDirection],imagePos.x,imagePos.y,enemy.size*cam.zoom*2,(enemy.size+6)*cam.zoom*2);

                ctx.beginPath();
                ctx.arc(screenEnemyPos.x,(enemy.y-12-cam.y)*cam.zoom,enemy.size*cam.zoom,0,Math.PI*2);
                ctx.fillStyle = 'red';
                ctx.globalAlpha = -((Math.min(enemy.health,5)/5/*enemy.maxHealth*/)-1);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'black';
            }else{
                ctx.beginPath();
                ctx.arc(screenEnemyPos.x,screenEnemyPos.y,enemy.size*cam.zoom,0,Math.PI*2);
                ctx.fillStyle = enemy.color;
                ctx.fill();
                ctx.stroke();
            }
            if (enemy.grappleTarget!=null){
                ctx.save();
                ctx.beginPath();
                let screenGrappleTarget = offSetByCam(enemy.grappleTarget,cam);
                ctx.moveTo(screenEnemyPos.x,screenEnemyPos.y);
                ctx.lineTo(screenGrappleTarget.x,screenGrappleTarget.y);
                ctx.strokeStyle='blue';
                ctx.lineWidth = 5*cam.zoom;
                ctx.stroke();
                ctx.restore();
            }
            //draws a line between lastpos and current pos
            /*ctx.beginPath();
            ctx.moveTo(offSetByCam(enemy.lastPosition).x,offSetByCam(enemy.lastPosition).y);
            ctx.lineTo(offSetByCam(enemy).x,offSetByCam(enemy).y);
            ctx.strokeStyle='black';
            ctx.stroke();*/
            if (keysToggle['i']&&devMode){
                ctx.fillStyle='black';
                ctx.font = enemy.size*2*cam.zoom+'px serif';
                ctx.fillText(enemyNum,screenEnemyPos.x-(cam.zoom*enemy.size/2),screenEnemyPos.y+(cam.zoom*enemy.size/2));
                enemyNum++;
            }
            if (((keysToggle['j']&&devMode))&&enemy.team!=2){
                ctx.fillStyle='white';
                ctx.font = enemy.size*cam.zoom+'px serif';
                ctx.fillText(Math.floor(enemy.health),screenEnemyPos.x-(cam.zoom*enemy.size/4),screenEnemyPos.y+(cam.zoom*enemy.size/4));
            }
            /*if (enemies[0]===enemy){
                ctx.fillStyle='white';
                ctx.font = enemy.size*cam.zoom+'px serif';
                ctx.fillText(Math.floor(enemy.health),screenEnemyPos.x-(cam.zoom*enemy.size/4),screenEnemyPos.y+(cam.zoom*enemy.size/4));
            }*/
            let firstEnemy = enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
            ctx.fillStyle='black';
            ctx.font = 30*cam.zoom+'px serif';
            let message = '';
            if (enemy.size!=0||enemy.PFType===14&&firstEnemy===undefined){
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
    return new newPoint((((point.x-cam.x)-c.width/2)*d)/z+c.width/2,(((point.y-cam.y)-(c.height-HUDHeight)/2)*d)/z+(c.height-HUDHeight)/2)
}
function findMidNumber(num1,num2){
    return Math.min(num1,num2)+Math.abs((num1-num2)/2)
}
function findMidPoint(point1,point2){
    return new newPoint(Math.min(point1.x,point2.x)+Math.abs((point1.x-point2.x)/2),Math.min(point1.y,point2.y)+Math.abs((point1.y-point2.y)/2));
}
function findBulletMiddle(bullet){
    let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
    let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
    return findMidPoint(new newPoint(tailX,tailY),dupPoint(bullet));
}
function drawWalls(cam,draw3d){
    let i = 0;
    for (enemyRoom of enemyRooms){
        if (enemyRoom.useExtraWalls===1){
            for (wall of enemyRoom.extraWalls){
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
        }
        for (wall of enemyRoom.walls){

            i++;
            //this is for debug
            //drawCircle(wall.first.x,wall.first.y,'red');
            //drawCircle(wall.second.x,wall.second.y,'red');
            //let mid = findMidPoint(wall.first,wall.second);
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
        let extraWallsCheck = wallsCheck.concat(enemyRoom.extraWalls);
        for(enemy of enemyRoom.enemies){
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
function updatePFBoxes(startingPoint,enemy,enemyRoom){
    let target = floorPoint(enemy,boxSize);
    //let startInWall = false;
    //unfinished code
    /*if (wallBoxes.find((element) => element.x===PFBoxes[0].x&&element.y===PFBoxes[0].y)!=undefined){
        startInWall = true;
    }*/
    for (box of enemyRoom.wallBoxes){
        if (isSamePoint(target,box)){
            return
        }
    }
    for (box of PFBoxes){
        box.hCost=findHCost(target,box);
        box.fCost=box.hCost+box.gCost;
        if (isSamePoint(target,box)/*&&!box.inOpenList*/){
            return
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
        enemies.push(newEnemyPreset(mouseShifted,0));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['1']){
        keysUsed['1']=false;
        enemies.push(newEnemyPreset(mouseShifted,1));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['2']){
        keysUsed['2']=false;
        enemies.push(newEnemyPreset(mouseShifted,2));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['3']){
        keysUsed['3']=false;
        enemies.push(newEnemyPreset(mouseShifted,3));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['4']){
        keysUsed['4']=false;
        enemies.push(newEnemyPreset(mouseShifted,4));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    if (keysUsed['5']){
        keysUsed['5']=false;
        enemies.push(newEnemyPreset(mouseShifted,5));
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
    if (keysToggle['i']&&devMode){
        //for (enemyRoom of enemyRooms){
            for (spawner of editorSpawnPoints){
                drawCircle(spawner.x,spawner.y,'red');
            }
        //}
    }
    if (keysToggle['k']&&devMode){
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
                if (keysToggle['i']&&devMode){
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
function generateRoom(topOpen,rightOpen,bottomOpen,leftOpen,roomPos,roomNum,difficulty,eligibleMajorPowerUps){
    //let enemiesPerRoom = 0;
    //this makes a new list with a placeholder enemy that will always be in the room
    //this aligns the cordinates as (-1,1) is the room one to the left of the beginning, not at the actual cordiate (-1,0)
    let enemyRoom = turnIntoRoomPos(roomPos);
    enemyRoom.enemies=[];
    enemyRoom.walls=[];
    enemyRoom.wallBoxes = [];
    enemyRoom.difficulty = difficulty;
    enemyRoom.roomNum=roomNum;
    if (roomNum!=1&&roomNum!=targetNumOfRooms){
        enemyRoom.isPowerUpCollected = false;
    }else{
        enemyRoom.isPowerUpCollected = true;
    }
    enemyRoom.powerUps=null;
    //enemyRooms.push([newEnemyPreset(addToPoint(roomPos,roomWidth/2,roomHeight/2),2)]);
    enemyRooms.push(enemyRoom);
    //enemies.push(enemyRooms[enemyRooms.length-1][0]);
    let roomOption = 0;
    if (roomNum===1){
        roomOption = roomOptions[0];
    }else if ((roomNum%10)===0){
        roomOption = roomOptions[1];
    }else{
        //the ones are there to skip the first and second item which is just a blank room and boss room respectively
        roomOption = roomOptions[Math.floor(Math.random()*(roomOptions.length-2))+2];
    } 
    enemyRoom.walls = JSON.parse(JSON.stringify(roomOption.walls));
    let room = enemyRoom.walls;
    enemyRoom.extraWalls = [];
    let extraWalls=enemyRoom.extraWalls;
    enemyRoom.useExtraWalls=0;
    for(spawnPoint of roomOption.spawnPoints){
        editorSpawnPoints.push(addToPoint(spawnPoint,roomPos.x,roomPos.y));
    }
    let numOfEnemies=0;
    if (roomOption.spawnPoints.length>0){
        numOfEnemies = Math.floor(((Math.random()/2)+.5)*(difficulty))+1;
    }
    const enemyPosition = addToPoint(roomPos,roomWidth/2,roomHeight/2);
    /*if (roomNum!=1&&roomNum!=targetNumOfRooms){
        let powerUpSeed = Math.random();
        let powerUpType=null;
        let currentPowerUpOptions = [...eligibleMajorPowerUps];
        //this makes it so it doesn't spawn the same power up twice in a row
        let powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===powerUpsSpawned[powerUpsSpawned.length-1])
        if (powerUpToRemove!=-1){
            currentPowerUpOptions.splice(powerUpToRemove,1);
        }
        if (undefined===powerUpsSpawned.find((powerUpOption)=>powerUpOption===9)){
            //this removes the Reduce bullet spread until there are multiple bullets
            powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===11);
            if (powerUpToRemove!=-1){
                currentPowerUpOptions.splice(powerUpToRemove,1);
            }
        }
        let numOfbulletSpeed = 0;
        for(i = 0; i < powerUpsSpawned.length; i++){
            if(powerUpsSpawned[i] === 20){
                numOfbulletSpeed++;
            }
        }
        if (numOfbulletSpeed>=4){
            //this removes the bullet speed upgrade when the bullets might pass through an enemy without hitting
            powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===20);
            currentPowerUpOptions.splice(powerUpToRemove,1);
        }
        let numOfDashPowerUps = 0;
        for(i = 0; i < powerUpsSpawned.length; i++){
            if(powerUpsSpawned[i] === 19){
                numOfDashPowerUps++;
            }
        }
        let fakeDashCoolDown = maximumDashCoolDown;
        for (let i=0;i<numOfDashPowerUps;i++){
            fakeDashCoolDown/=1.5;
        }
        if (fakeDashCoolDown<6){
            //this removes the dash cooldown option if it wouldn't change anything
            powerUpToRemove = currentPowerUpOptions.findIndex((powerUpOption)=>powerUpOption===19);
            currentPowerUpOptions.splice(powerUpToRemove,1);
        }
        powerUpType=currentPowerUpOptions[Math.floor(powerUpSeed*currentPowerUpOptions.length)];
        if ((roomNum%10)===0){
            //9 is shoot more bullets
            powerUpType=9;
        }
        powerUpsSpawned.push(powerUpType);
        let power = 2;
        enemies.push(newEnemyPreset(enemyPosition,powerUpType,power,undefined,0));
        //enemyRooms[enemyRooms.length-1].push(enemies[enemies.length-1]);
        enemyRoom.enemies.push(enemies[enemies.length-1]);
    }*/
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
        //enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,300),14,0,'Dash with the Space Bar or Shift'));
        //nemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,350),14,0,'Hit the space bar with your left hand thumb you psycho'));
    }
    if (roomNum===targetNumOfRooms){
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,200+roomPos.y),14,0,'You am become death'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,250+roomPos.y),14,0,'Destroyer of world'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,300+roomPos.y),14,0,'Reload to Play Again'));
    }
    //door length is twice as long to cover the entire wall and make a seamless wall
    if (topOpen){
        room.push(new newWall(0,0,roomWidth/2-(doorWidth/2),0));
        room.push(new newWall(roomWidth/2+(doorWidth/2),0,roomWidth,0));
        extraWalls.push(new newWall(roomWidth/2-(doorWidth/2),0,roomWidth/2+(doorWidth/2),0));
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
        extraWalls.push(new newWall(roomWidth,roomHeight/2-(doorWidth/2),roomWidth,roomHeight/2+(doorWidth/2)));
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
        extraWalls.push(new newWall(roomWidth/2-(doorWidth/2),roomHeight,roomWidth/2+(doorWidth/2),roomHeight));
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
        extraWalls.push(new newWall(0,roomHeight/2-(doorWidth/2),0,roomHeight/2+(doorWidth/2)));
        room.push(new newWall(0,roomHeight/2-(doorWidth/2),-(doorLength),roomHeight/2-(doorWidth/2)));
        room.push(new newWall(0,roomHeight/2+(doorWidth/2),-(doorLength),roomHeight/2+(doorWidth/2)));
        //these tiles only work with a specific room size and boxSize
        /*savedwallBoxes.push(new newPoint(roundTo(-35+roomPos.x,boxSize),roundTo(roomHeight/2+roomPos.y,boxSize)));
        savedwallBoxes.push(new newPoint(roundTo(-35+roomPos.x,boxSize),roundTo(roomHeight/2-boxSize+roomPos.y,boxSize)));*/
    }else{
        room.push(new newWall(0,0,0,roomHeight));
    }
    enemyRoom.extraWalls=shiftWallsBy(enemyRoom.extraWalls,roomPos.x,roomPos.y);
    enemyRoom.walls=shiftWallsBy(enemyRoom.walls,roomPos.x,roomPos.y);
    enemyRoom.wallBoxes=generateWallBoxes(2,enemyRoom.walls,enemyRoom.wallBoxes);
    return enemyRoom.walls;
}
let finishedRooms=null;
let roomsToMake=null;
let offLimitRooms = [];
let repeatedNum=0;
function generateRooms(targetNumOfRooms,finalDifficulty,eligibleMajorPowerUps){
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
            //console.log('stepped in: '+numOfRooms);
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
        walls = walls.concat(generateRoom(room.up,room.right,room.down,room.left,room.roomPos,i,((i/targetNumOfRooms)*(finalDifficulty-1))+1,eligibleMajorPowerUps));
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
    if (enemies.length===0){
        cam.x=0;
        cam.y=0;
    }else{
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
                            }
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
function bulletWallCollision(bulletsToRemove){
    for(let j=0;j<bullets.length;j++){
        let bullet = bullets[j];
        let xIntercept = null;
        let yIntercept = null;
        let secondCorner = null;

        let timesToRepeat = 1;
        if (bullet.realWidth!=0){
            //the rectangular bullet has 4 sides + 4 corners
            timesToRepeat=8;
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
            if (!sameRoomPos(enemyRoom,turnIntoRoomPos(bullet))){
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
                /*if (timesToRepeat===1){
                    k=4;
                }*/
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
                        //bottom right
                        corner = addToPoint(bullet,(Math.sin(bullet.direction-Math.PI)*bullet.tailLength)+(Math.sin(bullet.direction-Math.PI/2)*bullet.realWidth/2),(Math.cos(bullet.direction-Math.PI)*bullet.tailLength)+(Math.cos(bullet.direction-Math.PI/2)*bullet.realWidth/2));
                    break
                    case 7:
                        //bottom left
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
                    bullet.wallEffect(wallHit,bullet,intersection,bulletsToRemove)
                }
                /*for (wall of wallsCheck){
                    if (wall.first.y===wall.second.y){
                        yIntercept = wall.first.y;
                        //The line is straight so it will always be wall.first.y
                        xIntercept = ((yIntercept-corner.y)/bulletSlope)+corner.x;
                        if (isBetween(wall.first.x,wall.second.x,xIntercept)&&isBetween(corner.x,secondCorner.x,xIntercept)&&isBetween(corner.y,secondCorner.y,yIntercept)){
                            bullet.wallEffect(wall,bullet,new newPoint(xIntercept,yIntercept),bulletsToRemove);
                        }
                    }
                    if (wall.first.x===wall.second.x){
                        xIntercept = wall.first.x;
                        yIntercept = ((xIntercept-corner.x)*bulletSlope)+corner.y;
                        if (isBetween(wall.first.y,wall.second.y,yIntercept)&&isBetween(corner.y,secondCorner.y,yIntercept)&&isBetween(corner.x,secondCorner.x,xIntercept)){
                            bullet.wallEffect(wall,bullet,new newPoint(xIntercept,yIntercept),bulletsToRemove);
                        }
                    }
                }*/
                
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
function enemyMovement(enemiesToRemove){
    let start = floorPoint(enemies[0],boxSize);
    dashCooldown-=deltaTime;
    if (PFBoxes.find((element) => isSamePoint(element,start))===undefined){
        PFBoxes.push(new newPathBox(start.x,start.y,0,0,0,'end',true));
    }

    //this makes it so if the player is in a doorway, both rooms are loaded
    let roomChange=new newPoint(0,0);
    let z = enemies[0].x%(roomWidth+(2*doorLength));
    //let u = (roomWidth+(2*doorLength))/(doorLength*2);
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
        enemies[0].inDoorWay=true;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.y++;
        enemies[0].inDoorWay=true;
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
                if (enemy.team===1||minionsDropLoot){
                    //let numMoney = Math.floor(Math.random()*mainEnemyRoom.difficulty);
                    let numMoney = Math.floor(Math.random()*(maxMoneyDrop+1));
                    if (enemy.PFType===15){ //this makes it so bosses drop twice as much loot
                        numMoney*=4;
                    }
                    for (let i=0;i<numMoney;i++){
                        let moneyPos = new newPoint();
                        do{
                            moneyPos = addToPoint(dupPoint(enemy),(Math.random()*50)-25,(Math.random()*50)-25);
                        }while(rayCast(enemy,moneyPos,false,mainEnemyRoom.walls))
                        enemies.push(newEnemyPreset(moneyPos,16));
                        addToEnemyRooms(enemies[enemies.length-1]);
                    }
                    //this is actually the num of health orbs
                    //numMoney = Math.floor(Math.random()*2)+1;
                    numMoney = Math.floor(Math.random()*(maxHealthDrop+1));
                    if (enemy.PFType===15){
                        numMoney*=4;
                    }
                    for (let i=0;i<numMoney;i++){
                        let moneyPos = new newPoint();
                        do{
                            moneyPos = addToPoint(dupPoint(enemy),(Math.random()*50)-25,(Math.random()*50)-25);
                        }while(rayCast(enemy,moneyPos,false,mainEnemyRoom.walls))
                        enemies.push(newEnemyPreset(moneyPos,7));
                        addToEnemyRooms(enemies[enemies.length-1]);
                    }
                }
                /*if (Math.random()<.8){
                    enemies.push(newEnemyPreset(enemy,7));
                    addToEnemyRooms(enemies[enemies.length-1]);
                }*/
                enemiesToRemove.push(enemy);
                continue;
            }
            enemy.enemyRoom=mainEnemyRoom;
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
            /*let targetIndex = enemyRoom.findIndex((enemyCheck)=>enemyCheck===enemy.target)
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
            }*/
            if (enemy.grappleTarget!=null){
                enemyAngle = findAngle(enemy,enemy.grappleTarget);
                enemy.x-=Math.sin(enemyAngle)*enemy.grappleSpeed;
                enemy.y-=Math.cos(enemyAngle)*enemy.grappleSpeed;
                if (keysToggle['i']){
                    addCircle(enemy.grappleTarget);
                }
                if (findDis(enemy,enemy.grappleTarget)<enemy.size){
                    enemy.grappleTarget=null;
                }/*else if (undefined===rayCast(enemy,enemy.grappleTarget,false,mainEnemyRoom.walls)){
                    enemy.grappleTarget=null;
                }*/
            }
            enemy.x+=enemy.momentum.x*deltaTime;
            enemy.y+=enemy.momentum.y*deltaTime;
            let angle = findAngle(new newPoint(0,0),enemy.momentum)+Math.PI;
            let dis = findDis(new newPoint(0,0),enemy.momentum);
            dis/=1+(deltaTime/enemy.friction);
            if (dis<0){
                dis=0;
            }
            enemy.momentum.x=Math.sin(angle)*dis;
            enemy.momentum.y=Math.cos(angle)*dis;
            if (enemy.PFType===0||enemy.PFType===4){
                if (enemy.speed>findDis(enemy,enemy.target)){
                    enemy.x=enemy.target.x;
                    enemy.y=enemy.target.y;
                }else{
                    enemyAngle = findAngle(enemy,enemy.target);
                    enemy.x-=Math.sin(enemyAngle)*enemy.speed;
                    enemy.y-=Math.cos(enemyAngle)*enemy.speed;
                }
            }else if (enemy.PFType===1){
                if (keysUsed['t']&&devMode){
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
                //shop = addToPoint(subtractNumFromPoint(multiplyPoints(floorPoint(enemy.room,1),new newPoint(roomWidth+(doorLength*2),roomHeight+(doorLength*2))),doorLength),200,300);
                if (keysToggle['b']&&devMode){
                    enemy.speed = 20;
                }
                let movementTarget = new newPoint(0,0);
                if (dashFramesLeft>0){
                    //dashCode
                    //this makes you invincable whan you dash
                    //enemy.invinceable=dashFramesLeft;
                    dashFramesLeft-=deltaTime;
                    //this a function I made on desmos to get the dash working on different framerates
                    dashSpeed=(7.5*dashFramesLeft)+17.5
                    //dashSpeed-=((10*deltaTime)-dashFramesLeft);
                    enemy.x-=Math.sin(dashDirection)*dashSpeed*deltaTime;
                    enemy.y-=Math.cos(dashDirection)*dashSpeed*deltaTime;
                    /*dashFramesLeft-=1;
                    dashSpeed-=(10-dashFramesLeft);
                    enemy.x-=Math.sin(dashDirection)*dashSpeed;
                    enemy.y-=Math.cos(dashDirection)*dashSpeed;*/
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
                    if (controller!=undefined){
                        let axes = controller.axes;
                        if (Math.abs(axes[0])>.1){ //this adds a deadzone
                            movementTarget.x+=axes[0];
                        }
                        if (Math.abs(axes[1])>.1){
                            movementTarget.y+=axes[1];
                        }
                    }
                }
                let movementAngle = findAngle(new newPoint(0,0),movementTarget);
                if (movementTarget.x!=0||movementTarget.y!=0){
                    let currentSpeed = Math.min(1,findDis(new newPoint(0,0),movementTarget));
                    enemy.x-=Math.sin(movementAngle)*enemy.speed*currentSpeed;
                    enemy.y-=Math.cos(movementAngle)*enemy.speed*currentSpeed;
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
                /*keysToggle['e']=false;
                if ((keysUsed['shift']||(keysToggle['e']&&mousePressed))){
                    if ((!isSamePoint(movementTarget,new newPoint(0,0))||(keysToggle['e']&&mousePressed))&&dashCooldown<0){
                        screenShake+=4;
                        dashSpeed = 60;
                        dashFramesLeft = 6;
                        dashCooldown=maximumDashCoolDown;
                        if ((!keysToggle['e'])){
                            dashDirection = movementAngle;
                        }else{
                            dashDirection = findAngle(mouseShifted,enemy)+Math.PI;
                        }
                    }
                    keysUsed['shift']=false;
                }*/
                //let closestBox = floorPoint(enemy,boxSize);
                //let endBox = PFBoxes.find((box)=>)
                    
                let relativeEnemyPos = new newPoint((enemy.lastPosition.x+((roomWidth+doorLength*2)*500))%(roomWidth+doorLength*2),(enemy.lastPosition.y+((roomHeight+doorLength*2)*500))%(roomHeight+doorLength*2));
                let firstEnemy = enemyRoom.find((enemyCheck)=>enemyCheck.team===1);
                if (boundingBox(new newPoint(0,0),new newPoint(roomWidth,roomHeight),relativeEnemyPos,0,0)&&firstEnemy!=undefined&&mainEnemyRoom.useExtraWalls===0){
                    mainEnemyRoom.useExtraWalls=1;
                }
                if (firstEnemy===undefined){
                    mainEnemyRoom.useExtraWalls=2;
                }
                let realI = -1;
                let closestEnemy=findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                if (closestEnemy===undefined){
                    while (minionTargets.length!=0){
                        enemiesToRemove.push(minionTargets[0].enemy);
                        minionTargets.splice(0,1);
                    }
                }else{
                    for (let i=0;i<minionTargets.length;i++){
                        let thisTarget =minionTargets[i];
                        if (undefined!=enemiesToRemove.find((checkEnemy)=>checkEnemy===thisTarget.enemy)){
                            minionTargets.splice(i,1);
                            continue;
                        }
                        realI++;
                        if (thisTarget.enemy.deleted||!sameRoomPos(thisTarget.enemy.room,enemy.room)||i>maximumMinions){
                            enemiesToRemove.push(thisTarget.enemy);
                            minionTargets.splice(i,1);
                            i--;
                            realI--;
                            continue;
                        }
                        /*if (!sameRoomPos(thisTarget.enemy.room,enemy.room)){
                            realI--;
                            continue;
                        }*/
                        let changeNum =0;
                        if ((realI%2)===1){
                            changeNum-=(Math.floor((realI+1)/2))*enemy.size*2
                        }else{
                            changeNum+=(Math.floor((realI+1)/2))*enemy.size*2
                        }
                        if (keys['arrowup']){
                            thisTarget.y=enemy.y-100;
                            thisTarget.x=enemy.x+changeNum;
                        }else if (keys['arrowdown']){
                            thisTarget.y=enemy.y+100;
                            thisTarget.x=enemy.x+changeNum;
                        }else if (keys['arrowleft']){
                            thisTarget.x=enemy.x-100;
                            thisTarget.y=enemy.y+changeNum;
                        }else if (keys['arrowright']){
                            thisTarget.x=enemy.x+100;
                            thisTarget.y=enemy.y+changeNum;
                        }/*else{
                            let closestEnemy=findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                            //let firstEnemy = enemyRoom.enemies.find((enemyCheck)=>(enemyCheck!=enemy)&&(enemyCheck.PFType!=6));
                            if (closestEnemy!=undefined){
                                thisTarget.x=closestEnemy.x;
                                thisTarget.y=closestEnemy.y;
                            }
                        }*/
                    }
                }
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
                    if (keysToggle['i']&&devMode){
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
            }else if (enemy.PFType===36){
                enemy.targetSpeed = findDis(new newPoint(0,0),enemy.momentum);
                if (enemy.gunCooldown<0){
                    enemy.size+=deltaTime*20;
                }else{
                    enemy.color='black';
                }
                if (enemy.size>100){
                    enemiesToRemove.push(enemy);
                }
            }
            //enemy.room.x=(floorTo((enemies[0].x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
            //enemy.room.y=(floorTo((enemies[0].y+50),(roomHeight+(doorLength*2)))-50)-((c.height-HUDHeight)/2/cam.zoom)+(roomHeight/2)+doorLength
            if (!isSamePoint(enemy,enemy.lastPosition)){
                enemy.direction=findAngle(enemy,enemy.lastPosition);
            }
        }
    }
}
function shootBullet(bulletTemplate,direction,owner,bulletSpreadNum,shotSpread,accuracy,pos,offset){
    //console.log(bulletTemplate);
    bulletTemplate.owner = null; //this is to stop the stringify from looping 
    for (let i=0;i<bulletSpreadNum;i++){
        let bullet = JSON.parse(JSON.stringify(bulletTemplate));
        bullet.boringEffect=bulletTemplate.boringEffect;
        bullet.effect=bulletTemplate.effect;
        bullet.wallEffect=bulletTemplate.wallEffect;
        bullet.drawBullet=bulletTemplate.drawBullet;
        bullet.everyFrame=bulletTemplate.everyFrame;
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
        //console.log(bullet);
        //bullet.lastposition ends up being bugged
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
        }
    }
    for (let i=0;i<bulletSpreadNum;i++){
        let thisBulletDirection =bulletDirection;
        if ((i%2)===1){
            thisBulletDirection-=(Math.floor((i+1)/2)/10)*shotSpread;
        }else{
            thisBulletDirection+=(Math.floor((i+1)/2)/10)*shotSpread;
        }
        thisBulletDirection+=(Math.random()-.5)*accuracy;
        let bulletPos = new newPoint(enemy.x-Math.sin(thisBulletDirection)*(-enemy.size-bulletLength+1),enemy.y-Math.cos(thisBulletDirection)*(-enemy.size-bulletLength+1))
        let bullet = new newBullet(bulletPos.x,bulletPos.y,bulletSpeed,thisBulletDirection,bulletColor,bulletLength,5,bulletType,bulletRange,bulletKillPower,dupPoint(enemy),enemy,damage);
        bullet.effect = effect;
        bullets.push(bullet);
    }
}
let minionTargets = [];
function aimGun(enemy,target,bulletColor,overPowered,enemyRoom,skipRayCast){
    if (overPowered===undefined){
        overPowered=0;
    }
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
                //this might mess up code with enemies interacting with enemies
                /*if (enemy1.PFType!=1&&enemy2.PFType!=1){
                    continue;
                }*/
                if (enemy1!=enemy2&&enemy1.team!=enemy2.team){
                    let enemyDis = findDis(enemy1,enemy2);
                    if ((enemyDis<enemy1.size+enemy2.size)&&(rayCast(enemy1,enemy2,false,mainEnemyRoom.walls,false)===undefined)){
                        enemy1.effect(enemy2,enemy1,enemiesToRemove);
                        enemy2.effect(enemy1,enemy2,enemiesToRemove);
                    }else if ((enemy2.PFType===6||enemy1.PFType===6)&&enemyDis<=Math.max(enemy1.size,20)+Math.max(enemy2.size,20)){
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
        let firstEnemy = enemyRoom.find((enemy)=>enemy.team===1);
        if (firstEnemy===undefined&&enemyRoom.length>0){
            if (!mainEnemyRoom.isPowerUpCollected){
                mainEnemyRoom.isPowerUpCollected=true;
                switchMode(8);
            }
        }
        for (enemy1 of enemyRoom){
            for (enemy2 of enemyRoom){
                //this makes it so the placeholder enemy and power ups that haveb't really gotton spawned yet don't get activated
                //change the size 10
                if (enemy1.size===0||enemy2.size===0||enemy1.team===2||enemy2.team===2||(enemy1.PFType===36&&enemy1.gunCooldown<0)||(enemy2.PFType===36&&enemy2.gunCooldown<0)){
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
function drawBullets(cam,useImage){
    for (bullet of bullets){
        bullet.drawBullet(bullet);
    }
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
function singleBulletEnemyCollision(bullet){
    //bullet.room = new newPoint((bullet.x+doorLength)/(roomWidth+(doorLength*2)),(bullet.y+doorLength)/(roomHeight+(doorLength*2)));
    for (let i = 0;i<enemies.length;i++){
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
            if (enemy!=bullet.owner&&(enemy.team!=2)&&enemy.PFType!=36){
                if ((enemy.invinceable<1||enemy!=enemies[0])&&bullet.owner.team!=enemy.team&&bullet.enemiesHit.find((enemyCheck)=>enemyCheck===enemy)===undefined){
                    bullet.boringEffect(enemy,bullet);
                    bullet.effect(enemy,bullet);
                    /*if (enemy===enemies[0]){ //this would make the screen flash red when you get hit
                        ctx.rect(0,0,c.width,c.height);
                        ctx.fillStyle = 'red';
                        //addText(toString(enemies[0].health),new newPoint(c.width/2,c.height/2),'48px impact','black',Infinity,textToDraw);
                        ctx.fill();
                    }*/
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
function addRect(point,width,height,color,textToDraw){
    rectsToDraw.push({
        x:point.x,
        y:point.y,
        color:color,
        width:width,
        height:height,
        textToDraw:textToDraw
    })
}
function drawRects(){ //should add support for having boxes that have circles on the corners, to round the corners
    for (rect of rectsToDraw){
        ctx.beginPath();
        ctx.rect(rect.x,rect.y,rect.width,rect.height);
        ctx.stroke();
        ctx.fillStyle=rect.color;
        ctx.fill();
        for (text of rect.textToDraw){
            ctx.font = text.font;
            ctx.fillStyle = text.color;
            ctx.fillText(text.message,text.x+rect.x,text.y+rect.y,text.maxWidth);
        }
    }
}
function addText(message,point,font,color,maxWidth,textList){ //the point is just an offset from the rect's point
    if (message===''){
        return;
    }
    if (color===undefined){
        color='black';
    }
    if (font===undefined){
        font='32px serif';
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
function gunEnemyMovement(target){
    for (let i=0;i<powerUpsGrabbed.length;i++){
        let examplePowerUp=powerUpsGrabbed[i];
        examplePowerUp.upgradeEffect(enemies[0],examplePowerUp);
    }
    for (mainEnemyRoom of enemyRooms){
        if(!(sameRoomPos(mainEnemyRoom,enemies[0].room)||enemies[0].inDoorWay)){
            continue;
        }
        let enemyRoom=mainEnemyRoom.enemies;
        for (let i =0;i<enemyRoom.length;i++){
            let enemy=enemyRoom[i];
            if (enemy.PFType===1){
                for (let j=0;j<powerUpsGrabbed.length;j++){
                    let runCode=false;
                    if (controller===undefined){
                        switch(j){
                            case 0:
                                runCode=buttonsArray[0]&&powerUpsGrabbed[j].coolDown<1;
                                break
                            case 1:
                                runCode=buttonsArray[2]&&powerUpsGrabbed[j].coolDown<1
                                break
                            case 2:
                                runCode=keys[' ']&&powerUpsGrabbed[j].coolDown<1
                                break
                            case 3:
                                runCode=keys['shift']&&powerUpsGrabbed[j].coolDown<1
                                break
                        }
                    }else{
                        let axes = controller.axes;
                        let buttons = controller.buttons;
                        let movementTarget = dupPoint(enemy);
                        let skipped = true;
                        if (Math.abs(axes[2])>.1){ //this adds a deadzone
                            movementTarget.x+=axes[2];
                            skipped = false;
                        }
                        if (Math.abs(axes[3])>.1){
                            movementTarget.y+=axes[3];
                            skipped = false;
                        }
                        if (skipped){
                            movementTarget = addToPoint(movementTarget,Math.sin(shootingAngle),Math.cos(shootingAngle));
                        }
                        target=movementTarget;
                        shootingAngle = findAngle(target,enemies[0]);

                        switch(j){
                            case 0:
                                runCode=buttons[6].pressed&&powerUpsGrabbed[j].coolDown<1;
                                break
                            case 1:
                                runCode=buttons[7].pressed&&powerUpsGrabbed[j].coolDown<1;
                                break
                            case 2:
                                runCode=keys[' ']&&powerUpsGrabbed[j].coolDown<1
                                break
                            case 3:
                                runCode=keys['shift']&&powerUpsGrabbed[j].coolDown<1
                                break
                        }
                    }
                    if (runCode){
                        let examplePowerUp=powerUpsGrabbed[j];
                        examplePowerUp.onClickEffect(enemy,examplePowerUp);
                    }
                }
                /*if (keysUsed[' ']){
                    keysUsed[' ']=false;
                    let closestEnemy=findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                    if (closestEnemy===undefined){

                    }else if (maximumMinions>minionTargets.length){
                        minionTargets.push(dupPoint(enemy));
                        enemyRoom.push(newEnemyPreset(enemy,29,undefined,'',1,minionTargets[minionTargets.length-1]));
                        enemies.push(enemyRoom[enemyRoom.length-1]);
                        minionTargets[minionTargets.length-1].enemy=enemyRoom[enemyRoom.length-1];
                    }
                }
                if (keys['v']&&devMode){
                    aimGun(enemy,mouseShifted,'red',62*(1/enemy.shotSpread),mainEnemyRoom,true);
                }else if (mousePressed&&!keysToggle['e']){
                    //mouseClickUsed=false;
                    let closestEnemy=undefined;
                    closestDis=Infinity;
                    for (enemyCheck of enemyRoom){
                        let currentDis = findDis(mouseShifted,enemyCheck);
                        if (enemyCheck.team!=enemy.team&&(enemyCheck!=enemy)&&(enemyCheck.team!=2)&&currentDis<closestDis){
                            closestEnemy=enemyCheck;
                            closestDis=currentDis;
                        }
                    }
                    if (closestEnemy!=undefined){
                        if (Math.abs(findAngle(closestEnemy,enemy)-findAngle(mouseShifted,enemy))<autoAimStrength){
                            aimGun(enemy,closestEnemy,'red',undefined,mainEnemyRoom,true);
                            continue;
                        }
                    }
                    aimGun(enemy,mouseShifted,'red',undefined,mainEnemyRoom,true);
                }*/
            }else if(enemy.PFType===10||enemy.PFType===4||enemy.PFType===5||enemy.PFType===3||enemy.PFType===2||enemy.PFType===17){
                if (enemy.target.team!=undefined){
                    let closestEnemy = findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                    if (closestEnemy!=undefined){
                        aimGun(enemy,closestEnemy,'blue',undefined,mainEnemyRoom,true);
                    }
                }else{
                    let closestEnemy = findClosestEnemy(enemy,enemyRoom,enemy,false,true,mainEnemyRoom.walls);
                    if (closestEnemy!=undefined){
                        aimGun(enemy,closestEnemy,'red',undefined,mainEnemyRoom,true);
                    }
                }
            }
        }
    }
}
function drawSellButton(leftX){
    ctx.beginPath();
    ctx.arc(20+leftX,c.height-25,20,0,Math.PI*2);
    ctx.rect(20+leftX,c.height-45,53,40);
    ctx.arc(73+leftX,c.height-25,20,0,Math.PI*2);
    ctx.fillStyle='black';
    ctx.fill();

    ctx.drawImage(powerUpIconImage,8+leftX,c.height-37,25,25);

    ctx.beginPath();
    ctx.font = '32px Times New Roman';
    ctx.fillStyle = 'white';
    ctx.fillText('$',68+leftX,c.height-15);

    ctx.beginPath(); //arrow
    ctx.moveTo(33+leftX,c.height-35);
    ctx.bezierCurveTo(53+leftX, c.height-40, 61+leftX, c.height-35,63+leftX,c.height-30);
    ctx.lineTo(58+leftX,c.height-40);
    ctx.moveTo(63+leftX,c.height-31);
    ctx.lineTo(54+leftX,c.height-32);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
}
function drawHUDMouse(majorLeftX,majorRightX){
    let majorCenter = ((majorRightX-majorLeftX)/2)+majorLeftX;
    let start = new newPoint(majorLeftX-2,c.height);
    let cp1 = new newPoint(majorLeftX+5,c.height-100);
    let cp2 = new newPoint(majorRightX-5,c.height-100);
    let end = new newPoint(majorRightX+2,c.height);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.lineWidth=4;
    ctx.strokeStyle='white';
    ctx.stroke();
    ctx.strokeStyle='black';
    ctx.lineWidth=1;
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(majorCenter-1,c.height-76,2,100); //line that splits the mouse into left and right click
    ctx.rect(majorCenter-5,c.height-50,10,20); //scroll wheel hole
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    //ctx.rect(majorLeftX-6,c.height-2,12+majorRightX-majorLeftX,2); //bottom sliver
    ctx.rect(majorCenter-3,c.height-47,6,14); //scroll wheel
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    for (let i=0;i<powerUpSpace;i++){
        ctx.arc(majorLeftX+((i+.5)*40),c.height-20,15,0,Math.PI*2);
    }
    ctx.fillStyle='white';
    ctx.fill();

    /*ctx.beginPath();
    for (let i=0;i<powerUpSpace;i++){
        ctx.arc(majorLeftX+((i+.5)*40),c.height-20,11,0,Math.PI*2);
    }
    ctx.fillStyle='black';
    ctx.fill();*/
}
function drawMinorSlots(minorLeftX,minorRightX){
    ctx.beginPath();
    ctx.arc(minorLeftX+15,c.height-20,15,0,Math.PI*2);
    ctx.rect(minorLeftX+15,c.height-35,minorRightX-minorLeftX-30,30);
    ctx.arc(minorRightX-15,c.height-20,15,0,Math.PI*2);
    ctx.fillStyle='black';
    ctx.fill();
    ctx.beginPath();
    for (let i=0;i<minorPowerUpSpace;i++){
        ctx.arc(minorLeftX+(i*30)+15,c.height-20,10,0,Math.PI*2);
    }
    ctx.fillStyle='white';
    ctx.fill();
}
function drawPermanentSlots(permanentLeftX,permanentRightX){
    let permanentBottomY = 5;
    let permanentTopY = permanentRightX-30;
    ctx.beginPath();
    ctx.arc(permanentLeftX+15,(c.height-(20))-permanentBottomY,20,0,Math.PI*2);
    ctx.rect(permanentLeftX-5,(c.height-(20))-permanentTopY,40,permanentTopY-permanentBottomY);
    ctx.arc(permanentLeftX+15,(c.height-(20))-permanentTopY,20,0,Math.PI*2);
    ctx.fillStyle='black';
    ctx.fill();
    ctx.beginPath();
    for (let i=0;i<permanentMinorPowerUps.length;i++){
        ctx.arc(permanentLeftX+15,c.height-(10)-((i+.5)*30),10,0,Math.PI*2);
    }
    ctx.fillStyle='white';
    ctx.fill();

    ctx.drawImage(powerUpIconImage,permanentLeftX+3,(c.height-((permanentMinorPowerUps.length+1.5)*30))+permanentBottomY,25,25);
    
    /*ctx.beginPath();
    ctx.arc(permanentLeftX+((permanentMinorPowerUps.length)*30)+15,c.height-20,8,0,Math.PI*2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(permanentLeftX+((permanentMinorPowerUps.length)*30)+15,c.height-22,4,0,Math.PI*2);
    ctx.rect(permanentLeftX+((permanentMinorPowerUps.length)*30)+13,c.height-22,4,7);
    ctx.fillStyle = 'white';
    ctx.fill();*/

    ctx.font = '20px Times New Roman';
    let message = '$'+upgrader.var1;
    //let metrics = ctx.measureText(message);
    //let width = permanentRightX-permanentLeftX;
    ctx.fillText(message,permanentLeftX,c.height-permanentTopY-10);
}
function drawHUD(){
    ctx.fillStyle='black';
    //ctx.fillRect(0,c.height-HUDHeight,c.width,HUDHeight); //this would draw a bos that covers up things if HUDHeight !=0
    const TEXT_SIZE = 40;
    ctx.font=TEXT_SIZE+'px Courier New';
    ctx.fillText('Money:'+money,c.width-250,c.height-5);
    ctx.fillText('Health:'+enemies[0].health+'/'+enemies[0].maxHealth,c.width-600,c.height-5);
    if (weaponChoice===9){ //this is when I'm bebuging and I have all the power ups, I can still see my health and money
        ctx.fillText('Health:'+enemies[0].health+'/'+enemies[0].maxHealth,c.width-600,40);
        ctx.fillText('Money:'+money,c.width-250,40);
    }
    if (enemies[0].health===7&&enemies[0].maxHealth===11){
        //ctx.fillText('SLUUURRRPEE',c.width-(TEXT_SIZE*9),TEXT_SIZE*2);
    }
    let weapon = '';
    switch (weaponChoice){
        case 0:
            weapon='None'
            break
        case 1:
            weapon='Shotgun'
            break
        case 2:
            weapon='Sniper'
            break
        case 3:
            weapon='Grenade Gun'
            break
        case 4:
            weapon='Necromancer'
            break
        case 9:
            weapon='Classic'
            break
    }
    //ctx.fillText('Starting Weapon: '+weapon,c.width-(TEXT_SIZE*10*screenSize),TEXT_SIZE*screenSize);
    let damage = 0;
    if (powerUpsGrabbed.length>0){
        damage=powerUpsGrabbed[0].damage
    }
    //ctx.fillText('Damage: '+damage,c.width-(TEXT_SIZE*16*screenSize),TEXT_SIZE*screenSize);
    if (devMode){
        let currentFps = 1000/(Date.now()-startTime);
        previousFps.push(currentFps);
        if (previousFps.length>20/deltaTime){
            previousFps.splice(0,1);
        }
        let averageFps = 0;
        for (fps of previousFps){
            averageFps+=fps;
        }
        averageFps/=previousFps.length;
        ctx.font = 48*screenSize+'px serif';
        ctx.fillText('FPS:'+Math.round(averageFps),50*screenSize,45*screenSize);
    }
    //ctx.fillText('Max Health:'+enemies[0].maxHealth,c.width-(TEXT_SIZE*11),TEXT_SIZE*.8);
    let permanentLeftX = 10;
    //let permanentLeftX = (minorLeftX+minorPowerUpSpace*30)+25;
    let permanentRightX = permanentLeftX+((permanentMinorPowerUps.length+2)*30);
    drawPermanentSlots(permanentLeftX,permanentRightX);

    let majorLeftX = 65;
    let majorRightX = (majorLeftX+powerUpSpace*40);

    drawHUDMouse(majorLeftX,majorRightX);

    let minorLeftX = (majorRightX)+25;
    let minorRightX = (minorLeftX+minorPowerUpSpace*30);
    drawMinorSlots(minorLeftX,minorRightX);

    let sellButtonLeftX = (minorLeftX+minorPowerUpSpace*30)+25;
    drawSellButton(sellButtonLeftX);

    if (keysToggle['p']){
        return
    }
    let onClick = function (i,powerUpList){
        if (heldPowerUp===null&&powerUpList[i].PFType!=34){
            heldPowerUp=powerUpList.splice(i,1)[0]; //took
            //i--;
        }else if (heldPowerUp instanceof newMajorPowerUp){
            if (powerUpList[0]===heldPowerUp||powerUpsGrabbed.length===0){
                if (powerUpsGrabbed.length<powerUpSpace){
                    powerUpsGrabbed.push(heldPowerUp); //put back
                    heldPowerUp=null;
                }
            }else{
                if (powerUpList[i].PFType===34){ //34 is the placeholder, you should never be holding it
                    console.log('swapped');
                    powerUpsGrabbed.splice(i,1,heldPowerUp)[0];
                    powerUpsGrabbed.push(newPowerUpPreset(34,false));
                    heldPowerUp=null;
                }else{
                    console.log('other swap')
                    heldPowerUp=powerUpsGrabbed.splice(i,1,heldPowerUp)[0]; //swapped
                }
            }
        }else if (heldPowerUp instanceof newMinorPowerUp){
            if (powerUpList[0]===heldPowerUp||minorPowerUpsGrabbed.length===0){
                if (minorPowerUpsGrabbed.length<minorPowerUpSpace){
                    minorPowerUpsGrabbed.push(heldPowerUp); //put back
                    heldPowerUp=null;
                }
            }else{
                heldPowerUp=minorPowerUpsGrabbed.splice(i,1,heldPowerUp)[0]; //swapped
            }
        }else{
            //heldPowerUp=null;//the heldPowerUp is not the correct value and so is reset
        }
        return i;
    }
    powerUpsGrabbed.splice(powerUpSpace,Infinity);//this deletes the power ups if there are more than 5, the amount of space in your inventory
    minorPowerUpsGrabbed.splice(minorPowerUpSpace,Infinity);
    for (let k=0;k<6;k++){
        let powerUpList = [];
        switch (k){
            case 0:
                powerUpList = [newPowerUpPreset(8,false),newPowerUpPreset(8,false),newPowerUpPreset(8,false),newPowerUpPreset(8,false)] //this is a placeholder for the sell button. The sell button should be changed to cover any clicks in the entire black area
                break
            case 1:
                powerUpList = [upgrader] //this is a placeholder for  the upgrader
                break
            case 2:
                powerUpList=powerUpsGrabbed//major power ups
                break
            case 3:
                powerUpList=minorPowerUpsGrabbed//minor power ups
                break
            case 4:
                powerUpList = permanentMinorPowerUps;//permanent minor power ups
                break
            case 5:
                if (heldPowerUp===undefined){
                    heldPowerUp=null;//this shouldn't be nessecary but this is easier than coding it right
                }else if (heldPowerUp===null){
                    continue;
                }else{
                    powerUpList = [heldPowerUp]; //held power up
                }
                break
            /*case 6:
                powerUpList = bulletsInClip;
                break*/
        }
        for(let i=0;i<powerUpList.length;i++){
            let examplePowerUp = null;
            examplePowerUp=powerUpList[i];
            let actionOnClick = null;
            switch (k){
                case 0:
                    actionOnClick = function (i,powerUpList){
                        if (heldPowerUp!=null){
                            money++;
                            heldPowerUp=null;
                        }
                        return i;
                    }
                    drawPowerUp(examplePowerUp,i/2,.16,actionOnClick,powerUpList,sellButtonLeftX,false,false,true);
                    break
                case 1:
                    actionOnClick = function(i,powerUpList){
                        if (heldPowerUp!=null&&heldPowerUp instanceof newMinorPowerUp&&money>=upgrader.var1){
                            examplePowerUp.onClickEffect(enemies[0],examplePowerUp);
                            permanentMinorPowerUps.push(heldPowerUp);
                            heldPowerUp=null;
                        }
                        return i;
                    }
                    i=drawPowerUp(examplePowerUp,permanentMinorPowerUps.length,-.28,actionOnClick,powerUpList,permanentLeftX+15,false,false,true,true);
                    break
                case 2:
                    i=drawPowerUp(examplePowerUp,i,0,onClick,powerUpList,majorLeftX,false,false,examplePowerUp.PFType===34,false);
                    for (let j=0;j<examplePowerUp.minorPowerUps.length;j++){
                        let otherExamplePowerUp = examplePowerUp.minorPowerUps[j];
                        drawPowerUp(otherExamplePowerUp,i,j+1,function(){},powerUpList,majorLeftX);
                    }
                    break
                case 3:
                    i=drawPowerUp(examplePowerUp,i,0,onClick,powerUpList,minorLeftX);
                    break
                case 4:
                    i=drawPowerUp(examplePowerUp,i,-.33,function(i,powerUpList){return i},powerUpList,permanentLeftX+15,false,false,false,true);
                    break
                case 5:
                    i=drawPowerUp(examplePowerUp,0,0,onClick,powerUpList,minorLeftX);//drawpowerup already knows this is the held power up and does the hard work for me. It pays to be lazy
                    break
            }
        }
    }
}
function drawPowerUp(powerUp,numOnScreen,verticalNumOnScreen,onClick,powerUpList,leftX,isBullet,powerUpSelect,skipDrawingPowerUp,stackVertical){
    ctx.beginPath();
    ctx.save();
    //ctx.moveTo(c.width-30,c.height-30);
    let iconPos = null;
    if (powerUp===heldPowerUp){
        iconPos=addToPoint(dupPoint(mouse),10,4);
    }else if (stackVertical){
        if (powerUp.PFType===28||powerUp instanceof newMinorPowerUp){
            iconPos=new newPoint(leftX,c.height-20-(30*(numOnScreen+.5)));
        }else{
            iconPos=new newPoint(leftX,c.height-20-(40*(numOnScreen+.5)));
        }
    }else{
        if (powerUp instanceof newMajorPowerUp){
            iconPos=new newPoint(leftX+(40*(numOnScreen+.5)),c.height-20);
        }else{
            iconPos=new newPoint(leftX+(30*(numOnScreen+.5)),c.height-20);
        }
    }
    iconPos.y-=30*(verticalNumOnScreen);
    let iconSize = null;
    if (powerUp instanceof newMajorPowerUp){
        iconSize = 13;
    }else{
        iconSize = 7;
    }
    if (powerUpSelect){
        iconSize*=3;
    }
    if (isBullet){
        //the bullet is at 1/2 scale
        ctx.moveTo(iconPos.x,iconPos.y-(powerUp.tailLength/4));
        ctx.lineTo(iconPos.x,iconPos.y+(powerUp.tailLength/4));
        ctx.lineWidth=powerUp.visualWidth/2;
        ctx.strokeStyle = powerUp.color;
    }else{
        ctx.arc(iconPos.x,iconPos.y,iconSize,0,Math.PI*2);
    }
    //ctx.arc(mouse.x,mouse.y,30,0,Math.PI*2);
    let examplePowerUp = powerUp;
    ctx.fillStyle= examplePowerUp.color;
    if (!skipDrawingPowerUp){
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
    iconPos.x-=10;
    if (!powerUpSelect){
        if (powerUp instanceof newMinorPowerUp){
            iconSize = 14; //this makes the hovering over hitbox larger to prevent misclicks
        }else{
            iconSize = 19;
        }
    }
    if (findDis(iconPos,mouse)<iconSize){
        if (powerUpSelect){
            ctx.font = '32px impact';
        }else{
            ctx.font = '24px serif';
        }
        let label = examplePowerUp.label;
        let metrics = ctx.measureText(label);
        let powerUpPos = new newPoint(Math.max(0,Math.min(mouse.x-(metrics.width/2),c.width-metrics.width)),Math.min(mouse.y-20,c.height-31))
        let skipDrawDamage = isBullet||(examplePowerUp instanceof newMinorPowerUp)||(examplePowerUp.PFType===8)||(examplePowerUp.PFType===28)||(examplePowerUp.PFType===34);//I think this is needed but it might not be, a bullet doesn't have a cooldown atribute
        let textToDraw = [];
        let maxTextWidth = 20;
        let relativePos = new newPoint(5,20);
        if (powerUpSelect){
            relativePos.y+=12;
        }
        for(let i=0;i<4;i++){
            let text = '';
            switch(i){
                case 0:
                    text = label;
                    if (undefined!=rectsToDraw.find((checkRect)=>checkRect.textToDraw[0].message===text)){
                        if (powerUpSelect){
                            relativePos.y+=30;
                        }else{
                            relativePos.y+=20;
                        }
                        continue;
                    }
                    break
                case 1:
                    text = examplePowerUp.secondLabel;
                    if (examplePowerUp.secondLabel===''){
                        if (powerUpSelect){
                            relativePos.y-=30;
                        }else{
                            relativePos.y-=20;
                        }
                    }
                    break
                case 2:
                    if (skipDrawDamage){
                        continue;
                    }
                    text = 'Damage: '+roundTo2(examplePowerUp.damage,100);
                    break
                case 3:
                    if (skipDrawDamage){
                        continue;
                    }
                    text = 'Cooldown: '+roundTo2(examplePowerUp.coolDownMax,100);
                    break
            }
            /*if ((examplePowerUp.PFType===8)||(examplePowerUp.PFType===28)){
                powerUpPos.y+=30; //this makes the text for the trash can and other go lower
            }*/
            let metrics = ctx.measureText(text);
            maxTextWidth = Math.max(maxTextWidth,metrics.width);
            addText(text,relativePos,ctx.font,'black',maxTextWidth,textToDraw);
            //ctx.fillText(text,powerUpPos.x,powerUpPos.y,text.length*9);
            if (powerUpSelect){
                relativePos.y+=30;
            }else{
                relativePos.y+=20;
            }
        }
        if (mouseClickUsed){
            mouseClickUsed=false;
            if (numOnScreen===Math.round(numOnScreen)){
                numOnScreen = onClick(numOnScreen,powerUpList);
            }
        }else{//this makes it so when you pick up the power up, it doesn't draw the label, as when heldPowerUp draws, without this it would draw the label twice
            if (textToDraw.length>0){
                let rectHeight = 0;
                if (powerUpSelect){
                    rectHeight=100;
                }else{
                    rectHeight=65;
                }
                if (skipDrawDamage){
                    if (powerUpSelect){
                        rectHeight-=60;
                    }else{
                        rectHeight-=40;
                    }
                }
                if (examplePowerUp.secondLabel!=''){
                    if (powerUpSelect){
                        rectHeight+=30;
                    }else{
                        rectHeight+=20;
                    }
                }
                for (rect of rectsToDraw){
                    rect.y-=rectHeight+5;
                }
                addRect(addToPoint(powerUpPos,-5,-rectHeight+10),maxTextWidth+10,rectHeight,'white',textToDraw);
                //console.log(textToDraw[0].message);
            }
        }
    }
    return numOnScreen
}
let heldPowerUp = null;
//0 means there is no power up
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
function findEligiblePowerUps(){
    let powerUps = {
        minor:[],
        major:[]
    }
    let offLimitsPowerUps = [8,9,13,19,28,34]; //maybe also make the Grenade Gun not availible if you didn't pick it at the beggining
    for (let i=0;i<50;i++){
        let returnedPowerUp = newPowerUpPreset(i,false);
        if (returnedPowerUp===null||offLimitsPowerUps.includes(i)){
            continue
        }else if (returnedPowerUp instanceof newMajorPowerUp){
            powerUps.major.push(i);
        }else if (returnedPowerUp instanceof newMinorPowerUp){
            powerUps.minor.push(i);
        }
    }
    return powerUps;
}
let targetNumOfRooms=30;
let eligibleMajorPowerUps = [];
let eligibleMinorPowerUps = [];
function startGame(weaponChoice){
    if (wallsImport===''){
        generateRooms(targetNumOfRooms,10,eligibleMajorPowerUps);
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
            //9 is shoot more bullets(its not here because it's meant to be a good reward for beating the boss)
            //eligibleMajorPowerUps = [6,8,11,12,13,19,20,21,25,26,27,28,30,31,32,33,34];
            //eligibleMajorPowerUps = [0,1,2,22,23,24];
            //permanentMinorPowerUps.push(newPowerUpPreset(26,false));//this is just to get a look at how it will look
            powerUpSpace = eligibleMajorPowerUps.length;
            minorPowerUpSpace = eligibleMinorPowerUps.length;
            for (powerUp of eligibleMajorPowerUps){
                powerUpsGrabbed.push(newPowerUpPreset(powerUp));
            }
            for (powerUp of eligibleMinorPowerUps){
                minorPowerUpsGrabbed.push(newPowerUpPreset(powerUp));
            }
            money=21;
        break
    }
    while (powerUpsGrabbed.length<powerUpSpace){
        powerUpsGrabbed.push(newPowerUpPreset(34,false));
    }
    switchMode(0);
}
function fullEnemyWallColl(){
        //box collision checks for situations where the player would move right throught the wall, and wallColl just checks if the player is in the wall right now
        //it is ran twice so corners can check both walls then the other
        boxCollision(false);
        boxCollision(false);
        for (enemyRoom of enemyRooms){
            if (sameRoomPos(enemyRoom,turnIntoRoomPos(enemies[0]))||true){
                for (let i =0; i <collisionRepeat; i++){
                    enemyWallCollision(enemyRoom);
                }
            }
        }
}
function updatePlayerStats(){
    let enemy=enemies[0];
    enemy.maxHealth=enemy.originalCopy.maxHealth;
    enemy.targetSpeed=enemy.originalCopy.targetSpeed;
    getDuplicateMinorPowerUps = false;
    maxHealthDrop=1;
    maxMoneyDrop = 1;
    healthToMoneyRatio = 0;
    for (majorPowerUp of powerUpsGrabbed){
        //majorPowerUp.coolDownMax=majorPowerUp.originalCoolDownMax;
        /*for (minorPowerUp of majorPowerUp.minorPowerUps){
            minorPowerUp.modifier(majorPowerUp,minorPowerUp);
        }*/
        majorPowerUp.coolDownMax=majorPowerUp.originalCopy.coolDownMax;
        majorPowerUp.damage=majorPowerUp.originalCopy.damage;
        majorPowerUp.healthToHeal=majorPowerUp.originalCopy.healthToHeal;
        majorPowerUp.shotSpread=majorPowerUp.originalCopy.shotSpread;
        majorPowerUp.range=majorPowerUp.originalCopy.range;
        //let checkPowerUps = [...minorPowerUpsGrabbed]+[...permanentMinorPowerUps];
        let checkPowerUps = minorPowerUpsGrabbed.concat(permanentMinorPowerUps);
        for (minorPowerUp of checkPowerUps){
            minorPowerUp.modifier(majorPowerUp,minorPowerUp);
        }
        //majorPowerUp.coolDown.coolDownMax=roundTo(majorPowerUp.coolDownMax,100); //I need to figure out a way to stop the floating point weirdness from showing to the player
    }
}
function updatePlayerStats1(){
    maximumMinions=1;
    autoAimStrength=0;
    minionsDropLoot=false;
    minionDamage=.5;
    minionReloadSpeed=120;
    let baseStats=newEnemyPreset(new newPoint(0,0),1);
    for (let i= 0;i<=5;i++){
        if (i<powerUpsGrabbed.length){
            newEnemyPreset(new newPoint(0,0),powerUpsGrabbed[i]).upgradeEffect(baseStats,enemies[0]);
        }
    }
    /*for (powerUp of powerUpsGrabbed){
        newEnemyPreset(new newPoint(0,0),powerUp).upgradeEffect(baseStats);
    }*/
    enemy=enemies[0];
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
function powerUpSelect(){
    ctx.save();
    ctx.beginPath();
    ctx.rect(c.width/4,c.height/4,c.width/2,c.height/2);
    ctx.fillStyle='white';
    ctx.fill();
    ctx.lineWidth=4;
    ctx.stroke();
    ctx.restore();
    ctx.font='48px impact';
    ctx.fillStyle='black';
    ctx.fillText('Chose a power up',c.width/2.7,c.height/3);
    let enemyRoomIndex =findEnemyRoomIndex(enemies[0]);
    let enemyRoom = enemyRooms[enemyRoomIndex];
    let powerUps=enemyRoom.powerUps;
    if (powerUps===null){
        enemyRoom.powerUps=[];
        powerUps=enemyRoom.powerUps;
        if (eligibleMinorPowerUps.length<powerUpSpace+2){
            getDuplicateMinorPowerUps=true;
        }
        while (powerUps.length<2){
            let powerUpType = eligibleMinorPowerUps[Math.floor(Math.random()*eligibleMinorPowerUps.length)];
            //this is a easy, bad way to do this, better would be to do like room generation power ups
            if (undefined!=powerUps.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                continue;
            }
            if (!getDuplicateMinorPowerUps){
                if (undefined!=minorPowerUpsGrabbed.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                    continue;
                }
            }
            powerUps.push(newPowerUpPreset(powerUpType,true));
        }
        for (let i=0;i<1;i++){
            powerUps.push(newPowerUpPreset(eligibleMajorPowerUps[Math.floor(Math.random()*eligibleMajorPowerUps.length)],true));
        }
    }
    for(let i=0;i<powerUps.length;i++){
        let iconPos=new newPoint((3*c.width/4)-(200*i)-200,c.height/2);
        let examplePowerUp = powerUps[i];
        let powerUpSize = 40;
        if (examplePowerUp instanceof newMinorPowerUp){
            powerUpSize = 20;
        }
        let onClick = function(i,powerUpList){
            heldPowerUp=powerUpList[i];
            switchMode(0);
        }
        drawPowerUp(examplePowerUp,i,12,onClick,powerUps,iconPos.x,false,true);
    }
}
function drawMouse(){
    if (hideMouse){
        ctx.drawImage(targetImage,mouse.x,mouse.y-10);
    }
}
function renderEverything(skipPlayers,camera){
    waterBullets = [];
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
    drawBullets(camera,false);
    //drawShop();
    drawCircles(camera);
    //drawHUD doesn't need the camera because it is a special snowflake that doesn't draw following the camera
    drawHUD();
    drawRects();
    drawText();
    drawMouse();
}
let frameNum = 0;
let enemiesToRemove = [];
let bulletsToRemove = [];
function repeat(){
    if (controller!=undefined){
        let axes = controller.axes;
        if (Math.abs(axes[2])>.1){ //this adds a deadzone
            mouse.x+=axes[2]*10;
            skipped = false;
        }
        if (Math.abs(axes[3])>.1){
            mouse.y+=axes[3]*10;
            skipped = false;
        }
    }
    mouse.x=Math.max(Math.min(c.width,mouse.x),0);
    mouse.y=Math.max(Math.min(c.height,mouse.y),0);
    frameNum++;
    if (screenShake>0){
        screenShake-=deltaTime;
    }
    enemiesToRemove=[];
    bulletsToRemove=[];
    if (keysToggle['l']&&devMode){
        enemies[0].health++;
        money=9999;
    }
    updatePlayerStats();
    moveBullets(bulletsToRemove);
    if ((frameNum%targetRenderFPS)===0){
        PFBoxes=[];
    }
    for (enemy of enemies){
        enemy.lastPosition=dupPoint(enemy);
        //enemy.enemyRoom=mainEnemyRoom;
    }
    enemyMovement(enemiesToRemove);
    if (!(keys['n']&&devMode)){
        fullEnemyWallColl();
        for (let i = 0; i<1; i++){
            enemyCollisionEffects(enemiesToRemove);
            enemyCollision(enemiesToRemove);
        }
        fullEnemyWallColl();
    }
    gunEnemyMovement(enemies[0]);
    if (!(keys['n']&&devMode)){
        bulletWallCollision(bulletsToRemove);
    }
    for (enemyToRemove of enemiesToRemove){
        enemyToRemove.deleted=true;
        removeFromEnemyRooms(enemyToRemove);
        enemies.splice(enemies.findIndex((passed)=>passed===enemyToRemove),1);
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
    if (keys['f']){
        screenShake+=2;
        screenShake*=1.1;
    }else{
        if (screenShake>3){
            screenShake=3;
        }
    }
    //updatePlayerStats();
    if (enemies[0].health>enemies[0].maxHealth){
        enemies[0].health=enemies[0].maxHealth;
    }
    camControl(true,enemies[0],keysToggle['c'],!keysToggle['x'],keys['z']||frameNum===1,screenShake);
    //10 is added because if I didn't the mouse position would be slightly different from what it looks like
    //mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
    mouseShifted.x=((mouse.x+10)/cam.zoom)+(cam.x);
    mouseShifted.y=((mouse.y/cam.zoom)+cam.y);
    if (keysUsed['h']&&devMode){
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
    if (mode!=1){
        circlesToDraw = [];
    }
    //textToDraw = [];
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
        renderEverything(false,cam);
    }else if (mode===1||mode===5){
        if (keysUsed['o']){
            circlesToDraw = [];
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
        camControl(true,enemies[0],keysToggle['c'],!keysToggle['x'],keys['z'],0);
        ctx.fillStyle='black';
        ctx.font = '48px Creepster';
        let deathMessage = 'You Died! Press R To Play Again!';
        let metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(c.height/2));
        ctx.font = '32px Creepster';
        deathMessage = 'You Got All The Way To Room '+enemies[0].enemyRoom.roomNum+'!';
        metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(2.5*c.height/4));
        if (keys['r']){
            location.reload(); //this isn't a great way to do it. better would be to reset all the values so it doesn't have to actually reload
        }
    }else if (mode===7){
        //weapon select menu
        camControl(true,enemies[0],keysToggle['c'],!keysToggle['x'],keys['z'],screenShake);
        ctx.font='48px serif';
        ctx.fillText('Press a number to chose a weapon',(c.width/4),(c.height/4));
        ctx.font='30px serif';
        ctx.fillText('Press 1 to use The Shotgun',(c.width/16),(c.height/2));
        ctx.fillText('Press 2 to use The Sniper',(c.width/3),(c.height/2));
        ctx.fillText('  Press 3 to use Grenade Gun',(2*(c.width/3)),(c.height/2));
        //add a little image of the weapon below it
        if (keys['1']||(mouseClickUsed&&mouse.x<c.width/3)){
            weaponChoice=1;
            startGame(weaponChoice);
        }
        if (keys['2']||(mouseClickUsed&&mouse.x>c.width/3&&mouse.x<(2*c.width/3))){
            weaponChoice=2;
            startGame(weaponChoice);
        }
        if (keys['3']||(mouseClickUsed&&mouse.x>(2*c.width/3))){
            weaponChoice=3;
            startGame(weaponChoice);
        }
        if (keys['4']){
            weaponChoice=4;
            startGame(weaponChoice);
        }
        /*if (keys['7']){
            weaponChoice=7;
            startGame(weaponChoice);
        }
        if (keys['8']&&devMode){
            weaponChoice=8;
            startGame(weaponChoice);
        }*/
        if (keys['9']&&devMode){
            weaponChoice=9;
            startGame(weaponChoice);
        }
    }else if(mode===8){
        camControl(true,enemies[0],keysToggle['c'],!keysToggle['x'],keys['z'],0);
        renderEverything(false,cam);
        powerUpSelect();
        //drawHUD(); //this would draw the held power up above the power up select, but it causes it's own bugs 
        drawRects();
        drawMouse();
    }
}
let deltaTime = 0;
let previousFps = [];
let computingStartTime = 0;
function repeat3(){
    computingStartTime = Date.now();
    ctx.clearRect(0,0,c.width,(c.height-HUDHeight));
    repeat2();
    deltaTime = (Date.now()-startTime)/(1000/targetFPS);
    if ((Math.abs(1-screenSize)<.3)&&devMode){
        //this just makes it so if the screen is deformed, it just won't draw the debug info
        ctx.fillStyle='black';
        ctx.font = '24px serif';
        ctx.fillText('deltaTime:'+roundTo2(deltaTime,100),400,20);
        ctx.fillText('target com time:'+Math.round(1000/targetRenderFPS),200,20);
        ctx.fillText('computing Time:'+(Date.now()-computingStartTime),200,45);
    }
    startTime = Date.now();
    mouseClickUsed=false;
}
let startTime = Date.now();
//Example of a deep clone
//let oldWalls = JSON.parse(JSON.stringify(walls))
const targetFPS = 30;
const targetRenderFPS = 60;
setInterval(repeat3,1000/targetRenderFPS);