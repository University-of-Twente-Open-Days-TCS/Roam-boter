export default class popup {
    _stage;
    _layer;

    constructor(stage, layer) {
        this._stage = stage;
        this._layer = layer;
        this.createGroup(stage, layer);
    }

    createGroup(stage, layer) {
        this.group = new Konva.Group();
        this.createRect(stage, layer);
        this.createClose(stage, layer);
        //dropdown = new dropdown();
    }

    createRect(stage, layer) {
        var rect = new Konva.Rect({
            x: stage.width() * 0.2,
            y: stage.height() * 0.2,
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
            x: stage.width() * 0.8 - 50,
            y: stage.height() * 0.2 + 10,
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