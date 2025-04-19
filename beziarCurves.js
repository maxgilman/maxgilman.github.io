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
let firstTry = [{"x":2.3203125,"y":739.55859375},{"x":2.12109375,"y":631.6640625},{"x":1.3515625,"y":633.5625},{"x":1.19140625,"y":739.875}]

let points = [
    new newPoint(50,20),
    new newPoint(230,30),
    new newPoint(150,80),
    new newPoint(250,100),
];
//points=firstTry;
let start = points[0];
let cp1 = points[1];
let cp2 = points[2];
let end = points[3];

let imageHeight = 80*4;
function drawCurve(){
    if (!mouseClickUsed){
        //ctx.drawImage(UIImage,0,c.height-imageHeight,imageHeight*5,imageHeight);
    }
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
    for (pos of points){
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
function repeat(){
    ctx.clearRect(0,0,c.width,c.height);
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