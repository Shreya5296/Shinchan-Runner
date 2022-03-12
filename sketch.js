var background1, backgroundImg;
var ground, groundImg;
var shinchan, shinImg;
var cry, cryImg;
var a_kamen, a_kamenImg;
var chips, chipsImg;
var mom, momImg;
var invisibleGround;
var music;
var momG,chipsG,kamenG;
var gameovr,gameovrImg,restart,restartImg;
var sound1, win, loose;

start = 1;
play = 2;
end = 0;

var score = 0;
var gameState = "start";

function preload() {
  
  backgroundImg = loadImage("start.png");
  groundImg = loadImage("ground.png");
  shinImg = loadAnimation("walk1.png", "walk2.png", "walk3.png", "walk4.png");
  a_kamenImg = loadImage("action_kamen.png");
  chipsImg = loadImage("choco_chip.png");
  momImg = loadImage("mom.png");
  cryImg = loadAnimation("go1.png","go2.png","go3.png","go4.png","go5.png");
  
  gameovrImg = loadImage("gameOver1.png");
  
  restartImg = loadImage("restart.png");
  
  sound1 = loadSound("Shinchan message.mp3");
  
  music = loadSound("backgroundMusic.mp3");
  music.setVolume(0.3);
  
  win = loadSound("shinchan_ooh.mp3");
  win.setVolume(1.5);
  
  loose = loadSound("loose.mp3");
  
  momG = new Group();
  chipsG = new Group();
  kamenG = new Group();
}

function setup() {
  createCanvas(600, 500);

  background1 = createSprite(300, 250, 600, 500);
  background1.addImage("StartImg", backgroundImg);

  ground = createSprite(300, 250, 600, 500);
  ground.addImage("groundImg", groundImg);
  ground.visible = false;

  invisibleGround = createSprite(400, 450, 1000, 10);
  invisibleGround.visible = false;

  shinchan = createSprite(90, 420, 50, 80);
  shinchan.addAnimation("shinchan", shinImg);
  shinchan.scale = 1.5;
  shinchan.visible = false;
  
  cry = createSprite(250,420,50,80);
  cry.addAnimation("crying",cryImg);
  cry.scale=0.3;
  cry.visible = false;
  
  gameOvr = createSprite(300,160,250,250);
  gameOvr.addImage("Gameovr",gameovrImg);
  gameOvr.scale = 1.6;
  gameOvr.visible = false;
  
  restart = createSprite(300,300,20,20);
  restart.addImage("Restart",restartImg);
  restart.scale = 0.2;
  restart.visible = false;
  
}

function draw() {
  background(220);
  drawSprites();

  if (gameState == "start") {
    textSize(22);
    fill("black");
    stroke("orange");
    strokeWeight(10);
    text("Press Enter to Start the game", 190, 490);
    
    text("Catch choco chips and action kamen",160,40);
    text("press space to escape mom",200,70);

    if (keyDown("Enter")) {
      sound1.play();
      gameState = "play";
    }
  }

  if (gameState == "play") {
    if(!sound1.isPlaying() && !music.isPlaying()){
      music.play();
    }  
    if (ground.x < 90) {
      ground.x = ground.width / 2;
    }
    
    if (keyDown("space")) {
      shinchan.velocityY = -15;
    }
    
    shinchan.velocityY = shinchan.velocityY + 0.8;
    shinchan.collide(invisibleGround);
    
    shinchan.setCollider("circle",-20,20,20);
    shinchan.debug=false;
    
    spawnMom();
    var r = Math.round(random(1, 2));
    if (World.frameCount % 100 == 0) {
      if (r == 1) {
        spawnA_kamen();
      } else {
        spawnChips();
      }
    }
      
    if(shinchan.isTouching(chipsG)){
      score = score + 5;
      win.play();
      chipsG.destroyEach();
    }
    else if(shinchan.isTouching(kamenG)){
      score = score + 10;
      win.play();
      kamenG.destroyEach();
    }
    else if(shinchan.isTouching(momG)){
      gameState = "end";
    }

    textSize(22);
    fill("blue");
    stroke("cyan");
    strokeWeight(10);
    text("Score : " + score, 450, 40);

    background1.visible = false;
    ground.visible = true;
    shinchan.visible = true;
    ground.velocityX = -(6 + 3*score/100);
  }
  
  if(gameState==="end"){
    music.stop();
    
    if(!loose.isPlaying()){
      loose.play();
    }
    ground.velocityX = 0;
    invisibleGround.velocityX = 0;
    
    shinchan.velocityY = 0;
    shinchan.visible = false;
    cry.visible = true;
    gameOvr.visible = true;
    restart.visible = true;
    
    
    momG.setVelocityXEach(0);
    chipsG.setVelocityXEach(0);
    kamenG.setVelocityXEach(0);
    
    chipsG.setLifetimeEach(-1);
    kamenG.setLifetimeEach(-1);
    momG.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
   }
}

function spawnMom() {
  if (World.frameCount % 80 == 0) {
    mom = createSprite(550, 350, 10, 10);
    mom.addImage(momImg);
    mom.velocityX = -(10 + 3*score/100);
    mom.lifetime = 150;
    mom.scale = 0.25;

    momG.add(mom);
  }
}

function spawnA_kamen() {
  a_kamen = createSprite(550, 350, 10, 10);
  a_kamen.addImage(a_kamenImg);
  a_kamen.velocityX = -(7 + 3*score/100);
  a_kamen.lifetime = 150;
  a_kamen.scale = 0.7;
  
  kamenG.add(a_kamen);
}

function spawnChips() {
  chips = createSprite(550, 400, 10, 10);
  chips.addImage(chipsImg);
  chips.velocityX = -(7 + 3*score/100);
  chips.lifetime = 150;
  chips.scale = 0.2;
  
  chipsG.add(chips);
}

function reset(){
  gameState = "start";
  gameOvr.visible = false;
  restart.visible = false;
  
  momG.destroyEach();
  chipsG.destroyEach();
  kamenG.destroyEach();
  
  shinchan.changeAnimation("shinchan",shinImg);
  cry.visible = false;
  background1.visible = true;
  ground.visible = false;
 
  
  score = 0;
  
}
