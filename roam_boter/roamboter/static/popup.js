import dropdown from "./dropdown.js";
export default class popup {
    _stage;
    _layer;

    constructor(stage, layer) {
        this._stage = stage;
        this._layer = layer;
        this.createGroup(stage, layer);
    }

    createGroup(stage, layer) {
        this.group = new Konva.Group({
            x: stage.width() * 0.2,
            y: stage.height() * 0.2,
        });
        this.createRect(stage, layer);
        this.createClose(stage, layer);
        let dDown = new dropdown(stage, layer, [1, 2, 3], function (x) {
            console.log(x.toString())
        });
        this.group.add(dDown.group);
        //dropdown = new dropdown();
    }

    createRect(stage, layer) {
        var rect = new Konva.Rect({
            width: stage.width() * 0.6,
            height: stage.height() * 0.6,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(rect);
    }

    createClose(stage, layer) {
        var rect = new Konva.Rect({
            x: stage.width() * 0.6 - 50,
            y: 10,
            width: 40,
            height: 40,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(rect);
        rect.on("click", () => {
            layer.moveToBottom();
            this.group.destroy();
            stage.draw();
        });
    }
}