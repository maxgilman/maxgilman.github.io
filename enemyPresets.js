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
            target=player;
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
            enemy = new newEnemy(pos.x,pos.y,0,30,'black',2,target,75-(enemyPower),1.4+(enemyPower/2),'',undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,20);
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
                if (touchedEnemy===player&&thisEnemy.timer1<0&&undefined===touchedEnemy.enemyRoom.enemies.find((enemyCheck)=>enemyCheck.team===1)){
                    enemyRooms = [];
                    player.x = roomWidth/2;
                    player.y = roomHeight-200;
                    player.lastPosition = dupPoint(player);
                    generateRooms(31,30,true);
                    wallBoxes = generateWallBoxes(2,walls,wallBoxes);
                    enemyRooms[0].enemies.push(player);
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
            let targetSpeed = Math.min((findDis(target,player)/3.5),100); //100 is the range
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