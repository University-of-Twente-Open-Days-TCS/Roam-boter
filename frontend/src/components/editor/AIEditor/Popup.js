import Konva from "konva"
import Selector from "./Selector.js";
import {blue, cyan, green, grey} from "@material-ui/core/colors";

export default class Popup {

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
        this.group = new Konva.Group();
        this.createClose();
        this.createRect();
        this.createText();
    }

    createText() {
        if (this.textGroup !== null) {
            this.textGroup.destroy();
        }

        let boldWords = ["<Object>", "<Distance>", "<Amount>", "<Label>", "<Speed>", "<RelDir>", "<WindDir>", "<Seconds>"];
        let words = this.text.split(" ");
        let textGroup = new Konva.Group({offsetX: -15, offsetY: -15});
        let currentX = 0;
        let currentText = new Konva.Text({fill: 'white', text: "", fontStyle: "bold", shadowOffset: {x: 1, y: 1}, shadowBlur: 1, shadowColor: grey['500']});
        let size = currentText.fontSize() * 1.3;
        currentText.fontSize(size);
        textGroup.add(currentText);
        words.forEach((word) => {
            if (boldWords.includes(word)) {
                currentX += currentText.width();
                let boldText = new Konva.Text({
                    fill: blue['900'],
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
        this.selector = new Selector(this.stage, this.layer, options, (selection) => {
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

    //updates the Popup to be the correct size
    updatePopupGroup() {
        let margin = 10;
        this.rect.width(Math.max(this.selector.width, this.textWidth) + margin * 2);
        this.rect.height(this.selector.height + 20 + this.textHeight);
        //offset to place the origin of the group at the center.
        this.group.offset({x: this.rect.width() / 2, y: this.rect.height() / 2});
        this.group.x(this.stage.width() / 2);
        this.group.y(this.stage.height() / 2);
        this.selector.group.x(margin);
        this.selector.group.y(margin + this.textHeight);
        let ratioX = this.rect.width() / this.stage.width();
        let ratioY = this.rect.height() / this.stage.height();
        let maxRatio = Math.max(ratioX, ratioY);
        let scale = 1;
        //if the  Popup is larger than the stage it will scale down
        if (maxRatio > 0.9) {
            scale = 1 / maxRatio * 0.9;
        }
        this.group.scale({x: scale, y: scale});
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
            fill: cyan['400'],
            stroke: grey['900'],
            strokeWidth: 0,
            cornerRadius: 5,
            shadowColor: grey['700'],
            shadowOffset: {x: 3, y: 3},
            shadowBlur: 5,
            shadowOpacity: 90
        });
        this.group.add(this.rect);
    }

    createClose() {

        let exitRect = new Konva.Rect({
            width: this.stage.width(),
            height: this.stage.height(),
            opacity: 0,
        });
        this.layer.add(exitRect);
        exitRect.setAbsolutePosition({x: 0, y: 0});
        this.exitRect = exitRect;
        exitRect.on("click tap", () => {
            this.closePopup();
        });
    }


    //Close Popup, if an attribute has been given
    closePopup(attribute) {
        this.layer.moveToBottom();
        this.exitRect.destroy();
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

