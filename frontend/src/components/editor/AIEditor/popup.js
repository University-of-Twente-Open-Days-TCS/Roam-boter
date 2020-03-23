import Konva from "konva"
import selector from "./selector.js";


export default class popup {

    _stage;
    _layer;
    _list;
    _f;
    _group;


    constructor(stage, layer, options, f, text) {
        this.queue = [];
        this.stage = stage;
        this.layer = layer;
        this.f = f;
        this.selector = null;
        this.textGroup = null;
        this.textHeight = 30;
        this.text = text.replace(/\n/g, "");
        this.createGroup();
        this.getOption({
            options: options, f: (selection) => {
                f(selection);
                this.closePopup()
            }
        });
        this.stage.draggable(false);
    }

    createGroup() {
        let thisStage = this.stage;
        this.group = new Konva.Group();
        this.createRect();
        this.createText();
    }

    createText() {
        if (this.textGroup !== null) {
            this.textGroup.destroy();
        }

        let boldWords = ["<object>", "<distance>", "<amount>", "<label>", "<speed>", "<reldir>", "<winddir>"];
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
        this.group.add(this.textGroup);
    }

    //input in form of {options: [option], f: (option) => {}}
    getOption(input) {
        let options = input.options;
        let f = input.f;
        if (this.selector !== null) {
            this.selector.group.destroy();
        }
        this.selector = new selector(this.stage, this.layer, options, (selection) => {
            console.log(selection);
            if (typeof selection.getRemainingOptions !== "undefined") {
                this.getNextOption(selection, f);
            } else {
                f(selection);
            }
        });
        this.group.add(this.selector.group);
        this.updatePopupGroup();
        this.layer.draw();
    }

    updatePopupGroup() {
        let margin = 10;
        this.rect.width(Math.max(this.selector.width, this.textWidth) + margin * 2);
        this.rect.height(this.selector.height + 20 + this.textHeight);
        this.selector.group.x(margin);
        this.selector.group.y(margin + this.textHeight);
        this.group.x(this.stage.width() / 2 - (this.rect.width() / 2));
        this.group.y(this.stage.height() / 2 - (this.rect.height() / 2));
    }

    getNextOption(selection, f) {
        let nextOption = selection.getRemainingOptions().pop();
        if (typeof nextOption !== "undefined") {
            this.text = selection.toString().replace(/\n/g, "");
            this.createText();
            this.getOption({
                options: nextOption.options, f: (s) => {
                    nextOption.f(s);
                    this.getNextOption(selection, f)
                }
            });
        } else {
            f(selection);
        }
    }

    createRect() {

        this.rect = new Konva.Rect({
            fill: 'blue',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
    }



    //Close popup, if an attribute has been given
    closePopup(attribute) {
        this.layer.moveToBottom();
        this.group.destroy();
        this.stage.draggable(true);
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

