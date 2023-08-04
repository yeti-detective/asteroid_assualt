let myXPos = 250;
let myYPos = 400;
let enemyXPos;
let enemyYPos;
let lives = 3;
let score = 0;
let canShoot = true;
let gameEnded = false;
let gameStarted = false;
let SoundPlayed = false;


let ship_image;
let space_image;

let ballArray = []
let bulletArray = [];

function preload() {
     space_image = loadImage("images/space.png");
     ship_image = loadImage("images/ship1.png");
     asteroid_hit = loadSound("sounds/asteroid_hit.m4a");
     game_over = loadSound("sounds/game_over_sound.wav");
     ship_hit = loadSound("sounds/ship_hit.m4a");
     shoot_sound = loadSound("sounds/shoot_sound.m4a");
     win_sound = loadSound("sounds/win_sound.wav");
     gameplay_music = loadSound("sounds/gameplay_music.m4a");
     start_end_music = loadSound("sounds/start_end_music.m4a");
}

function setup() {
   createCanvas(500, 500);
   noStroke();

   for (let i = 0; i < 50; i++) {
       let temp = new Ball(random(0, 500), random(-500, -20), random(10, 255), random(25, 51), random(2, 5));
       ballArray.push(temp);
   }

   imageMode(CENTER);
   textAlign(LEFT, TOP);
   rectMode(CENTER);
}
//creates an asteroid with appropiate features
class Ball {
    constructor(enemyX, enemyY, color, size, speed) {
        this.enemyX = enemyX;
        this.enemyY = enemyY;
        this.colorValue = color;
        this.sizeValue = size;
        this.speedValue = speed;
    }
 }

class Bullet {
    constructor(bulletX, bulletY, r, g, b, speed, width, length) {
        this.bullX = bulletX
        this.bullY = bulletY
        this.rValue = r;
        this.gValue = g;
        this.bValue = b;
        this.bullsped = speed;
        this.bullwid = width;
        this.bullleng = length;
    }
    
}

function draw() { 
   image(space_image, 250, 250);
    
    if (!gameStarted) {
        beginGame();
      } 

    else if (!gameEnded) {
        gameLoop();
    } 

    else {
        endGame();
    }
}

function beginGame() {
    image(space_image, 250, 250);
    image(ship_image, 250, 400, 40, 40);
    if (!start_end_music.isPlaying()) {
        start_end_music.loop();
    }

    if (gameplay_music.isPlaying()) {
        gameplay_music.stop();
    }

    fill(0, 255, 255);
    textSize(45);
    textStyle(BOLDITALIC)
    text("ASTEROID ASSAULT", 16, 16);
    fill(0, 200, 255);
    text("ASTEROID ASSAULT", 18, 18);
    fill(0, 150, 255);
    text("ASTEROID ASSAULT", 20, 20);

    fill(255, 0, 100);
    textSize(20);
    textStyle(BOLD);
    text("Navigate the asteroid field!", 125, 90);
    fill(255, 255, 51)
    text("Use Spacebar to shoot asteroids", 95, 120);
    fill(0, 255, 100);
    text("Reach at least 5000 points to win!", 90, 150);
    textSize(15);
    text("(1 point awarded for every asteroid that passes by)", 72, 180);
    text("(10 points awarded for every asteroid destroyed)", 78, 200);
    fill(255);
    textSize(30);
    text("Click to Begin Game...", 95, 250);
    
}

function gameLoop() {
    // music
    if (!gameplay_music.isPlaying()) {
        gameplay_music.loop();
    }

    if (start_end_music.isPlaying()) {
        start_end_music.stop();
    }


    //asteroid creation
   for (let i = 0; i < ballArray.length; i++) {
    fill(ballArray[i].colorValue, ballArray[i].colorValue, ballArray[i].colorValue);
    ellipse(ballArray[i].enemyX, ballArray[i].enemyY, ballArray[i].sizeValue, ballArray[i].sizeValue);

    ballArray[i].enemyY += ballArray[i].speedValue;

    //if statement ensures endlessness and score increase
    if (ballArray[i].enemyY > 525) {
        ballArray[i].enemyY = -25;
        ballArray[i].enemyX = random(0,500);
        score++
    }
   }

   // makes sure the player can't hide outside of the canvas
   if (myXPos > 520) {
    myXPos = -15;
   }

   if (myXPos < -20) {
    myXPos = 515;
   }

   if (myYPos > 520) {
    myYPos = -15;
   }

   if (myYPos < -20) {
    myYPos = 515;
   }

   //positions of text
    fill(255, 255, 255);
    textSize(22);
    text("Lives: " + lives, 15, 15);
    text("Score: " + score, 14, 45,);

    //bullet creation
    if (keyIsDown(32) && canShoot == true && bulletArray.length < 1) {
        let boolet = new Bullet(myXPos - 2, myYPos - 28, 0, 255, 0, 5, 5, 20);
        bulletArray.push(boolet);
        shoot_sound.play();
        canShoot = false; 
    }

    if(!keyIsDown(32)) {
     canShoot = true;
    }
 

   fill(255, 0, 0);
   image(ship_image, myXPos, myYPos, 40, 40);
   //code that moves the ship accordingly to arrow keys
   if (keyIsDown(LEFT_ARROW)) {
       myXPos -= 3;
   }


   if (keyIsDown(RIGHT_ARROW)) {
       myXPos += 3;
   }


   if (keyIsDown(UP_ARROW)) {
       myYPos -= 3;
   }


   if (keyIsDown(DOWN_ARROW)) {
       myYPos += 3;
   }

   //Oh the bullets are my tears
   for (let i = 0; i < bulletArray.length; i++) {
      fill(bulletArray[i].rValue, bulletArray[i].gValue, bulletArray[i].bValue);
      rect(bulletArray[i].bullX, bulletArray[i].bullY, bulletArray[i].bullwid, bulletArray[i].bullleng)
      bulletArray[i].bullY -= bulletArray[i].bullsped; 
    }

    for (let i = bulletArray.length - 1; i >= 0; i--) {
        if (bulletArray[i].bullY < 0) {
          bulletArray.splice(i, 1);
        }
    }
    //bullet collision
    for (let i = 0; i < bulletArray.length; i++) {
        for (let j = 0; j < ballArray.length; j++) {
            if (dist(bulletArray[i].bullX, bulletArray[i].bullY, ballArray[j].enemyX, ballArray[j].enemyY) < ballArray[j].sizeValue / 2) {
                bulletArray.splice(i, 1);
                ballArray.splice(j, 1);
                asteroid_hit.play();

                score += 10;
                temp = new Ball(random(0, 500), random(-500, -20), random(10, 255), random(25, 51), random(2, 5));
                ballArray.push(temp);
                break;
            }
        }
    }

   //checks for collision (all credit goes to the oop_project extra credit)
   for (let i = 0; i < ballArray.length; i++) {
        if(dist(myXPos, myYPos, ballArray[i].enemyX, ballArray[i].enemyY) < ballArray[i].sizeValue / 2) {
            ballArray.splice(i, 1);
            lives--;
            ship_hit.play();
            temp = new Ball(random(0, 500), random(-500, -20), random(10, 255), random(25, 51), random(2, 5));
            ballArray.push(temp);
        }
    }

    if (lives <= 0) {
        gameEnded = true;
    }
}

function endGame() {
    image(space_image, 250, 250);
    
    if (!game_over.isPlaying() && !win_sound.isPlaying() && !SoundPlayed) {
        if (score < 5000) {
            game_over.play();
            SoundPlayed = true;
        }

        else { 
            win_sound.play();
            SoundPlayed = true;
        }
    }
    if (!start_end_music.isPlaying()) {
        start_end_music.loop();
    }

    if (gameplay_music.isPlaying()) {
        gameplay_music.stop();
    }

    if (score < 5000) {
        textSize(60);
        fill(255, 0 ,0);
        text("Game Over", 80, 50);
    }

    if (score >= 5000) {
        textSize(60);
        fill(0, 255 ,0);
        text("Congrats!!!", 90, 20);
        text("You Won!", 110, 90);
    }

    fill(255);
    textSize(30);
    text("Final Score: " + score, 130, 170);
    textSize(20);
    text("This game was brought to you by: ", 83, 450);
    text("Rahimin, AKM, Isaac, Leandro, and Cassius", 41, 470);
    // Draw the "Try Again" button
    fill(255, 0, 0);
    rect(250, 270, 120, 40);
    fill(255);
    textSize(18);
    text("Try Again?", 205, 260);
}

function resetGame() {
    lives = 3;
    score = 0;
    ballArray = [];
    gameEnded = false;
    gameStarted = false;
    for (let i = 0; i < 50; i++) {
        let temp = new Ball(random(0, 500), random(-500, -20), random(10, 255), random(25, 51), random(2, 5));
        ballArray.push(temp);
    }
}

function mouseClicked() {
    if (!gameStarted) {
        gameStarted = true;
    } else if (gameEnded && mouseX > 190 && mouseX < 310 && mouseY > 250 && mouseY <  290) {
        resetGame();
    }
}