function enemyMovement(enemiesToRemove,skipPlayer){
    let start = floorPoint(player,boxSize);
    dashCooldown-=deltaTime;
    if (PFBoxes.find((element) => isSamePoint(element,start))===undefined){
        PFBoxes.push(new newPathBox(start.x,start.y,0,0,0,'end',true));
    }

    player.inDoorWay=false;
    //this makes it so if the player is in a doorway, both rooms are loaded
    let roomChange=new newPoint(0,0);
    let z = player.x%(roomWidth+(2*doorLength));
    //let u = (roomWidth+(2*doorLength))/(doorLength*2);
    if (z>roomWidth/2){
        z-=roomWidth+(2*doorLength);
    }else if (z<-((2*doorLength)+(roomWidth/2))){
        z-=roomWidth+(2*doorLength);
    }
    if (z<0&&z>=-doorLength){
        roomChange.x--;
        player.inDoorWay=true;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.x++;
        player.inDoorWay=true;
    }
    
    z = player.y%(roomHeight+(2*doorLength));
    u = (roomHeight+(2*doorLength))/(doorLength*2);
    if (z>roomHeight/2){
        z-=roomHeight+(2*doorLength);
    }else if (z<-((2*doorLength)+(roomHeight/2))){
        z-=roomHeight+(2*doorLength);
    }
    if (z<0&&z>=-doorLength){
        roomChange.y--;
        player.inDoorWay=true;
    }else if(z<-doorLength&&z>-doorLength*2){
        roomChange.y++;
        player.inDoorWay=true;
    }
    for (mainEnemyRoom of enemyRooms){
        if(!sameRoomPos(mainEnemyRoom,player.room)&&!sameRoomPos(mainEnemyRoom,addTwoPoints(player.room,roomChange))){
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
                if (enemy.PFType===37||enemy.PFType===11||enemy.PFType===15||enemy.PFType===12){//bosses
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
            if ((targetIndex===-1)&&enemy.target!=player&&enemy!=player){
                let closestEnemy=undefined;
                closestDis=Infinity;
                for (enemyCheck of enemyRoom){
                    let currentDis = findDis(player,enemyCheck);
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
            }else if (enemy.PFType===2){
                enemy.x=enemy.originalCopy.x; //this locks the enemy in place
                enemy.y=enemy.originalCopy.y;
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
                if (enemy.timer1===0){
                    if (player.y<enemy.y){
                        enemy.targetSpeed=5;
                        let baseTarget = new newPoint(Math.max(Math.min(player.x,roomWidth-60),60),player.y-10);
                        if (player.PFType!=0){
                            enemy.target = addToPoint(baseTarget,-30,0);
                        }else{
                            enemy.target = addToPoint(baseTarget,30,0);
                        }
                        player.PFType=0;
                        player.target = addToPoint(player,0,100);
                        enemy.timer1+=deltaTime;
                    }
                }else{
                    if (enemy.speed>findDis(enemy,enemy.target)&&enemy.timer2===0){
                        enemy.x=enemy.target.x;
                        enemy.y=enemy.target.y;
                        enemy.timer1+=deltaTime;
                        if (!(enemy.timer1>60||(devMode&&enemy.timer1>5))){
                            if (player.PFType===0){
                                let screenEnemyPos = offSetByCam(enemy);
                                let text = 'Halt';
                                if (rectsToDraw.length===1){
                                    text = "Don't do Any Funny Business";
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
                            }
                        }else if (player.PFType===0){
                            mainEnemyRoom.isPowerUpCollected=true;
                            switchMode(8);
                            player.PFType=1;
                        }else{
                            enemy.timer2=1;
                            enemy.target = player;
                            enemy.targetSpeed = -1; //maybe add a scream
                        }
                    }else{
                        enemyAngle = findAngle(enemy,enemy.target);
                        enemy.x-=Math.sin(enemyAngle)*enemy.speed;
                        enemy.y-=Math.cos(enemyAngle)*enemy.speed;
                        if (textToDraw.length===0&&enemy.timer2!=0&&heldPowerUp===null){
                            addAutoRect(new newPoint(c.width/2,3*c.height/4),'Hold to Shoot Continuously','32px Courier New',undefined,false,true);
                        }
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
                if (enemy.gunCooldown<2*enemy.gunCoolDownMax/3){ //the boss waits a second before starting it's next dash
                    enemy.x+=Math.sin(enemy.direction)*enemy.speed; //boss starts the first dash too soon
                    enemy.y+=Math.cos(enemy.direction)*enemy.speed;
                }
            }else if (enemy.PFType===12){
                //teleporting boss
                enemy.timer1-=deltaTime;
                if (enemy.timer1<(enemy.gunCoolDownMax/2)&&enemy.timer2===0){
                    enemy.timer2 = 2;
                }else if (enemy.timer1<0){
                    //let teleportPos = dupPoint(enemy.enemyRoom.spawnPoints[Math.floor(Math.random()*enemy.enemyRoom.spawnPoints.length)]);
                    let teleportPos = randomPosInRoom(enemy.enemyRoom,enemy.size);
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
                    enemiesToRemove.push(enemy);
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
                    enemy.target=player;
                }else{
                    enemyAngle = findAngle(enemy,enemy.target);
                    enemy.x=enemy.target.x+Math.sin(enemyAngle)*(enemy.size+enemy.target.size);
                    enemy.y=enemy.target.y+Math.cos(enemyAngle)*(enemy.size+enemy.target.size);
                }
            }else if (enemy.PFType===38){
                if (enemy.target.deleted===true){
                    enemy.PFType=2;//this is the other black enemy. Effectively, the enemy "dismounts"
                    enemy.target=player;
                    enemy.originalCopy.x=enemy.x; //pftype 2 enemies stick in place at the original point, so this sets the place it sill stick to
                    enemy.originalCopy.y=enemy.y;
                }else{
                    enemy.x=enemy.target.x
                    enemy.y=enemy.target.y
                }
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
            //enemy.room.x=(floorTo((player.x+50),(roomWidth+(doorLength*2)))-50)-(c.width/2/cam.zoom)+(roomWidth/2)+doorLength;
            //enemy.room.y=(floorTo((player.y+50),(roomHeight+(doorLength*2)))-50)-((c.height-HUDHeight)/2/cam.zoom)+(roomHeight/2)+doorLength
            if (!isSamePoint(enemy,enemy.lastPosition)&&enemy.PFType!=11){ //the dashing boss shouldn't have it's dash direction messed up by this
                enemy.direction=findAngle(enemy,enemy.lastPosition);
            }
        }
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
        enemy.speed = 80;
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
            if (isSamePoint(player,player.originalCopy)){
                timerGo=true;
            }
        }
        if(keys['s']){
            movementTarget.y++;
            if (isSamePoint(player,player.originalCopy)){
                timerGo=true;
            }
        }
        if(keys['a']){
            movementTarget.x--;
            if (isSamePoint(player,player.originalCopy)){
                timerGo=true;
            }
        }
        if(keys['d']){
            movementTarget.x++;
            if (isSamePoint(player,player.originalCopy)){
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
        /*if (findDis(new newPoint(0,0),enemy.momentum)<enemy.targetSpeed){
            enemy.momentum.x-=Math.sin(movementAngle)*enemy.speed*currentSpeed*enemy.friction; 
            enemy.momentum.y-=Math.cos(movementAngle)*enemy.speed*currentSpeed*enemy.friction;
        }else{
            enemy.momentum = new newPoint(-enemy.speed*Math.sin(movementAngle),-enemy.speed*Math.cos(movementAngle));
        }*/
        //enemy.momentum.x += (Math.sin(movementAngle)*enemy.targetSpeed*currentSpeed)/enemy.targetSpeed; //fix this to make the force that's applied porportional to how fast you're moving and how different the direction you want to go compared to which way you're actualy moving
        //enemy.momentum.y += (Math.cos(movementAngle)*enemy.targetSpeed*currentSpeed)/enemy.targetSpeed;
        //enemy.momentum.x = -Math.sin(movementAngle)*enemy.targetSpeed*currentSpeed;
        //enemy.momentum.y = -Math.cos(movementAngle)*enemy.targetSpeed*currentSpeed;
        enemy.x-=Math.sin(movementAngle)*enemy.speed*currentSpeed;
        enemy.y-=Math.cos(movementAngle)*enemy.speed*currentSpeed;
    }else if (playerNoStop){
        enemy.x+=Math.sin(enemy.direction)*enemy.speed; //the player can't stop moving
        enemy.y+=Math.cos(enemy.direction)*enemy.speed;
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

function gunEnemyMovement(target){
    for (let i=0;i<powerUpsGrabbed.length;i++){
        let examplePowerUp=powerUpsGrabbed[i];
        examplePowerUp.upgradeEffect(player,examplePowerUp,gunAngle);
    }
    for (mainEnemyRoom of enemyRooms){
        if(!sameRoomPos(mainEnemyRoom,player.room)){
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
                        shootingAngle = findAngle(target,player);

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
                    let bullet = new newBullet(0,0,enemy.bulletSpeed,0,'blue',40,5,0,60,1,new newPoint(),enemy,enemy.damage,'',21,3);
                    bullet.color = ['blue','#00FF00','green'/*Placeholder color. Should never be a thing*/,'#B900FF'][Math.round(enemy.damage-1)];
                    shootBullet(bullet,findAngle(enemy.target,enemy),enemy,bullet.bulletSpreadNum,bullet.shotSpread,0,enemy,enemy.size,true);
                    enemy.timer2 = 1; //1 means the enemy took the shot
                }
            }else if(enemy.PFType===10||enemy.PFType===4||enemy.PFType===5||enemy.PFType===3||enemy.PFType===2||enemy.PFType===17||enemy.PFType===15||enemy.PFType===38){
                if (enemy.target.team!=undefined){
                    /*let closestEnemy = findClosestEnemy(enemy,enemyRoom,enemy,false,false,mainEnemyRoom.walls);
                    if (closestEnemy!=undefined){
                        aimGun(enemy,closestEnemy,'blue',undefined,mainEnemyRoom,true);
                    }*/
                    let bulletColor = ['blue','#00FF00','green'/*Placeholder color. Should never be a thing*/,'#B900FF'][Math.round(enemy.damage-1)];
                    if (enemy.target.team===0){
                        aimGun(enemy,enemy.target,bulletColor,undefined,mainEnemyRoom,true);
                    }else{
                        aimGun(enemy,player,bulletColor,undefined,mainEnemyRoom,true);
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