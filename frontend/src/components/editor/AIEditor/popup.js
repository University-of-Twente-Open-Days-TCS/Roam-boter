import Konva from "konva"
import dropdown from "./dropdown.js";

export default class popup {

    _stage;
    _layer;
    _list;
    _f;
    _group;


    constructor(stage, layer, list, f) {
        this.stage = stage;
        this.layer = layer;
        this.list = list;
        this.f = f;
        this.createGroup();
    }

    createGroup() {
        let thisStage = this.stage;
        this.dDown = new dropdown(this.stage, this.layer, this.list, this.closePopup.bind(this));
        this.group = new Konva.Group();

        this.createRect();
        //this.createClose();
        this.group.add(this.dDown.group);
        //dropdown = new dropdown();
        this.group.x(thisStage.width() / 2 - (this.rect.width() / 2));
        this.group.y(thisStage.height() / 2 - (this.rect.height() / 2));
    }

    createRect() {
        let thisStage = this.stage;

        this.rect = new Konva.Rect({
            width: this.dDown.width + 20,
            height: this.dDown.height + 20,
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
    }

    createClose() {
        let thisStage = this.stage;

        var exitRect = new Konva.Rect({
            x: thisStage.width() * 0.6 - 50,
            y: 10,
            width: 40,
            height: 40,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(exitRect);

        exitRect.on("click", () => {
            this.closePopup();
        });
    }


    //Close popup, if an attribute has been given
    closePopup(attribute) {
        this.layer.moveToBottom();
        this.group.destroy();
        this.stage.draw();
        if (attribute != null) {
            this.f(attribute);
        }

    }

    get stage() {
        return this._stage;
    }

    set stage(value) {
        this._stage = value;
    }

    get layer() {
        return this._layer;
    }

    set layer(value) {
        this._layer = value;
    }

    get list() {
        return this._list;
    }

    set list(value) {
        this._list = value;
    }

    get f() {
        return this._f;
    }

    set f(value) {
        this._f = value;
    }

    get group() {
        return this._group;
    }

    set group(value) {
        this._group = value;
    }

}