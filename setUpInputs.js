let controller;
//c.style.cursor='none'
if (false){
    document.addEventListener("click", function () {
        document.body.requestPointerLock();
    });
}
/*c.addEventListener("click", async () => {
    if(!document.pointerLockElement) {
        try {
            await c.requestPointerLock({
            unadjustedMovement: true,
        });
        } catch (error) {
            if (error.name === "NotSupportedError") {
            // Some platforms may not support unadjusted movement.
            await c.requestPointerLock();
            } else {
            throw error;
            }
        }
    }
});*/
document.getElementById("spriteCanvas").addEventListener('contextmenu', event => {
    event.preventDefault();
});//this stops right clicking on the canvas from opening the right click menu(so i can still right click somewhere on the page)
document.addEventListener('contextmenu', event => {
    keys = {};
});
let keys = {};
let keysUsed = {};
let keysToggle = {};
document.addEventListener('keydown', (event) => {
    //remember when using this to set the thing to false after used
    let keyPressed = event.key.toLowerCase();
    if (!keys[keyPressed]){
        keysUsed[keyPressed] = true;
        keysToggle[keyPressed] = !keysToggle[keyPressed];
    }
    keys[keyPressed]=true;
});
document.addEventListener('keyup', (event) => {
    let keyPressed = event.key.toLowerCase();
    keys[keyPressed]=false;
});
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
    mouseClickUsed = true;
}
document.onmouseup = function(e) {
    buttonsArray[e.button] = false;
    mousePressed = false;
}
let mouse = new newPoint(0,0);
mouse.show=true;
let mouseShifted = dupPoint(mouse);
if (false){
    document.onmousemove = handleMouseMove;
}else{
    document.onmousemove = handleMouseMove1;
}
function handleMouseMove(event){
    if (controller===undefined){
        let multiplier = Math.min(3,Math.max(.5,findDis(new newPoint(0,0),new newPoint(event.movementX,event.movementY))));
        mouse.x+=event.movementX*multiplier/4;
        mouse.y+=event.movementY*multiplier/4;
    }else{
        //this is handled elsewhere
    }
}
function handleMouseMove1(event) {
    if (controller===undefined||true){
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
        mouse.x = event.pageX-30;
        mouse.y = event.pageY-40;
    }else{
        let axes = controller.axes;
        mouse.x+=axes[2]*2;
        mouse.y+=axes[3]*2;
    }
}


var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad; 
    var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);
    /*var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);*/
    var b = document.createElement("div");
    b.className = "buttons";
    for (var i=0; i<gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }
    d.appendChild(b);
    var a = document.createElement("div");
    a.className = "axes";
    for (i=0; i<gamepad.axes.length; i++) {
        e = document.createElement("meter");
        e.className = "axis";
        //e.id = "a" + i;
        e.setAttribute("min", "-1");
        e.setAttribute("max", "1");
        e.setAttribute("value", "0");
        e.innerHTML = i;
        a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById("start").style.display = "none";
    document.body.appendChild(d);
    rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}
function updateStatus() {
    controller = controllers[0];
    scangamepads();
    for (j in controllers) {
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");
        for (var i=0; i<controller.buttons.length; i++) {
        var b = buttons[i];
        var val = controller.buttons[i];
        var pressed = val == 1.0;
        var touched = false;
        if (typeof(val) == "object") {
            pressed = val.pressed;
            if ('touched' in val) {
            touched = val.touched;
            }
            val = val.value;
        }
        var pct = Math.round(val * 100) + "%";
        b.style.backgroundSize = pct + " " + pct;
        b.className = "button";
        if (pressed) {
            b.className += " pressed";
        }
        if (touched) {
            b.className += " touched";
        }
        }

        var axes = d.getElementsByClassName("axis");
        for (var i=0; i<controller.axes.length; i++) {
        var a = axes[i];
        a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
        a.setAttribute("value", controller.axes[i]);
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
        controllers[gamepads[i].index] = gamepads[i];
        }
    }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}