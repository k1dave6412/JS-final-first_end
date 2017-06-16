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

//aiming
var aimingImg = document.createElement("img");
aimingImg.src = "images/crosshair.png"

// building button
var buildImg = document.createElement("img");
buildImg.src = "images/tower-btn.png"

// Tower
var towerImg = document.createElement("img");
towerImg.src = "images/tower.png";


// enemy class
function Enemy() {
    this.x = 32 * 3;
    this.y = 480 - 32;
    this.HP = 10 * Hard;

    this.pathDes = 0;
    this.speedX = 0;
    this.speedY = -64 * Hard;
    this.move = function() {
        if (isCollided(this.x, this.y, enemyPath[this.pathDes].x, enemyPath[this.pathDes].y, 64 * Hard / FPS, 64 * Hard / FPS)) {
            this.pathDes += 1;
            if (this.pathDes !== enemyPath.length) {

                if (enemyPath[this.pathDes].x > enemyPath[this.pathDes - 1].x) {
                    this.speedX = 64 * Hard;
                    this.speedY = 0;
                } else if (enemyPath[this.pathDes].x < enemyPath[this.pathDes - 1].x) {
                    this.speedX = -64 * Hard;
                    this.speedY = 0;
                } else if (enemyPath[this.pathDes].y > enemyPath[this.pathDes - 1].y) {
                    this.speedX = 0;
                    this.speedY = 64 * Hard;
                } else {
                    this.speedX = 0;
                    this.speedY = -64 * Hard;
                }
            } else {
                this.HP = 0;
                this.speedX = 0;
                this.speedY = 0;
            }
        }
        this.x += this.speedX / FPS;
        this.y += this.speedY / FPS;
    };
};

var enemies = [];

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

// tower Class
function Tower() {
    this.x = 0;
    this.y = 0;
    this.range = 96;
    this.aimingEnemyId = null;
    this.searchEnemy = function() {
            this.CD -= 1 / FPS;

            for (var i = 0; i < enemies.length; i++) {
                var distance = Math.sqrt(
                    Math.pow(this.x - enemies[i].x, 2) + Math.pow(this.y - enemies[i].y, 2)
                );
                if (distance <= this.range) {
                    this.aimingEnemyId = i;
                    if (this.CD <= 0) {
                        this.shoot();
                        this.CD = this.fireRate;
                    }
                    return;
                }
            }

            this.aimingEnemyId = null;
        },
        this.shoot = function() {
            var id = this.aimingEnemyId;

            //draw line
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(enemies[id].x, enemies[id].y);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();

            enemies[id].HP -= this.damage;
        };
    this.fireRate = 1;
    this.CD = 1;
    this.damage = 5;
}
var tower = new Tower();
var towers = [];

// isBuilding
var isBuilding = false;

// FPS 
var FPS = 60;

//clocks
var clocks = 0;

//HP, Score, Money
var HP = 100;
var Score = 0;
var Money = 10;
ctx.font = "36px Arial";
ctx.fillStyle = "white";

//Hard
var Hard = 1;

//gameover score
var gameover = canvas.getContext("2d");
var yourscore = canvas.getContext("2d");
gameover.font = "72px Arial";
yourscore.font = "36px Arial";
gameover.fillStyle = "white";
yourscore.fillStyle = "white";


function draw() {
    clocks++;
    ctx.drawImage(bgImg, 0, 0);
    ctx.drawImage(characterImg, 640 - 32, 480 - 32 * 3);
    ctx.drawImage(buildImg, 640 - 32 * 2, 480 - 32 * 2, 32 * 2, 32 * 2);

    if (isBuilding) {
        ctx.drawImage(towerImg, cursor.x, cursor.y)
    }

    for (var i = 0; i < towers.length; i++) {
        ctx.drawImage(towerImg, towers[i].x, towers[i].y)
        towers[i].searchEnemy();
    }

    // move and draw all enemies
    for (var i = 0; i < enemies.length; i++) {
        //HP-10 if enemies arrived
        if (enemies[i].HP <= 0) {
            if (enemies[i].pathDes == enemyPath.length) {
                HP = HP - 10;
            } else {
                Score += 10 * Hard;
                Money += 10 * Hard;
            }
            enemies.splice(i, 1);
        } else {
            ctx.drawImage(enemyImg, enemies[i].x, enemies[i].y);
            enemies[i].move();
        }
    };

    // produce enemy per 80 ticks
    if (clocks % 80 == 0) {
        var newEnemy = new Enemy();
        enemies.push(newEnemy);
    }

    if (clocks % 160 * Hard == 0) {
        Hard++;
    }


    //HP ,Score, Money TEXT
    ctx.fillText("HP: " + HP, 15 + 0, 15 + 0 + 36);
    ctx.fillText("Score: " + Score, 15 + 0, 15 + 0 + 36 + 36);
    ctx.fillText("Money: " + Money, 15 + 0, 15 + 0 + 36 + 36 + 36);

    //aimingEnemy

    if (tower.aimingEnemyId != null) {
        var id = tower.aimingEnemyId;
        ctx.drawImage(aimingImg, enemies[id].x, enemies[id].y);
    }

    if (HP <= 0) {
        clearInterval(intervalID);
        gameover.fillText("GAMEOVER", 320, 240);
        yourscore.fillText("You got " + Score, 320 + 32, 240 + 32);
    }

}

// delay loading
setTimeout(draw, 100);
// repeat loading
var intervalID = setInterval(draw, 1000 / FPS);

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
            if (Money >= 10) {
                var newTower = new Tower();
                newTower.x = cursor.x;
                newTower.y = cursor.y;
                towers.push(newTower);
                isBuilding = false;
                Money -= 10;
            }
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