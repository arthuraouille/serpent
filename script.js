var snake;
var apple;
var snakeGame;

/*
//
// E v e n t s
// 
*/

// First launch
window.onload = function() {
    
    // Create game
    snakeGame = new SnakeGame(900, 600, 30, 100);
    
    // Create snake
    snake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
    
    // Create apple
    apple = new Apple([10, 10]);
    
    // Launch
    snakeGame.init(snake, apple);
    
}

// Keyboard management
document.onkeydown = function(e) {
    
    var key = e.keyCode;
    var newDirection;
    var ctx = snakeGame.ctx;
    var centerX = snakeGame.canvas.width / 2;
    var centerY = snakeGame.canvas.height / 2;

    switch(key) {
        case 37:
            newDirection = "left"
            break;
        case 38:
            newDirection = "up"
            break;
        case 39:
            newDirection = "right"
            break;
        case 40:
            newDirection = "down"
            break;
        case 32:            
            switch ( snakeGame.status ) {
                case "play":                         
                    snakeGame.status = "pause";
                    
                    // Pause screen
                    ctx.save();
                    ctx.fillStyle = "rgba(53, 53, 53, 0.8)"
                    ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
                    
                    ctx.font = "bold 70px sans-serif";
                    ctx.fillStyle = "#fff";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.strokeStyle = "#000";
                    ctx.lineWidth = 7;
                    ctx.strokeText("||", centerX, centerY);
                    ctx.fillText("||", centerX, centerY);
                    
                    ctx.restore();
                    break;
                case "pause":
                    snakeGame.status = "play";
                    ctx.save();
                    ctx.clearRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
                    ctx.restore();
                    break;
                default:
                    // Restart with new snake, apple
                    snake = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
                    apple = new Apple([10, 10]);

                    snakeGame.init(snake, apple);
            }                
            break;
        default:
            return;
    }
    snakeGame.snake.setDir(newDirection);
}


/*
//
// C o n s t r u c t o r s
//
*/

function SnakeGame(canvasWidth, canvasHeight, blockSize, delay) {
    
    // Canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.border = blockSize + "px solid rgba(53, 53, 53, 0.6)";
    this.canvas.style.margin = "50px auto";
    this.canvas.style.display = "block";
    this.canvas.style.backgroundColor = "#ddd";
    
    document.body.appendChild(this.canvas);
    
    // Context
    this.ctx = this.canvas.getContext("2d");
    
    // Other parameters
    this.blockSize = blockSize;
    this.delay = delay;
    this.widthInBlocks = canvasWidth / blockSize;
    this.heightInBlocks = canvasHeight / blockSize;
    this.status = "gameover";
    
    // Variables
    var instance = this;
    var timeout;
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    
    
    // Playing objects
    this.snake;
    this.apple;
    this.score;
    
    /********
    * methods
    ********/
    
    // Init
    this.init= function(snake, apple) {
        this.snake = snake;
        this.apple = apple;
        this.score = 0;
        this.status = "play";
        
        clearTimeout(timeout); 
        refreshCanvas();
    }
    
    // Check for collision
    this.checkCollision = function() {
            
        var wallCollision = false;
        var snakeCollision = false;

        var head = this.snake.body[0];
        var rest = this.snake.body.slice(1);

        var snakeX = head[0];
        var snakeY = head[1];

        var minX = 0;
        var minY = 0;
        var maxX = this.widthInBlocks - 1;
        var maxY = this.heightInBlocks - 1;

        var isOutHorizontally = snakeX < minX || snakeX > maxX;
        var isOutVertically = snakeY < minY || snakeY > maxY;

        // Check wall collision
        if ( isOutHorizontally || isOutVertically ) {
            wallCollision = true;
        }

        // Check body collision
        for ( var i = 0; i < rest.length; i++ ) {

            if ( snakeX === rest[i][0] && snakeY === rest[i][1] ) {
                snakeCollision = true;                    
            }

        }

        return wallCollision || snakeCollision;
    };
    
    // Game over
    this.gameOver = function() {
        
        this.status = "gameover";
        
        this.ctx.save();
        
        // Grey background
        this.ctx.fillStyle = "rgba(53, 53, 53, 0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game over text
        this.ctx.font = "bold 70px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 7;
        this.ctx.strokeText("Game Over", centerX, centerY / 2);
        this.ctx.fillText("Game Over", centerX, centerY / 2);
        
        // Replay text
        this.ctx.font = "bold 20px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 5;
        this.ctx.strokeText("Appuyez sur <ESPACE> pour rejouer.", centerX, centerY * 3 / 4);
        this.ctx.fillText("Appuyez sur <ESPACE> pour rejouer.", centerX, centerY * 3 / 4);
        
        this.ctx.restore();
        
    };
    
    // Display score
    this.displayScore = function() {
        
        this.ctx.save();
        
        this.ctx.font = "bold 200px sans-serif";
        this.ctx.fillStyle = "rgba(53, 53, 53, 0.6)";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        
        this.ctx.fillText(this.score.toString(), centerX, centerY);
        
        this.ctx.restore();
    };  
    
    /********
    * game engine
    ********/
    
    var refreshCanvas = function(snake, apple) {
        
        if (instance.status === "play") {
            
                instance.snake.move(); // instance = le jeu

            if ( instance.checkCollision() ) {

                instance.gameOver();

            } else {

                if ( instance.snake.checkApple(instance.apple) ) {

                    instance.score++;
                    instance.snake.ateApple = true;
                    do {
                        instance.apple.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);
                    } while ( instance.apple.isOnSnake(instance.snake) )

                } 

                instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);

                instance.displayScore();  
                instance.snake.draw(instance.ctx, instance.blockSize);
                instance.apple.draw(instance.ctx, instance.blockSize);

            }
                
        }
        
        // continuously refreshCanvas, unless game is over.
        if ( instance.status !== "gameover" ) {
            timeout = setTimeout(refreshCanvas, instance.delay);
        }
    };
}
    
    
// Constructeur SERPENT
function Snake(body, direction) {

    this.body = body;

    this.direction = direction;

    this.ateApple = false;

    this.draw = function(ctx, blockSize) {

        ctx.save();
        ctx.fillStyle = "#f60";
        for ( var i = 0 ; i < this.body.length; i++ ) {

            var x = this.body[i][0] * blockSize;
            var y = this.body[i][1] * blockSize; 
            ctx.fillRect(x, y, blockSize, blockSize);

        }
        ctx.restore();

    };

    this.move = function() {
        var nextPosition = this.body[0].slice();

        switch(this.direction) {
            case "left":
                nextPosition[0]--;
                break;
            case "right":
                nextPosition[0]++; 
                break;
            case "down":
                nextPosition[1]++;
                break;
            case "up":
                nextPosition[1]--;
                break;
            default:
                throw("Invalid direction");

        }

        // Ajoute le nouveau bloc devant le BODY
        this.body.unshift(nextPosition);

        // Supprime le dernier bloc du BODY
        if ( !this.ateApple ) {
            this.body.pop();
        } else {
            this.ateApple = false;
        }
    };

    this.setDir = function(newDirection) {
        var allowedMoves
        switch(this.direction) {
            case "left":
            case "right":
                allowedMoves = ["up", "down"];
                break;
            case "down":
            case "up":
                allowedMoves = ["left", "right"];
                break;
            default:
                throw("Invalid direction");

        }

        // Si la direction est autorisée
        if ( allowedMoves.indexOf(newDirection) > -1 ) {
            this.direction = newDirection;
        }
    };

    this.checkApple = function(appleToEat) {

        var head = this.body[0];

        if ( head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] ) {
            return true;
        } else {
            return false; 
        }
    };
}
    
    
// Constructeur POMME
function Apple(position) {

    this.position = position;

    this.draw = function(ctx, blockSize) {
        ctx.save();
        ctx.fillStyle = "#3c3";
        ctx.beginPath();
        var radius = blockSize / 2;
        var x = this.position[0] * blockSize + radius;
        var y = this.position[1] * blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();    
    };

    this.setNewPosition = function(widthInBlocks, heightInBlocks) {

        var newX = Math.round(Math.random() * (widthInBlocks - 1));
        var newY = Math.round(Math.random() * (heightInBlocks - 1));

        this.position = [newX, newY];

    };

    this.isOnSnake = function(snakeToCheck) {

        var isOnSnake = false;

        for ( var i = 0; i < snakeToCheck.length; i++ ) {
            if ( this.position[0] === snakeToCheck[i][0] && this.position[1] === snakeToCheck[i][1] ) {
                isOnSnake = true;
            }
        }

        return isOnSnake;

    };

}