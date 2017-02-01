window.onload = function()
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    
    init();
    
    function init() {
        
        // Aire de jeu
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid"; 
        document.body.appendChild(canvas);
        
        // Contexte
        ctx = canvas.getContext('2d');
        
        // Serpent
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        
        // Pomme
        applee = new Apple([10, 10]);
        
        refreshCanvas();
    }
    
    function refreshCanvas() {
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.move();
        snakee.draw();
        
        applee.draw();
        setTimeout(refreshCanvas, delay);
    }
    
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    
    // Prototype POMME
    function Apple(position) {
        
        this.position = position;
        
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#3c3";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = position[0] * blockSize + radius;
            var y = position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();    
        }
        
    }
    
    
    // Prototype SERPENT
    function Snake(body, direction) {
        
        this.body = body;
        
        this.direction = direction;
        
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#f00";
            for ( var i = 0 ; i < this.body.length; i++ ) {
                drawBlock(ctx, this.body[i]);
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
            this.body.pop();
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
        
        this.checkCollision = function() {
            
            var wallCollision = true;
            var snakeCollision = true;
        }
    }
    
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        
        var newDirection;
        
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
            default:
                return;
        }
        
        snakee.setDir(newDirection);
    }
}