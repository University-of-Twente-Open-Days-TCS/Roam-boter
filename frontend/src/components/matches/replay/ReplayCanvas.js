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
        /**
         * Initializes the canvas
         * @param canvasContainer DOM element to use as container
         * @param gameData frames of the simulation.
         */

        this.frame = 0

        // Initialize images

        this.tankTurretSprites = []
        this.tankSprites = []

        for (var i = 0; i < 2; i++) {
          this.tankSprites.push(new Image());
          this.tankSprites[i].src = "simulation_images/tank_body" + i + ".png";

          this.tankTurretSprites.push(new Image());
          this.tankTurretSprites[i].src = "simulation_images/tank_turret" + i + ".png"
        }

        this.healthPackSprite = new Image();
        this.healthPackSprite.src = "simulation_images/health_pack.png"

        this.canvasContainer = canvasContainer
        this.gameData = gameData

        let canvas = document.createElement('canvas')
        canvas.style.position = 'absolute'
        canvas.style.zIndex = 2

        // offscreen canvas for level. Improves performance
        let levelCanvas = document.createElement('canvas')
        levelCanvas.style.zIndex = 1

        this.canvas = canvas
        this.levelCanvas = levelCanvas


        this.updateSize()

        // append canvas to div
        canvasContainer.appendChild(canvas)
        canvasContainer.appendChild(levelCanvas)

        this.ctx2d = this.canvas.getContext("2d");
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
        this.levelCanvas.width = width
        this.levelCanvas.height = height

        // update size constants
        let gameData = this.gameData
        this.WIDTH = width
        this.HEIGHT = height
        this.CELLSIZE_X = height / gameData.level.length;
        this.CELLSIZE_Y = width / gameData.level[0].length;
        this.SCALING = width / ( gameData.level[0].length * 10 );

        // redraw the level
        this.drawLevel()
    }

    setFrame(frame) {
        this.frame = frame
    }

    getFramesLength() {
        return this.gameData.frames.length
    }

    drawLevel() {
        /**
         * Draws the level to a seperate canvas
         * Since level stays constant this canvas does not need to be redrawn.
         */
        var ctx = this.levelCanvas.getContext('2d')
        let blockColors = this.BLOCK_COLORS;

        let cellsize_x = this.CELLSIZE_X
        let cellsize_y = this.CELLSIZE_Y

        this.gameData.level.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                ctx.fillStyle = blockColors[cell];
                ctx.fillRect((x * cellsize_x), (y * cellsize_y), cellsize_x, cellsize_y);
            });
        });
    }


    draw() {
        let frame = this.frame
        frame = frame % this.gameData.frames.length

        var ctx = this.ctx2d;
        var tankSprites = this.tankSprites;
        var turretSprites = this.tankTurretSprites;
        var healthPackSprite = this.healthPackSprite;

        let cellsize_x = this.CELLSIZE_X
        let cellsize_y = this.CELLSIZE_Y
        let scaling = this.SCALING

        ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)

        function drawImage(image, x, y, scale, degrees) {
            ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(degrees * (Math.PI / 180));
            let dx = Math.floor(-image.width / 2)   // prevent sub-pixel rendering
            let dy = Math.floor(-image.height /2)
            ctx.drawImage(image, dx, dy);
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);


        // Draw the vision bars for each tank.
        this.gameData.frames[frame].tanks.forEach(function (tank, index) {
            var goal_x_1 = (tank.pos[0] * cellsize_x) + -Math.sin((tank.rotation + tank.turret_rotation - 30) * (Math.PI / 180)) * 100 * scaling;
            var goal_y_1 = (tank.pos[1] * cellsize_y) + -Math.cos((tank.rotation + tank.turret_rotation - 30)  * (Math.PI / 180)) * 100 * scaling;

            var goal_x_2 = (tank.pos[0] * cellsize_x) + -Math.sin((tank.rotation + tank.turret_rotation + 30) * (Math.PI / 180)) * 100 * scaling;
            var goal_y_2 = (tank.pos[1] * cellsize_y) + -Math.cos((tank.rotation + tank.turret_rotation + 30)  * (Math.PI / 180)) * 100 * scaling;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
            ctx.moveTo(tank.pos[0] * cellsize_x, tank.pos[1] * cellsize_y);
            ctx.lineTo(goal_x_1, goal_y_1);
            ctx.moveTo(tank.pos[0] * cellsize_x, tank.pos[1] * cellsize_y);
            ctx.lineTo(goal_x_2, goal_y_2);
            ctx.stroke();
        });

        this.gameData.frames[frame].tanks.forEach(function (elem, index) {
            drawImage(tankSprites[index], elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation);
            drawImage(turretSprites[index], elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation - elem.turret_rotation);

            // draw health bar
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "rgb(" + ((100 - elem.health) * (255 / 100)) + ", " + (elem.health * (255 / 100)) + ", 0)"
            ctx.fillRect(elem.pos[0] * cellsize_x - 20, elem.pos[1] * cellsize_y - 20, elem.health / 100 * 40, 5);
            //ctx.drawImage(tankSprite, elem.pos[0] * 20 - 32, elem.pos[1] * 20 - 32, 64, 64);
            //ctx.fillRect((elem.pos[0] * 20 - 10), elem.pos[1] * 20 - 10, 20, 20);
        });

        this.gameData.frames[frame].health_packs.forEach(function (elem, index) {
            if (elem.respawn_timer === 0) {
                drawImage(healthPackSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling / 1.5, -elem.rotation);
            }
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.gameData.frames[frame].bullets.forEach(function (elem, index) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(elem.pos[0] * cellsize_x - 2, elem.pos[1] * cellsize_y - 2, 4, 4);
        });

    }
}

export default ReplayCanvas
