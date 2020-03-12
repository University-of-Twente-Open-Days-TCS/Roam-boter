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

    constructor(canvas, game_data) {

        this.tankSprite = new Image();
        this.tankSprite.src = "simulation_images/tank_body.png";

        this.tankTurretSprite = new Image();
        this.tankTurretSprite.src = "simulation_images/tank_turret.png"

        // set canvas
        this.canvas = canvas
        this.game_data = game_data
        this.ctx2d = this.canvas.getContext("2d");
    }

    drawFrame(frame) {
        if(frame >= this.game_data.frames.length){
            // Don't draw a new frame if out of range
            return
        }

        var ctx = this.ctx2d;
        var blockColors = this.BLOCK_COLORS;
        var tankSprite = this.tankSprite;
        var turretSprite = this.tankTurretSprite;
        var width = this.canvas.width;
        var height = this.canvas.height;

        var cellsize_y = height / this.game_data.level.length;
        var cellsize_x = width / this.game_data.level[0].length;

        var scaling = width / (this.game_data.level[0].length * 10);

        function drawImage(image, x, y, scale, rotation) {
            ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
            ctx.rotate(rotation * (Math.PI / 180));
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
        }


        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.game_data.level.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                ctx.fillStyle = blockColors[cell];
                ctx.fillRect((x * cellsize_x), (y * cellsize_y), cellsize_x, cellsize_y);
            });
        });

        this.game_data.frames[frame].tanks.forEach(function (elem, index) {
            drawImage(tankSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation);
            drawImage(turretSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation - elem.turret_rotation);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "rgb(" + ((100 - elem.health) * (255 / 100)) + ", " + (elem.health * (255 / 100)) + ", 0)"
            ctx.fillRect(elem.pos[0] * cellsize_x - 20, elem.pos[1] * cellsize_y - 20, elem.health / 100 * 40, 5);
            //ctx.drawImage(tankSprite, elem.pos[0] * 20 - 32, elem.pos[1] * 20 - 32, 64, 64);
            //ctx.fillRect((elem.pos[0] * 20 - 10), elem.pos[1] * 20 - 10, 20, 20);
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.game_data.frames[frame].bullets.forEach(function (elem, index) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(elem.pos[0] * cellsize_x - 2, elem.pos[1] * cellsize_y - 2, 4, 4);
        });

        ctx.fillStyle = "#000000";
        ctx.font = "15px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Scores", width / (8 / 7), height / (8));


        this.game_data.frames[frame].scores.forEach(function (score, index) {
            ctx.font = "10px Arial";
            ctx.fillText("Team " + index + ": " + score, width / (8 / 7), height / 8 + (10 * index + 10));
        });

    }
}

export default ReplayCanvas
