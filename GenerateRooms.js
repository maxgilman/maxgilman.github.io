function generateRooms(targetNumOfRooms,finalDifficulty,bossRush){
    bossChainEnemies = []
    let offLimitRooms = [];
    let bossesSpawned = [];
    //if the targetNumOfRooms is big, it will take a while to generate, it has probbally not crashed
    let deadEnds = [];
    //about half of the rooms will be dead ends
    //let originalLength = enemies.length;
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
        //lot of other changes would need to be made to make more sprawling room generation, mostly making it so rooms are added to the back of the list using .push, not the front
        //Right now it generates the first path, then generates all the side dead ends(side dead ends have been removed), which makes it so there aren't long paths the break off that don't lead anywhere
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
        /*if (numOfRooms>500){
            numOfDoors=0;
        }*/
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
            if (finishedRooms.length<1&&!bossRush){
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
        if (deadEnd&&numOfRooms<targetNumOfRooms){//this gets the maze out of a dead end
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
    addToEnemyRooms(player);
    /*for (let i=0;i<originalLength;i++){
        addToEnemyRooms(enemies[i]);
    }*/
}
function consoleChallengeRooms(){
    for (enemyRoom of enemyRooms){
        console.log('challenge:'+enemyRoom.challengeRoom+' Room Num:'+enemyRoom.roomNum);
    }
}
function generateRoom(topOpen,rightOpen,bottomOpen,leftOpen,roomPos,roomNum,difficulty,bossesSpawned,bossRush){
    //this aligns the cordinates as (-1,1) is the room one to the left of the beginning, not at the actual cordiate (-1,0)
    let enemyRoom = turnIntoRoomPos(roomPos);
    enemyRoom.enemies=[];
    enemyRoom.enemyPickUps=[];
    enemyRoom.walls=[];
    enemyRoom.wallBoxes = [];
    enemyRoom.difficulty = difficulty;
    enemyRoom.roomNum=roomNum;
    enemyRoom.useExtraWalls=0;
    enemyRoom.isPowerUpCollected = false;
    enemyRoom.numMinorsCollected=0;
    enemyRoom.powerUps = [];
    enemyRoom.shopPowerUps = [];
    enemyRoom.rerollNum = 0;
    enemyRoom.spawnPoints = [];
    enemyRoom.challengeRoom = 0; //0 means not a challenge room
    enemyRoom.timer1 = 0; //this can be used however. Used by challenge rooms
    if (roomNum===0){
        enemyRoom.isPowerUpCollected = false;
        enemyRoom.powerUps = [newPowerUpPreset(34,false),newPowerUpPreset(45,false),newPowerUpPreset(34,false)];
    }else if (roomNum<0){
        enemyRoom.isPowerUpCollected = true;
    }else if (roomNum===targetNumOfRooms){//doing it like this is easier for me to understand
        enemyRoom.isPowerUpCollected = true;
    }
    if ((roomNum>5&&(roomNum%10)>1)||bossRush){ //once room 5 and not a boss room or the room after, rooms can start to be challenge rooms
        let lastChallengeRoomNum = 0;
        let lastChallengeRoomType = -1;
        for (enemyRoomCheck of enemyRooms){
            if (enemyRoomCheck.challengeRoom>0){
                lastChallengeRoomNum = enemyRoomCheck.roomNum;
                lastChallengeRoomType = enemyRoomCheck.challengeRoom;
            }
        }
        let roomsSinceChallengeRoom = enemyRoom.roomNum-lastChallengeRoomNum; //I think this sometimes skips one. Its kinda weird.
        //console.log(roomsSinceChallengeRoom);
        if (roomsSinceChallengeRoom>1){
            let randomNum = Math.random();
            if (roomsSinceChallengeRoom<5){ //this allows four rooms to not be challenge rooms before it forces one
                randomNum-=.75;
                randomNum*=4; //randomNum is now between -3 and 1
            } //else the number is already above 0, it will always be a challenge room
            let eligibleRoomTypes = [0,1,2,3,4,5,6]; //challenge room types
            for (let i=0;i<eligibleRoomTypes.length;i++){
                if (eligibleRoomTypes[i]===lastChallengeRoomType){
                    eligibleRoomTypes.splice(i,1);
                    break;
                }
            }
            randomNum=Math.floor(randomNum*eligibleRoomTypes.length); //randomNum is now between 1-3 is challenge room, at or below 0 if else
            enemyRoom.challengeRoom = eligibleRoomTypes[Math.max(0,randomNum)];
        }
        //enemyRoom.challengeRoom = 1; //debug option
    }
    //enemyRooms.push([newEnemyPreset(addToPoint(roomPos,roomWidth/2,roomHeight/2),2)]);
    enemyRooms.push(enemyRoom);
    //enemies.push(enemyRooms[enemyRooms.length-1][0]);
    let roomOption = 0;
    let enemyDamage = findEnemyDamage(roomNum,bossRush);
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
        let bossType = [2,0,1]/*this is the boss order*/[bossesSpawned.length%3];
        bossesSpawned.push(bossType);
        switch (bossType){
            case 0: //dashing boss
                roomOption=emptyRoom;
                //enemies.push(newEnemyPreset(enemyPosition,11,undefined,undefined,difficulty));
                enemyRoom.enemies.push(newEnemyPreset(enemyPosition,11,enemyDamage,'',difficulty));
                break
            case 1: //snake boss
                roomOption = emptyRoom;
                let previousEnemy = player;
                for (let i=0;i<4;i++){
                    previousEnemy = newEnemyPreset(enemyPosition,37,enemyDamage,'',difficulty,previousEnemy);
                    //enemies.push(previousEnemy);
                    enemyRoom.enemies.push(previousEnemy);
                    //enemies.push(newEnemyPreset(enemyPosition,38,undefined,undefined,difficulty,previousEnemy));
                    enemyRoom.enemies.push(newEnemyPreset(enemyPosition,38,enemyDamage,'',difficulty,previousEnemy));
                }
                break
            case 2: //teleporting boss
                //roomOption=teleportingBossRoom;
                roomOption = {
                    walls:[],
                    spawnPoints:[]
                }
                roomOption.spawnPoints = teleportingBossRoom.spawnPoints;
                //enemies.push(newEnemyPreset(enemyPosition,12,undefined,undefined,difficulty,player));
                enemyRoom.enemies.push(newEnemyPreset(enemyPosition,12,enemyDamage,'',difficulty,player));
                break
            case 10: //basic boss
                roomOption = bossRoom;
                //enemies.push(newEnemyPreset(enemyPosition,15,undefined,undefined,difficulty));
                enemyRoom.enemies.push(newEnemyPreset(enemyPosition,15,enemyDamage,'',difficulty));
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
        if (roomNum<=0){
            randomNum = i; //every spawn point gets an enemy if this is the experiment room
        }
        let enemyPos = roomOption.spawnPoints[randomNum];
        //this adds the newest enemy to both lists
        let enemyType = findRandomEnemy(roomNum,difficulty);
        let enemy = newEnemyPreset(addTwoPoints(enemyPos,roomPos),enemyType,enemyDamage,undefined,difficulty);
        if (roomNum===-1){
            enemy.gunCooldown=60;
            if (randomNum>=2){
                enemy.team=0;//the players team so they don't shoot at the player
            }
        }
        //enemies.push(enemy);
        enemyRoom.enemies.push(enemy);
    }
    if (roomNum===-1){ //starting room
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,150),14,0,'Move with WASD'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,200),14,0,'Press 1 to be a Sweat'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2,250),14,0,'Stealth (Big time)'));
    }
    if (roomNum===targetNumOfRooms-2&&!bossRush){ //final room
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,200+roomPos.y),14,0,'You am become death'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,250+roomPos.y),14,0,'Destroyer of world'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,300+roomPos.y),14,0,'Reload the Page to Play Again'));
        enemyRoom.enemies.push(newEnemyPreset(new newPoint(roomWidth/2+roomPos.x,350+roomPos.y),14,0,'Or enter the Portal to Fight a Boss Rush'));
        enemyRoom.enemies.push(newEnemyPreset(addToPoint(roomPos,roomWidth/2,(roomHeight/2)+100),13,undefined,undefined,difficulty)); //portal
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
function shiftWallsBy(wallsList,x,y){
    for (wall of wallsList){
        wall.first.x+=x;
        wall.first.y+=y;
        wall.second.x+=x;
        wall.second.y+=y;
    }
    return wallsList
}
function findRandomEnemy(roomNum,difficulty){
    let enemyType = 4;
    let enemyRandomNum = Math.random();
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
    return enemyType;
}
function findEnemyDamage(roomNum,isBossRush){
    let enemyDamage = [1,2,4][Math.floor((roomNum-1)/10)];
    if (isBossRush){
        enemyDamage = [4,8,16,32,64,128][Math.floor((roomNum-1)/5)];
    }
    if (enemyDamage===undefined){ //should never trigger
        enemyDamage=1;
    }
    return enemyDamage
}