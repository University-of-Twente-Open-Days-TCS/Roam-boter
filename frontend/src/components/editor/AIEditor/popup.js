import Konva from "konva"
import dropdown from "./dropdown.js";


export default class popup {

    _stage;
    _layer;
    _list;
    _f;
    _group;


    constructor(stage, layer, list, f, text) {
        this.stage = stage;
        this.layer = layer;
        this.list = list;
        this.f = f;
        this.textHeight = 30;
        this.text = text.replace(/\n/g, "");
        this.createGroup();

    }

    createGroup() {
        let thisStage = this.stage;
        this.stage.on("click tap", {});
        this.dDown = new dropdown(this.stage, this.layer, this.list, this.closePopup.bind(this));
        this.group = new Konva.Group({draggable: true});
        this.createText();
        this.createRect();
        this.group.add(this.textGroup);
        //this.createClose();
        this.group.add(this.dDown.group);
        //dropdown = new dropdown();
        this.group.x(thisStage.width() / 2 - (this.rect.width() / 2));
        this.group.y(thisStage.height() / 2 - (this.rect.height() / 2));
    }

    createText() {
        let boldWords = ["_object_", "_distance_", "_amount_", "_label_", "_speed_", "_reldir_", "_winddir_"];
        let words = this.text.split(" ");
        let textGroup = new Konva.Group();
        let currentX = 0;
        let currentText = new Konva.Text({fill: "#FFF", padding: 5, text: ""});
        let size = currentText.fontSize() * 1.3;
        currentText.fontSize(size);
        textGroup.add(currentText);
        words.forEach((word) => {
            if (boldWords.includes(word)) {
                currentX += currentText.width();
                let boldText = new Konva.Text({
                    fill: "#FFF",
                    padding: 5,
                    text: word.substring(1, word.length - 1),
                    fontStyle: "italic bold",
                    x: currentX,
                    fontSize: size
                });
                textGroup.add(boldText);
                currentX += boldText.width();
                currentText = new Konva.Text({fill: "#FFF", padding: 5, text: "", x: currentX, fontSize: size});
                textGroup.add(currentText);
            } else {
                currentText.text(currentText.text() + word + " ")
            }
        });
        this.textWidth = currentX + currentText.width();
        this.textGroup = textGroup;


    }

    createRect() {

        this.rect = new Konva.Rect({
            width: Math.max(this.dDown.width, this.textWidth) + 20,
            height: this.dDown.height + 20 + this.textHeight,
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

        exitRect.on("click tap", () => {
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

