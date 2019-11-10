var W = 600;
var H = 1000;
var dy = -2;
var gravity = 1.7;
var maxspeed = 30; 
var ground = H;
var points = 0;

function startGame() {
  myGameArea.start();
  player = new Component(90, 140, "./images/white-lama.png", 250, 820);
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  myPlatforms: [],
  frames: 0,
  gameOver: false,
	drawCanvas: function() {
    this.canvas.width = W;
    this.canvas.height = H;
    this.context = this.canvas.getContext("2d");
    document.getElementById("game-board").append(this.canvas);
	},
	start: function() {
		this.drawCanvas();
		this.reqAnimation = window.requestAnimationFrame(updateGameArea);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

class Component {
    constructor(width, height, image, x, y) {
        this.image = new Image();
        this.image.src = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        
        this.hasJumped = false;
        this.hasTouchedFirstObstacle = false;
        this.vx = 0; // vitesse horizontale
        this.vy = 0; // vitesse verticale
    }
    jump() {
      this.vy = -30;
      this.hasJumped = true;
      this.hasTouchedFirstObstacle = true;
    }
    forward() {
      this.vx = 8;
    }
    backward() {
      this.vx = -8;
    }
    update() {

      // on limite la vitesse 
      if (this.vy > maxspeed) this.vy = maxspeed;

      // on met a jour la position via les vitesses
      this.x += this.vx;
      this.y += this.vy;
  
      // on empeche d'aller plus bas que le sol
      if (this.y > H - this.height) this.y = H - this.height;

    //
    // on créer le saut du player sur les plateformes
    //

    let closestPlatforms = myGameArea.myPlatforms;
    // On ne garde que les plateformes qui par projection chevauchent le player en x
    closestPlatforms = closestPlatforms.filter(platform => player.x + player.width > platform.x && player.x < platform.x + platform.width); // player chevauche la plate-forme en horizontal
    // On ne garde que les plateformes au dessous (ie: tant que pas entierement traversé)
    closestPlatforms = closestPlatforms.filter(platform => player.y <= platform.y + platform.height);
    // On trie de la plateforme la plus proche a la plus éloignée (du player)
    closestPlatforms.sort((a, b) => Math.abs(player.y+player.height - a.y) - Math.abs(player.y+player.height - b.y));

    if (closestPlatforms[0] && this.vy > 0 && player.y+player.height <= closestPlatforms[0].y + this.vy) {
      player.y = closestPlatforms[0].y - player.height;
    }
     // on empeche d'aller plus bas que le sol
     if (player.y + player.height > ground) {
      console.log('limit')
      player.y = ground - player.height;
      this.vy = 0;
    }

    // GAMEOVER
    if (player.y + player.height === ground && player.hasJumped) {
      myGameArea.gameOver = true;
      // afficher ton GOMenu
      showGoMenu();
    } 

      if (this.x > W) this.x = 0;
      if (this.x < -this.width) this.x = W;
      
      // la gravité s'applique
      this.vy += gravity;

    }
    draw() {
  
     myGameArea.context.drawImage(
       this.image,
       this.x,
       this.y,
       this.width,
       this.height
     );
      // this.y += -dy; //----> permet de faire défiler le jeu vers le bas    
  }
};  

const pressed = {
  space: false,
  arrowleft: false,
  arrowright: false
}

document.onkeydown = function (e) {
  switch (e.keyCode) {
    // SPACE
    case 32:
      if (pressed.space) return; // STOP si touche déja enfoncée
      pressed.up = true;
      
      player.jump(); // jump mario 🦘
      break;
    // LEFT
    case 37:
      if (pressed.arrowleft) return; // STOP si touche déja enfoncée
      pressed.arrowleft = true;
      
      player.backward(); // GO back
      break;
    // RIGHT
    case 39:
      if (pressed.arrowright) return; // STOP si touche déja enfoncée
      pressed.right = true;
      
      player.forward(); // GO ahead mario !!
      break;
  }
}

document.onkeyup = function (e) {
  switch (e.keyCode) {
    // SPACE
    case 32:
      // on "libère" l'etat d'enfoncement de la touche
      pressed.space = false; 
      break;
    // ARROWLEFT
    case 37:
      // on "libère" l'etat d'enfoncement de la touche
      pressed.arrowleft = false; 
      
      // on annule la vitesse horizontale
      player.vx = 0; 
      break;
    // ARROWRIGHT
    case 39:
      // on "libère" l'etat d'enfoncement de la touche
      pressed.arrowright = false;
      
      // on annule la vitesse horizontale
      player.vx = 0; 
      break;
  }
};

function reset(){
  document.location.reload(true);
}

function score() {
  myGameArea.context.font = "35px Montserrat";
  myGameArea.context.textAlign = "right";
  myGameArea.context.fillStyle = "orange";
  myGameArea.context.fillText(`${points} pts`, W-10, 35);
}

function updateScore() {
  var scoreText = document.getElementById("score");
  scoreText.innerHTML = score;
}

function showGoMenu(){
  document.getElementById("game-intro").style.display = "none";
  document.getElementById("game-board").style.display = "none";
  document.getElementById("gameOverMenu").style.display = "block";

  var scoreText = document.getElementById("go_score");
  scoreText.innerHTML = "Your final score : " + points;
}

//afficher score
function hideScore() {
	var menu = document.getElementById("scoreBoard");
  menu.style.zIndex = -1;
  menu.style.visibility = "hidden";
}

// Boucle d'anim, exécutée toutes les 16ms
function updateGameArea() {
    //console.log('tick')
    myGameArea.frames += 1;

    myGameArea.clear();
    

    //
    // Obstacle toutes les 120frames
    //

    if (myGameArea.frames % 100 === 0) {
      console.log("frame x120");
    
      var minWidth = 140;
      var maxWidth = 160;
      var width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  
      var width2 = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      var width3 = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      var randomX = 50+width2+Math.floor(Math.random() * (W - width - 50 - width2 - 150));
      var height = 25;
      var y = 0;
      var minGapH = 300;
      var maxGapH = 500;
      var gapH = Math.floor(Math.random() * (maxGapH - minGapH + 1) + minGapH);
  
      myGameArea.myPlatforms.push(
        new Component(width, height, "./images/13.png", W - width, y)
      );
      myGameArea.myPlatforms.push(
        new Component(width2, height, "./images/13.png", 50, y - gapH)
      );
      myGameArea.myPlatforms.push(
        new Component(width3, height, "./images/13.png", randomX, y - gapH/2)
      );
    }

    if(myGameArea.frames % 15 === 0){
      if(player.hasTouchedFirstObstacle) {
        points ++;
      }
    }

    //
    // Faire defiler les platforms
    //

    myGameArea.myPlatforms.forEach(function(platform, index){
      platform.y += 3;
      platform.draw();

      // si la plateforme sort (du bas), on l'enlève du tableau des plateformes
      if(platform.y > H) {
        myGameArea.myPlatforms.splice(index, 1);
      }
    });

    score();
  
    player.update(); // on recalcule les positions de notre player
    player.draw();

    // loop
    if(!myGameArea.gameOver){
      myGameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
    }
}
  document.getElementById("start-button").onclick = function() {
  document.getElementById("game-intro").style.display = "none";
  document.getElementById("game-board").style.display = "block";
  document.getElementById("gameOverMenu").style.display = "none";
  startGame();
 };




