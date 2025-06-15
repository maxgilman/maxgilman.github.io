const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
document.addEventListener('contextmenu', event => {
    event.preventDefault();
});//this stops right clicking from opening the right click menu
document.onmousemove = handleMouseMove;
class newPoint {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}
let mouse = new newPoint(0,0);
function handleMouseMove(event) {
    let eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}
let buttonsArray = [false, false, false, false, false, false, false, false, false];//0 is left click, 1 is middle click, and 2 is right click
let mousePressed = false;
let mouseClickUsed = false;
document.onmousedown = function(e) {
    buttonsArray[e.button] = true;
    mousePressed = true;
    if (e.button===2){
        //if there is a context menu open, uncomment this code
        //keys=[];
        //mousePressed=false;
    }
    if (e.button===2){
        mouseClickUsed=!mouseClickUsed;
    }
}
document.onmouseup = function(e) {
    buttonsArray[e.button] = false;
    mousePressed = false;
};
let keys = {};
let keysUsed = {};
document.addEventListener('keydown', (event) => {
    //remember when using this to set the thing to false after used
    let keyPressed = event.key.toLowerCase();
    if (!keys[keyPressed]){
        keysUsed[keyPressed] = true;
    }
    keys[keyPressed]=true;
});
document.addEventListener('keyup', (event) => {
    let keyPressed = event.key.toLowerCase();
    keys[keyPressed]=false;
});
function findDis(point1,point2){
    return Math.sqrt(Math.pow((point1.x-point2.x),2)+Math.pow((point1.y-point2.y),2))
}
let curves = [];
let points = [
    new newPoint(80,700),
    new newPoint(82,650),
    new newPoint(111,625),
    new newPoint(135,630),
];
let start = points[0];
let cp1 = points[1];
let cp2 = points[2];
let end = points[3];
curves.push({
    start: start,
    end: end,
    cp1: cp1,
    cp2: cp2,
})

let range = new newPoint(end.x-start.x,end.y-start.y);

/*for (let i=0;i<20;i++){
    curves.push({
        start: new newPoint(start.x,start.y),
        end: mouse,
        cp1: new newPoint(start.x+range.x*Math.random(),start.y+range.y*Math.random()),
        cp2: new newPoint(start.x+range.x*Math.random(),start.y+range.y*Math.random()),
    })
}*/
let imageHeight = 80*4;
ctx.strokeStyle='aqua';
ctx.lineWidth=5;
function lerp(a,b,t){
    return (1-t)*a+t*b;
}
function lerpV2(a,b,t){
    return { x: lerp(a.x,b.x,t), y: lerp(a.y,b.y,t) };
}
function drawCurve(){
    /*for (curve of curves){
        ctx.beginPath();
        ctx.moveTo(curve.start.x,curve.start.y);
        //let lerped = lerpV2(curve.start,curve.end,.2);
        //ctx.lineTo(lerped.x,lerped.y);
        ctx.bezierCurveTo(curve.cp1.x, curve.cp1.y, curve.cp2.x, curve.cp2.y, curve.end.x, curve.end.y);
        ctx.stroke();
    }*/
    /*if (!mouseClickUsed){
        //ctx.drawImage(UIImage,0,c.height-imageHeight,imageHeight*5,imageHeight);
    }*/
    // Cubic Bézier curve
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();

    // Start and end points
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI); // Start point
    ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI); // End point
    ctx.fill();

    // Control points
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cp1.x, cp1.y, 5, 0, 2 * Math.PI); // Control point one
    ctx.arc(cp2.x, cp2.y, 5, 0, 2 * Math.PI); // Control point two
    ctx.fill();
}
function mousePoints(){
    for (curve of curves){
        for (let i=0;i<4;i++){
            let pos;
            switch (i){
                case 0:
                    pos=curve.start;
                break
                case 1:
                    pos=curve.cp1;
                break
                case 2:
                    pos=curve.cp2;
                break
                case 3:
                    pos=curve.end;
                break
            }
            if (pos.direction===undefined){
                pos.direction=1;
            }
            if (keys['w']){
                pos.y-=20;
            }if (keys['s']){
                pos.y+=20;
            }
            if (keys['a']){
                pos.x-=20;
            }if (keys['d']){
                pos.x+=20;
            }
            if (mousePressed){
                if (findDis(mouse,pos)<50){
                    pos.x=mouse.x;
                    pos.y=mouse.y;
                    return;
                }
            }   
        }
    }
    /*for (curve of curves){
        for (let i=1;i<3;i++){
            let pos;
            switch (i){
                case 1:
                    pos=curve.cp1;
                break
                case 2:
                    pos=curve.cp2;
                break
            }
            if (!keys['o']){
                pos.x+=10*pos.direction;
            }
            if (Math.random()>.9){
                pos.direction*=Math.max(Math.random(),.5)*2;
            }
            if (pos.x<curve.start.x){
                pos.x=curve.start.x;
                pos.direction=Math.max(Math.random(),.25);
                
            }else if (pos.x>curve.end.x){
                pos.x=curve.end.x;
                pos.direction=-Math.max(Math.random(),.25)
            }
        }
    }*/
}
let frameCount = 0;
let dashs = [];
for (let i=0; i<5;i++){
    dashs.push(0,0,Math.floor(Math.random()*100));
}
function repeat(){
    frameCount++;
    ctx.clearRect(0,0,c.width,c.height);
    /*if ((frameCount%10)===0){
        if (dashs.length>5){
            dashs.pop();
            //console.log(dashs);
            dashs[0]=dashs[0]+1;
        }
        ctx.setLineDash(dashs);
    }*/
    mousePoints();
    drawCurve();

    if (keysUsed['e']){
        keysUsed['e']=false;
        imageHeight/=2;
        for (pos of points){
            pos.x=pos.x+((0-pos.x)/2);
            pos.y=pos.y+((c.height-pos.y)/2);
        }
        console.log(points);
        console.log(JSON.stringify(points));
    }
}
setInterval(repeat,33/2);