let explosionImages = [new Image(),new Image(),new Image(),new Image()];
for (let i=0;i<4;i++){
    explosionImages[i].src='Explosion_Frames/Explosion_'+(i+1)+'.png';
}
let playerImages = {
    back:new Image(),
    front:new Image(),
    left:new Image(),
    right:new Image(),
    imagesList:null,
    chargingList:[new Image(),new Image(),new Image(),new Image(),new Image(),new Image()],
}
for (let i=0;i<6;i++){
    playerImages.chargingList[i].src = 'Player_Images/Player_Charging_'+(-(i-6))+'.png';
}
playerImages.front.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.right.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.left.src = 'Player_Images/Player_front_V2_cropped.png';
playerImages.back.src = 'Player_Images/Player_front_V2_cropped.png';

let enemyImages = {
    nonMoving:[],
    nonMovingOffset:[],//array of points that the image uses to aline itself
}
for (let i=0;i<8;i++){
    enemyImages.nonMoving.push(new Image());
    enemyImages.nonMoving[i].src = 'Enemy_Images/Non_Moving/'+i+'.png';
}
enemyImages.nonMovingOffset[0] = new newPoint(-4,0)
enemyImages.nonMovingOffset[1] = new newPoint(-4,0)
enemyImages.nonMovingOffset[2] = new newPoint(-4,0)
enemyImages.nonMovingOffset[3] = new newPoint(-4,0)
enemyImages.nonMovingOffset[4] = new newPoint(-4,0)
enemyImages.nonMovingOffset[5] = new newPoint(-9,0)
enemyImages.nonMovingOffset[6] = new newPoint(-12,0)
enemyImages.nonMovingOffset[7] = new newPoint(-7,0)
let tileImages = [
    new Image(),new Image(),new Image(), //organized into 3 by 3 grid of box of tiles(plus 2 extra images)
    new Image(),new Image(),new Image(),
    new Image(),new Image(),new Image(),
    new Image(),            new Image(),
]
/*tileImages[0].src = 'Tile_Images/Left_Top_Open.png';
tileImages[3].src = 'Tile_Images/Left_No_Open.png';
tileImages[6].src = 'Tile_Images/Left_Bottom_Open.png';
tileImages[9].src = 'Tile_Images/Left_Open.png';
tileImages[1].src = 'Tile_Images/Top.png';
tileImages[7].src = 'Tile_Images/Bottom.png';
tileImages[4].src = 'Tile_Images/Bricks.png'; //middle
tileImages[2].src = 'Tile_Images/Right_Top_Open.png';
tileImages[5].src = 'Tile_Images/Right_No_Open.png';
tileImages[8].src = 'Tile_Images/Right_Bottom_Open.png';
tileImages[10].src = 'Tile_Images/Right_Open.png';*/
let wallImage = new Image();
wallImage.src = 'Tile_Images/Wall_Bricks.png';
let aboveWallImage = new Image();
aboveWallImage.src = 'Tile_Images/Above_Wall_Area.png';
let aboveWallHorizontalDivider = new Image();
aboveWallHorizontalDivider.src = 'Tile_Images/Above_Wall_Horizontal_Divider.png';
let aboveWallVerticalDivider = new Image();
aboveWallVerticalDivider.src = 'Tile_Images/Above_Wall_Vertical_Divider.png';
tileImages[0].src = 'Tile_Images/Floor_Bricks.png';
tileImages[1] = wallImage;
tileImages[2] = aboveWallImage;
tileImages[3] = aboveWallHorizontalDivider;
tileImages[4] = aboveWallVerticalDivider;
tileImages[5].src = 'Tile_Images/Gradient_Up.png';
tileImages[6].src = 'Tile_Images/Gradient_Right.png';
tileImages[7].src = 'Tile_Images/Gradient_Down.png';
tileImages[8].src = 'Tile_Images/Gradient_Left.png';
tileImages[9].src = 'Tile_Images/Floor_Bricks.png'; //placeholder
tileImages[10].src = 'Tile_Images/Floor_Bricks.png';

let bulletImage=new Image();
bulletImage.src='Bullet_test.png';
playerImages.imagesList=[playerImages.front,playerImages.right,playerImages.back,playerImages.left];
let powerUpIconImage = new Image();
powerUpIconImage.src = 'powerUpIcon.png';
let bombImage = new Image();
bombImage.src = 'Bomb.png';
let shopImage = new Image();
shopImage.src = 'Shop.png';
let soulImage = new Image();
soulImage.src = 'Soul.png';
let creditCardImage = new Image();
creditCardImage.src = 'Credit_Card.png';
let portalImage = new Image();
portalImage.src = 'Portal.png';
