// Html img element
var bgImg = document.createElement("img");
bgImg.src = "images/map.png";

// find canvas in html
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// character jason
var characterImg = document.createElement("img");
characterImg.src = "images/jason.gif"

// enemy
var enemyImg = document.createElement("img");
enemyImg.src = "images/slime.gif"

// building button
var buildImg = document.createElement("img");
buildImg.src = "images/tower-btn.png"

// Tower
var towerImg = document.createElement("img");
towerImg.src = "images/tower.png";


// enemy objects
var enemy = {
    x: 32 * 3,
    y: 480 - 32,

    pathDes: 0,
    speedX: 0,
    speedY: -64,
    move: function move() {
        if (isCollided(this.x, this.y, enemyPath[this.pathDes].x, enemyPath[this.pathDes].y, 64 / FPS, 64 / FPS)) {
            this.pathDes += 1;
            if (this.pathDes !== enemyPath.length) {

                if (enemyPath[this.pathDes].x > enemyPath[this.pathDes - 1].x) {
                    this.speedX = 64;
                    this.speedY = 0;
                } else if (enemyPath[this.pathDes].x < enemyPath[this.pathDes - 1].x) {
                    this.speedX = -64;
                    this.speedY = 0;
                } else if (enemyPath[this.pathDes].y > enemyPath[this.pathDes - 1].y) {
                    this.speedX = 0;
                    this.speedY = 64;
                } else {
                    this.speedX = 0;
                    this.speedY = -64;
                }
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
        }
        this.x += this.speedX / FPS;
        this.y += this.speedY / FPS;
    },
};

// enemy nav arrays
var enemyPath = [
    { x: 32 * 3, y: 32 * 2 },
    { x: 32 * 12, y: 32 * 2 },
    { x: 32 * 12, y: 32 * 6 },
    { x: 32 * 7, y: 32 * 6 },
    { x: 32 * 7, y: 32 * 10 },
    { x: 32 * 17, y: 32 * 10 },
    { x: 32 * 17, y: 32 * 3 },
]

// cursor get
var cursor = {
    x: 0,
    y: 0,
}

// tower cursor
var tower = {
    x: 0,
    y: 0,
}

// isBuilding
var isBuilding = false;

// FPS 
var FPS = 24;


function draw() {
    ctx.drawImage(bgImg, 0, 0);
    ctx.drawImage(characterImg, 640 - 32, 480 - 32 * 3);
    ctx.drawImage(enemyImg, enemy.x, enemy.y);
    ctx.drawImage(buildImg, 640 - 32 * 2, 480 - 32 * 2, 32 * 2, 32 * 2);

    if (isBuilding) {
        ctx.drawImage(towerImg, cursor.x, cursor.y)
    } else {
        ctx.drawImage(towerImg, tower.x, tower.y)
    }

    enemy.move();
}

// delay loading
setTimeout(draw, 100);
// repeat loading
setInterval(draw, 1000 / FPS);

//get cursor on canvas
$("#canvas").on("mousemove",
    function(event) {
        if (isBuilding) {
            cursor.x = event.offsetX - event.offsetX % 32;
            cursor.y = event.offsetY - event.offsetY % 32;
        }
    }
);

//judge click on buildingImg
$("#canvas").on("click",
    function(event) {
        if (event.offsetX > 640 - 32 * 2 && event.offsetY > 480 - 32 * 2) {
            isBuilding = !isBuilding;
        } else if (isBuilding) {
            tower.x = cursor.x;
            tower.y = cursor.y;
            isBuilding = false;
        }
    }
);

// collieded?
function isCollided(pointX, pointY, targetX, targetY, targetWidth, targetHeight) {
    if (pointX >= targetX &&
        pointX <= targetX + targetWidth &&
        pointY >= targetY &&
        pointY <= targetY + targetHeight
    ) {
        return true;
    } else {
        return false;
    }
}




/* 
canvas drawImg:
ctx.drawImage(img, x, y, width, height) 

mouse offset in target:
$("#target").on("mousemove",
    function(event) {
        console.log("x: " + event.offsetX + ",y: " + event.offsetY)
    }
);
$("#target").on("click",
    function(event) {
        console.log("x: " + event.offsetX + ",y: " + event.offsetY)
    }
);
*/