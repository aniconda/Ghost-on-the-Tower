var towerImg, tower;
var doorImg, doorsGroup;
var climberImg, climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup;
var restart, gameOver;
var gameOverSound;
var gameState = "play";

//loading images
function preload(){
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadImage("ghost-standing.png");
  gameOverSound = loadSound("mixkit-arcade-retro-game-over-213.wav");
  gameOverImg = loadImage("game-over.png");
  restartImg = loadImage("reset.png");
}

function setup() {
  createCanvas(600, 600);
 // creating the tower sprite
  tower = createSprite(300,300);
  tower.addImage("tower",towerImg);
  tower.velocityY = 4;
 // creating the ghost sprite
  ghost = createSprite(200,200);
  ghost.addImage("ghost",ghostImg);
  ghost.scale = 0.5;
 
  ghost.setCollider('circle',0,0,100);

  gameOver = createSprite(width/2-25,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4

  restart = createSprite(275,500);
  restart.addImage(restartImg);
  restart.scale = 0.2

  climbersGroup = new Group();
  doorsGroup = new Group();
  invisibleBlockGroup = new Group();
}

function draw() {
  //ghost.debug = true;
  background(200);
  ghost.velocityY += 2;
  tower.velocityY = 4;
  
  if (gameState =="play") {
    gameOver.visible = false;
    restart.visible = false;
    if(keyDown("space")) {
    ghost.velocityY = -3.5;
    }
    if(keyDown(RIGHT)) {
    ghost.velocityX = 2;
    }
    if(keyDown(LEFT)) {
    ghost.velocityX = -2;
    }
    if(tower.y > 400){
      tower.y = 300;
    }
    spawnObstacles();
    if(invisibleBlockGroup.isTouching(ghost) || ghost.y > 600) {
      gameState = "end";
      gameOverSound.play();
    } 
    if(ghost.isTouching(climbersGroup)) {
      ghost.collide(climbersGroup);
      ghost.addAnimation("ghost", ghostImg);
    } 
    
 }
 else if (gameState == "end") {
  gameOver.visible = true;
  restart.visible = true;
  
  gameOver.depth = ghost.depth + 2;
  restart.depth = gameOver.depth + 1;
  
  //set velocity of each object to 0
  ghost.velocityY = 0;
  ghost.velocityX = 0;
  tower.velocityY = 0;
  doorsGroup.setVelocityYEach(0);
  climbersGroup.setVelocityYEach(0);
  invisibleBlockGroup.setVelocityYEach(0);
  //set lifetime of the objects so they're never destroyed
  doorsGroup.setLifetimeEach(-1);
  climbersGroup.setLifetimeEach(-1);
  invisibleBlockGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
 }
 drawSprites();
}



function spawnObstacles() {
  if (frameCount % 100 == 0) {
  var door = createSprite(200,-50);
  door.addImage(doorImg);
  door.velocityY = 4;

  var climber = createSprite(200,10);
  climber.addImage(climberImg);
  climber.velocityY = 4;

  var invisibleBlock = createSprite(200,50);
  invisibleBlock.width = climber.width;
  invisibleBlock.height = 2;
  invisibleBlock.velocityY = 4;
  invisibleBlock.visible = false;
  invisibleBlock.debug = true;
  door.x = Math.round(random(120,400));
  invisibleBlock.x = climber.x = door.x;
  
  door.lifetime = 800;
  climber.lifetime = 800;
  invisibleBlock.lifetime = 800;
  //adjusting depth
  ghost.depth = door.depth + 1;
  climber.depth = ghost.depth + 1;
 
  // add doors, climbers, and invisible blocks to their respective groups:
  doorsGroup.add(door);
  climbersGroup.add(climber);
  invisibleBlockGroup.add(invisibleBlock);
}
}
function reset() {
  doorsGroup.destroyEach();
  climbersGroup.destroyEach();
  invisibleBlockGroup.destroyEach();
  ghost.x = 200;
  ghost.y = 200;
  gameState = "play";
}

