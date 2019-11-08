var W = 600;
var H = 1000;
var dy = -2;
var gravity = 2;
var maxspeed = 30;
var ground = H; 

function startGame() {
    myGameArea.start();
    player = new Component(80, 130, "./images/blue.png", 250, 820);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    myPlatforms: [],
    frames: 0,
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
	}
};

class Component {
    constructor(width, height, image, x, y) {
        this.image = new Image();
        this.image.src = image;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.vx = 0; // vitesse horizontale
        this.vy = 0; // vitesse verticale
    }

    jump() {
      this.vy = -30;
    }
    forward() {
      this.vx = 5;
    }
    backward() {
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
    // on redéfinit le sol avec l'une des plateformes
    //

    let closestPlatforms = myGameArea.myPlatforms;
    // On ne garde que les plateformes qui par projection chevauchent du player en x
    closestPlatforms = closestPlatforms.filter(platform => player.x + player.width > platform.x && player.x < platform.x + platform.width); // player chevauche la plate-forme en horizontal
    // On ne garde que les plateformes au dessous (ie: tant que pas entierement traversé)
    closestPlatforms = closestPlatforms.filter(platform => player.y <= platform.y + platform.height);
    // On trie par de la plateforme la plus proche a la plus éloignée (du player)
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

      /* SAUT SUR PLATEFORME RÉALISÉ PAR ANTOINE HIER
      // on empeche d'aller plus bas que l'obstacle sur lequel il est
    
      // tableau des plateformes qui sont en dessous du player

      let bottomPlateforms = myGameArea.myPlatforms.filter(function(platform){
        //si je suis en dessous je retourne true 
        if(player.y + player.height < platform.y){
          return true;
        } else {
          return false;
        }
      });

      let bottomAndOverlapPlateforms = bottomPlateforms.filter(function (platform) {
        if (player.x < platform.x + platform.width && player.x + player.width > platform.x) {
          return true;
        } else {
          return false;
        }
      });
      console.log(bottomAndOverlapPlateforms);

      // on empeche d'aller plus bas que le sol
      console.log(bottomAndOverlapPlateforms.length, bottomAndOverlapPlateforms.length > 0 && bottomAndOverlapPlateforms[0].y, player.y)
      if (bottomAndOverlapPlateforms.length > 0 && player.y < bottomAndOverlapPlateforms[0].y - player.height) {
        console.log('oui')
        player.y = bottomAndOverlapPlateforms[0].y - player.height;
      }
      */


      if (this.x > W) this.x = 0;
      if (this.x < -this.width) this.x = W;
      
      // la gravité s'applique
      this.vy += gravity;

    }

    draw() {
      /*
     myGameArea.context.drawImage(
       this.image,
       this.x,
       this.y,
       this.width,
       this.height
     );
     */
     myGameArea.context.fillRect(this.x, this.y, this.width, this.height);
      //this.y += -dy; //----> permet de faire défiler le jeu vers le bas    
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
    case 38:
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

// Boucle d'anim, exécutée toutes les 16ms
function updateGameArea() {
    //console.log('tick')
    myGameArea.frames += 1;

    myGameArea.clear();
    

    //
    // Obstacle toutes les 300frames
    //

    if (myGameArea.frames % 120 === 0) {
      console.log("frame x300");
    
      var minWidth = 150;
      var maxWidth = 250;
      var width =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  
      var width2 =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      var height = 25;
      var y = 0;
      var minGapH = 120;
      var maxGapH = 200;
      var gapH = Math.floor(Math.random() * (maxGapH - minGapH + 1) + minGapH);
  
      myGameArea.myPlatforms.push(
        new Component(width, height, "./images/obstacle.png", W - width, y)
      );
      myGameArea.myPlatforms.push(
        new Component(width2, height, "./images/obstacle.png", 0, y - gapH)
      );
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

    // loop
    myGameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
    //myGameArea.myObstacles = [];
  
    player.update(); // on recalcule les positions de notre player
    player.draw();
}

startGame();