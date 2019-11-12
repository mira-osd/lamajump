var W = 600;
var H = 1000;
var gravity = 2;
var maxspeed = 33; 
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
      this.vy = -33;
      this.hasJumped = true;
      this.hasTouchedFirstObstacle = true;

    }
    forward() {
      this.image.src = "./images/white-lama.png";
      const imgright = document.createElement("img1");
      imgright.onload = () => {
        this.imgright = imgright;
      };
      this.vx = 5;
    }
    backward() {
      this.image.src = "./images/lama-left.png";
      const imgleft = document.createElement("img2");
      imgleft.onload = () => {
        this.imgleft = imgleft;
      };
      this.vx = -5;
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
      // afficher GOMenu
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

      player.vy = 0; 
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

function showGoMenu(){
  document.getElementById("game-intro").style.display = "none";
  document.getElementById("game-board").style.display = "none";
  document.getElementById("gameOverMenu").style.display = "block";

  var scoreText = document.getElementById("go_score");
  scoreText.innerHTML = "Your final score : " + points;
}

// Boucle d'anim, exécutée toutes les 16ms
function updateGameArea() {
    //console.log('tick')
    myGameArea.frames += 1;

    myGameArea.clear();
    

    //
    // Obstacle toutes les 100frames
    //

    if (myGameArea.frames % 100 === 0) {
      console.log("frame x100");
    
      var minWidth = 120;
      var maxWidth = 180;
      var width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      var width2 = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      
      var height = 25;
      var y = 0;

      //gap de la première plateforme
      var minGapH = 200;
      var maxGapH = 260;
      var gapH = Math.floor(Math.random() * (maxGapH - minGapH + 1) + minGapH);

      // gap de la deuxième plateforme
      var minGapH2 = 340; 
      var maxGapH2 = 400; 
      var gapH2 = Math.floor(Math.random() * (maxGapH2 - minGapH2 + 1) + minGapH2);

      //emplacement random de la première plateforme 
      var minX = 10;
      var maxX = 150;
      var randomX = Math.floor(Math.random() * (maxX - minX + 1) + minX);

      // emplacement random de la deuxième plateforme
      var minX2 = 230;
      var maxX2 = 450;
      var randomX2 = Math.floor(Math.random() * (maxX2 - minX2 + 1) + minX2);
  
      myGameArea.myPlatforms.push(
        new Component(width, height, "./images/13.png", randomX, y - gapH)
      );
      myGameArea.myPlatforms.push(
        new Component(width2, height, "./images/13.png", randomX2, y - gapH2)
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




