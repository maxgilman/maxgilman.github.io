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
                dashFramesLeft=6//thisPowerUp.range;
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
                shootBullet(bullet,gunAngle,player,bullet.bulletSpreadNum,bullet.shotSpread,0,player,player.size);
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
                let enemy = newEnemyPreset(dropPoint,36,thisPowerUp.range,undefined,thisPowerUp.damage,mouseShifted);
                enemy.gunCoolDownMax=thisPowerUp.var1;
                enemy.gunCooldown=enemy.gunCoolDownMax;
                enemy.bulletLength=thisPowerUp.var2;
                enemy.enemyRoomEnemyLink = thisEnemy;
                enemy.enemyRoom = thisEnemy.enemyRoom;
                //enemies.push(enemy);
                addToEnemyRooms(enemy);
            },30,1,100,Infinity);
            powerUp.var1 = 13; //the explosion time for the bombs
            powerUp.var2 = 200; //the explosion size of the bombs
            powerUp.image.src = 'Gun_Images/Grenade_Launcher.png';
        break
        case 3:
            powerUp = new newMajorPowerUp(PFType,'Heal 1HP in a Button Press','#4ABBA8',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax; //make none of this work if the player is still healing
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
                let bulletSpeed = 40;
                let bullet=new newBullet(0,0,bulletSpeed,0,'#FFB475',20,40,1,thisPowerUp.range/bulletSpeed,1,new newPoint(0,0),thisEnemy,0,'',20,(Math.PI*2)/2); //make this the blue of the player. The energy is moving outwards. Maybe also make it squiggly
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
                    if (dis<3*thisPowerUp.range/4){
                        force = -60;
                    }else if (dis<thisPowerUp.range){
                        force = -45;
                    }
                    //force = Math.max(20-(Math.max(dis,60)/40),0);
                    enemy.momentum = new newPoint(Math.sin(angle)*force,Math.cos(angle)*force);
                }
            },30,0,400);
            powerUp.var1 = 0; //how long the pushing effect has left to last for bullets
        break
        case 6:
            powerUp = new newMajorPowerUp(PFType,'Shotgun','#BABFC0',function (thisEnemy,thisPowerUp){
                thisPowerUp.coolDown-=deltaTime;
            },function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,30,0,'red',40,5,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage/3,'',3,thisPowerUp.shotSpread);
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
            },20,3,10,1,undefined,' for the Three Bullets Combined');
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
            powerUp = new newMinorPowerUp(PFType,'Cooldown on guns 3/4','#414f40',function (majorPowerUp,thisPowerUp){
                if (guns.includes(majorPowerUp.PFType)){
                    majorPowerUp.coolDownMax*=3/4;
                }
            })
        break
        case 11:
            powerUp = new newMinorPowerUp(PFType,'Your Grenades Deal +4 Damage','#FF6E6E',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.damage+=4;
                }
            })
        break
        case 12:
            powerUp = new newMinorPowerUp(PFType,'+5 Damage for Ability Bound to Right Click','#FFAC01',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[1]&&majorPowerUp.damage>0){
                    majorPowerUp.damage+=5;
                }
            })
        break
        /*case 13:
            powerUp = new newMinorPowerUp(PFType,'Every room cleared without taking damage, 1/2 cooldown on shotgun','#FF6EEC',function (majorPowerUp,thisPowerUp){
                if (player.health<thisPowerUp.var1){
                    thisPowerUp.var3=1
                }else if (player.health>thisPowerUp.var1){
                    thisPowerUp.var1=player.health;
                }
                if (thisPowerUp.var2.roomNum<player.enemyRoom.roomNum){
                    thisPowerUp.var2=player.enemyRoom;
                    thisPowerUp.var3*=2;
                }
                if (majorPowerUp.PFType===5){
                    majorPowerUp.coolDownMax/=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Divisor: '+thisPowerUp.var3;
            })
            powerUp.var1 = player.health; //var1 is the starting health
            powerUp.var2 = player.enemyRoom; //var2 is whatever room the player is in
            powerUp.var3 = 1; //var3 is the multiplier
        break*/
        case 14:
            powerUp = new newMinorPowerUp(PFType,"1/2 Cooldown on Everything that isn't a Gun",'#104239',function (majorPowerUp,thisPowerUp){
                if (!guns.includes(majorPowerUp.PFType)){
                    majorPowerUp.coolDownMax/=2;
                }
            })
        break
        case 15:
            powerUp = new newMinorPowerUp(PFType,'Using the Dash Ability Heals 1 More HP','#4cd44e',function (majorPowerUp,thisPowerUp){
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
            powerUp = new newMinorPowerUp(PFType,'After Gaining Health, +5 Damage for 5 Seconds','#f0c013',function (majorPowerUp,thisPowerUp){
                if(player.health>thisPowerUp.var1){
                    thisPowerUp.coolDown=150;
                }
                thisPowerUp.var1=player.health;
                if(powerUp.coolDown>0){
                    if (majorPowerUp===powerUpsGrabbed[0]){
                        thisPowerUp.coolDown-=deltaTime;
                    }
                    if (majorPowerUp.damage>0){
                        majorPowerUp.damage+=10;
                    }
                    thisPowerUp.secondLabel = 'Active for '+Math.round((Math.max(0,thisPowerUp.coolDown)/30))+' More Seconds';
                }else{
                    thisPowerUp.secondLabel = 'Not Active';
                }
            })
            powerUp.var1 = player.health; //var1 is the starting health
            powerUp.coolDownMax = 150; //I use the cooldown variable to get the code to draw the grey countdown circle
            powerUp.coolDown = 0;
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
                    player.maxHealth+=5;
                }
            })
        break
        case 21:
            powerUp = new newMinorPowerUp(PFType,'Get Multiple of the Same Modifiers','#08a838',function (majorPowerUp,thisPowerUp){
                getDuplicateMinorPowerUps=true;
            })
        break
        case 23:
            powerUp = new newMinorPowerUp(PFType,'-2 Max Health, +4 Damage','#277bab',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    player.maxHealth-=2;
                }
                if (majorPowerUp.damage>0){
                    majorPowerUp.damage+=8;
                }
            })
        break
        case 24:
            powerUp = new newMinorPowerUp(PFType,'If at or below 3HP, 1.5X Damage','#ffcc00',function (majorPowerUp,thisPowerUp){
                if (player.health<=3){
                    majorPowerUp.damage*=1.5;
                }
            })
        break
        case 25:
            powerUp = new newMinorPowerUp(PFType,'Move 50% Faster','#000099',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    player.targetSpeed*=1.5;
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
            powerUp = new newMinorPowerUp(PFType,'Every Room Cleared Without Losing Health, Enemies can Drop 1 More Health','#cc0099',function (majorPowerUp,thisPowerUp){
                if (player.health<thisPowerUp.var1){
                    thisPowerUp.var1=Infinity;//this makes it so now the player is locked out of getting the thing this room
                }else if (player.health>thisPowerUp.var1){
                    thisPowerUp.var1=player.health;
                }
                let firstEnemy = player.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
                if (thisPowerUp.lastEnemyRoom.roomNum<player.enemyRoom.roomNum&&firstEnemy===undefined){
                    if (player.health===thisPowerUp.var1){
                        thisPowerUp.var3++;
                    }
                    thisPowerUp.var1=player.health;
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                }
                if (majorPowerUp===powerUpsGrabbed[0]){
                    maxHealthDrop+=thisPowerUp.var3;
                }
                thisPowerUp.secondLabel = 'Current Extra Health: '+thisPowerUp.var3;
            })
            powerUp.var1 = player.health; //var1 is the starting health
            powerUp.var3 = 0; //var3 is the extra health*/
        break
        case 28:
            powerUp = new newMajorPowerUp(PFType,'Gain another Modifier Slot for $5','White',function(thisEnemy,thisPowerUp){
                minorPowerUpSpace+=thisPowerUp.var2;
            },function(thisEnemy,thisPowerUp){
                let price = 5+(thisPowerUp.var2*5); //price starts at 5
                if (money>=price){
                    if (heldPowerUp!=null&&heldPowerUp instanceof newMinorPowerUp){
                        minorPowerUpsGrabbed.push(heldPowerUp);
                        heldPowerUp=null;
                    }
                    money-=price;
                    thisPowerUp.label = 'Gain another Modifier Slot for $'+price;
                    thisPowerUp.var2++;
                    minorPowerUpSpace++;
                }
            });
            powerUp.var2 = 0; //extra power up space
        break
        case 29:
            powerUp = new newMinorPowerUp(PFType,'After Clearing a Room, Get $0.2, up to $50, for every $1 you have','#99ff66',function (majorPowerUp,thisPowerUp){
                let firstEnemy = player.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
                if ((player.enemyRoom.roomNum-thisPowerUp.lastEnemyRoom.roomNum)>=1&&firstEnemy===undefined){
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                    money+=Math.min(money*.2,50);
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
            powerUp = new newMinorPowerUp(PFType,'Gain a +1 Damage Boost for Every HP You Have','#993300',function (majorPowerUp,thisPowerUp){
                thisPowerUp.secondLabel = 'Current Boost: +'+(player.health);
                if (majorPowerUp.damage>0){
                    majorPowerUp.damage+=player.health;
                }
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
                shootBullet(bullet,gunAngle,player,bullet.bulletSpreadNum,bullet.shotSpread,.1,player,player.size);
            },45,.5,40,1,undefined,' every 2 Seconds to Enemy');
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
            powerUp = new newMinorPowerUp(PFType,'1/2 Cooldown on everything, But Everything Does 1/2 Damage','#07ed5f',function (majorPowerUp,thisPowerUp){
                majorPowerUp.coolDownMax/=2;
                majorPowerUp.damage/=2;
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
            powerUp = new newMinorPowerUp(PFType,'All Bullets can Pierce Infinite Enemies','#b970e0',function (majorPowerUp,thisPowerUp){
                majorPowerUp.bulletKillPower=Infinity;
            })
        break
        case 42:
            powerUp = new newMinorPowerUp(PFType,'2/3 Cooldown for Ability Bound to Left Click','#86E6F1',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    majorPowerUp.coolDownMax*=2/3;
                }
            })
        break
        case 43:
            powerUp = new newMinorPowerUp(PFType,"Explosives Heal You and your Souls The Explosive's Damage",'#1a37c7',function (majorPowerUp,thisPowerUp){
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
                    //enemies.push(enemy);
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
                if (player.health===1){
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
                let enemy = newEnemyPreset(dropPoint,35,thisPowerUp.range,undefined,thisPowerUp.damage,mouseShifted);
                enemy.enemyRoomEnemyLink = thisEnemy;
                enemy.enemyRoom = thisEnemy.enemyRoom;
                //this doesn't scale right with frame rate differences
                enemy.targetSpeed = Math.min((findDis(mouseShifted,player)/3.5),thisPowerUp.range);
                enemy.momentum = new newPoint(Math.sin(gunAngle)*enemy.targetSpeed,Math.cos(gunAngle)*enemy.targetSpeed);
                enemy.direction = gunAngle;
                //enemies.push(enemy);
                addToEnemyRooms(enemy);
            },40,0,100,Infinity);
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
            },30,5,30,Infinity);
            powerUp.var1 = 0; //the current charge level
            powerUp.var2 = false; //button held last frame
            //powerUp.var3 = 0; //frame counter for the flashing gun effect
            powerUp.coolDowntext = ' of Holding to Charge a Shot';
            powerUp.image.src = 'Gun_Images/Grenade_Launcher.png';
        break
        case 50:
            powerUp = new newMinorPowerUp(PFType,'Every Other Room Deal 2X Damage','#AB5C3B',function (majorPowerUp,thisPowerUp){
                if (player.enemyRoom.roomNum!=thisPowerUp.lastEnemyRoom.roomNum){
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                    thisPowerUp.var1=!thisPowerUp.var1;
                }
                if (thisPowerUp.var1){
                    majorPowerUp.damage*=2;
                    thisPowerUp.secondLabel = '2X Damage is Active This Room';
                }else{
                    thisPowerUp.secondLabel = '2X Damage is Not Active This Room';
                }
            })
            powerUp.var1 = true; //whether the power up is active in this particular room
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
                shootBullet(bullet,gunAngle,player,bullet.bulletSpreadNum,bullet.shotSpread,.1,player,player.size);
            },45,.2,40,1);
        break
        case 52:
            powerUp = new newMinorPowerUp(PFType,'Your Grenades take 0.5X as Long to Explode','#464B9A',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.var1*=.5;
                }
            })
        break
        case 53:
            powerUp = new newMinorPowerUp(PFType,'Your Grenades have 1.5X Explosion Size','#6247C9',function (majorPowerUp,thisPowerUp){ //make this apply to all explosives
                if (majorPowerUp.PFType===2){
                    majorPowerUp.var2*=1.5;
                }
            })
        break
        case 54:
            powerUp = new newMinorPowerUp(PFType,'Get $5 if Entering a Room on 3HP or less','#7bf23f',function (majorPowerUp,thisPowerUp){
                if ((player.enemyRoom.roomNum-thisPowerUp.lastEnemyRoom.roomNum)>=1){
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                    if (player.health<=3){
                        money+=5;
                    }
                }
            })
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
            powerUp = new newMinorPowerUp(PFType,'Every 1 second, your next Bullet will drop 1/4 its damage in money on enemy hit','#AF37A0',function (majorPowerUp,thisPowerUp){
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
                            for (let i=0;i<(thisBullet.damage/4);i++){
                                let moneyPos = new newPoint();
                                do{
                                    moneyPos = addToPoint(dupPoint(enemyHit),(Math.random()*50)-25,(Math.random()*50)-25);
                                }while(rayCast(enemyHit,moneyPos,false,enemyHit.enemyRoom.walls))
                                //enemies.push(newEnemyPreset(moneyPos,16));
                                addToEnemyRooms(newEnemyPreset(moneyPos,16));
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
        case 57:
            powerUp = new newMajorPowerUp(PFType,'Sniper but Bullets Bounce','grey',function (thisEnemy,thisPowerUp){thisPowerUp.coolDown-=deltaTime},function(thisEnemy,thisPowerUp,gunAngle){
                thisPowerUp.coolDown=thisPowerUp.coolDownMax;
                screenShake+=3;
                let bullet = new newBullet(0,0,40,0,'red',60,5,0,thisPowerUp.range,thisPowerUp.bulletKillPower,new newPoint(0,0),thisEnemy,thisPowerUp.damage,'',1,1);
                for (extraEffect of thisPowerUp.extraBulletEffects){
                    bullet.effects.push(extraEffect);
                }
                bullet.wallEffect = function(wallHit,thisBullet,posOnWall,bulletsToRemove){
                    let wallAngle = findAngle(wallHit.second,wallHit.first);
                    let reflectionAngle = wallAngle;
                    if (0>(((thisBullet.lastPosition.x - wallHit.first.x)*(wallHit.second.y - wallHit.first.y)) - ((thisBullet.lastPosition.y - wallHit.first.y)*(wallHit.second.y - wallHit.first.x)))){
                        reflectionAngle-=Math.PI;
                    }else{
                        reflectionAngle+=Math.PI;
                    }
                    let angleDis = reflectionAngle-thisBullet.direction;
                    thisBullet.direction = angleDis+reflectionAngle;

                    let newHeadX = posOnWall.x+(Math.sin(thisBullet.direction)*thisBullet.tailLength);
                    let newHeadY = posOnWall.y+(Math.cos(thisBullet.direction)*thisBullet.tailLength);
                    thisBullet.x=newHeadX;
                    thisBullet.y=newHeadY;
                    thisBullet.lastPosition=dupPoint(posOnWall);
                }
                shootBullet(bullet,gunAngle,thisEnemy,bullet.bulletSpreadNum,bullet.shotSpread,0,thisEnemy,thisEnemy.size);
            },30,2,100000000,Infinity);
            powerUp.image.src = 'Gun_Images/Sniper.png';
        break
        case 58:
            powerUp = new newMinorPowerUp(PFType,'+2 Damage','#FFA2A2',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.damage>0){
                    majorPowerUp.damage+=2;
                }
            })
        break
        case 59:
            powerUp = new newMinorPowerUp(PFType,'Gain 1 Max HP for Every Room Cleared Where 10 or More Damage is taken','#D0DA00',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp===powerUpsGrabbed[0]){
                    player.maxHealth+=thisPowerUp.var3;
                    thisPowerUp.secondLabel = 'Current Extra Max Health: '+thisPowerUp.var3+'  Taken '+thisPowerUp.var4+' damage this Room';
                }
                if (player.health<thisPowerUp.var1){
                    thisPowerUp.var4+=thisPowerUp.var1-player.health;
                    thisPowerUp.var1 = player.health;
                }else if (player.health>thisPowerUp.var1){
                    thisPowerUp.var1=player.health;
                }
                let firstEnemy = player.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1);
                if (thisPowerUp.lastEnemyRoom.roomNum<player.enemyRoom.roomNum&&firstEnemy===undefined){
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                    if (thisPowerUp.var4>=10){
                        thisPowerUp.var3++;
                    }
                    thisPowerUp.var4 = 0;
                }
            })
            powerUp.var1 = player.health; //var1 is the starting health
            powerUp.var3 = 0; //var3 is the extra max health
            powerUp.var4 = 0; //how much damage has been taken this room
        break
        case 60:
            powerUp = new newMinorPowerUp(PFType,'Bullets deal Triple Damage to Frozen Enemies','#bd8202',function (majorPowerUp,thisPowerUp){
                if (majorPowerUp.PFType!=51){ //ice staff bullets don't deal extra damage
                    majorPowerUp.extraBulletEffects.push(function(enemyHit,thisBullet){
                        if (undefined!=enemyHit.statusEffects.find((effect)=>effect.type===2)){ //2 is the frozen effect
                            thisBullet.effects[1](enemyHit,thisBullet); //calls the second effect twice, should be the damageing effect
                            thisBullet.effects[1](enemyHit,thisBullet);
                        }
                    })
                }
            })
        break
        case 61:
            powerUp = new newMinorPowerUp(PFType,'Gain +.1 Damage for Every Money you Have, but you lose 1/4 of Your Money Every Room Entered','#993300',function (majorPowerUp,thisPowerUp){
                thisPowerUp.secondLabel = 'Current Boost: +'+(money/10);
                if (majorPowerUp.damage>0){
                    majorPowerUp.damage+=money/10;
                }
                if ((player.enemyRoom.roomNum-thisPowerUp.lastEnemyRoom.roomNum)>=1){
                    thisPowerUp.lastEnemyRoom=player.enemyRoom;
                    money*=.75;
                }
            });
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
        //granades push you away 4X as far/strong
    }
    if (powerUp instanceof newMajorPowerUp&&isEffect){
        let specialEffect = Math.random()*50;
        if (specialEffect<1&&isGun){
            powerUp.secondLabel='This Gun Has +25 Base Damage!!';
            powerUp.price+=5;
            powerUp.damage+=25;
        }else if (specialEffect<6&&isGun){
            powerUp.secondLabel='This Gun Has +5 Base Damage!';
            powerUp.price+=3;
            powerUp.damage+=5;
        }else if (specialEffect<10){
            powerUp.secondLabel='This Ability Has 1/2 Base Cooldown!';
            powerUp.price+=3;
            powerUp.coolDownMax*=.5;
        }
    }
    if (powerUp!=null){
        let var1 = powerUp.var1;
        let var2 = powerUp.var2;
        let var3 = powerUp.var3;
        let var4 = powerUp.var4;
        let lastEnemyRoom = powerUp.lastEnemyRoom;
        powerUp.var1 = null;
        powerUp.var2 = null;
        powerUp.var3 = null;
        powerUp.var4 = null;
        powerUp.lastEnemyRoom = null;
        powerUp.originalCopy=JSON.parse(JSON.stringify(powerUp));
        powerUp.var1 = var1;
        powerUp.var2 = var2;
        powerUp.var3 = var3;
        powerUp.var4 = var4;
        powerUp.lastEnemyRoom = lastEnemyRoom;
        powerUp.originalCopy.bulletKillPower=powerUp.bulletKillPower;
    }
    return powerUp;
}