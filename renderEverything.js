function renderEverything(skipPlayers,camera){
    waterBullets = [];
    drawBackground();
    //the camera mechanic is unfinished and probally doesn't work cause variables share names
    drawDebug(camera);
    drawWalls(camera,false);
    drawEnemyRooms();
    if (!skipPlayers){
        drawEnemies(camera);
    }
    drawBullets(camera,false);
    drawShop();
    drawCircles(camera);
    drawParticles();
    drawScreenTint();
    drawBorder();
    if (shop.inShop&&mode===0){
        drawShopItemSelect();
    }
}
function drawBackground(){
    //ctx.fillStyle = background; //this is a color, maybe in the future this may be an image
    switch(Math.floor(Math.max(player.enemyRoom.roomNum-1,0)/10)){
        case 0:
            ctx.fillStyle='white';
        break
        case 1:
            ctx.fillStyle='#BBBBBB';
        break
        case 2:
            ctx.fillStyle='#757575';
        break
    }
    ctx.fillRect(0,0,c.width,c.height);
}
function drawScreenTint(){
    ctx.globalAlpha = screenTint.opacity;
    ctx.fillStyle = screenTint.color; //this is a color, maybe in the future this may be an image
    ctx.fillRect(0,0,c.width,c.height);
    ctx.globalAlpha=1;
}
function drawDebug(cam){
    if (changePlayerColor){
        if (mousePressed){
            player.color='black'
        }else{
            player.color='brown'
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
function drawTintOnEnemy(enemy,drawHealthTint,offset){
    let screenEnemyPos = offSetByCam(enemy);
    ctx.beginPath();
    ctx.arc(screenEnemyPos.x+offset.x,screenEnemyPos.y+offset.y,enemy.size*cam.zoom,0,Math.PI*2);
    ctx.fillStyle = 'red';
    if (drawHealthTint){
        if (enemy.health>=5&&enemy.invinceable>=0){
            ctx.globalAlpha = .2;
        }else{
            ctx.globalAlpha = -((Math.min(enemy.health,5)/5/*enemy.maxHealth*/)-1);
        }
    }else if (enemy.invinceable>=0){
        ctx.globalAlpha = .4;
    }else{
        return;
    }
    ctx.fill();
    ctx.globalAlpha = 1;
}
function drawEnemy(enemy){
    let screenEnemyPos = offSetByCam(enemy);
    if (enemy.PFType===1||enemy===player){
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
                let thisImage = playerImages.imagesList[movementDirection];
                let imageSizeRatio = Math.max(1,Math.round(enemy.size*cam.zoom*2/thisImage.width/*it would be slightly different if image height is used*/));
                ctx.drawImage(thisImage,Math.round(imagePos.x),Math.round(imagePos.y),imageSizeRatio*thisImage.width,imageSizeRatio*thisImage.height);
            }else{//the player is playing the charging animation
                let imagePos = addToPoint(offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size)),0,-17*(player.size/player.originalCopy.size));
                let thisImage = playerImages.chargingList[Math.floor(enemy.timer1)];
                let imageSizeRatio = Math.max(1,Math.round(enemy.size*cam.zoom*2/thisImage.width/*it would be slightly different if image height is used*/));
                ctx.drawImage(thisImage,Math.round(imagePos.x),Math.round(imagePos.y),imageSizeRatio*thisImage.width,imageSizeRatio*thisImage.height);
            }
        }
        /*ctx.save();
        let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
        ctx.translate(imagePos.x,imagePos.y);
        ctx.rotate(-enemy.direction);
        ctx.drawImage(playerImages.imagesList[movementDirection],0,0);
        ctx.restore();*/

        drawTintOnEnemy(enemy,true,new newPoint(0,0));
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
    }else if (enemy.PFType===2){
        let imageIndex = Math.round((enemy.gunAngle/(Math.PI*2))*8);
        //console.log('start')
        //console.log(imageIndex);
        imageIndex = bringNumIntoRange(imageIndex,0,8);
        //console.log(imageIndex);
        let image = enemyImages.nonMoving[imageIndex];
        let offset = enemyImages.nonMovingOffset[imageIndex];
        let imageScale = 2;
        let imagePos = offSetByCam(addToPoint(enemy,-enemy.size,-enemy.size));
        ctx.drawImage(image,imagePos.x+(offset.x*imageScale),imagePos.y+(offset.y*imageScale),image.width*imageScale,image.height*imageScale);
        drawTintOnEnemy(enemy,false,new newPoint(-4,0));
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
    if (((keysToggle['j']&&devMode))&&enemy.team!=2){
        ctx.fillStyle='white';
        ctx.font = enemy.size*cam.zoom+'px Courier New';
        ctx.fillText(Math.floor(enemy.health),screenEnemyPos.x-(cam.zoom*enemy.size/4),screenEnemyPos.y+(cam.zoom*enemy.size/4));
    }
    /*if (player===enemy){
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
    /*if (enemy===player){
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
    if (enemy===player&&false){
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
function drawEnemies(cam){
    for (enemyRoom of enemyRooms){
        for (enemy of enemyRoom.enemyPickUps){
            if (drawEnemyCheck(enemy)){
                drawEnemy(enemy);
            }
        }
        for (enemy of enemyRoom.enemies){
            if (drawEnemyCheck(enemy)){
                drawEnemy(enemy);
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
function drawShop(){
    let screenShopPos = offSetByCam(shop);
    ctx.drawImage(shopImage,screenShopPos.x-8,screenShopPos.y-24);

    ctx.globalAlpha = .5;
    ctx.beginPath();
    ctx.fillStyle='yellow';
    ctx.fillRect(screenShopPos.x-5,screenShopPos.y+115,110,50);
    ctx.globalAlpha=1;
}
function drawCircles(cam){
    for (circle of circlesToDraw){
        drawCircle(circle.x,circle.y,circle.color,false,circle.size);
    }
}
function drawParticles(){
    for (particle of particles){
        particle.drawParticle(particle);
    }
}
function drawBorder(){
    let screenRoomPos = new newPoint(0,0);
    let borderColor = ['#FF0000','#FF0000','#C00000','#7F0000','#400000'][Math.floor(player.health)];
    if (borderColor===undefined){//player.health was greater than 4
        borderColor = 'black';
    }
    ctx.fillStyle = ctx.createLinearGradient(0, screenRoomPos.y, 0, screenRoomPos.y+doorLength);//top
    ctx.fillStyle.addColorStop(0, borderColor);
    ctx.fillStyle.addColorStop(1, "rgb(0 0 0 / 0%)");
    ctx.fillRect(screenRoomPos.x, screenRoomPos.y, roomWidth+(doorLength*2), doorLength);
    ctx.fillStyle = ctx.createLinearGradient(0, screenRoomPos.y+roomHeight+(doorLength*2), 0, screenRoomPos.y+roomHeight+doorLength);//bottom
    ctx.fillStyle.addColorStop(0, borderColor);
    ctx.fillStyle.addColorStop(1, "rgb(0 0 0 / 0%)");
    ctx.fillRect(screenRoomPos.x, screenRoomPos.y+roomHeight+doorLength, roomWidth+(doorLength*2), doorLength);
    ctx.fillStyle = ctx.createLinearGradient(screenRoomPos.x, 0, screenRoomPos.x+doorLength, 0);//left
    ctx.fillStyle.addColorStop(0, borderColor);
    ctx.fillStyle.addColorStop(1, "rgb(0 0 0 / 0%)");
    ctx.fillRect(screenRoomPos.x, screenRoomPos.y, doorLength, roomHeight+(doorLength*2));
    ctx.fillStyle = ctx.createLinearGradient(screenRoomPos.x+roomWidth+(doorLength*2), 0, screenRoomPos.x+roomWidth+doorLength, 0);//right
    ctx.fillStyle.addColorStop(0, borderColor);
    ctx.fillStyle.addColorStop(1, "rgb(0 0 0 / 0%)");
    ctx.fillRect(screenRoomPos.x+roomWidth+doorLength, screenRoomPos.y, doorLength, roomHeight+(doorLength*2));
    /*for (enemyRoom of enemyRooms){
        let roomPos = turnRoomIntoRealPos(enemyRoom);
        let screenRoomPos = offSetByCam(roomPos);
       
    }*/
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
    let enemyRoomIndex =findEnemyRoomIndex(player);
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
            if (player.enemyRoom.roomNum>0){
                showHUD.minorPowerUps=true;
            }
            if (player.enemyRoom.roomNum>1){
                showHUD.sellButton=true;
            }
            drawPowerUp(examplePowerUp,i,12,onClick,powerUps,iconPos.x,false,true);
        }
    }
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
function drawMouse(){
    //ctx.drawImage(targetImage,mouse.x,mouse.y-10);
    ctx.drawCircle(mouse.x,mouse.y,'grey',true,10);
    //add a plus to make it look like a screw
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
function drawEnemyRooms(){
    let tileSize = 28;
    let pos = new newPoint(100,100);
    pos = offSetByCam(pos);
    ctx.drawImage(tileImages[0],pos.x,pos.y);
    ctx.drawImage(tileImages[2],pos.x+tileSize,pos.y);
    ctx.drawImage(tileImages[6],pos.x,pos.y+tileSize);
    ctx.drawImage(tileImages[8],pos.x+tileSize,pos.y+tileSize);
}