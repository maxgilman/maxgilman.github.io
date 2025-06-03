function findHCost(HTarget,pos){
    return Math.abs(HTarget.x-pos.x)+Math.abs(HTarget.y-pos.y)
}
function pivotArray(arr,lowerBound,upperBound){
    //lower is inclusive, upper is exclusive
    let pivot = upperBound-1;
    let switchSpot = lowerBound;
    for (let checker=lowerBound;checker<upperBound;checker++){
        //change so it comparess fCost of both
        if (arr[checker].fCost<=arr[pivot].fCost){
            //this is so when both fCost is the same, it prioritizes making progress closer to the target
            if (arr[checker].fCost===arr[pivot].fCost){
                if (checker!=pivot){
                    if (arr[checker].hCost<=arr[pivot].hCost){
                        const holder = arr[checker];
                        arr[checker] = arr[switchSpot];
                        arr[switchSpot] = holder;
                        switchSpot++;
                    }
                }
            }else{
                const holder = arr[checker];
                arr[checker] = arr[switchSpot];
                arr[switchSpot] = holder;
                switchSpot++;
            }
        }
    }
    /*if (switchSpot!=lowerBound){
        switchSpot++;
    }*/
    /*if (switchSpot=upperBound){
        switchSpot--;
    }*/
    const holder = arr[pivot];
    arr[pivot] = arr[switchSpot];
    arr[switchSpot] = holder;
    return {
        pivot:switchSpot,
        returnedArray:arr
    }
}
function recursive(arr,lowerBound,upperBound){
    //this case means the list is 1 or 0 long and is already sorted by defenition
    if (upperBound-lowerBound<2){
        return arr
    }else{
        const pivot = pivotArray(arr,lowerBound,upperBound);
        recursive(arr,lowerBound,pivot.pivot);
        recursive(arr,pivot.pivot,upperBound);
    }
}
function quickSort(arr){
    recursive(arr,0,arr.length);
    return arr
}
function checkSorted(arr){
    let i =0;
    let lastItem = -Infinity;
    for (item in arr){
        if(item.fCost<lastItem){
            console.log(i+' messed up')
        }
        if (item.fCost!=item.gCost+item.hCost){
            console.log({...item});
        }
        i++
    }
}
function updatePFBoxes(startingPoint,enemy,enemyRoom){
    let target = floorPoint(enemy,boxSize);
    //let startInWall = false;
    //unfinished code
    /*if (wallBoxes.find((element) => element.x===PFBoxes[0].x&&element.y===PFBoxes[0].y)!=undefined){
        startInWall = true;
    }*/
    for (box of enemyRoom.wallBoxes){
        if (isSamePoint(target,box)){
            return
        }
    }
    for (box of PFBoxes){
        box.hCost=findHCost(target,box);
        box.fCost=box.hCost+box.gCost;
        if (isSamePoint(target,box)/*&&!box.inOpenList*/){
            return
        }
    }
    quickSort(PFBoxes);
    let done = 0;
    while (done<200){
        done++
        /*if (findDis(target,start)>500){
            //If the target is far away, don"t even bother trying to navigate to it.
            break
        }*/
        let i = 0;
        let current2Point = null;
        //This finds the first box in the list thats in the open list
        do {
            current2Point = PFBoxes[i];
            i++;
            //if there are no more boxes to check, there is no path to the goal
            if (current2Point === undefined){
                break
            }
        }while(current2Point.inOpenList===false)
        if (current2Point === undefined){
            break
        }
        current2Point.inOpenList=false;
        for (let i = 0;i<4;i++){
            //this clones the item to avoid shananagins
            let currentPoint = {...current2Point};
            switch (i){
                case 0: currentPoint.x+=boxSize;
                break;
                case 1: currentPoint.y+=boxSize;
                break;
                case 2: currentPoint.x-=boxSize;
                break;
                case 3: currentPoint.y-=boxSize;
                break;
            }
            //check the object is not in a wall, if not, continue
            if (enemyRoom.wallBoxes.find((element) => isSamePoint(element,currentPoint))===undefined){
                //check if it's already in the list
                currentPoint.gCost+=boxSize;
                currentPoint.hCost = findHCost(target,currentPoint);
                currentPoint.fCost = currentPoint.gCost+currentPoint.hCost;
                currentPoint.inOpenList=true;
                currentPoint.parent = new newPoint (current2Point.x,current2Point.y);
                if ((PFBoxes.find((element) => isSamePoint(element,currentPoint))===undefined)&&sameRoomPos(turnIntoRoomPos(currentPoint),enemyRoom)){
                    //add it to the list
                    addPFBox(currentPoint);
                }else{
                    //this checks if the pathfinding algoritm has found a faster way to get to that box
                    let oldBoxIndex = PFBoxes.findIndex((element) => isSamePoint(element,currentPoint)&&element.gCost>currentPoint.gCost);

                    if (oldBoxIndex!=-1){
                        PFBoxes.splice(oldBoxIndex,1);
                        addPFBox(currentPoint);
                    }
                }
            }
        }
        //if found target, break
        if (isSamePoint(target,current2Point)){
            break
        }
    }
    if (done>99){
        //console.log('never found');
    }
}
function addPFBox(PFBox){
    let posInList = PFBoxes.find((element) => element.fCost>PFBox.fCost);
    if (posInList===undefined){
        PFBoxes.push(PFBox);
    }else{
        PFBoxes.splice(posInList,0,PFBox);
    }
    quickSort(PFBoxes);
}