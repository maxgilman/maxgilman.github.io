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
function drawHalfMouse(points,buttonPressed,holeXPos){
    if (buttonPressed){
        for (point of points){
            point.y+=2;
        }
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
    ctx.lineTo(points[3].x,c.height);
    ctx.lineWidth=4;
    ctx.strokeStyle='white';
    ctx.stroke();
    ctx.lineWidth=1;
    if (buttonPressed){
        ctx.fillStyle = '#1E1E1E';
    }else{
        ctx.fillStyle = 'black';
    }
    ctx.fill();

    ctx.beginPath(); //hole for power up
    let yPos = c.height-20;
    if (buttonPressed){
        yPos+=2;
    }
    ctx.arc(holeXPos,yPos,15,0,Math.PI*2);
    ctx.fillStyle='white';
    ctx.fill();
}
function drawHUDMouse(majorLeftX,majorRightX){
    let majorCenter = ((majorRightX-majorLeftX)/2)+majorLeftX;

    let points = [
        new newPoint(majorLeftX,c.height),
        new newPoint(majorLeftX+2,c.height-70),
        new newPoint(majorCenter-20,c.height-75),
        new newPoint(majorCenter-1,c.height-75),
    ]
    let otherPoints = []; //the points for the right click button

    for (point of points){
        otherPoints.push(new newPoint((-(point.x-majorCenter))+majorCenter+2,point.y));
    }

    drawHalfMouse(points,buttonsArray[0],majorLeftX+20);

    drawHalfMouse(otherPoints,buttonsArray[2],majorLeftX+60);
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    //ctx.rect(majorCenter-1,c.height-76,2,100); //line that splits the mouse into left and right click
    ctx.rect(majorCenter-5,c.height-50,10,20); //scroll wheel hole
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    //ctx.rect(majorLeftX-6,c.height-2,12+majorRightX-majorLeftX,2); //bottom sliver
    ctx.rect(majorCenter-3,c.height-47,6,14); //scroll wheel
    ctx.fillStyle = '#1E1E1E';
    ctx.fill();

    /*ctx.beginPath();
    for (let i=0;i<powerUpSpace;i++){
        ctx.arc(majorLeftX+((i+.5)*40),c.height-20,15,0,Math.PI*2);
    }
    ctx.fillStyle='white';
    ctx.fill();*/

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
    /*if (keysUsed[' ']&&devMode){
        minorPowerUpsGrabbed.pop();
        keysUsed[' ']=false;
    }*/
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
    let message = '$'+(5+(upgrader.var2*5));
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
    /*player.health=roundTo2(player.health,10);
    ctx.fillText('Health:'+player.health+'/'+player.maxHealth,leftX,c.height-5);*/
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
function drawMoney(){
    money = roundTo2(money,10);
    ctx.strokeText('Money:'+money,c.width-275,c.height-5);
    ctx.fillText('Money:'+money,c.width-275,c.height-5);
}
let flashingNum = 0;
function drawHUD(){
    ctx.fillStyle='black';
    //ctx.fillRect(0,c.height-HUDHeight,c.width,HUDHeight); //this would draw a bos that covers up things if HUDHeight !=0
    const TEXT_SIZE = 40;
    ctx.font=TEXT_SIZE+'px Courier New';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    if (showHUD.money){
        drawMoney();
    }else if (money>0){
        showHUD.money=true;
    }
    if (player.enemyRoom.roomNum>0){
        ctx.strokeText('Room:'+player.enemyRoom.roomNum+'/30',c.width-990,c.height-10);
        ctx.fillText('Room:'+player.enemyRoom.roomNum+'/30',c.width-990,c.height-10);
    }
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    /*){ //this is when I'm bebuging and I have all the power ups, I can still see my health and money
        ctx.fillText('Money:'+money,c.width-250,40);
        ctx.fillText('Health:'+player.health+'/'+player.maxHealth,c.width-600,40);
    }*/
    if (player.health===7&&player.maxHealth===11){
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
        drawHealthBar(c.width-640,c.height-45,'green',player);
    } //boss health bar is drawn after the power ups
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
                    if (player.enemyRoom.roomNum===0){
                        addAutoRect(new newPoint(5,c.height-115),['Left Click Slot'],'24px Courier New',undefined,false,false);
            
                        addAutoRect(new newPoint(130,c.height-80),['Right Click Slot'],'24px Courier New',undefined,false,false);
                        
                        addAutoRect(new newPoint(0,c.height/4),['Drag Ability into Mouse Slots'],'50px Courier New',undefined,false,true);
                        drawArrow(new newPoint((c.width/2)+130,(c.height/4)+63),new newPoint(250,c.height-100),50,Math.PI/4);

                        drawArrow(new newPoint(20,c.height-85),new newPoint(55,c.height-35),30,Math.PI/4);
                        drawArrow(new newPoint(200,c.height-45),new newPoint(140,c.height-25),30,Math.PI/4);
                        flashingNum+=deltaTime;
                        if (flashingNum<10){
                            ctx.beginPath();
                            let verticalPos = c.height-20;
                            if (buttonsArray[0]){
                                verticalPos+=2;
                            }
                            ctx.arc(majorLeftX+20,verticalPos,13,0,Math.PI*2);
                            verticalPos = c.height-20;
                            if (buttonsArray[2]){
                                verticalPos+=2;
                            }
                            ctx.arc(majorLeftX+60,verticalPos,13,0,Math.PI*2);
                            ctx.fillStyle='blue';
                            ctx.fill();
                        }else if(flashingNum>20){
                            flashingNum=0;
                        }
                    }else if (player.enemyRoom.roomNum===1){
                        addAutoRect(new newPoint(20,c.height-270),['Drag Modifiers into These Smaller Slots'],'24px Courier New',undefined,false,false);
                        drawArrow(new newPoint(330,c.height-240),new newPoint(55,c.height-150),30,Math.PI/4);
                        flashingNum+=deltaTime;
                        if (flashingNum<10){
                            ctx.beginPath();
                            for (let i=0;i<minorPowerUpSpace;i++){
                                ctx.arc(permanentLeftX+15,c.height-35-(30*i),11,0,Math.PI*2);
                            }
                            ctx.fillStyle='blue';
                            ctx.fill();
                        }else if(flashingNum>20){
                            flashingNum = 0;
                        }
                    }
                    powerUpList = [heldPowerUp]; //held power up
                }
                break
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
                        examplePowerUp.onClickEffect(player,examplePowerUp); //the code about the held power up is handled in here
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
                    let verticalOffset = 0;
                    if (examplePowerUp===powerUpsGrabbed[0]&&buttonsArray[0]){
                        verticalOffset-=2;
                    }else if (examplePowerUp===powerUpsGrabbed[1]&&buttonsArray[2]){
                        verticalOffset-=2;
                    }
                    i=drawPowerUp(examplePowerUp,i,verticalOffset/30,onClick,powerUpList,majorLeftX,false,false,examplePowerUp.PFType===34,false);
                    /*for (let j=0;j<examplePowerUp.minorPowerUps.length;j++){
                        let otherExamplePowerUp = examplePowerUp.minorPowerUps[j];
                        drawPowerUp(otherExamplePowerUp,i,j+1,function(){},powerUpList,majorLeftX);
                    }*/
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
    for (let i=0;i<playerEnemyRoom.enemies.length;i++){ //boss health bar is drawn over the power ups
        if ([11,12,15,37,38].includes(playerEnemyRoom.enemies[i].PFType)){ //all the bosses pftypes are here
            drawHealthBar(c.width-640,5,'red',playerEnemyRoom.enemies[i]); //boss health bar
            break;
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
        for(let i=0;i<2+examplePowerUp.labels.length;i++){
            let text = '';
            if (i<examplePowerUp.labels.length){
                text = examplePowerUp.labels[i];
                if ((text==='Click Here To Sell Item for $1')&&undefined!=rectsToDraw.find((checkRect)=>checkRect.textToDraw[0].message===text)){
                    if (powerUpSelect){
                        relativePos.y+=30;
                    }else{
                        relativePos.y+=20;
                    }
                    continue;
                }
            }else if(i<examplePowerUp.labels.length+1){
                if (skipDrawDamage){
                    continue;
                }
                text = 'Deals '+roundTo2(examplePowerUp.damage,100)+' Damage';
                text+=examplePowerUp.damageText;
            }else if(i<examplePowerUp.labels.length+2){
                if (skipDrawCooldown){
                    continue;
                }
                //text = 'Cooldown: '+roundTo2(examplePowerUp.coolDownMax,100);
                let secondsText = 'Seconds';
                if (roundTo2(examplePowerUp.coolDownMax/30,100)===1){
                    secondsText='Second';
                }
                text = 'Cooldown: '+roundTo2(examplePowerUp.coolDownMax/30,100)+' '+secondsText+examplePowerUp.coolDowntext;
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
                if (powerUpSelect){
                    rectHeight+=(examplePowerUp.labels.length-1)*30
                }else{
                    rectHeight+=(examplePowerUp.labels.length-1)*20
                }
                for (rect of rectsToDraw){
                    if (rect.isMoveable){
                        rect.y-=rectHeight+5;
                    }
                }
                let powerUpPos = new newPoint(Math.max(5,Math.min(mouse.x-(maxTextWidth/2),c.width-(maxTextWidth+5)))-5,Math.max(Math.min(mouse.y-10,c.height),rectHeight)-rectHeight)
                rectsToDraw.push(new newRect(powerUpPos,maxTextWidth+10,rectHeight,'white',textToDraw,true));
            }
        }
    }
    return numOnScreen
}