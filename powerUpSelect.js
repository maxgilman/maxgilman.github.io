function powerUpSelect(){
    let enemyRoom = playerEnemyRoom;
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
    if (maxNumMinorsToGrab!=1){
        text = 'Spend $'+minorPriceScaling(playerEnemyRoom.numMinorsCollected)+' to take a Modifier';
    }
    if (playerEnemyRoom.numMinorsCollected>=maxNumMinorsToGrab){
        text = "You Can't Take Any More Modifiers";
    }
    if (player.enemyRoom.roomNum===0){
        text = 'Break Out of the Factory';
    }
    let stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),c.height/3);
    text = 'Then Drag it into a Slot on the Side';
    if (enemyRoom.roomNum===0){
        text = 'Drag the weapon into a Mouse Slot';
    }else if ((enemyRoom.roomNum%10)===0){
        let otherText = 'SPECIAL BOSS MODIFIERS';
        ctx.font='40px impact';
        stats = ctx.measureText(otherText);
        ctx.fillText(otherText,(c.width/2)-(stats.width/2),1.2*c.height/3);
    }
    if (playerEnemyRoom.numMinorsCollected>=maxNumMinorsToGrab){
        text = 'Now leave';
    }
    ctx.font='32px impact';
    stats = ctx.measureText(text);
    ctx.fillText(text,(c.width/2)-(stats.width/2),1.9*c.height/3);
    let powerUps=enemyRoom.powerUps;
    if (powerUps.length===0){
        let currentEligible = [...eligibleMinorPowerUps];
        if ((enemyRoom.roomNum%10)===0){
            currentEligible = [{PFType:29,rarity:1},{PFType:56,rarity:1},{PFType:62,rarity:1},{PFType:63,rarity:1}]//special boss power ups
        }
        for (let i=0;i<currentEligible.length;i++){
            if (!getDuplicateMinorPowerUps){
                if (undefined!=minorPowerUpsGrabbed.find((examplePowerUp)=>examplePowerUp.PFType===currentEligible[i].PFType)){
                    currentEligible.splice(i,1);
                    i--;
                    continue;
                }
                if (undefined!=permanentMinorPowerUps.find((examplePowerUp)=>examplePowerUp.PFType===currentEligible[i].PFType)){
                    currentEligible.splice(i,1);
                    i--;
                    continue;
                }
            }
        }
        while (powerUps.length<3){
            let powerUpType = 21; //this is the get multiple of the same modifiers power up
            if (currentEligible.length>0){
                let randomEligible = [];
                for (powerUp of currentEligible){
                    for (let i=0;i<powerUp.rarity;i++){
                        randomEligible.push(powerUp);
                    }
                }
                powerUpType = randomEligible[Math.floor(Math.random()*randomEligible.length)].PFType;
            }
            powerUps.push(newPowerUpPreset(powerUpType,true));
            currentEligible.splice(currentEligible.findIndex((check)=>check.PFType===powerUpType),1);
        }
        /*for (let i=0;i<1;i++){
            powerUps.push(newPowerUpPreset(eligibleMajorPowerUps[Math.floor(Math.random()*eligibleMajorPowerUps.length)],true));
        }*/
    }
    for(let i=0;i<powerUps.length;i++){
        let iconPos=new newPoint((3*c.width/4)-(200*i)-200,c.height/2);
        let examplePowerUp = powerUps[i];
        let onClick = function(i,powerUpList){
            let takeMinor = false;
            let price = 0;
            let maybePrice = minorPriceScaling(playerEnemyRoom.numMinorsCollected);
            if (playerEnemyRoom.numMinorsCollected<maxNumMinorsToGrab){
                if (maxNumMinorsToGrab===1){
                    takeMinor=true;
                }else if (money>=maybePrice){
                    takeMinor = true;
                    price = minorPriceScaling(playerEnemyRoom.numMinorsCollected)
                }
            }
            if (takeMinor){
                money-=price;
                heldPowerUp=powerUpList[i];
                powerUpList.splice(i,1,newPowerUpPreset(34,false));
                playerEnemyRoom.numMinorsCollected++;
            }
        }
        let powerUpSize = 40;
        if (examplePowerUp instanceof newMinorPowerUp){
            powerUpSize = 20;
        }else{
            onClick = function(i,powerUpList){ //its a major power up. Should be the first room, so you can't grab a ton of modiifers
                heldPowerUp=powerUpList[i];
                switchMode(0);
            }
        }
        if (examplePowerUp.PFType!=34){
            if (player.enemyRoom.roomNum>0){
                showHUD.minorPowerUps=true;
            }
            if (player.enemyRoom.roomNum>1){
                showHUD.sellButton=true;
            }
            drawPowerUp(examplePowerUp,i,12,onClick,powerUps,iconPos.x,false,true,false,false);
        }
    }
    doButtons();
}
function doButtons(){
    for (button of buttons){
        button.color = 'white'; //this is the easiest way to do this, could be deleted later
        if (button===rerollButton&&!canRerollMinor){
            continue;
        }
        if (button.pressedLastFrame===undefined){ //first frame
            button.pressedLastFrame = button.pressed;
        }else{
            button.everyFrame(button);
            button.pressedLastFrame = button.pressed;
            let mouseHover = boundingBox(button,addToPoint(button,button.width,button.height),addToPoint(mouse,13,3),0,0); //the mouse has the 10 offset as normal, then the 3 is from the button being "elevated" 3 pixels
            if (mouseHover){
                button.onHover(button);
            }
            button.pressed = (mouseHover||button.pressedLastFrame)&&mousePressed;
            if(!button.pressed&&button.pressedLastFrame&&mouseHover){
                button.onClick(button);
            }
            let buttonText = [];
            ctx.font = button.font;
            let metrics = ctx.measureText(button.text);
            let textPos = new newPoint(Math.round((button.width/2)-(metrics.width/2)),Number(button.font[0]+button.font[1])); //finding the size of the font may not work for some fonts
            addText(button.text,textPos,ctx.font,'black',1000000,buttonText);
            drawRect(new newRect(button,button.width,button.height,button.color,buttonText,false,true,button.pressed),true,button.pressed)
        }
    }
}