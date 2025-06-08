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
            if (guns.includes(PFType)){
                price=3;
            }else{
                price=2;
            }
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
            target = player;
        }
        this.target = target;
        let team=1;
        if (PFType===1){ //this just checks if this is the player to avid checking the player variable. There is probably a more elegant way to do this
            team = 0;
        }else{
            if (target===player){
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
        this.gunAngle = 0;
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
let waterBullets = [];
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
class newWall {
    constructor(x1,y1,x2,y2){
        this.first = new newPoint(x1,y1);
        this.second = new newPoint(x2,y2);
    }
}