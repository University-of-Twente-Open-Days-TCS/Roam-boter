import React, {Component} from "react";
import {getCsrfToken} from "../RoamBotAPI.js";

class MatchReplay extends Component {
    constructor(props) {
        super(props);

        this.currentFrame = 0


        this.blockColors = [
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

        this.ctx = ''
        this.canvas = ''

        this.tankSprite = new Image();
        this.tankSprite.src = "simulation_images/tank_body.png";

        this.tankTurretSprite = new Image();
        this.tankTurretSprite.src = "simulation_images/tank_turret.png"
        // this.state.match_data = props.match_data
    }

    async componentDidMount() {
        // selects the id of the match from the URL
        const id = this.props.match.url.split('/').slice(-1)[0]

        const response = await fetch(`http://localhost:8000/matches/botmatches/` + id, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json",
            },
        });
        let data = await response.json();
        console.log({data})
        this.game_data = JSON.parse(data.simulation);
        this.canvas = this.refs.canvas;
        this.ctx2d = this.canvas.getContext("2d");
        this.interval = setInterval(() => this.drawNextFrame(), 16);
        // this.canvas.width = this.canvas.parentNode.width;
        // this.canvas.height = this.canvas.parentNode.height;
        // console.log(this.canvas.parentNode);
    }

    drawNextFrame() {
        // DRAW THE LEVEL BACKGROUND.
        var ctx = this.ctx2d;
        var blockColors = this.blockColors;
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

        this.game_data.frames[this.currentFrame].tanks.forEach(function (elem, index) {
            drawImage(tankSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation);
            drawImage(turretSprite, elem.pos[0] * cellsize_x, elem.pos[1] * cellsize_y, scaling, -elem.rotation - elem.turret_rotation);
            //ctx.drawImage(tankSprite, elem.pos[0] * 20 - 32, elem.pos[1] * 20 - 32, 64, 64);
            //ctx.fillRect((elem.pos[0] * 20 - 10), elem.pos[1] * 20 - 10, 20, 20);
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.game_data.frames[this.currentFrame].bullets.forEach(function (elem, index) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(elem.pos[0] * cellsize_x - 2, elem.pos[1] * cellsize_y - 2, 4, 4);
        });

        this.currentFrame += 1;
        this.currentFrame = this.currentFrame % this.game_data.frames.length;

    }

    render() {
        return (
            <div>
                <h1>Match Replay</h1>
                <canvas ref="canvas" width={610} height={410}/>
            </div>
        )
    }
}

export default MatchReplay;
