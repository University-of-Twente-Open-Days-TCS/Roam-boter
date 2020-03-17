class ReplayCanvas {

    BLOCK_COLORS = [
        "#FFFFFF",    // 0: EMPTY
        "#000000",    // 1: RESERVED
        "#000000",    // 2: RESERVED
        "#000000",    // 3: RESERVED
        "#000000",    // 4: RESERVED
        "#000000",    // 5: WALL
        "#000000",    // 6: RESERVED
        "#000000",    // 7: RESERVED
        "#00FF00",    // 8: HEAL
        "#FF0000",    // 9: FLAG
        "#FFFF00",    // 10: HILL
        "#0000FF",    // 11: SPAWN
        "#000000",    // 12: RESERVED
        "#000000",    // 13: RESERVED
    ]

    constructor(canvasContainer, gameData) {
        this.frame = 0
        this.draw = this.draw.bind(this)
        this.tankSprite = new Image();
        this.tankSprite.src = "simulation_images/tank_body.png";

        this.tankTurretSprite = new Image();
        this.tankTurretSprite.src = "simulation_images/tank_turret.png"

        this.canvasContainer = canvasContainer
        this.gameData = gameData


        
        let canvas = document.createElement('canvas')
        this.canvas = canvas
        this.updateSize()
        // append canvas to div
        canvasContainer.appendChild(canvas)

        this.ctx2d = this.canvas.getContext("2d");

        //bind functions
        this.start = this.start.bind(this)
        this.draw = this.draw.bind(this)
    }

    getCanvasSize(){
        /**
         * Calculates the height of the canvas.
         * The canvas fills the width of canvasContainer and scales the height according to the level.
         */

        let width = this.canvasContainer.offsetWidth
        let levelHeight = this.gameData.level.length
        let levelWidth = this.gameData.level[0].length

        let aspectRatio = levelWidth / levelHeight
        let height = width / aspectRatio
        return {width, height}
    }


    updateSize() {
        let {width, height} = this.getCanvasSize()
        this.canvas.width = width
        this.canvas.height = height
    }
    
    setFrame(frame) {
        this.frame = frame
    }

    getFramesLength() {
        return this.gameData.frames.length
    }

    start() {
        this.draw()
    }

    draw() {
        let frame = this.frame
        frame = frame % this.gameData.frames.length

        var ctx = this.ctx2d;
        var blockColors = this.BLOCK_COLORS;
        var tankSprite = this.tankSprite;
        var turretSprite = this.tankTurretSprite;
        var width = this.canvas.width;
        var height = this.canvas.height;

        var cellsize_y = height / this.gameData.level.length;
        var cellsize_x = width / this.gameData.level[0].length;

        var scaling = width / (this.gameData.level[0].length * 10);

        function drawImage(image, x, y, scale, rotation) {
            ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(rotation * (Math.PI / 180));
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        }


        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.gameData.level.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                ctx.fillStyle = blockColors[cell];
                ctx.fillRect((x * cellsize_x), (y * cellsize_y), cellsize_x, cellsize_y);
            });
        });

        this.gameData.frames[frame].tanks.forEach(function (elem, index) {
            drawImage(tankSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation);
            drawImage(turretSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation - elem.turret_rotation);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "rgb(" + ((100 - elem.health) * (255 / 100)) + ", " + (elem.health * (255 / 100)) + ", 0)"
            ctx.fillRect(elem.pos[0] * cellsize_x - 20, elem.pos[1] * cellsize_y - 20, elem.health / 100 * 40, 5);
            //ctx.drawImage(tankSprite, elem.pos[0] * 20 - 32, elem.pos[1] * 20 - 32, 64, 64);
            //ctx.fillRect((elem.pos[0] * 20 - 10), elem.pos[1] * 20 - 10, 20, 20);
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.gameData.frames[frame].bullets.forEach(function (elem, index) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(elem.pos[0] * cellsize_x - 2, elem.pos[1] * cellsize_y - 2, 4, 4);
        });

        ctx.fillStyle = "#000000";
        ctx.font = "15px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Scores", width / (8 / 7), height / (8));


        this.gameData.frames[frame].scores.forEach(function (score, index) {
            ctx.font = "10px Arial";
            ctx.fillText("Team " + index + ": " + score, width / (8 / 7), height / 8 + (10 * index + 10));
        });

        requestAnimationFrame(this.draw)
    }
}

export default ReplayCanvas
