let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

ctx.fillStyle='black';
ctx.font='48px Courier New';
ctx.fillText('Loading...',c.width/2.5,c.height/2);

//c.style.cursor='none'
if (false){
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
class newParticle{
    constructor(x,y,size,color,type,momentum,friction){
        this.x=x;
        this.y=y;
        this.size=size;
        this.color=color;
        this.type=type;
        this.friction=friction;
        this.drawParticle = function(particle){
            ctx.beginPath();
            let screenParticlePos = offSetByCam(particle);
            ctx.arc(screenParticlePos.x,screenParticlePos.y,particle.size*cam.zoom,0,Math.PI*2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.stroke();
        }
        this.momentum = momentum; //this is a newPoint as a vector
        this.moveParticle = function(particle){
            particle.x+=particle.momentum.x*deltaTime;
            particle.y+=particle.momentum.y*deltaTime;
            particle.momentum=dividePoint(particle.momentum,1+((particle.friction-1)*deltaTime));
            if (findDis(new newPoint(0,0),particle.momentum)<.1){
                particlesToRemove.push(particle);
            }
        }
        this.timer1 = 0;
    }
}
class newMajorPowerUp{
    constructor(PFType,label,color,upgradeEffect,onClickEffect,coolDownMax,damage,range,bulletKillPower,price,damageText){
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
        this.bulletKillPower=bulletKillPower;
        if (price===undefined){
            price=3;
        }
        this.price=price;
        if (damageText===undefined)[
            damageText = ''
        ]
        this.damageText=damageText;
        this.coolDowntext=''; //this can be individually set
        this.extraBulletEffects = [];
        this.extraOnClickEffects = [];
        this.image = new Image();
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
        this.var2 = null;
        this.var3 = null;
        this.price=1;
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
        this.lastRoom=dupPoint(this.room);
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
        this.invinceable=-1;
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
            if (PFType===7||PFType===14||PFType===16){
                team=2;
            }
            if (PFType===1){
                team=0;
            }
        }else if (PFType===37||PFType===38){
            team=1;
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
        this.statusEffects = []; //this is the effects EX: Shocked or on fire that is on the player format: {type:x,timeLeft:y}
        this.timer1 = 0; //this can time whatever the enemy needs to time
        this.timer2 = 0;
        this.enemyRoomEnemyLink = undefined; //enemies can set this to always link their enemyRoom to whatever room another enemy is in (most likely linked to the player)
    }
}
let guns = [2,6,7,45,48,49];
let bulletPowerUps = [6,7,37,45,49,51];
function newPowerUpPreset(PFType,isEffect){
    if (isEffect===undefined){
        isEffect=true;
    }
    let powerUp = null;
    let isGun = guns.includes(PFType);
    if (PFType===1||PFType===48){ //this makes grapple hook and gravity gun not have the Xdamage things
        isGun=false;
    }
    switch(PFType){
        case 0:
            powerUp = new newMajorPowerUp(PFType,'Dash','Lime',function (thisEnemy,thisPowerUp){if (dashFramesLeft<1){thisPowerUp.coolDown-=deltaTime}},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                dashDirection=thisEnemy.direction+Math.PI;
                dashFramesLeft=thisPowerUp.range;
                thisEnemy.health+=thisPowerUp.healthToHeal;
                if (thisPowerUp.healthToHeal>0){
                    thisEnemy.timer1 = 5.999;
                }
            },20,0,6);
        break
        case 1:
            powerUp = new newMajorPowerUp(PFType,'Grapple Hook','#ffffcc',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet =  new newBullet(0,0,60,0,'blue',40,5,50,20,1,new newPoint(0,0),thisEnemy,0,'',1,1);
                bullet.effects[1] = function(enemyHit,thisBullet){
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
                    ctx.strokeStyle='black';
                    ctx.lineWidth=1;
                }
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,0,enemies[0],enemies[0].size);
                /*aimCustomGun(thisEnemy,mouseShifted,thisPowerUp.damage,60,0,1,1,0,'red',20,1,1,function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.grappleTarget=dupPoint(thisBullet.owner);
                });*/
            },20,0,30,1);//the range here doesn't actually control anything
            powerUp.image.src = 'Gun_Images/Grapple_Gun.png';
        break
        case 2:
            powerUp = new newMajorPowerUp(PFType,'Grenade Gun','#4A69BB',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                //let dropPoint = addToPoint(thisEnemy,Math.sin(thisEnemy.direction)*40,Math.cos(thisEnemy.direction)*40)
                let dropPoint= dupPoint(thisEnemy);
                let enemy = newEnemyPreset(dropPoint,36,1,undefined,thisPowerUp.damage,mouseShifted);
                enemy.gunCoolDownMax=thisPowerUp.var1;
                enemy.gunCooldown=enemy.gunCoolDownMax;
                enemy.bulletLength=thisPowerUp.var2;
                enemy.enemyRoomEnemyLink = thisEnemy;
                enemy.enemyRoom = thisEnemy.enemyRoom;
                enemies.push(enemy);
                addToEnemyRooms(enemy);
            },40,1,0,Infinity);
            powerUp.var1 = 15; //the explosion time for the bombs
            powerUp.var2 = 200; //the explosion size of the bombs
            powerUp.image.src = 'Gun_Images/Grenade_Launcher.png';
        break
        case 3:
            powerUp = new newMajorPowerUp(PFType,'Heal 1HP in a Button Press','#4ABBA8',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                thisEnemy.health+=1;
                thisEnemy.timer1 = 5.999; //timer to track what frame of the charging animation to play. Not 6 as there is no 7th frame to play(zero indexed)
            },90,0);
        break
        case 4:
            powerUp = new newMajorPowerUp(PFType,'Magnet','#FF7501',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
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
            powerUp = new newMajorPowerUp(PFType,'Push Bullets and Enemies Away','#FFB475',function (thisEnemy,thisPowerUp){ //make the enemy split, the top section go up, then snap down to send out a shockwave
                thisPowerUp.coolDown-=deltaTime;
                thisPowerUp.var1-=deltaTime;
                if (thisPowerUp.var1>0){
                    for (bullet of bullets){
                        if (undefined!=bullet.enemiesHit.find((enemyCheck)=>enemyCheck===thisEnemy)){
                            continue;
                        }
                        bullet.enemiesHit.push(thisEnemy);
                        if (bullet.type===1){
                            continue;
                        }
                        if (findDis(bullet,thisEnemy)<400){
                            if (undefined!=rayCast(bullet,thisEnemy,false,thisEnemy.enemyRoom.walls)){
                                continue;
                            }
                            let bulletTail = findBulletTailPos(bullet);
                            bullet.x=bulletTail.x;
                            bullet.y=bulletTail.y;
                            bullet.direction = findAngle(bullet,thisEnemy);
                            bullet.owner = thisEnemy;
                            bullet.speed*=2;
                        }
                    }
                }
            },function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                thisPowerUp.var1 = 10; //the bullets pushing away effect will linger
                screenShake+=3;
                let enemyRoomEnemies = thisEnemy.enemyRoom.enemies;
                let bullet=new newBullet(0,0,40,0,'#FFB475',20,40,1,10,1,new newPoint(0,0),thisEnemy,0,'',20,(Math.PI*2)/2); //make this the blue of the player. The energy is moving outwards. Maybe also make it squiggly
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,0,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size,true);
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
                    if (dis<300){
                        force = -60;
                    }else if (dis<400){
                        force = -45;
                    }
                    //force = Math.max(20-(Math.max(dis,60)/40),0);
                    enemy.momentum = new newPoint(Math.sin(angle)*force,Math.cos(angle)*force);
                }
            },30,0,400);
            powerUp.var1 = 0; //how long the pushing effect has left to last for bullets
        break
        case 6:
            powerUp = new newMajorPowerUp(PFType,'Shotgun','#BABFC0',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,30,0,'red',40,5,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage,'',3,thisPowerUp.shotSpread);
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
            },20,1,10,1,undefined,' for each of the Three Bullets');
            powerUp.image.src = 'Gun_Images/Shotgun.png';
        break
        case 7:
            powerUp = new newMajorPowerUp(PFType,'Sniper','grey',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,40,0,'red',60,5,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage,'',1,1);
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
            },30,2,40,Infinity);
            powerUp.image.src = 'Gun_Images/Sniper.png';
        break
        case 8:
            powerUp = new newMajorPowerUp(PFType,'Click Here To Sell Item for $1','white',function (){},function(){ //if change wording, change drawPowerup, it's looking for the old text
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
        case 9:
            powerUp = new newMinorPowerUp(PFType,'1/2 cooldown for gun on left click. If no gun','#278978',function (majorPowerUp,thisPowerUp){
                for (powerUp of powerUpsGrabbed){
                    if (guns.includes(powerUp.PFType)){
                        if (majorPowerUp===powerUp){
                            majorPowerUp.coolDownMax/=2;
                        }
                        return;
                    }
                }
            })
            powerUp.secondLabel = 'on left click, 1/2 cooldown for gun on right click';
        break
        case 10:
            powerUp = new newMinorPowerUp(PFType,'Cooldown on guns 2/3','#414f40',function (majorPowerUp,thisPowerUp){
                if (guns.includes(majorPowerUp.PFType)){
                    majorPowerUp.coolDownMax*=.66666;
                }
            })
        break
        case 11:
            powerUp = new newMinorPowerUp(PFType,'Grenades Deal 1.5X Damage','#FF6E6E',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.damage*=1.5;
                }
            })
        break
        case 12:
            powerUp = new newMinorPowerUp(PFType,'2X Damage for Ability Bound to Right Click','#FFAC01',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[1]){
                    majorPowerUp.damage*=2;
                }
            })
        break
        case 13:
            powerUp = new newMinorPowerUp(PFType,'Every room cleared without taking damage, 1/2 cooldown on shotgun','#FF6EEC',function (majorPowerUp,thisPowerUp){
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
            powerUp = new newMinorPowerUp(PFType,'Cooldown on everything 3/4','#104239',function (majorPowerUp,thisPowerUp){
                majorPowerUp.coolDownMax*=.75;
            })
        break
        case 15:
            powerUp = new newMinorPowerUp(PFType,'Using the Dash Ability Heals 1HP','#4cd44e',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===0){
                    majorPowerUp.healthToHeal+=1;
                }
            })
        break
        case 16:
            powerUp = new newMinorPowerUp(PFType,'More Aim Assist','#5e3b5e',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    aimAssist+=1;
                }
            })
        break
        case 17:
            powerUp = new newMinorPowerUp(PFType,'After Gaining Health, 3X Damage for 5 Seconds','#f0c013',function (majorPowerUp,thisPowerUp){
                if(enemies[0].health>thisPowerUp.var1){
                    thisPowerUp.var2=150;
                }
                thisPowerUp.var1=enemies[0].health;
                if(thisPowerUp.var2>0){
                    if (majorPowerUp===powerUpsGrabbed[0]){
                        thisPowerUp.var2-=deltaTime;
                    }
                    majorPowerUp.damage*=3;
                    thisPowerUp.secondLabel = 'Active for '+Math.round((Math.max(0,thisPowerUp.var2)/30))+' More Seconds';
                }else{
                    thisPowerUp.secondLabel = 'Not Active';
                }
            })
            powerUp.var1 = enemies[0].health; //var1 is the starting health
            powerUp.var2 = 0; //var2 is the frames left with double damage
        break
        case 18:
            powerUp = new newMinorPowerUp(PFType,'Tighten Bullet Spread','#b260db',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===6){
                    majorPowerUp.shotSpread*=.75;
                }
            })
        break
        case 19:
            break
        case 20:
            powerUp = new newMinorPowerUp(PFType,'Increase Max HP by 5','#f7f74a',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    enemies[0].maxHealth+=5;
                }
            })
        break
        case 21:
            powerUp = new newMinorPowerUp(PFType,'Get Multiple of the Same Modifiers','#08a838',function (majorPowerUp,thisPowerUp){
                getDuplicateMinorPowerUps=true;
            })
        break
        case 23:
            powerUp = new newMinorPowerUp(PFType,'-2 Max Health, 2X Damage','#277bab',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    enemies[0].maxHealth-=2;
                }
                majorPowerUp.damage*=2;
            })
        break
        case 24:
            powerUp = new newMinorPowerUp(PFType,'If at or below 3HP, 2X Damage','#ffcc00',function (majorPowerUp,thisPowerUp){
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
            /*powerUp = new newMinorPowerUp(PFType,'Every 2 Rooms Cleared, Enemies can Drop 1 More Health, up to 4','#cc0099',function (majorPowerUp,thisPowerUp){
                if ((enemies[0].enemyRoom.roomNum-thisPowerUp.var2.roomNum)>=2){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    thisPowerUp.var3++;
                    if (thisPowerUp.var3>4){
                        thisPowerUp.var3=4;
                    }
                }
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxHealthDrop+=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Extra Health: '+thisPowerUp.var3;
            })
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
            powerUp.var3 = 0; //var3 is the extra health*/
            powerUp = new newMinorPowerUp(PFType,'Every Room Cleared Without Losing Health, Enemies can Drop 1 More Health','#cc0099',function (majorPowerUp,thisPowerUp){
                if (enemies[0].health<thisPowerUp.var1){
                    thisPowerUp.var1=Infinity;//this makes it so now the player is locked out of getting the thing this room
                }else if (enemies[0].health>thisPowerUp.var1){
                    thisPowerUp.var1=enemies[0].health;
                }
                let firstEnemy = enemies[0].enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
                if (thisPowerUp.var2.roomNum<enemies[0].enemyRoom.roomNum&&firstEnemy===undefined){
                    if (enemies[0].health===thisPowerUp.var1){
                        thisPowerUp.var3++;
                    }
                    thisPowerUp.var1=enemies[0].health;
                    thisPowerUp.var2=enemies[0].enemyRoom;
                }
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxHealthDrop+=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Extra Health: '+thisPowerUp.var3;
            })
            powerUp.var1 = enemies[0].health; //var1 is the starting health
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
            powerUp.var3 = 0; //var3 is the extra health*/
        break
        case 28:
            powerUp = new newMajorPowerUp(PFType,'Click Here With A Modifier And Use $5 to Put it in a Permanent Slot','White',function(){},function(thisEnemy,thisPowerUp){
                money-=thisPowerUp.var1;
                thisPowerUp.var1+=5;
                thisPowerUp.label = 'Click Here With A Modifier And Use $'+thisPowerUp.var1+' to Put it in a Permanent Slot';
            });
            powerUp.var1 = 5;
        break
        case 29:
            powerUp = new newMinorPowerUp(PFType,'After Clearing a Room, Get $0.2, up to $50, for every $1 you have','#99ff66',function (majorPowerUp,thisPowerUp){
                let firstEnemy = enemies[0].enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
                if ((enemies[0].enemyRoom.roomNum-thisPowerUp.var2.roomNum)>=1&&firstEnemy===undefined){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    money+=Math.min(money*.2,50);
                }
            })
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
        break
        case 30:
            powerUp = new newMinorPowerUp(PFType,'Enemies can Drop 1 More Money','#33cc33',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxMoneyDrop++;
                }
            })
        break
        case 31:
            powerUp = new newMinorPowerUp(PFType,'2X Range on Shotgun','#9999ff',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===6){
                    majorPowerUp.range*=2;
                }
            })
        break
        case 32:
            powerUp = new newMajorPowerUp(PFType,'Water Sprayer','aqua',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                //screenShake+=.5;
                let bullet = new newBullet(0,0,15,0,'aqua',15,15,5,60,1,new newPoint(),thisEnemy,thisPowerUp.damage,'sploosh',1,0);
                bullet.realWidth = bullet.visualWidth;
                bullet.drawBullet = function(bullet){
                    let midPoint = findBulletMiddle(bullet);
                    addCircle(midPoint,'aqua',bullet.visualWidth/2);
                    midPoint=offSetByCam(midPoint);
                    for (waterBullet of waterBullets){//this looks kind of jank and really cool at the same time
                        if (findDis(waterBullet,bullet)<30){
                            let waterMidPoint = offSetByCam(findBulletMiddle(waterBullet));
                            //let bulletAngle = findAngle(bullet,waterBullet);
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
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    bulletsToRemove.push(thisBullet);
                }
                bullet.effects[1] = function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.invinceable=enemyHit.maximumInvinceable;
                    screenShake+=1;
                    enemyHit.momentum= new newPoint()
                    if (undefined===enemyHit.statusEffects.find((effect)=>effect.type===0)){
                        enemyHit.statusEffects.push({
                            type:0,  //0 is the wet effect
                            timeLeft:60,
                            coolDown:0,
                            coolDownMax:3,
                            var1:undefined
                        });
                    }
                }
                bullet.effects[0] = function(enemyHit,thisBullet){
                    thisBullet.enemiesHit.push(enemyHit);
                    thisBullet.enemiesLeft--;
                }
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,.1,thisEnemy,thisEnemy.size);
                /*aimCustomGun(thisEnemy,mouseShifted,thisPowerUp.damage,60,0,1,1,0,'red',20,1,1,function(enemyHit,thisBullet){
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.grappleTarget=dupPoint(thisBullet.owner);
                });*/
            },0,.01,30);//the range here doesn't actually control anything
        break
        case 33:
            powerUp = new newMinorPowerUp(PFType,'Gain a 10% Damage Boost for Every HP You Have','#993300',function (majorPowerUp,thisPowerUp){
                thisPowerUp.secondLabel = 'Current Multiplier: '+(1+(enemies[0].health/10))+'X';
                majorPowerUp.damage*=1+(enemies[0].health*.1);
            });
        break
        case 34:
            powerUp = new newMajorPowerUp(PFType,'','white',function (thisEnemy,thisPowerUp){},function(thisEnemy,thisPowerUp){
                //this is a placeholder for just an invisible thing to click
            });
        break
        case 35:
            powerUp = new newMinorPowerUp(PFType,'Turn Excess HP Pickups into .2 Money','#ccff33',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    healthToMoneyRatio+=.2;
                }
            })
        break
        case 36: //this isn't in the possible power ups because more slots breaks the UI and because it would delete the small ones you had if you picked it up
            isEffect=false;
            powerUp = new newMajorPowerUp(PFType,'Gain 5 More Small Upgrade Slots','#000066',function (thisEnemy,thisPowerUp){
                minorPowerUpSpace+=5;
            },function(thisEnemy,thisPowerUp){},0,0);
        break
        case 37:
            powerUp = new newMajorPowerUp(PFType,'Lightning Staff','yellow',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                //screenShake+=.5;
                let bullet = new newBullet(0,0,30,0,'yellow',50,50,5,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(),thisEnemy,thisPowerUp.damage,'',1,0);
                bullet.realWidth = bullet.visualWidth;
                /*bullet.drawBullet = function(bullet){
                    let midPoint = findBulletMiddle(bullet);
                    addCircle(midPoint,bullet.color,bullet.visualWidth/2);
                }*/
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    bulletsToRemove.push(thisBullet);
                }
                bullet.effects[1] = function(enemyHit,thisBullet){
                    screenShake+=1;
                    let lightningEffect = enemyHit.statusEffects.find((effect)=>effect.type===1)
                    if (undefined===lightningEffect){
                        enemyHit.statusEffects.push({
                            type:1,  //1 is the shocked effect
                            timeLeft:60,
                            coolDown:5,
                            coolDownMax:10,
                            var1:thisBullet.damage, //the damage that will be dealt every time it triggers
                        });
                    }else{
                        lightningEffect.timeLeft=60;
                    }
                }
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,.1,enemies[0],enemies[0].size);
            },45,.5,60,1,undefined,' every 2 Seconds to Enemy');
        break
        case 38:
            powerUp = new newMajorPowerUp(PFType,'Spend $1 for a Full Heal','#4aba82',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp){
                if (money>=1&&thisEnemy.health<thisEnemy.maxHealth){
                    thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                    screenShake+=3;
                    thisEnemy.health=thisEnemy.maxHealth;
                    money--;
                    thisEnemy.timer1 = 5.999;
                }
            },180,0);
        break
        case 39:
            powerUp = new newMinorPowerUp(PFType,'2/3 Cooldown on everything, But Everything Does 2/3 Damage','#07ed5f',function (majorPowerUp,thisPowerUp){
                majorPowerUp.coolDownMax*=2/3;
                majorPowerUp.damage*=2/3;
            })
        break
        case 40:
            powerUp = new newMinorPowerUp(PFType,'Every Bullet has a 1/4 Chance to Drop Half Enemy Loot on Hit','#bd8202',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.damage>0){
                    majorPowerUp.extraBulletEffects.push(function(enemyHit,thisBullet){
                        if (enemyHit.team===1){
                            if (Math.random()<=(1/4)){
                                dropEnemyLoot(enemyHit,enemyHit.enemyRoom,1/2);
                            }
                        }
                    })
                }
            })
        break
        case 41:
            powerUp = new newMinorPowerUp(PFType,'Shotgun Bullets can Peirce Infinite Enemies','#b970e0',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType===6){
                    majorPowerUp.bulletKillPower=Infinity;
                }
            })
        break
        case 42:
            powerUp = new newMinorPowerUp(PFType,'1/2 Cooldown for Ability Bound to Left Click','#86E6F1',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    majorPowerUp.coolDownMax/=2;
                }
            })
        break
        case 43:
            powerUp = new newMinorPowerUp(PFType,"Grenades Heal You and your Souls The Grenade's Damage",'#1a37c7',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    bombsHealYou=true;
                }
            })
        break
        case 44:
            powerUp = new newMajorPowerUp(PFType,'Summon Souls as a Shield','#700F93',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let soulNum = 0;
                for (enemy of thisEnemy.enemyRoom.enemies){
                    if (enemy.PFType===9){
                        soulNum++;
                    }
                }
                let i=soulNum;
                while(i<16&&i<(soulNum+2)){
                    i++;
                    let staffPointPos = addToPoint(thisEnemy,Math.sin(gunAngle)*(45+thisEnemy.size),Math.cos(gunAngle)*(45+thisEnemy.size));

                    let angle = (Math.random()*Math.PI)+gunAngle-(Math.PI/2);
                    let soulHalfPos = addToPoint(staffPointPos,Math.sin(angle)*100,Math.cos(angle)*100);
                    let particle = new newParticle(soulHalfPos.x,soulHalfPos.y,10,'#700F93',0,new newPoint(-Math.sin(angle)*20,-Math.cos(angle)*20),0.90);
                    particle.timer1 = 4;
                    particle.drawParticle = function(particle){
                        let particleSpeed = findDis(new newPoint(0,0),particle.momentum);
                        ctx.globalAlpha = 2*((particleSpeed/20)-1);
                        let screenParticlePos = offSetByCam(addToPoint(particle,-soulImage.width/2,-soulImage.height/2));
                        ctx.drawImage(soulImage,screenParticlePos.x,screenParticlePos.y);
                        ctx.globalAlpha = 1;
                    }
                    particle.moveParticle = function(particle){
                        particle.timer1-=deltaTime;
                        particle.x+=particle.momentum.x*deltaTime;
                        particle.y+=particle.momentum.y*deltaTime;
                        particle.momentum=dividePoint(particle.momentum,1+((particle.friction-1)*deltaTime));
                        if (particle.timer1<0){
                            particlesToRemove.push(particle);
                        }
                    }
                    particles.push(particle); //this is supposed to be the soul being summoned and flying towards the staff to start roateing around the player

                    let enemy = newEnemyPreset(dupPoint(staffPointPos),9,1,'',thisPowerUp.damage,thisEnemy); //make a little animation when they are summoned
                    enemy.maxHealth=thisPowerUp.var1;
                    enemy.health=enemy.maxHealth;
                    enemy.enemyRoomEnemyLink = thisEnemy; //the soul will always be in the enemyRoom the player is in
                    enemy.enemyRoom = thisEnemy.enemyRoom;
                    enemy.timer1=findAngle(enemy,thisEnemy)+(Math.random()/50); //the angle the souls are around you. The randomness is to make the multiple souls that spawn work out better
                    enemy.timer2=3; //the time the soul should wait before it is visible and moves. gives the particles the time to look like they are the soul
                    enemies.push(enemy);
                    thisEnemy.enemyRoom.enemies.push(enemy);
                }
            },20,.2,0,Infinity,undefined,' for every Soul');
            powerUp.var1 = 1 //the souls health
            powerUp.image.src = 'Gun_Images/Soul_Summoner.png';
        break
        case 45:
            powerUp = new newMajorPowerUp(PFType,'Pistol','#DEDEDE',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,30,0,'red',30,5,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage,'',1,1);
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
            },25,1,30,1);
            powerUp.image.src = 'Gun_Images/Pistol.png';
        break
        case 46:
            powerUp = new newMajorPowerUp(PFType,"Ah everybody, get on the floor, and let's dance! Don't fight your feelings, give yourself a chance! Shake shake shake, shake shake shake Shake your booty! Shake your booty! Oh, shake shake shake, shake shake shake Shake your booty! Shake your booty! Aah, you can, you can do it very well You're the best in the world, I can tell Oh, shake shake shake, shake shake shake Shake your booty! Shake your booty! Oh, shake shake shake, shake shake shake Shake your booty! Shake your booty!"/*'SHAKE SHAKE SHAKE! SHAKE SHAKE SHAKE! SHAKE YOUR BOOTY! SHAKE YOUR BOOTY!'*/,'#FD65FF',function (thisEnemy,thisPowerUp){},function(thisEnemy,thisPowerUp,gunAngle){
                screenShake+=300;
                screenShakeLimit+=300;
            },0,0,0,0);
        break
        case 47:
            powerUp = new newMinorPowerUp(PFType,'If at 1HP, 1/4 Cooldown on Everything','#A58A00',function (majorPowerUp,thisPowerUp){
                if (enemies[0].health===1){
                    majorPowerUp.coolDownMax/=4;
                }
            })
        break
        case 48:
            powerUp = new newMajorPowerUp(PFType,'Black Hole Launcher','#BE3F02',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                //let dropPoint = addToPoint(thisEnemy,Math.sin(thisEnemy.direction)*40,Math.cos(thisEnemy.direction)*40)
                let dropPoint= dupPoint(thisEnemy);
                let enemy = newEnemyPreset(dropPoint,35,1,undefined,thisPowerUp.damage,mouseShifted);
                enemy.enemyRoomEnemyLink = thisEnemy;
                enemy.enemyRoom = thisEnemy.enemyRoom;
                //this doesn't scale right with frame rate differences
                enemy.targetSpeed = Math.min((findDis(mouseShifted,enemies[0])/3.5),100); //100 is the range
                enemy.momentum = new newPoint(Math.sin(gunAngle)*enemy.targetSpeed,Math.cos(gunAngle)*enemy.targetSpeed);
                enemy.direction = gunAngle;
                enemies.push(enemy);
                addToEnemyRooms(enemy);
            },40,0,0,Infinity);
            powerUp.image.src = 'Gun_Images/Grenade_Launcher.png';
        break
        case 49:
            powerUp = new newMajorPowerUp(PFType,'The Pulverizor','#EE0081',function (thisEnemy,thisPowerUp,gunAngle){
                if (thisPowerUp.var1>thisPowerUp.coolDownMax){ //the gun is charged
                    if (screenShake<2){
                        screenShake+=deltaTime*1.2;
                    }
                }
                if (!thisPowerUp.var2){
                    if (thisPowerUp.var1>thisPowerUp.coolDownMax){ //the gun is charged
                        screenShake+=3;
                        let bullet = new newBullet(0,0,60,0,'#FF008A',100,20,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage,'',1,1);
                        for (extraEffect of thisPowerUp.extraBulletEffects){
                            bullet.effects.push(extraEffect);
                        }
                        bullet.realWidth=bullet.visualWidth-3;
                        shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
                    }
                    thisPowerUp.var1=0;
                }
                thisPowerUp.var2=false;
            },function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.var1+=deltaTime;
                thisPowerUp.coolDown=0; //this makes this function trigger every frame, it doesn't have to wait
                thisPowerUp.var2=true;
            },30,5,100,Infinity);
            powerUp.var1 = 0; //the current charge level
            powerUp.var2 = false; //button held last frame
            //powerUp.var3 = 0; //frame counter for the flashing gun effect
            powerUp.coolDowntext = ' of Holding to Charge a Shot';
            powerUp.image.src = 'Gun_Images/Grenade_Launcher.png';
        break
        case 50:
            powerUp = new newMinorPowerUp(PFType,'Every Other Room Deal 4X Damage','#AB5C3B',function (majorPowerUp,thisPowerUp){
                if (enemies[0].enemyRoom.roomNum!=thisPowerUp.var2.roomNum){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    thisPowerUp.var1=!thisPowerUp.var1;
                }
                if (thisPowerUp.var1){
                    majorPowerUp.damage*=4;
                    thisPowerUp.secondLabel = '4X Damage is Active This Room';
                }else{
                    thisPowerUp.secondLabel = '4X Damage is Not Active This Room';
                }
            })
            powerUp.var1 = true; //whether the power up is active in this particular room
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
        break
        case 51:
            powerUp = new newMajorPowerUp(PFType,'Ice Staff','#00CFE4',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                //screenShake+=.5;
                let bullet = new newBullet(0,0,30,0,'#00E6FF',30,30,5,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(),thisEnemy,thisPowerUp.damage,'',1,0);
                bullet.realWidth = bullet.visualWidth;
                /*bullet.drawBullet = function(bullet){
                    let midPoint = findBulletMiddle(bullet);
                    addCircle(midPoint,bullet.color,bullet.visualWidth/2);
                }*/
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    bulletsToRemove.push(thisBullet);
                }
                bullet.effects[1] = function(enemyHit,thisBullet){
                    screenShake+=1;
                    enemyHit.health-=thisBullet.damage;
                    enemyHit.invinceable=enemyHit.maximumInvinceable;
                    let iceEffect = enemyHit.statusEffects.find((effect)=>effect.type===2);
                    if (undefined===enemyHit.statusEffects.find((effect)=>effect.type===2)){
                        enemyHit.statusEffects.push({
                            type:2,  //2 is the icy effect
                            timeLeft:60,
                            coolDown:0,
                            coolDownMax:0,
                            var1:.5, //the ice intensity multiplier
                        });
                    }else{
                        iceEffect.timeLeft=60;
                    }
                }
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,enemies[0],bullet.bulletSpreadNum,bullet.shotSpread,.1,enemies[0],enemies[0].size);
            },45,.2,60,1);
        break
        case 52:
            powerUp = new newMinorPowerUp(PFType,'Grenades take 0.5X as Long to Explode','#464B9A',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.var1*=.5;
                }
            })
        break
        case 53:
            powerUp = new newMinorPowerUp(PFType,'Grenades have 1.5X Explosion Size','#6247C9',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.var2*=1.5;
                }
            })
        break
        case 54:
            powerUp = new newMinorPowerUp(PFType,'Get $5 if Entering a Room on 3HP or less','#7bf23f',function (majorPowerUp,thisPowerUp){
                if ((enemies[0].enemyRoom.roomNum-thisPowerUp.var2.roomNum)>=1){
                    thisPowerUp.var2=enemies[0].enemyRoom;
                    if (enemies[0].health<=3){
                        money+=5;
                    }
                }
            })
            powerUp.var2 = enemies[0].enemyRoom; //var2 is whatever room the player is in
        break
        case 55:
            powerUp = new newMinorPowerUp(PFType,'Souls have twice as much health','#912DB5',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===44){
                    majorPowerUp.var1*=2;
                    thisPowerUp.secondLabel = 'All New Souls have '+majorPowerUp.var1+' Health after this'; //this shows the health of the last soul summoner's souls' health, but it shouldn't matter since they are all the same
                    //the label only checks this, it doesn't see it after the other power ups go
                }
            })
        break
        case 56:
            powerUp = new newMinorPowerUp(PFType,'Every 1 second, your next Bullet will drop 1/2 its damage in money on enemy hit','#AF37A0',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    thisPowerUp.coolDown-=deltaTime;
                }
                if (thisPowerUp.coolDown<0){
                    if (bulletPowerUps.includes(majorPowerUp.PFType)&&majorPowerUp.PFType!=49){//skip the pulverizor since that ones firing method is weird
                        majorPowerUp.extraOnClickEffects.push(function(thisEnemy,thisPowerUp,gunAngle){
                            for (powerUp of minorPowerUpsGrabbed){
                                if (powerUp.PFType===56){ //the power up is an instance of this power up
                                    powerUp.coolDown=powerUp.coolDownMax;
                                }
                            }
                        })
                        majorPowerUp.extraBulletEffects.push(function(enemyHit,thisBullet){
                            for (let i=0;i<(thisBullet.damage/2);i++){
                                let moneyPos = new newPoint();
                                do{
                                    moneyPos = addToPoint(dupPoint(enemyHit),(Math.random()*50)-25,(Math.random()*50)-25);
                                }while(rayCast(enemyHit,moneyPos,false,enemyHit.enemyRoom.walls))
                                enemies.push(newEnemyPreset(moneyPos,16));
                                addToEnemyRooms(enemies[enemies.length-1]);
                            }
                        })
                    }
                    thisPowerUp.secondLabel = 'Ready';
                }else{
                    thisPowerUp.secondLabel = 'Not Ready';
                }
            })
            powerUp.coolDownMax = 30; //I use the cooldown variable to get the code to draw the grey countdown circle
            powerUp.coolDown = 30;//the counter to check when the ability is ready
        break
        //power up ideas:
        //Illigal hacking: First, weapon gets damage boost, but The more you've used a specific instance of a weapon,the less damage it deals
        //do more damage but take more damage
        //add more upgrades concerning range
        //minor: health and money are always drawn towards you
        //up the sell value of everything by 1 every room
            //up the sell value by .25 with every sold item
        //enemies have a 1/4 to shoot a slower bullet that heals you(green bullet)
        //gain a "soul" for every enemy you kill
        //enemy can be shocked(or any other status effect) multiple times over
        //gravity gun has a explosion at the end(non damaging)
        //ice staff freeze effects are 2X as strong
        //grenades push you away 4X as far/strong
    }
    if (powerUp instanceof newMajorPowerUp&&isEffect){
        let specialEffect = Math.random()*50;
        if (specialEffect<1&&isGun){
            powerUp.secondLabel='This Gun Has 4X Damage!!';
            powerUp.damage*=4;
        }else if (specialEffect<6&&isGun){
            powerUp.secondLabel='This Gun Has 2X Damage!';
            powerUp.damage*=2;
        }else if (specialEffect<10){
            powerUp.secondLabel='This Ability Has 1/2 Cooldown!';
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
        powerUp.originalCopy.bulletKillPower=powerUp.bulletKillPower;
    }
    return powerUp;
}
let waterBullets = [];
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
            enemy.timer1=-1;
        break
        case 2:
            enemy = new newEnemy(pos.x,pos.y,0,20,'black',2,target,75-(enemyPower),1.4+(enemyPower/2),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20);
        break
        case 3:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/2),20,'grey',3,target,30-(enemyPower*2.5),3+(enemyPower/5),'',undefined,undefined,undefined,1,undefined,undefined,undefined,undefined,50);
        break
        case 4:
            enemy = new newEnemy(pos.x,pos.y,3,20,'green',4,target,45-(enemyPower*3),(2*Math.pow(2,enemyPower/3)),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20+enemyPower);
        break
        case 5:
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/3),20,'lime',5,target,70-(enemyPower*3),1+(2*Math.pow(2,enemyPower/4)),'');
        break
        case 6:
            enemy = new newEnemy(pos.x,pos.y,6,20,'blue',PFType,target,50,5,'');//demo enemy that gets shot at the beginning
            enemy.team=4;
            enemy.direction=Math.PI;
            enemy.gunCooldown=enemy.gunCoolDownMax;
        break
        case 7:
            enemy = new newEnemy(pos.x,pos.y,power,10,'yellow',7,target,Infinity,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                //gunMaxCoolDown is a timer until it despawns on this one
                if (touchedEnemy.PFType===1){
                    screenShake=1;
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
            //guard
            enemy = new newEnemy(pos.x,pos.y,0,20,'#3d3d3d',PFType,target,75-(enemyPower),1,'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20);
            enemy.gunCooldown=100;//timer until the guard tells you to stop
            enemy.target=pos;
        break
        case 9:
            //Soul that orbits you
            enemy = new newEnemy(pos.x,pos.y,.5,10,'#900FBE',PFType,target,Infinity,1,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (touchedEnemy.team!=thisEnemy&&touchedEnemy.team===1){
                    touchedEnemy.health-=thisEnemy.damage;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                    enemiesToRemove.push(thisEnemy);
                }
            },undefined,undefined,undefined,undefined,undefined,undefined,enemyPower);
            enemy.team=0;
            enemy.timer1=Math.random()*Math.PI*2; //the angle the souls are around you. Set again by the power up
        break
        case 10:
            enemy = new newEnemy(pos.x,pos.y,2+(enemyPower),20,'magenta',10,target,60-(enemyPower*2),4);
        break
        case 11:
            //Dashing boss
            enemy = new newEnemy(pos.x,pos.y,40,40,'#4C5C7D',11,target,40/*maybe scale this with difficulty*/,1+(10*Math.pow(2,enemyPower/1.5)),'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2){
                    touchedEnemy.health--;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                }
            });
            enemy.gunCooldown = enemy.gunCoolDownMax; //the enemy has a full length first dash
            enemy.direction = (Math.PI/4)+((Math.PI/2)*Math.floor(Math.random()*4)); //the bosses first dash is diagonol, away from the player but you still learn what it does
        break
        case 12:
            //teleporting boss
            enemy = new newEnemy(pos.x,pos.y,0,40,'#00FFBA',12,target,60/*maybe scale this with difficulty*/,1+(10*Math.pow(2,enemyPower/1.5)),'',function(touchedEnemy,thisEnemy,enemiesToRemove){});
            enemy.bulletSpeed=20;
        break
        case 13://portal to the boss rush
            enemy = new newEnemy(pos.x,pos.y,0,40,'#00FFBA',PFType,target,0,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if (touchedEnemy===enemies[0]&&thisEnemy.timer1<0&&undefined===touchedEnemy.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1)){
                    enemyRooms = [];
                    enemies = [enemies[0]]; //deletes all enemies except the player
                    enemies[0].x = roomWidth/2;
                    enemies[0].y = roomHeight-200;
                    enemies[0].lastPosition = dupPoint(enemies[0]);
                    generateRooms(31,30,true);
                    wallBoxes = generateWallBoxes(2,walls,wallBoxes);
                    enemyRooms[0].enemies.push(enemies[0]);
                    for (enemyRoom of enemyRooms){
                        for (enemy of enemyRoom.enemies){
                            removeFromEnemyRooms(enemy);
                            addToEnemyRooms(enemy);
                        }
                    }
                    timerGo = true;
                    enemiesToRemove.push(thisEnemy);
                }
            });
            enemy.team=2;
            enemy.timer1=120;
        break
        case 14:
            //placeholder for text
            enemy = new newEnemy(pos.x,pos.y,0,0,'white',14,target,Infinity,Infinity,message);
        break
        case 15:
            //boss
            enemy = new newEnemy(pos.x,pos.y,3,40,'black',15,target,45-(enemyPower*4.3),1+(10*Math.pow(2,enemyPower/1.5)),'',undefined,3);
        break
        case 16:
            //money
            enemy = new newEnemy(pos.x,pos.y,0,10,'green',16,target,Infinity,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
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
        case 35: //this is the gravity puller thing
            enemy = new newEnemy(pos.x,pos.y,0,13,'black',PFType,target,15,Infinity,'',function(){},undefined,undefined,undefined,undefined,undefined,undefined,enemyPower);
            enemy.team=3;
            enemy.friction=3;
            enemy.gunCooldown=enemy.gunCoolDownMax;
        break
        case 36: //this is the actual bomb
            //the momentum doesn't go the same distance at different frames rates, but the difference is not that big so I haven't fixed it
            let targetSpeed = Math.min((findDis(target,enemies[0])/3.5),100); //100 is the range
            let targetAngle = gunAngle
            let desiredVector = new newPoint(Math.sin(targetAngle)*targetSpeed,Math.cos(targetAngle)*targetSpeed);
            enemy = new newEnemy(pos.x,pos.y,targetSpeed,10,'red',PFType,target,15/*this is the default explosion time, but it will be modified by the power up*/,Infinity,'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if ((touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2&&thisEnemy.gunCooldown<0){
                    if (undefined===thisEnemy.touchedEnemies.find((enemyCheck)=>enemyCheck===touchedEnemy)){
                        if (touchedEnemy.team===0){
                            if (bombsHealYou){
                                touchedEnemy.health+=thisEnemy.damage;
                            }
                        }else{
                            touchedEnemy.health-=thisEnemy.damage;
                            touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                        }
                        let angle = findAngle(thisEnemy,touchedEnemy);
                        touchedEnemy.momentum.x-=Math.sin(angle)*13;
                        touchedEnemy.momentum.y-=Math.cos(angle)*13;
                        thisEnemy.touchedEnemies.push(touchedEnemy);
                    }
                }
            },undefined,undefined,undefined,undefined,100/*the size of the explosion*/,undefined,enemyPower,undefined,undefined,undefined,undefined,targetAngle);
            enemy.team=3;
            enemy.momentum = dupPoint(desiredVector);
            enemy.friction=3;
            enemy.gunCooldown=enemy.gunCoolDownMax;
        break
        case 37:
            //Link in the boss chain
            enemy = new newEnemy(pos.x,pos.y,5+(enemyPower/2),40,'pink',37,target,Infinity,1+(10*Math.pow(2,enemyPower/1.5)),'',function(touchedEnemy,thisEnemy,enemiesToRemove){
                if ((touchedEnemy.invinceable<1)&&(touchedEnemy.team!=thisEnemy.team)&&touchedEnemy.team!=2){
                    touchedEnemy.health--;
                    touchedEnemy.invinceable=touchedEnemy.maximumInvinceable+10;
                }
            },3);
            bossChainEnemies.push(enemy);
        break
        case 38:
            //this is the enemy that snaps to the boss chain
            enemy = new newEnemy(pos.x,pos.y,3+(enemyPower/2),20,'black',PFType,target,45-(enemyPower*3),(5*Math.pow(2,enemyPower/1.5)),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20+enemyPower);
        break
    }
    if (PFType!=7&&PFType!=16){//this isnt the best way to do it, it just stops the bad thing
        let target = enemy.target;
        enemy.target=undefined;
        enemy.originalCopy = JSON.parse(JSON.stringify(enemy));
        enemy.target=target
    }
    return enemy
}
let bossChainEnemies = []; //this will have every boss in the same list, so it won't work if rooms are skipped
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
        this.effects = [function(enemyHit,thisBullet){
            thisBullet.enemiesHit.push(enemyHit);
            thisBullet.enemiesLeft--;
        },function(enemyHit,thisBullet){
            enemyHit.health-=thisBullet.damage;
            enemyHit.invinceable=enemyHit.maximumInvinceable;
            screenShake+=1;
        }];
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
mouse.show=true;
let mouseShifted = dupPoint(mouse);
if (false){
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
    if (controller===undefined||true){
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
    controllers[gamepad.index] = gamepad; 
    var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);
    /*var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);*/
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
let changePlayerColor = false;
let mode =7;
//this is outdated
/*modes:
0:normal gameplay
1:The game is paused and goes by 1 full frame at a time
2:editor mode
3:room editor mode
*/
let enemies = [];
let enemyRooms = [];
let wallsCopy = [];
let particles = [];
//this is the player
enemies.push(newEnemyPreset(new newPoint(roomWidth/2,roomHeight-200),1));
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
let bulletsInClip = [];
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
function turnRoomIntoRealPos(roomPos){
    return subtractNumFromPoint(multiplyPoints(floorPoint(roomPos,1),new newPoint(roomWidth+(doorLength*2),roomHeight+(doorLength*2))),doorLength)
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
    if (enemyRoom!=undefined){
        enemyRoom.enemies.push(enemy);
        enemy.enemyRoom=enemyRoom;
    }
}
function drawEnemies(cam){
    for (enemyRoom of enemyRooms){
        let enemyNum = 0;
        for (enemy of enemyRoom.enemies){
            let screenEnemyPos = offSetByCam(enemy);
            if (enemy.PFType===1||enemy===enemies[0]){
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
                if (enemy.size!=0){
                    if (enemy.timer1<0){
                        movementDirection=Math.floor(movementDirection*4);
                        let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
                        let thisImage = playerImages.imagesList[movementDirection]
                        ctx.drawImage(thisImage,Math.round(imagePos.x),Math.round(imagePos.y)/*enemy.size*cam.zoom*2,(enemy.size)*cam.zoom*2*/);
                    }else{//the player is playing the charging animation
                        let imagePos = addToPoint(offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size)),0,-17);
                        let thisImage = playerImages.chargingList[Math.floor(enemy.timer1)];
                        ctx.drawImage(thisImage,Math.round(imagePos.x),Math.round(imagePos.y));
                    }
                }
                /*ctx.save();
                let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
                ctx.translate(imagePos.x,imagePos.y);
                ctx.rotate(-enemy.direction);
                ctx.drawImage(playerImages.imagesList[movementDirection],0,0);
                ctx.restore();*/

                ctx.beginPath();
                ctx.arc(screenEnemyPos.x,(enemy.y-cam.y)*cam.zoom,enemy.size*cam.zoom,0,Math.PI*2);
                ctx.fillStyle = 'red';
                if (enemy.health>=5&&enemy.invinceable>=0){
                    ctx.globalAlpha = .2;
                }else{
                    ctx.globalAlpha = -((Math.min(enemy.health,5)/5/*enemy.maxHealth*/)-1);
                }
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'black';

                let gunPos = offSetByCam(addToPoint(enemy,Math.sin(gunAngle)*enemy.size/2,Math.cos(gunAngle)*enemy.size/2));
                if (enemy.health<=0){
                    //maybe make the gun do something intresting when the player explodes, like falling to the ground or smth
                }
                let gunNum = 0;
                let firstSlotGun = false;
                let secondSlotGun = false;
                if (powerUpsGrabbed[0].image.src!=''){
                    firstSlotGun=true;
                    gunNum++;
                }
                if (powerUpsGrabbed[1].image.src!=''){
                    secondSlotGun=true;
                    gunNum++;
                }
                let image;
                if (secondSlotGun||firstSlotGun){
                    if (secondSlotGun&&firstSlotGun){
                        for (let i=0;i<2;i++){
                            image=powerUpsGrabbed[i].image;
                            ctx.save();
                            ctx.translate(gunPos.x,gunPos.y);
                            ctx.rotate(-gunAngle);
                            if (gunAngle>0){
                                ctx.translate(image.width, 0);
                                ctx.scale(-1, 1);
                                ctx.drawImage(image,(i*15),0,image.width*cam.zoom,image.height*cam.zoom);
                            }else{
                                ctx.drawImage(image,(i*15)-20,0,image.width*cam.zoom,image.height*cam.zoom);
                            }
                            ctx.restore();
                        }
                    }else {
                        if (firstSlotGun){
                            image=powerUpsGrabbed[0].image;
                        }else{
                            image=powerUpsGrabbed[1].image;
                        }
                        ctx.save();
                        ctx.translate(gunPos.x,gunPos.y);
                        ctx.rotate(-gunAngle);
                        if (gunAngle>0){
                            ctx.translate(image.width, 0);
                            ctx.scale(-1, 1);
                            ctx.drawImage(image,10+(image.width/4),0,image.width*cam.zoom,image.height*cam.zoom);//Every image probably needs its own variable on where the barrel is
                        }else{
                            ctx.drawImage(image,-10,0,image.width*cam.zoom,image.height*cam.zoom);
                        }
                        ctx.restore();
                    }
                }
            }else if(enemy.PFType===36){
                if (enemy.gunCooldown>0){
                    if (((enemy.gunCooldown<10)&&((enemy.gunCooldown%6)<2))){
                        ctx.beginPath();
                        ctx.arc(screenEnemyPos.x,screenEnemyPos.y,enemy.bulletLength,0,Math.PI*2);
                        ctx.fillStyle='red';
                        ctx.fill();
                        ctx.stroke();
                    }
                    let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size-5));
                    ctx.drawImage(bombImage,imagePos.x,imagePos.y);
                }else {
                    let image;
                    switch (true){
                        case enemy.gunCooldown>-2:
                            image = explosionImages[0];
                        break
                        case enemy.gunCooldown>-3:
                            image = explosionImages[1];
                        break
                        case enemy.gunCooldown>-4:
                            image = explosionImages[2];
                        break
                        default:
                            image=explosionImages[3];
                    }
                    let imageScaling = enemy.bulletLength/100;
                    let imagePos = offSetByCam(addToPoint(enemy,imageScaling*(-image.width/2),imageScaling*(-image.height/2)));
                    ctx.drawImage(image,imagePos.x,imagePos.y,image.width*imageScaling,image.height*imageScaling);
                }
            }else if (enemy.PFType===9){//soul image
                if (enemy.timer2<0){
                    let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
                    ctx.drawImage(soulImage,imagePos.x,imagePos.y);
                }
            }else if (enemy.PFType===16){ //money
                let image = creditCardImage;
                let imagePos = offSetByCam(addToPoint(enemy,-image.width/2,-image.height/2));
                ctx.drawImage(image,imagePos.x,imagePos.y,image.width,image.height);
            }else if (enemy.PFType===13){
                if (undefined===enemy.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1)){
                    let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
                    ctx.drawImage(portalImage,imagePos.x,imagePos.y,enemy.size*2,enemy.size*2);
                }
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
                ctx.font = enemy.size*2*cam.zoom+'px Courier New';
                ctx.fillText(enemyNum,screenEnemyPos.x-(cam.zoom*enemy.size/2),screenEnemyPos.y+(cam.zoom*enemy.size/2));
                enemyNum++;
            }
            if (((keysToggle['j']&&devMode))&&enemy.team!=2){
                ctx.fillStyle='white';
                ctx.font = enemy.size*cam.zoom+'px Courier New';
                ctx.fillText(Math.floor(enemy.health),screenEnemyPos.x-(cam.zoom*enemy.size/4),screenEnemyPos.y+(cam.zoom*enemy.size/4));
            }
            /*if (enemies[0]===enemy){
                ctx.fillStyle='white';
                ctx.font = enemy.size*cam.zoom+'px Courier New';
                ctx.fillText(Math.floor(enemy.health),screenEnemyPos.x-(cam.zoom*enemy.size/4),screenEnemyPos.y+(cam.zoom*enemy.size/4));
            }*/
            let firstEnemy = enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
            ctx.fillStyle='black';
            ctx.font = 30*cam.zoom+'px Courier New';
            let message = '';
            if (enemy.size!=0||enemy.PFType===14&&firstEnemy===undefined){
                //message = messages[enemy.PFType];
                message=enemy.label;
            }
            let metrics = ctx.measureText(message);
            ctx.fillText(message,screenEnemyPos.x-(metrics.width/2),screenEnemyPos.y-(cam.zoom*40));
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
function betterAccountForZ(point,z){
    return new newPoint(((point.x)*d)/z,((point.y)*d)/z);
}
function accountForZ(point,z){
    return new newPoint((((point.x-cam.x)-c.width/2)*d)/z+c.width/2,(((point.y-cam.y)-(c.height-HUDHeight)/2)*d)/z+(c.height-HUDHeight)/2)
}
function findMidNumber(num1,num2){
    return Math.min(num1,num2)+Math.abs((num1-num2)/2)
}
function findMidPoint(point1,point2){
    return new newPoint(Math.min(point1.x,point2.x)+Math.abs((point1.x-point2.x)/2),Math.min(point1.y,point2.y)+Math.abs((point1.y-point2.y)/2));
}
function findBulletTailPos(bullet){
    let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
    let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
    return new newPoint(tailX,tailY);
}
function findBulletMiddle(bullet){
    let tailX = bullet.x-(Math.sin(bullet.direction)*bullet.tailLength);
    let tailY = bullet.y-(Math.cos(bullet.direction)*bullet.tailLength);
    return findMidPoint(new newPoint(tailX,tailY),dupPoint(bullet));
}
function drawWalls(cam,draw3d){
    let i = 0;
    //this is an example of a crisp line, I can't figure out how to get the walls to look like this
    /*ctx.beginPath();
    ctx.moveTo(100.5,100);
    ctx.lineTo(100.5,200);
    ctx.stroke();*/
    for (enemyRoom of enemyRooms){
        if (enemyRoom.useExtraWalls===1){
            for (wall of enemyRoom.extraWalls){
                if (!draw3d){
                    ctx.beginPath();
                    ctx.moveTo(((wall.first.x-cam.x)*cam.zoom),((wall.first.y-cam.y)*cam.zoom));
                    ctx.lineTo(((wall.second.x-cam.x)*cam.zoom),((wall.second.y-cam.y)*cam.zoom));
                    ctx.stroke();
                }else{
                    let newFirst = accountForZ(wall.first,47);
                    let newSecond = accountForZ(wall.second,47);
                    let newFirst2 = accountForZ(wall.first,53);
                    let newSecond2 = accountForZ(wall.second,53);
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
                let newFirst = accountForZ(wall.first,47);
                let newSecond = accountForZ(wall.second,47);
                let newFirst2 = accountForZ(wall.first,53);
                let newSecond2 = accountForZ(wall.second,53);
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
            if (enemy.PFType===36&&enemy.gunCooldown<=0){
                continue;
            }
            let thisWallsCheck = extraWallsCheck;
            if ((enemy.team===0||enemy.team===3)&&enemyRoom.useExtraWalls!=1){
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
        for (enemyRoom of enemyRooms){
            for (spawner of enemyRoom.spawnPoints){
                addCircle(dupPoint(spawner),'red',5);
            }
        }
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
                    ctx.font = 10*cam.zoom+"px Courier New";
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
function generateRoom(topOpen,rightOpen,bottomOpen,leftOpen,roomPos,roomNum,difficulty,bossesSpawned,bossRush,challengeRooms){ //not implemented yet, but this would make sure if 5 rooms pass without a challenge, it makes one
    //let enemiesPerRoom = 0;
    //this makes a new list with a placeholder enemy that will always be in the room
    //this aligns the cordinates as (-1,1) is the room one to the left of the beginning, not at the actual cordiate (-1,0)
    let enemyRoom = turnIntoRoomPos(roomPos);
    enemyRoom.enemies=[];
    enemyRoom.walls=[];
    enemyRoom.wallBoxes = [];
    enemyRoom.difficulty = difficulty;
    enemyRoom.roomNum=roomNum;
    enemyRoom.useExtraWalls=0;
    enemyRoom.isPowerUpCollected = false;
    enemyRoom.powerUps = [];
    enemyRoom.shopPowerUps = [];
    enemyRoom.shopRerollNum = 0; //not used currently
    enemyRoom.spawnPoints = [];
    enemyRoom.challengeRoom = 0; //0 means not a challenge room
    if (roomNum===0){
        enemyRoom.isPowerUpCollected = false;
        enemyRoom.powerUps = [newPowerUpPreset(34,false),newPowerUpPreset(45,false),newPowerUpPreset(34,false)];
    }else if (roomNum<0){
        enemyRoom.isPowerUpCollected = true;
    }else if (roomNum===targetNumOfRooms){//doing it like this is easier for me to understand
        enemyRoom.isPowerUpCollected = true;
    }
    if (roomNum>5&&(roomNum%10)!=0){ //once room 5 and not a boss room, rooms can start to be challenge rooms
        let randomNum = Math.random();
        randomNum-=.75;
        randomNum*=4;
        randomNum=Math.floor(randomNum*4); //randomNum is now between 0-3 is challenge room, below 0 if else
        enemyRoom.challengeRoom = Math.max(0,randomNum);
    }
    //enemyRooms.push([newEnemyPreset(addToPoint(roomPos,roomWidth/2,roomHeight/2),2)]);
    enemyRooms.push(enemyRoom);
    //enemies.push(enemyRooms[enemyRooms.length-1][0]);
    let roomOption = 0;
    if (roomNum===-1||(bossRush&&roomNum===0)){
        roomOption = emptyRoom;
        enemyRoom.isPowerUpCollected=true;
    }else if(roomNum===-1){
        roomOption = experimentRoom;
        enemyRoom.useExtraWalls=2;//the extra walls cannot come back if the value is set to 2
    }else if(roomNum===0&&!bossRush){
        roomOption = guardRoom;
    }else if ((roomNum%10)===0||bossRush){
        const enemyPosition = addToPoint(roomPos,roomWidth/2,roomHeight/2);
        let bossType = [0,2,1]/*this is the boss order*/[bossesSpawned.length%3];
        bossesSpawned.push(bossType);
        switch (bossType){
            case 0:
                roomOption=emptyRoom;
                enemies.push(newEnemyPreset(enemyPosition,11,undefined,undefined,difficulty));
                enemyRoom.enemies.push(enemies[enemies.length-1]);
                break
            case 1:
                roomOption = emptyRoom;
                let previousEnemy = enemies[0];
                for (let i=0;i<4;i++){
                    previousEnemy = newEnemyPreset(enemyPosition,37,undefined,undefined,difficulty,previousEnemy);
                    enemies.push(previousEnemy);
                    enemyRoom.enemies.push(previousEnemy);
                    enemies.push(newEnemyPreset(enemyPosition,38,undefined,undefined,difficulty,previousEnemy));
                    enemyRoom.enemies.push(enemies[enemies.length-1]);
                }
                break
            case 2:
                //roomOption=teleportingBossRoom;
                roomOption = {
                    walls:[],
                    spawnPoints:[]
                }
                roomOption.spawnPoints = teleportingBossRoom.spawnPoints;
                enemies.push(newEnemyPreset(enemyPosition,12,undefined,undefined,difficulty,enemies[0]));
                enemyRoom.enemies.push(enemies[enemies.length-1]);
                break
            case 10:
                roomOption = bossRoom;
                enemies.push(newEnemyPreset(enemyPosition,15,undefined,undefined,difficulty));
                enemyRoom.enemies.push(enemies[enemies.length-1]);
                break
        }
    }else{
        roomOption = roomOptions[Math.floor(Math.random()*(roomOptions.length))];
    } 
    enemyRoom.walls = JSON.parse(JSON.stringify(roomOption.walls));
    let room = enemyRoom.walls;
    enemyRoom.extraWalls = [];
    let extraWalls=enemyRoom.extraWalls;
    for(spawnPoint of roomOption.spawnPoints){
        enemyRoom.spawnPoints.push(addToPoint(spawnPoint,roomPos.x,roomPos.y));
    }
    let numOfEnemies=0;
    if (roomOption.spawnPoints.length>0&&((roomNum%10)!=0||roomNum===0)&&!bossRush){
        if (roomNum<=0){
            numOfEnemies=roomOption.spawnPoints.length;
        }else{
            numOfEnemies = Math.floor(((Math.random()/2)+.5)*(difficulty))+1;
        }
    }
    for (let i = 0;i<numOfEnemies;i++){
        let randomNum = Math.floor(Math.random()*roomOption.spawnPoints.length);
        let enemyRandomNum = Math.random();
        if (roomNum<=0){
            randomNum = i; //every spawn point gets an enemy if this is the experiment room
        }
        let enemyPos = roomOption.spawnPoints[randomNum];
        //this adds the newest enemy to both lists
        let enemyType = 4;
        let scaledRandomNum = ((-Math.pow(3,-((enemyRandomNum*difficulty))))+1);
        if(roomNum===0){
            enemyType=8;
        }else if (roomNum<2){
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
        let enemy = newEnemyPreset(addTwoPoints(enemyPos,roomPos),enemyType,undefined,undefined,difficulty);
        if (roomNum===-1){
            enemy.gunCooldown=60;
            if (randomNum>=2){
                enemy.team=0;//the players team so they don't shoot at the player
            }
        }
        enemies.push(enemy);
        enemyRoom.enemies.push(enemy);
    }
    if (roomNum===-1){ //starting room
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,150),14,0,'Move with WASD'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,200),14,0,'Press 1 to be a Sweat'));
    }
    if (roomNum===targetNumOfRooms-2&&!bossRush){ //final room
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,200+roomPos.y),14,0,'You am become death'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,250+roomPos.y),14,0,'Destroyer of world'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,300+roomPos.y),14,0,'Reload the Page to Play Again'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,350+roomPos.y),14,0,'Or enter the Portal to Fight a Boss Rush'));
        enemies.push(newEnemyPreset(addToPoint(roomPos,roomWidth/2,(roomHeight/2)+100),13,undefined,undefined,difficulty)); //portal
        enemyRoom.enemies.push(enemies[enemies.length-1]);
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
function generateRooms(targetNumOfRooms,finalDifficulty,bossRush){
    let offLimitRooms = [];
    let bossesSpawned = [];
    //if the targetNumOfRooms is big, it will take a while to generate, it has probbally not crashed
    let deadEnds = [];
    //about half of the rooms will be dead ends
    let originalLength = enemies.length;
    //this clears the walls list and adds a cap to the beggining, but only on the bottom, if the beggining is different, the numbers need to change
    //walls = [new newWall(700,700,600,700)];
    walls = [];
    let roomsToMake = [{
        x:0,
        y:0,
        parentDirection:null,
        setDoors:[0],
    }];
    let finishedRooms = [];
    //this is set to one because the first room exists as a room
    let numOfRooms = 1;
    while(roomsToMake.length>0){
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
        let notOptions = [...room.setDoors]; //this initializes the function and gives makes it not copy these doors
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
        let numOfDoors = 0;
        if (room.setDoors.length>0){
            options=room.setDoors;
        }else{
            for (let i = 0;i<4;i++){
                if (notOptions.find(passed => passed===i)===undefined){
                    options.push(i);
                }
            }
        }
        numOfDoors = Math.floor(Math.random()*(options.length+1));
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
            let doorPos = 0;
            let randomNum = Math.floor(Math.random()*(options.length));
            doorPos = options[randomNum];
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
            roomsToMake[0].setDoors = [];
            if (finishedRooms.length<2){
                roomsToMake[0].setDoors.push(0);
            }
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
        if (deadEnd&&numOfRooms<targetNumOfRooms){
            //this still might not work and the maze might end early if it can't back out of a deadend
            roomsToMake.splice(numOfDoors,1)[0];
            offLimitRooms.push(finishedRooms.pop());
            roomsToMake.push(finishedRooms.pop());
            numOfRooms-=2;
        }else{
            finishedRooms.push(roomsToMake.splice(numOfDoors,1)[0]);
        }
    }
    let i=0;
    for (room of finishedRooms){
        i++;
        if (bossRush){
            walls = walls.concat(generateRoom(room.up,room.right,room.down,room.left,room.roomPos,i-1,(((i)/(targetNumOfRooms))*(finalDifficulty-1))+1,bossesSpawned,true));
        }else{//normal rooms
            walls = walls.concat(generateRoom(room.up,room.right,room.down,room.left,room.roomPos,i-2,(((i-2)/(targetNumOfRooms))*(finalDifficulty-1))+1,bossesSpawned));
        }
    }
    for (let i=0;i<originalLength;i++){
        addToEnemyRooms(enemies[i]);
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
            if ((enemy.team===0||enemy.team===3)&&enemyRoom.useExtraWalls!=1){
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
function enemyMovement(enemiesToRemove,skipPlayer){
    let start = floorPoint(enemies[0],boxSize);
    dashCooldown-=deltaTime;
    if (PFBoxes.find((element) => isSamePoint(element,start))===undefined){
        PFBoxes.push(new newPathBox(start.x,start.y,0,0,0,'end',true));
    }

    enemies[0].inDoorWay=false;
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
        enemies[0].inDoorWay=true;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.x++;
        enemies[0].inDoorWay=true;
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
    for (mainEnemyRoom of enemyRooms){
        if(!sameRoomPos(mainEnemyRoom,enemies[0].room)&&!sameRoomPos(mainEnemyRoom,addTwoPoints(enemies[0].room,roomChange))){
            continue;
        }
        let enemyRoom =mainEnemyRoom.enemies;
        for (let i =0;i<enemyRoom.length;i++){
            let enemy=enemyRoom[i];
            if (enemy.enemyRoomEnemyLink===undefined){
                enemy.enemyRoom=mainEnemyRoom;
            }
            if(enemy.health<=0){
                if (enemy.team===1){
                    let multiplier=1;
                    if (enemy.PFType===15){ //this makes it so bosses drop twice as much loot
                        multiplier=4;
                    }
                    dropEnemyLoot(enemy,mainEnemyRoom,multiplier);
                }
                if (enemy.PFType===37||enemy.PFType===11||enemy.PFType===15){//bosses
                    for (let i=0;i<40;i++){
                        particles.push(new newParticle(enemy.x,enemy.y,7,enemy.defaultColor,0,new newPoint((Math.random()-.5)*15,(Math.random()-.5)*15),1.1));
                    }
                }else{
                    for (let i=0;i<20;i++){
                        particles.push(new newParticle(enemy.x,enemy.y,5,enemy.defaultColor,0,new newPoint((Math.random()-.5)*20,(Math.random()-.5)*20),1.3));
                    }
                }
                //if (undefined===enemiesToRemove.find((enemyCheck)=>enemyCheck===enemy)){
                    enemiesToRemove.push(enemy);
                //}
                continue;
            }
            if (enemy.health>enemy.maxHealth){
                enemy.health=enemy.maxHealth;
            }
            enemy.lastPosition=dupPoint(enemy);
            enemy.color=enemy.defaultColor;
            enemy.gunCooldown-=deltaTime;
            enemy.invinceable-=deltaTime;
            enemy.speed=enemy.targetSpeed*deltaTime;
            enemyStatusEffects(enemy);
            if (enemy.gunCooldown>enemy.gunCoolDownMax){
                enemy.gunCooldown=enemy.gunCoolDownMax;
            }
            if (enemy.invinceable>0){
                enemy.color='red';
            }
            //enemy.lastRoom=enemy.room;
            //enemy.lastPosition = new newPoint(enemy.x,enemy.y);
            //enemy.room = new newPoint((enemy.x+doorLength)/(roomWidth+(doorLength*2)),(enemy.y+doorLength)/(roomHeight+(doorLength*2)));
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
            if (enemy.PFType===0||enemy.PFType===4||enemy.PFType===15||(enemy.PFType===37&&enemy.target.team===0)){
                if (enemy.speed>findDis(enemy,enemy.target)){
                    enemy.x=enemy.target.x;
                    enemy.y=enemy.target.y;
                }else{
                    enemyAngle = findAngle(enemy,enemy.target);
                    enemy.x-=Math.sin(enemyAngle)*enemy.speed;
                    enemy.y-=Math.cos(enemyAngle)*enemy.speed;
                }
            }else if (enemy.PFType===1&&!skipPlayer){
                playerMovement(enemy,mainEnemyRoom);
            }else if (enemy.PFType===3||enemy.PFType===5||enemy.PFType===17){
                pathfindingMovement(enemy,mainEnemyRoom);
            }else if (enemy.PFType===6){
                if (enemy.gunCooldown<0){
                    enemy.gunCooldown=enemy.gunCoolDownMax;
                    enemy.direction+=Math.PI;
                }
                enemy.x+=Math.sin(enemy.direction)*enemy.speed;
                enemy.y+=Math.cos(enemy.direction)*enemy.speed;
            }else if (enemy.PFType===7){
                if (enemy.gunCooldown<0){
                    enemiesToRemove.push(enemy);
                }
            }else if (enemy.PFType===8){
                //guard
                if (enemy.targetSpeed===0){
                    enemy.x=enemy.target.x;
                    enemy.y=enemy.target.y;
                    if (enemies[0].y<enemy.y){
                        enemy.targetSpeed=5;
                        let baseTarget = new newPoint(Math.max(Math.min(enemies[0].x,roomWidth-60),60),enemies[0].y-10);
                        if (enemies[0].PFType!=0){
                            enemy.target = addToPoint(baseTarget,-30,0);
                            enemies[0].PFType=0;
                            enemies[0].target = addToPoint(enemies[0],0,100);
                            modeTimer = 60;
                            if (devMode){
                                modeTimer=5;
                            }
                        }else{
                            enemy.target = addToPoint(baseTarget,30,0);
                        }
                    }
                }else{
                    if (enemy.speed>findDis(enemy,enemy.target)){
                        enemy.x=enemy.target.x;
                        enemy.y=enemy.target.y;

                        let screenEnemyPos = offSetByCam(enemy);
                        let text = 'Halt';
                        if (rectsToDraw.length===1){
                            text = "Don't do Any Funny Business";
                            modeTimer-=deltaTime;
                            if (modeTimer<0){
                                mainEnemyRoom.isPowerUpCollected=true;
                                switchMode(8);
                                enemies[0].PFType=1;
                            }
                        }
                        if (modeTimer<0){
                            enemy.PFType=0;
                            enemy.target=enemies[0];//the enemy looks like its running away from you
                            enemy.targetSpeed=-1; //maybe even make them scream or something
                        }
                        let textToDraw = [];
                        ctx.font = '32px Courier New'
                        let metrics = ctx.measureText(text);
                        let rectHeight = 35;
                        addText(text,new newPoint(5,rectHeight-7),ctx.font,'black',metrics.width,textToDraw);
                        addRect(addToPoint(screenEnemyPos,-40,-60),metrics.width+10,rectHeight,'white',textToDraw,false);
                        if (rectsToDraw.length===2){
                            let rect1 = rectsToDraw[0];
                            let rect2 = rectsToDraw[1];
                            /*let distance = rect2.x-rect1.x;
                            rect1.x-=(distance/2);
                            rect2.x+=(distance/2);*/
                            rect1.x-=20;
                            rect2.x+=20;
                        }
                    }else{
                        enemyAngle = findAngle(enemy,enemy.target);
                        enemy.x-=Math.sin(enemyAngle)*enemy.speed;
                        enemy.y-=Math.cos(enemyAngle)*enemy.speed;
                    }
                }
            }else if (enemy.PFType===9){
                if (enemy.timer2<0){
                    //souls rotate around their target(the player)
                    let distance = enemy.target.size+enemy.size+20;
                    //enemy.timer1 =  findAngle(enemy,enemy.target.lastPosition);
                    enemy.timer1+=enemy.speed*deltaTime; //timer1 is the angle
                    if (enemy.timer1>Math.PI*2){
                        enemy.timer1-=Math.PI*2;
                    }
                    enemy.x=enemy.target.x+(Math.sin(enemy.timer1)*distance);
                    enemy.y=enemy.target.y+(Math.cos(enemy.timer1)*distance);
                    enemy.lastPosition = dupPoint(enemy.target);
                }else{
                    enemy.timer2-=deltaTime;
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
            }else if (enemy.PFType===11){
                //dashing boss
                if(enemy.gunCooldown<0){ //maybe make this use momentum instead
                    let playerAngle = findAngle(enemy.target,enemy.target.lastPosition);
                    let playerDistance = findDis(enemy.target.lastPosition,enemy.target)
                    let expectedPlayerPos = addToPoint(dupPoint(enemy.target),Math.sin(playerAngle)*playerDistance*(20/deltaTime),Math.cos(playerAngle)*playerDistance*(20/deltaTime))
                    //addCircle(expectedPlayerPos,'blue',20);
                    enemy.direction = findAngle(expectedPlayerPos,enemy);
                    enemy.gunCooldown=enemy.gunCoolDownMax-0.01;
                    //enemy.timer1++; //this is the number of bullets the boss needs to shoot. Will almost always be 0 or 1
                }
                if (enemy.gunCooldown<enemy.gunCoolDownMax-20){ //the boss waits a second before starting it's next dash
                    enemy.x+=Math.sin(enemy.direction)*enemy.speed; //boss starts the first dash too soon
                    enemy.y+=Math.cos(enemy.direction)*enemy.speed;
                }
            }else if (enemy.PFType===12){
                //teleporting boss
                enemy.timer1-=deltaTime;
                if (enemy.timer1<(enemy.gunCoolDownMax/2)&&enemy.timer2===0){
                    enemy.timer2 = 2;
                }else if (enemy.timer1<0){ //make the boss teleport to an actual random pos
                    let teleportPos = dupPoint(enemy.enemyRoom.spawnPoints[Math.floor(Math.random()*enemy.enemyRoom.spawnPoints.length)]);
                    enemy.timer1=enemy.gunCoolDownMax;
                    enemy.x=teleportPos.x;
                    enemy.y=teleportPos.y;
                    enemy.lastPosition.x=enemy.x;
                    enemy.lastPosition.y=enemy.y;
                    enemy.timer2=0;
                }
            }else if (enemy.PFType===13){ //portal
                if (undefined===enemy.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1)){
                    enemy.timer1-=deltaTime;
                }
            }else if (enemy.PFType===35){
                //gravity gun
                enemy.targetSpeed = findDis(new newPoint(0,0),enemy.momentum);
                for (pulledEnemy of enemyRoom){
                    if (pulledEnemy===enemy||pulledEnemy.team===2){//maybe also skip the player
                        continue;
                    }
                    let angle = findAngle(enemy,pulledEnemy);
                    pulledEnemy.momentum.x+=Math.sin(angle)*5*deltaTime;//this will probably not work on other frame rates
                    pulledEnemy.momentum.y+=Math.cos(angle)*5*deltaTime;
                }
                if (enemy.gunCooldown<0){
                    enemiesToRemove.push(enemy);
                }
            }else if (enemy.PFType===36){
                enemy.targetSpeed = findDis(new newPoint(0,0),enemy.momentum);
                if (enemy.gunCooldown<-9){
                    //if (!enemy.deleted){
                        enemiesToRemove.push(enemy);
                    //}else{
                        //console.log('already deleted');
                    //}
                }else if (enemy.gunCooldown<0&&enemy.size!=0/*the bomb will stop exploding once the smoke continues*/){
                    enemy.size+=deltaTime*20;
                }else{
                    enemy.color='black';
                }
                if (enemy.size>enemy.bulletLength){
                    enemy.size=0;
                }
            }else if(enemy.PFType===37){//this only triggers if boss chain num!=0
                let enemyNum = bossChainEnemies.findIndex((checkEnemy)=>checkEnemy===enemy);
                if (bossChainEnemies[enemyNum-1].deleted===true){
                    bossChainEnemies.splice(enemyNum-1,1);
                    enemy.target=enemies[0];
                }else{
                    enemyAngle = findAngle(enemy,enemy.target);
                    enemy.x=enemy.target.x+Math.sin(enemyAngle)*(enemy.size+enemy.target.size);
                    enemy.y=enemy.target.y+Math.cos(enemyAngle)*(enemy.size+enemy.target.size);
                }
            }else if (enemy.PFType===38){
                if (enemy.target.deleted===true){
                    enemy.PFType=2;//this is the other black enemy. Effectively, the enemy "dismounts"
                    enemy.target=enemies[0];
                }else{
                    enemy.x=enemy.target.x
                    enemy.y=enemy.target.y
                }
            }
            //enemy.room.x=(floorTo((enemies[0].x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
            //enemy.room.y=(floorTo((enemies[0].y+50),(roomHeight+(doorLength*2)))-50)-((c.height-HUDHeight)/2/cam.zoom)+(roomHeight/2)+doorLength
            if (!isSamePoint(enemy,enemy.lastPosition)&&enemy.PFType!=11){ //the dashing boss shouldn't have it's dash direction messed up by this
                enemy.direction=findAngle(enemy,enemy.lastPosition);
            }
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
        enemies.push(newEnemyPreset(moneyPos,16));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
    //this is actually the num of health orbs
    //numMoney = Math.floor(Math.random()*2)+1;
    numMoney = Math.floor(Math.random()*(maxHealthDrop+1)*lootMultiplier);
    for (let i=0;i<numMoney;i++){
        let moneyPos = new newPoint();
        do{
            moneyPos = addToPoint(dupPoint(enemy),(Math.random()*50)-25,(Math.random()*50)-25);
        }while(rayCast(enemy,moneyPos,false,mainEnemyRoom.walls))
        enemies.push(newEnemyPreset(moneyPos,7));
        addToEnemyRooms(enemies[enemies.length-1]);
    }
}
function pathfindingMovement(enemy,mainEnemyRoom){
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
                }
            } else {
                if(yDis<0){
                    enemy.y-=enemy.speed;
                }else if(yDis>0){
                    enemy.y+=enemy.speed;
                }else if(xDis<0){
                    enemy.x-=enemy.speed;
                }else if(xDis>=0){
                    enemy.x+=enemy.speed;
                }
            }
        //}
    }
}
function playerMovement(enemy,mainEnemyRoom){
    enemy.timer1-=deltaTime/2;//go down a frame in the charging animation
    let enemyRoom = mainEnemyRoom.enemies;
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
            if (isSamePoint(enemies[0],enemies[0].originalCopy)){
                timerGo=true;
            }
        }
        if(keys['s']){
            movementTarget.y++;
            if (isSamePoint(enemies[0],enemies[0].originalCopy)){
                timerGo=true;
            }
        }
        if(keys['a']){
            movementTarget.x--;
            if (isSamePoint(enemies[0],enemies[0].originalCopy)){
                timerGo=true;
            }
        }
        if(keys['d']){
            movementTarget.x++;
            if (isSamePoint(enemies[0],enemies[0].originalCopy)){
                timerGo=true;
            }
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
        if (flippedControls){
            movementTarget = multiplyPoint(movementTarget,-1);
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
                    if (rayCast(enemy1,enemy2,false,mainEnemyRoom.walls,true)===undefined){
                        if (enemyDis<enemy1.size+enemy2.size){
                            enemy1.effect(enemy2,enemy1,enemiesToRemove);
                            enemy2.effect(enemy1,enemy2,enemiesToRemove);
                        }else if ((enemy2.team===2||enemy1.team===2)&&enemyDis<=Math.max(enemy1.size,20)+Math.max(enemy2.size,20)){//this makes the hitbox larger
                            enemy1.effect(enemy2,enemy1,enemiesToRemove);
                            enemy2.effect(enemy1,enemy2,enemiesToRemove);
                        }
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
                if (mainEnemyRoom.roomNum===(targetNumOfRooms-2)){
                    beatGame=true;
                    timerGo=false;
                }
                switchMode(8);
                bullets=[];
            }
        }
        for (enemy1 of enemyRoom){
            if (enemy1.size===0||enemy1.PFType===35||enemy1.team===2||(enemy1.PFType===36&&enemy1.gunCooldown<0)||enemy1.PFType===38){
                continue;
            }
            for (enemy2 of enemyRoom){
                //this makes it so the placeholder enemy and power ups that haven't really gotton spawned yet don't get activated
                //change the size 10
                if (enemy2.PFType===35||enemy2.size===0||enemy2.team===2||(enemy2.PFType===36&&enemy2.gunCooldown<0)||enemy2.PFType===38){
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
                        /*if (enemy1.PFType===9||enemy2.PFType===9){ //souls
                            //the souls distance away from players is 50
                            let magicNumber = Math.acos(((50*50) + (50*50) - (20*20))/(2*50*50))
                                
                            let angleDis = enemy1.timer1-enemy2.timer1;
                            if (angleDis===0){ //if they're on top of each other, just chose a random direction
                                angleDis=Math.random()-.5;
                            }
                            let angleSign = angleDis/Math.abs(angleDis); //there might be a more computer efficent way to do this
                            if (angleSign===Infinity){
                                angleSign=1;
                            }
                            if (angleSign===-Infinity){
                                angleSign=-1;
                            }
                            enemy1.timer1-=angleDis/2;
                            enemy1.timer1-=angleSign*magicNumber;
                            enemy2.timer1+=angleDis/2;
                            enemy2.timer1+=angleSign*magicNumber;
                        }else{*/
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
                        //}
                        if (enemy1.PFType===9&&enemy2.PFType===9){ //souls
                            enemy1.timer1 = findAngle(enemy1,enemy1.target)
                            enemy2.timer1 = findAngle(enemy2,enemy2.target)
                        }
                    }
                }
            }
        }
    }
}
function drawBullets(cam,useImage){
    for (bullet of bullets){
        bullet.drawBullet(bullet);
        if (keysToggle['j']&&devMode){
            let screenBulletPos = offSetByCam(bullet);
            ctx.fillStyle='grey';
            ctx.font = enemy.size*cam.zoom+'px Courier New';
            ctx.fillText(Math.floor(bullet.damage),screenBulletPos.x-(cam.zoom*bullet.visualWidth/4),screenBulletPos.y+(cam.zoom*bullet.visualWidth/4));
        }
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
function singleBulletEnemyCollision(bullet){ //all this code it copied to bullet enemy collision so there can be multiple bullet enemy collisions in a frame
    //bullet.room = new newPoint((bullet.x+doorLength)/(roomWidth+(doorLength*2)),(bullet.y+doorLength)/(roomHeight+(doorLength*2)));
    for (let i = enemies.length-1;i>=0;i--){
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
        if(!sameRoomPos(enemies[0].enemyRoom,bulletRoom)){
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
                            if ((enemy.invinceable<1||enemy!=enemies[0])&&bullet.owner.team!=enemy.team){
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
function addAutoRect(point,text,font,maxWidth,isMoveable,autoCenter){
    if (maxWidth===undefined){
        maxWidth=c.width;
    }
    let textToDraw = [];
    ctx.font = font;
    let metrics = ctx.measureText(text);
    let height = metrics.emHeightAscent+metrics.emHeightDescent;
    if (autoCenter){
        point.x=(c.width/2)-((metrics.width+10)/2)
    }
    addText(text,new newPoint(5,metrics.emHeightAscent),font,'black',maxWidth,textToDraw);
    addRect(point,metrics.width+10,height,'white',textToDraw,isMoveable);
}
function addRect(point,width,height,color,textToDraw,isMoveable){
    rectsToDraw.push({
        x:point.x,
        y:point.y,
        color:color,
        width:width,
        height:height,
        textToDraw:textToDraw,
        isMoveable:isMoveable
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
function gunEnemyMovement(target){
    for (let i=0;i<powerUpsGrabbed.length;i++){
        let examplePowerUp=powerUpsGrabbed[i];
        examplePowerUp.upgradeEffect(enemies[0],examplePowerUp,gunAngle);
    }
    for (mainEnemyRoom of enemyRooms){
        if(!sameRoomPos(mainEnemyRoom,enemies[0].room)){
            continue;
        }
        let enemyRoom=mainEnemyRoom.enemies;
        for (let i =0;i<enemyRoom.length;i++){
            let enemy=enemyRoom[i];
            if (enemy.PFType===1&&heldPowerUp===null){
                for (let j=0;j<powerUpsGrabbed.length;j++){
                    let runCode=false;
                    if (controller===undefined){
                        switch(j){
                            case 0:
                                runCode=(buttonsArray[0]||keys[' '])&&powerUpsGrabbed[j].coolDown<1;
                                break
                            case 1:
                                runCode=(buttonsArray[2]||keys['shift'])&&powerUpsGrabbed[j].coolDown<1
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
                    let examplePowerUp=powerUpsGrabbed[j];
                    if (runCode){
                        examplePowerUp.onClickEffect(enemy,examplePowerUp,gunAngle);
                        for (clickEffect of examplePowerUp.extraOnClickEffects){
                            clickEffect(enemy,examplePowerUp,gunAngle);
                        }
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
            }/*else if (enemy.PFType===11){
                //Dashing Boss
                if (enemy.timer1>0){ //this number means the boss should shoot
                    let bullet = new newBullet(0,0,40,0,'blue',40,5,0,60,1,new newPoint(),enemy,1,'',1,1);
                    shootBullet(bullet,enemy.direction,enemy,bullet.bulletSpreadNum,bullet.shotSpread,0,enemy,enemy.size,true);
                    enemy.timer1--;
                }
            }*/else if (enemy.PFType===12){
                //teleporting boss
                if (enemy.timer2===2){ //2 means the enemy is good to shoot
                    let bullet = new newBullet(0,0,enemy.bulletSpeed,0,'blue',40,5,0,60,1,new newPoint(),enemy,1,'',20,3);
                    shootBullet(bullet,findAngle(enemy.target,enemy)+Math.random-.5,enemy,bullet.bulletSpreadNum,bullet.shotSpread,0,enemy,enemy.size,true);
                    enemy.timer2 = 1; //1 means the enemy took the shot
                }
            }else if(enemy.PFType===10||enemy.PFType===4||enemy.PFType===5||enemy.PFType===3||enemy.PFType===2||enemy.PFType===17||enemy.PFType===15||enemy.PFType===38){
                if (enemy.target.team!=undefined){
                    /*let closestEnemy = findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                    if (closestEnemy!=undefined){
                        aimGun(enemy,closestEnemy,'blue',undefined,mainEnemyRoom,true);
                    }*/
                    if (enemy.target.team===0){
                        aimGun(enemy,enemy.target,'blue',undefined,mainEnemyRoom,true);
                    }else{
                        aimGun(enemy,enemies[0],'blue',undefined,mainEnemyRoom,true);
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

    /*ctx.drawImage(powerUpIconImage,8+leftX,c.height-37,25,25);

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
    ctx.lineWidth = 1;*/

    ctx.beginPath();
    ctx.font = '32px Times New Roman';
    ctx.fillStyle = 'white';
    ctx.fillText('$ell',23+leftX,c.height-15);
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
const screenPowerUpHeight = 23;
function drawPermanentSlots(permanentLeftX){
    if (keysUsed[' ']){
        minorPowerUpsGrabbed.pop();
        keysUsed[' ']=false;
    }
    let maximumTop = c.height-5;
    let totalSlotNum = permanentMinorPowerUps.length+minorPowerUpSpace;
    let horizontalSlots = Math.max(totalSlotNum-screenPowerUpHeight,-1);
    let permanentBottomY = maximumTop-10-((screenPowerUpHeight)*30); //Slots may be better to draw everything in a slot to avoid this fiddling
    let permanentTopY = Math.min(permanentBottomY+((totalSlotNum+1)*30),maximumTop/*permanentBottomY+((screenPowerUpHeight)*30)*/);
    let permanentMidX = permanentLeftX+15;
    ctx.beginPath();
    ctx.arc(permanentMidX,(c.height+10)-permanentBottomY,20,0,Math.PI*2);
    ctx.rect(permanentLeftX-5,(c.height+20)-permanentTopY,40,permanentTopY-permanentBottomY-10);
    ctx.arc(permanentMidX,(c.height+20)-permanentTopY,20,0,Math.PI*2);
    if (horizontalSlots>-1){
        ctx.rect(permanentLeftX+10,c.height-maximumTop,35+((horizontalSlots)*30),40);
        ctx.arc(((horizontalSlots+2)*30)-5,c.height+20-maximumTop,20,0,Math.PI*2);
    }

    ctx.fillStyle='black';
    ctx.fill();
    ctx.fillStyle='white';
    let i=0;
    while (i<totalSlotNum){
        ctx.beginPath();
        ctx.arc(permanentMidX+Math.max(0,(((i-screenPowerUpHeight))*30)),c.height-(20)-((Math.min(i,screenPowerUpHeight)+.5)*30),13,0,Math.PI*2);
        ctx.fill();
        i++;
    }

    //ctx.drawImage(powerUpIconImage,permanentLeftX+Math.max(0,(((i-screenPowerUpHeight))*30))+3,c.height-((Math.min(i,screenPowerUpHeight)+.5)*30)-22,25,25);
    i++;
    
    ctx.font = '20px Times New Roman';
    let message = '$'+upgrader.var1;
    let metrics = ctx.measureText(message);
    let width = Math.min(metrics.width,30);
    ctx.fillText(message,permanentLeftX+Math.max(0,(((i-screenPowerUpHeight))*30))-(width/2)+15,c.height+25-permanentTopY,width);

    /*ctx.beginPath();
    ctx.arc(permanentLeftX+((permanentMinorPowerUps.length)*30)+15,c.height-20,8,0,Math.PI*2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(permanentLeftX+((permanentMinorPowerUps.length)*30)+15,c.height-22,4,0,Math.PI*2);
    ctx.rect(permanentLeftX+((permanentMinorPowerUps.length)*30)+13,c.height-22,4,7);
    ctx.fillStyle = 'white';
    ctx.fill();*/
}
function drawHealthBar(leftX,topY,color,enemy){
    /*enemies[0].health=roundTo2(enemies[0].health,10);
    ctx.fillText('Health:'+enemies[0].health+'/'+enemies[0].maxHealth,leftX,c.height-5);*/
    let maxHealthSlots = 35;
    ctx.fillStyle = 'black';
    ctx.fillRect(leftX,topY,(Math.min(enemy.maxHealth,maxHealthSlots)*10)+5,40);
    ctx.fillRect(leftX,topY+15,(Math.min(enemy.maxHealth,maxHealthSlots)*10)+10,10);
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.rect(leftX+2.5,topY+2.5,(Math.min(enemy.maxHealth,maxHealthSlots)*10),35);
    let verticalRows = Math.ceil(enemy.maxHealth/maxHealthSlots);
    if (verticalRows<10){ //this is an arbitrary number where it looks better to have the other health bar design, and it's less laggy
        for(let i=1;i<Math.min(enemy.maxHealth,maxHealthSlots);i++){
            ctx.moveTo(leftX+(i*10)+2.5,topY+2);
            ctx.lineTo(leftX+(i*10)+2.5,topY+38);
        }
        ctx.stroke();
        for(let i=0;i<enemy.health;i++){
            let row = Math.floor(i/maxHealthSlots);
            ctx.fillRect(leftX+((i%maxHealthSlots)*10)+4,topY+4+Math.min(row,2)+(row*32/verticalRows),7,(32/verticalRows)-Math.min(row,2));
        }
        if (verticalRows<7){
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            for (let i=1;i<verticalRows;i++){
                ctx.moveTo(leftX+2.5,topY+3.5+(i*32/verticalRows));
                ctx.lineTo(leftX+(maxHealthSlots*10)+2.5,topY+3.5+(i*32/verticalRows));
            }
            ctx.stroke();
        }
    }else{ //if the boss has a ton of health, drawing each health takes to long(really laggy)
        ctx.stroke(); //this finishes the white outline of the battery
        let percentageFilled = enemy.health/enemy.maxHealth;
        ctx.beginPath();
        ctx.fillRect(leftX+4,topY+4,percentageFilled*maxHealthSlots*10,32);
    }
    ctx.strokeStyle = 'black';
}
function drawHUD(){
    ctx.fillStyle='black';
    //ctx.fillRect(0,c.height-HUDHeight,c.width,HUDHeight); //this would draw a bos that covers up things if HUDHeight !=0
    const TEXT_SIZE = 40;
    ctx.font=TEXT_SIZE+'px Courier New';
    if (showHUD.money){
        money = roundTo2(money,10);
        ctx.fillText('Money:'+money,c.width-275,c.height-5);
    }else if (money>0){
        showHUD.money=true;
    }
    if (enemies[0].enemyRoom.roomNum>0){
        ctx.fillText('Room:'+enemies[0].enemyRoom.roomNum+'/30',c.width-990,c.height-10);
    }
    /*){ //this is when I'm bebuging and I have all the power ups, I can still see my health and money
        ctx.fillText('Money:'+money,c.width-250,40);
        ctx.fillText('Health:'+enemies[0].health+'/'+enemies[0].maxHealth,c.width-600,40);
    }*/
    if (enemies[0].health===7&&enemies[0].maxHealth===11){
        //ctx.fillText('SLUUURRRPEE',c.width-(TEXT_SIZE*9),TEXT_SIZE*2);
    }
    if (keysToggle['f']||devMode){
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
        ctx.font = 48*screenSize+'px Courier New';
        ctx.fillText('FPS:'+Math.round(averageFps),800*screenSize,45*screenSize);
    }
    if (showHUD.health){
        drawHealthBar(c.width-640,c.height-45,'green',enemies[0]);
    }
    if ([11,12,15,36,37].includes(enemies[0].enemyRoom.enemies[0].PFType)){ //all the bosses pftypes are here
        drawHealthBar(c.width-640,5,'red',enemies[0].enemyRoom.enemies[0]); //boss health bar
    }
    let permanentLeftX = 10;
    if (showHUD.minorPowerUps){
        drawPermanentSlots(permanentLeftX);
    }

    let majorLeftX = 55;
    let majorRightX = (majorLeftX+powerUpSpace*40);

    if (showHUD.majorPowerUps){
        drawHUDMouse(majorLeftX,majorRightX);
    }

    /*let minorLeftX = (majorRightX)+10;
    let minorRightX = (minorLeftX+minorPowerUpSpace*30);
    if (showHUD.minorPowerUps){
        drawMinorSlots(minorLeftX,minorRightX);
    }*/

    let sellButtonLeftX = majorRightX+10;
    if (showHUD.sellButton){
        drawSellButton(sellButtonLeftX);
    }

    if (mode===1&&devMode){
        return
    }
    let onClick = function (i,powerUpList){
        if (heldPowerUp===null&&powerUpList[i].PFType!=34){
            if (devMode&&buttonsArray[2]){
                heldPowerUp = newPowerUpPreset(powerUpList[i].PFType,true);
            }else{
                heldPowerUp=powerUpList.splice(i,1)[0]; //took
                if (heldPowerUp instanceof newMajorPowerUp){
                    powerUpList.splice(i,0,newPowerUpPreset(34,false));
                }
            }
        }else if (((heldPowerUp instanceof newMajorPowerUp) ^ (powerUpList[i] instanceof newMajorPowerUp))){
            //the list is the wrong one
        }else if (heldPowerUp instanceof newMajorPowerUp){
            if (powerUpList[0]===heldPowerUp||powerUpsGrabbed.length===0){
                if (powerUpsGrabbed.length<powerUpSpace){
                    powerUpsGrabbed.push(heldPowerUp); //put back
                    heldPowerUp=null;
                }
            }else{
                if (powerUpList[i].PFType===34){ //34 is the placeholder, you should never be holding it
                    powerUpsGrabbed.splice(i,1,heldPowerUp)[0];
                    powerUpsGrabbed.push(newPowerUpPreset(34,false));
                    heldPowerUp=null;
                    showHUD.health=true;
                }else{
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
                if (!showHUD.sellButton){
                    continue;
                }
                powerUpList = [newPowerUpPreset(8,false),newPowerUpPreset(8,false),newPowerUpPreset(8,false),newPowerUpPreset(8,false)] //this is a placeholder for the sell button. The sell button should be changed to cover any clicks in the entire black area
                break
            case 1:
                if (!showHUD.minorPowerUps){
                    continue;
                }
                powerUpList = [upgrader] //this is a placeholder for  the upgrader
                break
            case 2:
                powerUpList=powerUpsGrabbed//major power ups
                break
            case 3:
                powerUpList=minorPowerUpsGrabbed//minor power ups
                break
            case 4:
                if (!showHUD.minorPowerUps){
                    continue;
                }
                powerUpList = permanentMinorPowerUps;//permanent minor power ups
                break
            case 5:
                if (heldPowerUp===undefined){
                    heldPowerUp=null;//this shouldn't be nessecary but this is easier than coding it right
                }else if (heldPowerUp===null){
                    continue;
                }else{
                    if (enemies[0].enemyRoom.roomNum===0){
                        addAutoRect(new newPoint(5,c.height-115),'Left Click Slot','24px Courier New',undefined,false,false);
            
                        addAutoRect(new newPoint(130,c.height-80),'Right Click Slot','24px Courier New',undefined,false,false);
                        
                        addAutoRect(new newPoint(0,c.height/4),'Drag Ability into Mouse Slots','50px Courier New',undefined,false,true);
                        drawArrow(new newPoint((c.width/2)+90,(c.height/4)+63),new newPoint(170,c.height-100),50,Math.PI/4);

                        drawArrow(new newPoint(20,c.height-85),new newPoint(55,c.height-35),30,Math.PI/4);
                        drawArrow(new newPoint(200,c.height-45),new newPoint(140,c.height-25),30,Math.PI/4);
                        if ((frameNum%40)<20){ //this flashing won't work at different frame rates
                            ctx.beginPath();
                            ctx.arc(majorLeftX+20,c.height-20,13,0,Math.PI*2);
                            ctx.arc(majorLeftX+60,c.height-20,13,0,Math.PI*2);
                            ctx.fillStyle='blue';
                            ctx.fill();
                        }
                    }else if (enemies[0].enemyRoom.roomNum===1){
                        let textList = [];
                        addText('Drag Modifiers into These Smaller Slots',new newPoint(5,25),'24px Courier New','black',1000000,textList);
                        addRect(new newPoint(20,c.height-275),400,30,'white',textList,false);
            
                        drawArrow(new newPoint(250,c.height-240),new newPoint(55,c.height-150),30,Math.PI/4);
                        if ((frameNum%40)<20){ //this flashing won't work at different frame rates
                            ctx.beginPath();
                            for (let i=0;i<minorPowerUpSpace;i++){
                                ctx.arc(permanentLeftX+15,c.height-35-(30*i),11,0,Math.PI*2);
                            }
                            ctx.fillStyle='blue';
                            ctx.fill();
                        }
                    }
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
                    drawPowerUp(examplePowerUp,i/2,.16,actionOnClick,powerUpList,sellButtonLeftX-5,false,false,true);//5 is subtracted to line the circles up with the entire button
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
                    let allPowerUps = minorPowerUpSpace+permanentMinorPowerUps.length;
                    if (allPowerUps<=screenPowerUpHeight){ //make power ups and upgrader wrap around the screen //10 is the max num of power ups
                        drawPowerUp(examplePowerUp,allPowerUps,-.05,actionOnClick,powerUpList,permanentLeftX+15,false,false,true,true,powerUpIconImage);
                    }else{
                        drawPowerUp(examplePowerUp,30*(allPowerUps)/40,screenPowerUpHeight+.5,actionOnClick,powerUpList,(permanentLeftX-5)-((screenPowerUpHeight)*30),false,false,true,false,powerUpIconImage);
                    }
                    //i=drawPowerUp(examplePowerUp,minorPowerUpSpace+permanentMinorPowerUps.length,-.28,actionOnClick,powerUpList,permanentLeftX+15,false,false,true,true);
                    break
                case 2:
                    i=drawPowerUp(examplePowerUp,i,0,onClick,powerUpList,majorLeftX,false,false,examplePowerUp.PFType===34,false);
                    for (let j=0;j<examplePowerUp.minorPowerUps.length;j++){
                        let otherExamplePowerUp = examplePowerUp.minorPowerUps[j];
                        drawPowerUp(otherExamplePowerUp,i,j+1,function(){},powerUpList,majorLeftX);
                    }
                    break
                case 3:
                    if (i<=screenPowerUpHeight){ //make power ups and upgrader wrap around the screen //10 is the max num of power ups
                        i=drawPowerUp(examplePowerUp,i,0,onClick,powerUpList,permanentLeftX+15,false,false,false,true);
                    }else{
                        i=drawPowerUp(examplePowerUp,i,screenPowerUpHeight+.5,onClick,powerUpList,permanentLeftX+15-((screenPowerUpHeight+.5)*30),false,false,false,false);
                    }
                    break
                case 4:
                    let thisNum = i+minorPowerUpSpace;
                    if (thisNum<=screenPowerUpHeight){ //make power ups and upgrader wrap around the screen //10 is the max num of power ups
                        drawPowerUp(examplePowerUp,thisNum,0,function(i,powerUpList){return i},powerUpList,permanentLeftX+15,false,false,false,true,lockImage);
                    }else{
                        drawPowerUp(examplePowerUp,thisNum,screenPowerUpHeight+.5,function(i,powerUpList){return i},powerUpList,permanentLeftX+15-((screenPowerUpHeight+.5)*30),false,false,false,false,lockImage);
                    }
                    break
                case 5:
                    i=drawPowerUp(examplePowerUp,0,0,onClick,powerUpList,0);//drawpowerup already knows this is the held power up and does the hard work for me. It pays to be lazy
                    break
            }
        }
    }
    drawRects();
    drawText();
}
function drawPowerUp(powerUp,numOnScreen,verticalNumOnScreen,onClick,powerUpList,leftX,isBullet,powerUpSelect,skipDrawingPowerUp,stackVertical,powerUpImage){
    ctx.beginPath();
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
        iconSize = 11;
    }
    if (powerUpImage===powerUpIconImage){
        iconSize=13;
    }
    if (powerUpSelect){
        iconSize*=3;
    }
    //ctx.arc(mouse.x,mouse.y,30,0,Math.PI*2);
    let examplePowerUp = powerUp;
    ctx.fillStyle= examplePowerUp.color;
    if (!skipDrawingPowerUp){
        /*let boltTip = addToPoint(betterAccountForZ(addToPoint(iconPos,-55,-(c.height-20)),70),55,c.height-20);
        let boltAngle = findAngle(boltTip,iconPos);
        let firstBoltSide = addToPoint(iconPos,iconSize*Math.sin(boltAngle+(Math.PI/2)),iconSize*Math.cos(boltAngle+(Math.PI/2)))
        let secondBoltSide = addToPoint(iconPos,iconSize*Math.sin(boltAngle-(Math.PI/2)),iconSize*Math.cos(boltAngle-(Math.PI/2)));
        ctx.beginPath();
        ctx.moveTo(firstBoltSide.x,firstBoltSide.y);
        ctx.lineTo(boltTip.x,boltTip.y);
        ctx.lineTo(secondBoltSide.x,secondBoltSide.y);
        ctx.fill();
        ctx.stroke();*/
        /*for (let i=6;i>0;i--){
            ctx.beginPath();
            let newPos = betterAccountForZ(addToPoint(iconPos,-55,-(c.height-20)),50+(i*3));
            ctx.arc(newPos.x+55,newPos.y+(c.height-20),iconSize-(i*2),0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        }*/

        ctx.beginPath();
        ctx.arc(iconPos.x,iconPos.y,iconSize,0,Math.PI*2);

        ctx.fill();
        ctx.stroke();
        //cooldown circle
        ctx.beginPath();
        ctx.arc(iconPos.x,iconPos.y,iconSize,-Math.PI/2,(Math.PI*2)-((Math.PI*2)*((powerUp.coolDownMax-Math.max(powerUp.coolDown,0))/powerUp.coolDownMax))-Math.PI/2);
        ctx.lineTo(iconPos.x,iconPos.y);
        ctx.globalAlpha = .3;
        ctx.fillStyle='black';
        ctx.fill();
        ctx.globalAlpha=1;
    }
    if(powerUpImage instanceof Image){
        ctx.drawImage(powerUpImage,iconPos.x-(iconSize*1.1),iconPos.y-(iconSize*1.1),iconSize*2*1.1,iconSize*2*1.1);
    }
    iconPos.x-=10;
    if (!powerUpSelect){
        if (powerUpImage!=powerUpIconImage){
            if (powerUp instanceof newMinorPowerUp){
                iconSize = 14; //this makes the hovering over hitbox larger to prevent misclicks
            }else{
                iconSize = 19;
            }
        }
    }
    if (shop.inShop&&powerUpSelect&&mode===0){
        let text = [];
        ctx.fillStyle='black';
        ctx.fillText('$'+powerUp.price,iconPos.x-15,iconPos.y+85);
    }
    if (findDis(iconPos,mouse)<iconSize){
        if (powerUpSelect){
            ctx.font = '32px impact';
        }else{
            ctx.font = '24px Courier New';
        }
        let label = examplePowerUp.label;
        let skipDrawDamage = (examplePowerUp instanceof newMinorPowerUp)||(examplePowerUp.PFType===8)||(examplePowerUp.PFType===28)||(examplePowerUp.PFType===34);//I think this is needed but it might not be, a bullet doesn't have a cooldown atribute
        let skipDrawCooldown = skipDrawDamage;
        if (roundTo2(examplePowerUp.damage,100)===0){
            skipDrawDamage=true;
        }
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
                    if ((text==='Click Here To Sell Item for $1')&&undefined!=rectsToDraw.find((checkRect)=>checkRect.textToDraw[0].message===text)){
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
                    text = 'Deals '+roundTo2(examplePowerUp.damage,100)+' Damage';
                    text+=examplePowerUp.damageText;
                    break
                case 3:
                    if (skipDrawCooldown){
                        continue;
                    }
                    //text = 'Cooldown: '+roundTo2(examplePowerUp.coolDownMax,100);
                    let secondsText = 'Seconds';
                    if (roundTo2(examplePowerUp.coolDownMax/30,100)===1){
                        secondsText='Second';
                    }
                    text = 'Cooldown: '+roundTo2(examplePowerUp.coolDownMax/30,100)+' '+secondsText+examplePowerUp.coolDowntext;
                    break
            }
            let metrics = ctx.measureText(text);
            maxTextWidth = Math.min(Math.max(maxTextWidth,metrics.width),c.width-15);
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
            //buttonsArray=[]; //this unclicks all the buttons so you can no longer shoot
            if (numOnScreen===Math.round(numOnScreen)){
                numOnScreen = onClick(numOnScreen,powerUpList);
            }else{
                onClick(numOnScreen,powerUpList);
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
                        rectHeight-=30;
                    }else{
                        rectHeight-=20;
                    }
                }
                if (skipDrawCooldown){
                    if (powerUpSelect){
                        rectHeight-=30;
                    }else{
                        rectHeight-=20;
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
                    if (rect.isMoveable){
                        rect.y-=rectHeight+5;
                    }
                }
                let powerUpPos = new newPoint(Math.max(5,Math.min(mouse.x-(maxTextWidth/2),c.width-(maxTextWidth+5)))-5,Math.max(Math.min(mouse.y-10,c.height),rectHeight)-rectHeight)
                addRect(powerUpPos,maxTextWidth+10,rectHeight,'white',textToDraw,true);
            }
        }
    }
    return numOnScreen
}
let heldPowerUp = null;
//0 means there is no power up
function drawShop(){
    let screenShopPos = offSetByCam(shop);
    ctx.drawImage(shopImage,screenShopPos.x-8,screenShopPos.y-24);

    ctx.globalAlpha = .5;
    ctx.beginPath();
    ctx.fillStyle='yellow';
    ctx.fillRect(screenShopPos.x-5,screenShopPos.y+115,110,50);
    ctx.globalAlpha=1;
}
function findEligiblePowerUps(){
    let powerUps = {
        minor:[],
        major:[]
    }
    let offLimitsPowerUps = [4,8,9,13,19,28,29,32,34,36];
    for (let i=0;i<100;i++){
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
let targetNumOfRooms=32;//there is are some extra for the totorial rooms
let eligibleMajorPowerUps = [];
let eligibleMinorPowerUps = [];
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
                minorPowerUpsGrabbed.push(newPowerUpPreset(powerUp));
            }
            money=1000;
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
    majorPowerUp.coolDownMax=majorPowerUp.originalCopy.coolDownMax;
    majorPowerUp.damage=majorPowerUp.originalCopy.damage;
    majorPowerUp.healthToHeal=majorPowerUp.originalCopy.healthToHeal;
    majorPowerUp.shotSpread=majorPowerUp.originalCopy.shotSpread;
    majorPowerUp.range=majorPowerUp.originalCopy.range;
    majorPowerUp.bulletKillPower=majorPowerUp.originalCopy.bulletKillPower;
    majorPowerUp.extraBulletEffects=[]; //this shouldn't cause any issues, but if the original copy is not an empty list, it might behave wrong
    majorPowerUp.extraOnClickEffects=[];
    let checkPowerUps = minorPowerUpsGrabbed.concat(permanentMinorPowerUps);
    for (minorPowerUp of checkPowerUps){
        minorPowerUp.modifier(majorPowerUp,minorPowerUp);
    }
    //majorPowerUp.coolDown.coolDownMax=roundTo(majorPowerUp.coolDownMax,100); //I need to figure out a way to stop the floating point weirdness from showing to the player
}
function updatePlayerStats(){
    for (enemy of enemies){
        if (enemy.originalCopy!=undefined){
            enemy.gunCoolDownMax = enemy.originalCopy.gunCoolDownMax;
            enemy.bulletSpeed = enemy.originalCopy.bulletSpeed;
        }
    }
    enemies[0].targetSpeed=enemies[0].originalCopy.targetSpeed;
    enemies[0].maxHealth=enemies[0].originalCopy.maxHealth;
    getDuplicateMinorPowerUps = false;
    maxHealthDrop=1;
    maxMoneyDrop = 1;
    healthToMoneyRatio = 0;
    screenShakeLimit=3;
    bombsHealYou=false;
    if (controller===undefined){
        aimAssist=.1;
    }else{
        aimAssist=.4;
    }
    if (devMode){
        minorPowerUpSpace=Math.max(minorPowerUpsGrabbed.length,5);
        powerUpSpace=powerUpsGrabbed.length;
    }else{
        minorPowerUpSpace=5;
        powerUpSpace=2;
    }
    for (majorPowerUp of powerUpsGrabbed){
        resetMajorStats(majorPowerUp);
    }
    for (majorPowerUp of enemies[0].enemyRoom.shopPowerUps){ //this updates the shops power ups so you can see the stats
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
function powerUpSelect(){//add a skip button that gives $2
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
    let text = 'Chose a Modifier';
    if (enemies[0].enemyRoom.roomNum===0){
        text = 'Break Out of the Factory';
    }
    let stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),c.height/3);
    ctx.font='32px impact';
    text = 'Then Drag it into a Slot on the Side';
    if (enemies[0].enemyRoom.roomNum===0){
        text = 'Drag the weapon into a Mouse Slot';
    }
    stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),2*c.height/3);
    let enemyRoomIndex =findEnemyRoomIndex(enemies[0]);
    let enemyRoom = enemyRooms[enemyRoomIndex];
    let powerUps=enemyRoom.powerUps;
    if (powerUps.length===0){
        if ((eligibleMinorPowerUps.length<(minorPowerUpSpace+permanentMinorPowerUps.length+3))&&!getDuplicateMinorPowerUps){
            while (powerUps.length<3){
                let powerUpType = 21;
                powerUps.push(newPowerUpPreset(powerUpType,true));
            }
        }
        while (powerUps.length<3){
            let powerUpType = eligibleMinorPowerUps[Math.floor(Math.random()*eligibleMinorPowerUps.length)];
            //this is a easy, bad way to do this, better would be to do like room generation power ups
            if (undefined!=powerUps.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                continue;
            }
            if (!getDuplicateMinorPowerUps){
                if (undefined!=minorPowerUpsGrabbed.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                    continue;
                }
                if (undefined!=permanentMinorPowerUps.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                    continue;
                }
            }
            powerUps.push(newPowerUpPreset(powerUpType,true));
        }
        /*for (let i=0;i<1;i++){
            powerUps.push(newPowerUpPreset(eligibleMajorPowerUps[Math.floor(Math.random()*eligibleMajorPowerUps.length)],true));
        }*/
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
        if (examplePowerUp.PFType!=34){
            if (enemies[0].enemyRoom.roomNum>0){
                showHUD.minorPowerUps=true;
            }
            if (enemies[0].enemyRoom.roomNum>1){
                showHUD.sellButton=true;
            }
            drawPowerUp(examplePowerUp,i,12,onClick,powerUps,iconPos.x,false,true);
        }
    }
}
function drawMouse(){
    //ctx.drawImage(targetImage,mouse.x,mouse.y-10);
    ctx.drawCircle(mouse.x,mouse.y,'grey',true,10);
    //add a plus to make it look like a screw
}
function drawShopItemSelect(){
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
    let text = 'Buy an Ability';
    let stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),c.height/3);
    ctx.font='32px impact';
    text = 'Then Drag it into a Mouse Button Slot';
    stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),2*c.height/3);
    let enemyRoomIndex =findEnemyRoomIndex(enemies[0]);
    let enemyRoom = enemyRooms[enemyRoomIndex];
    let powerUps=enemyRoom.shopPowerUps;
    if (powerUps.length===0){
        while (powerUps.length<3){
            let powerUpType = eligibleMajorPowerUps[Math.floor(Math.random()*eligibleMajorPowerUps.length)];
            //this is a easy, bad way to do this, better would be to do like room generation power ups
            if (undefined!=powerUps.find((examplePowerUp)=>examplePowerUp.PFType===powerUpType)){
                continue;
            }
            powerUps.push(newPowerUpPreset(powerUpType,true));
        }
    }
    for(let i=0;i<powerUps.length;i++){
        let iconPos=new newPoint((3*c.width/4)-(200*i)-200,c.height/2);
        let examplePowerUp = powerUps[i];
        let onClick = function(i,powerUpList){
            if (money>=powerUpList[i].price&&heldPowerUp===null){
                heldPowerUp=powerUpList.splice(i,1,newPowerUpPreset(34,false))[0];
                money-=heldPowerUp.price;
            }
        }
        if (examplePowerUp.PFType!=34){
            if (enemies[0].enemyRoom.roomNum>0){
                showHUD.minorPowerUps=true;
            }
            if (enemies[0].enemyRoom.roomNum>1){
                showHUD.sellButton=true;
            }
            drawPowerUp(examplePowerUp,i,12,onClick,powerUps,iconPos.x,false,true);
        }
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
    drawShop();
    drawCircles(camera);
    drawParticles();
    if (shop.inShop&&mode===0){
        drawShopItemSelect();
    }
    //drawHUD doesn't need the camera because it is a special snowflake that doesn't draw following the camera
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
function drawParticles(){
    for (particle of particles){
        particle.drawParticle(particle);
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
        minorPowerUpsGrabbed.push(newPowerUpPreset(powerUp));
    }
    money=9999;
    showHUD.majorPowerUps=true;
    showHUD.minorPowerUps=true;
    showHUD.sellButton=true;
    showHUD.health=true;
}
function updateShopPos(){
    let firstEnemy = enemies[0].enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
    if (firstEnemy===undefined&&enemies[0].enemyRoom.roomNum>1){
        let roomPos = turnRoomIntoRealPos(enemies[0].enemyRoom);
        let enemyRoomWalls=enemies[0].enemyRoom.walls;
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
        }
        if (boundingBox(addToPoint(shop,-5,115),addToPoint(shop,115,165),enemies[0],0,0)){
            shop.inShop=true;
        }else{
            shop.inShop=false;
        }
    }else{
        shop.x=Infinity;//this just makes it draw nowhere/offscreen
    }
}
function findPlayerGunAngle(){
    gunAngle=findAngle(mouseShifted,enemies[0]);
    if (controller!=undefined){
        let movementTarget = dupPoint(enemies[0]);
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
        gunAngle = findAngle(movementTarget,enemies[0]);
    }
    let closestAngle = Infinity;
    for (enemy of enemies[0].enemyRoom.enemies){
        if (enemy===enemies[0]){
            continue;
        }
        if (enemy.team!=1){
            continue;//maybe change this so it also auto aims toward teammates(to shoot bombs)
        }
        let angle = findAngle(enemy,enemies[0]);
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
    for (enemy of enemies){
        enemy.lastRoom=enemy.room;
        enemy.room = new newPoint((enemy.x+doorLength)/(roomWidth+(doorLength*2)),(enemy.y+doorLength)/(roomHeight+(doorLength*2)));
        if (enemy.enemyRoomEnemyLink===undefined){ //this is done in a completely different loop to make sure the link(usually the player) moves rooms before the things linked to it
            if ((!isSamePoint(floorPoint(enemy.lastRoom,1),floorPoint(enemy.room,1)))||enemy===enemies[0]){
                removeFromEnemyRooms(enemy);
                addToEnemyRooms(enemy);
            }
        }
    }
    for (enemy of enemies){ //this might not work for a frame if there is an enemy linked to an enemy who is linked to yet another enemy
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
let playerEnemyRoom = null;
let timeSpentInRoom = 0;
let flippedControls = false;
let doBulletWallCollision = true;
function challengeRooms(){
    timeSpentInRoom+=deltaTime;
    if (playerEnemyRoom!=enemies[0].enemyRoom){
        playerEnemyRoom = enemies[0].enemyRoom;
        timeSpentInRoom = 0;
    }
    challengeRoom = playerEnemyRoom.challengeRoom
    if (timeSpentInRoom<60&&challengeRoom!=0){
        addAutoRect(new newPoint(c.width/2,c.height/2),'GLITCHED ROOM','48px Courier New',undefined,false,true);
    }
    flippedControls=false;
    doBulletWallCollision = true;
    let firstEnemy = playerEnemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
    if (firstEnemy!=undefined){ //makes the challenges stop once you beat a room
        switch(challengeRoom){ //0 means no challenge room
            case 1:
                doBulletWallCollision = false; //bullets can go through walls
            break
            case 2:
                deltaTime*=2;//speeds up time by 2. This might speed up things not meant to speed up like timer
            break
            case 3:
                if ((!enemies[0].inDoorWay)&&(timeSpentInRoom>10)){
                    flippedControls=true; //controlls are flipped. this is handled in the player's script
                }
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
        let portal = newEnemyPreset(new newPoint(0,0),13,0,'',0,enemies[0]);
        portal.effect(enemies[0],portal,enemiesToRemove);
    }
    if (keysToggle['l']&&devMode){
        powerUpsGrabbed = [newPowerUpPreset(7,false),newPowerUpPreset(34,false)];
        minorPowerUpsGrabbed = [newPowerUpPreset(33),newPowerUpPreset(33),newPowerUpPreset(33),newPowerUpPreset(33),newPowerUpPreset(33)];
        enemies[0].health=enemies[0].maxHealth;
        money=9999;
        showHUD.majorPowerUps=true;
        showHUD.minorPowerUps=true;
        showHUD.health=true;
        showHUD.sellButton=true;
    }
    if (keys['9']&&devMode){
        giveAllPowerUps();
    }
    challengeRooms();
    updatePlayerStats();
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
    updateEnemiesEnemyRoom();
    if (keys['c']){
        console.log(enemyRooms);
    }
    if (!(keysToggle['n']&&devMode)){
        fullEnemyWallColl();
        for (let i = 0; i<1; i++){
            enemyCollisionEffects(enemiesToRemove);
            enemyCollision(enemiesToRemove);
        }
        fullEnemyWallColl();
    }
    gunEnemyMovement(enemies[0]);
    //drawBullets(cam,false);
    moveParticles();
    if ((!(keysToggle['n']&&devMode))&&doBulletWallCollision){
        bulletWallCollision(bulletsToRemove);
    }
    for (enemyToRemove of enemiesToRemove){
        enemyToRemove.deleted=true; //this may need to go inside the if statement
        removeFromEnemyRooms(enemyToRemove);
        let enemyIndex = enemies.findIndex((passed)=>passed===enemyToRemove);
        if (enemyIndex!=-1){
            enemies.splice(enemyIndex,1);
        }
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
    if (enemies[0].health>enemies[0].maxHealth){
        enemies[0].health=enemies[0].maxHealth;
    }
    camControl(true,enemies[0],false,false,keys['z']||frameNum===1,screenShake);
    //10 is added because if I didn't the mouse position would be slightly different from what it looks like
    //mouseShifted = new newPoint(((mouse.x+10)/cam.zoom)+(cam.x),((mouse.y/cam.zoom)+cam.y));
    if (keysUsed['h']&&devMode){
        keysUsed['h']=false;
        enemies[0].x=mouseShifted.x;
        enemies[0].y=mouseShifted.y;
        enemies[0].lastPosition.x=mouseShifted.x;
        enemies[0].lastPosition.y=mouseShifted.y;
    }
    if (enemies[0].health<=0){
        for (let i=0;i<40;i++){
            particles.push(new newParticle(enemies[0].x,enemies[0].y,7,enemies[0].defaultColor,0,new newPoint((Math.random()-.5)*20,(Math.random()-.5)*20),1.05));
        }
        //enemiesToRemove.push(enemies[0]);
        enemies[0].size=0;
        switchMode(6);
    }
}
function drawArrow(tail,point,prongLength,prongAngle){
    ctx.beginPath();
    ctx.moveTo(tail.x,tail.y);
    ctx.lineTo(point.x,point.y);
    let arrowAngle = findAngle(tail,point);
    ctx.lineTo(point.x+(prongLength*Math.sin(arrowAngle+prongAngle)),point.y+(prongLength*Math.cos(arrowAngle+prongAngle)))
    ctx.moveTo(point.x,point.y);
    ctx.lineTo(point.x+(prongLength*Math.sin(arrowAngle-prongAngle)),point.y+(prongLength*Math.cos(arrowAngle-prongAngle)))
    ctx.stroke();
}
let modeTimer = 0;
function switchMode(modeTarget){
    if (modeTarget===8){
        showHUD.majorPowerUps=true;
        if (enemies[0].enemyRoom.roomNum>=10){
            showHUD.permanentMinorPowerUps=true;
        }
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
        camTarget=dupPoint(enemies[0]);
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
        //camControl(true,enemies[0],false,!false,keys['z'],0);
        moveParticles();
        renderEverything(false,cam);
        drawHUD();
        ctx.fillStyle='#000000';
        ctx.font = '48px Courier New';
        let deathMessage = 'You Died! Press R To Play Again!';
        let metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(c.height/2));
        ctx.font = '32px Courier New';
        deathMessage = 'You Got All The Way To Room '+enemies[0].enemyRoom.roomNum+'!';
        metrics = ctx.measureText(deathMessage);
        ctx.fillText(deathMessage,(c.width/2)-(metrics.width/2),(2.5*c.height/4));
        if (keys['r']){
            location.reload(); //this isn't a great way to do it. better would be to reset all the values so it doesn't have to actually reload
        }
    }else if (mode===7){
        //weapon select menu
        camControl(true,enemies[0],false,!false,keys['z'],screenShake);
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
        camControl(true,enemies[0],false,true,false,0);
        moveParticles();
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