var W = 600;
var H = 1000;
var dy = -2;

function startGame() {
    myGameArea.start();
    player = new Component(80, 130, "./images/blue.png", 250, 820);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    myObstacles: [],
    frames: 0,
    gravity: 0.10,
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
    }

    draw() {
        // myGameArea.context.drawImage(
        //     this.image,
        //     this.x,
        //     this.y,
        //     this.width,
        //     this.height
        // );
        myGameArea.context.fillRect(this.x, this.y, this.width, this.height);
            // this.y += -dy; ----> permet de faire défiler le jeu vers le bas 
        
    }
    moveLeft() {
        this.x += -100;
      }
    moveRight() {
        this.x += 100;
      }
    moveUp(){
        this.y -= 100;
    }

};  

document.onkeydown = function (e) {
    if (!player) return;
    
    console.log('keydown');
    switch (e.keyCode) {
      case 37:
        // left
        player.moveLeft();
        break;
      case 39:
        //right
        player.moveRight();
        break;
    case 38:
         // left
        player.moveUp();
        break;
    }
  };




/*  FAIT AVANT ANTOINE
function updateObstacles() {
    // Toutes les 120 frames
    if (myGameArea.frames % 120 === 0) {
      console.log('coucou');

      var minWidth = 100;
      var maxWidth = 180;
      var width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
      
      var minGap = 50;
      var maxGap = 200;
      var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      
      //myGameArea.myObstacles.push(new Component(100, width, "./images/obstacle.png", W, 500)); // changer image par couleur 
      myGameArea.myObstacles.push(new Component(100, W - width - gap, "./images/obstacle.png", 0, width + gap));
    }

    // Pour chacun de mes obstacles
    for (let i=0; i < myGameArea.myObstacles.length; i++) {
        let obstacle = myGameArea.myObstacles[i];

        obstacle.draw();

        if (player.crashWith(obstacle)) {
          myGameArea.stop();
          return;
        }
    }
  }
*/

function random(from, to) {
    return Math.floor(from + Math.random()*(to - from));
  }

// Boucle d'anim, exécutée toutes les 16ms
function updateGameArea() {
    console.log('tick')
    myGameArea.frames += 1;

    myGameArea.clear();
    
    player.draw();

    //
    // Obstacle toutes les 100frames
    //

    if (myGameArea.frames % 100 === 0) {
        console.log('frame x100');
        
        // var width = random(W /3, (2/3)*W);
        var width = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
        var height = 25; 
        var y = 0;

        var minGap = 100;
        var maxGap = 200;
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        
    
        myGameArea.myObstacles.push(new Component(width, height, "./images/obstacle.png", 600-width, y));
        myGameArea.myObstacles.push(new Component(width - gap, height, "./images/obstacle.png", 0, y+ gap));

    }

    //
    // Faire defiler les obstacles
    //

    myGameArea.myObstacles.forEach(function(obstacle){
        obstacle.y += 3;
        obstacle.draw();
      });

    //updateObstacles();

    // loop
    myGameArea.reqAnimation = window.requestAnimationFrame(updateGameArea);
    //myGameArea.myObstacles = [];

}

startGame();