function enemyCollision(enemiesToRemove){
    //enemies2 is the enemies in this room or should be processed
    for (mainEnemyRoom of enemyRooms){
        //this could be made faster by only checking loaded rooms near the player
        /*if (!sameRoomPos(mainEnemyRoom,player.room)){
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
function enemyCollisionEffects(enemiesToRemove){
    //enemies2 is the enemies in this room or should be processed
    for (mainEnemyRoom of enemyRooms){
        if (!sameRoomPos(mainEnemyRoom,player.room)){
            continue
        }
        let enemyRoom = mainEnemyRoom.enemies;
        let pickUpsToRemove = [];
        for (enemy of mainEnemyRoom.enemyPickUps){//this checks the money collision
            //let player = player;
            let enemyDis = findDis(player,enemy);
            if (enemyDis<=player.size+20){//this makes the hitbox larger(the 20 is the size of the pickups pickup range)
                if (rayCast(enemy,player,false,mainEnemyRoom.walls,true)===undefined){
                    enemy.effect(player,enemy,pickUpsToRemove); //this could be replaced with just doing an if statement and then the money and health effects, that may be faster than calling a function we already know what it will return
                }
            }
        }
        for (pickUp of pickUpsToRemove){
            let pickUpIndex = mainEnemyRoom.enemyPickUps.findIndex((pickUpCheck)=>pickUpCheck===pickUp)
            if (pickUpIndex!=-1){
                mainEnemyRoom.enemyPickUps.splice(pickUpIndex,1);
            }
        }
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
                        }
                    }
                }
            }
        }
    }
}