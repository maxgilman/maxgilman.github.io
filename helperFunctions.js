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
/** is, "check," inside box specified by point 1 and 2. 'extra' makes the bounding box bigger by the specified amount*/
function boundingBox(point1,point2,check,extraX,extraY){
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
/**this function doesn't change the original point, rather it returns a new point*/
function bringPointIntoRange(point,maxDis){
    let angle = findAngle(point,new newPoint(0,0));
    let dis = Math.min(findDis(new newPoint(0,0),point),maxDis);
    return new newPoint(Math.sin(angle)*dis,Math.cos(angle)*dis);
}
/**Moves num up or down by increments of (max-min) until it's between max and min. Min is inclusive, max is exclusive*/
function bringNumIntoRange(num,min,max){
    let difference = max-min;
    while(num<min){
        num+=difference;
    }
    while(num>=max){
        num-=difference;
    }
    return num;
}
//let d = 50;
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
function randomPosInRoom(roomPos,borderSize){
    let realRoomPos = turnRoomIntoRealPos(roomPos);
    return new newPoint(realRoomPos.x+doorLength+borderSize+((roomWidth-(borderSize*2))*Math.random()),realRoomPos.y+doorLength+borderSize+((roomHeight-(borderSize*2))*Math.random()));
}
function isRoundNum(num){
    return Math.round(num)===num;
}
function minorPriceScaling(numGrabbed){ //this takes in the num of modifiers collected, then gives out a num. Its localized in a function to make adjusting easy
    return Math.pow(2,Math.pow(2,numGrabbed));
}