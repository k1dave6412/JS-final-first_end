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

function draw() {
    ctx.drawImage(bgImg, 0, 0);
    ctx.drawImage(characterImg, 640 - 32, 480 - 32 * 3);
    ctx.drawImage(enemyImg, enemy.x, enemy.y);
    ctx.drawImage(buildImg, 640 - 32 * 2, 480 - 32 * 2, 32 * 2, 32 * 2);
}

// delay loading
setTimeout(draw, 100);
// repeat loading
setInterval(draw, 30)