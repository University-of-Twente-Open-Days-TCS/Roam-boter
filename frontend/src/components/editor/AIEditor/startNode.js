import arrow from "./arrow.js";
import Konva from "konva"

const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;


export default class startNode {

    arrow;

    _trueArrow;
    _layer;
    _stage;
    _group;
    _rect;
    _trueCircle;
    _dragCircle;

    constructor(stage, layer) {
        //    bla insert shape and a point which can be dragged to a condition/action
        this.stage = stage;
        this.layer = layer;
        this.createGroup(stage);

    }

    createGroup(stage) {
        this.group = new Konva.Group({
            x: stage.width() / 2
        });
        this.createRect();
        this.createText();
        this.createTrueCircle();
        this.createDragCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows()
        });
    }

    createRect() {
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: blockWidth,
            height: blockHeight,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
    }

    createText() {
        this.text = new Konva.Text({
            x: 20,
            y: 5,
            text: "Start",
            fontSize: 12,
            fill: '#FFF',
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        this.group.add(this.text);
    }

    //create a circle from which the true connection is made to another node
    createTrueCircle() {
        this.trueCircle = new Konva.Circle({
            y: this.rect.height(),
            x: this.rect.width() / 2,
            radius: circle_radius,
            fill: 'green',
            stroke: 'black',
        });
        this.group.add(this.trueCircle);

    }

    //creates an invisible circle used only for making a new connection between nodes, based on condition will create one for true or for false
    createDragCircle() {
        let node = this;
        this.dragCircle = new Konva.Circle({
            draggable: true,
            y: this.trueCircle.y(),
            x: this.trueCircle.x(),
            radius: hitboxCircleRadius,
            fill: 'black',
            opacity: 0
        });


        this.group.add(this.dragCircle);

        this.dragCircle.originalX = this.dragCircle.x();
        this.dragCircle.originalY = this.dragCircle.y();

        //when the invisible circle starts to be dragged create a new temporary arrow
        this.dragCircle.on("dragstart", function () {
            this.tempX = this.getAbsolutePosition().x;
            this.tempY = this.getAbsolutePosition().y;
            //it is important that the invisible circle is in a different layer in order to check what is under the cursor it later
            this.moveTo(node.stage.templayer);
            this.tempArrow = new Konva.Arrow({
                stroke: "black",
                fill: "black"
            });

            //delete any existing arrow
            if (node.trueArrow != null) {
                node.trueArrow.delete();
            }

            node.stage.templayer.add(this.tempArrow);
        });

        //update the temporary arrow
        this.dragCircle.on("dragmove", function () {
            //this is to offset the position of the stage
            this.tempArrow.absolutePosition({x: 0, y: 0});
            let points = [this.tempX, this.tempY, this.getAbsolutePosition().x, this.getAbsolutePosition().y];
            this.tempArrow.points(points.map(function (p) {
                return p / node.stage.scale
            }));
            node.stage.templayer.batchDraw();
        });
        let g = this.group;
        //when the drag has ended return the invisible circle to its original position, remove the temporary arrow and create a new connection between nodes if applicable
        this.dragCircle.on("dragend", function () {
            let touchPos = node.stage.getPointerPosition();
            let intersect = node.layer.getIntersection(touchPos);
            if (node.stage.inputDict.has(intersect)) {
                if (node.stage.inputDict.get(intersect).inputArrow != null) {
                    node.stage.inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, node.stage.inputDict.get(intersect), true, node.stage, node.layer);
            }
            this.moveTo(g);
            this.x(this.originalX);
            this.y(this.originalY);
            this.tempArrow.destroy();
            this.tempArrow = null;
            node.layer.batchDraw();
            node.stage.templayer.batchDraw();
        });
    }

    getTrueDotPosition() {
        let pos = this.trueCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

    updateArrows() {
        if (this.trueArrow != null) {
            this.trueArrow.update();
        }
    }

    get trueArrow() {
        return this._trueArrow;
    }

    set trueArrow(value) {
        this._trueArrow = value;
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

    get rect() {
        return this._rect;
    }

    set rect(value) {
        this._rect = value;
    }

    get trueCircle() {
        return this._trueCircle;
    }

    set trueCircle(value) {
        this._trueCircle = value;
    }

    get dragCircle() {
        return this._dragCircle;
    }

    set dragCircle(value) {
        this._dragCircle = value;
    }


    get group() {
        return this._group;
    }

    set group(value) {
        this._group = value;
    }

}
