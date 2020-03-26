import arrow from "./arrow.js";
import Konva from "konva"
import popup from "./popup";
import actionNode from "./actionNode";
import conditionNode from "./conditionNode.js";

const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;


export default class startNode {

    arrow;

    _trueArrow;
    _layer;
    _stage;
    _canvas;
    _group;
    _rect;
    _trueCircle;
    _dragCircle;

    constructor(stage, layer, canvas) {
        //    bla insert shape and a point which can be dragged to a condition/action
        this.canvas = canvas;
        this.stage = stage;
        this.layer = layer;
        this.createGroup(stage);
        this.canvas = canvas;

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

        let canvas = this.canvas;
        //when the invisible circle starts to be dragged create a new temporary arrow
        this.dragCircle.on("dragstart", function () {
            this.tempX = this.x() + node.group.x();
            this.tempY = this.y() + node.group.y();
            canvas.dragging = true;

            //it is important that the invisible circle is in a different layer
            // in order to check what is under the cursor later
            this.moveTo(node.stage.templayer);
            this.tempArrow = new Konva.Arrow({
                stroke: "black",
                fill: "black"
            });

            //delete any existing arrow
            if (node.trueArrow != null) {
                node.trueArrow.delete();
            }

            node.layer.add(this.tempArrow);
        });

        //update the temporary arrow
        this.dragCircle.on("dragmove", function () {
            canvas.dragging = true;
            //this is to offset the position of the stage
            var points = [this.tempX, this.tempY, this.x(), this.y()];
            this.tempArrow.points(points);
            node.layer.batchDraw();
        });
        let g = this.group;
        //when the drag has ended return the invisible circle to its original position, remove the temporary arrow and create a new connection between nodes if applicable
        this.dragCircle.on("dragend", function () {
            let touchPos = node.stage.getPointerPosition();
            let intersect = node.layer.getIntersection(touchPos);
            canvas.dragging = false;
            if (node.stage.inputDict.has(intersect)) {
                if (node.stage.inputDict.get(intersect).inputArrow != null) {
                    node.stage.inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, node.stage.inputDict.get(intersect), true, node.stage, node.layer);
            } else {
                //If not dropped on other element, make a popup to create either a new condition or action
                node.stage.staticlayer.add(new popup(node.stage, node.stage.staticlayer, [new conditionNode(node.stage, node.layer, node.canvas), new actionNode(node.stage, node.layer, node.canvas)], (selection) => {
                    let newNode = null;
                    newNode = node.canvas.addNode(selection);
                    new arrow(node, newNode, true, node.stage, node.layer);
                    if (newNode !== null) {
                        newNode.group.absolutePosition(touchPos);
                        newNode.updateArrows();
                    }
                }, "select a new condition or action").group);
                node.stage.staticlayer.moveToTop();
                node.stage.draw();
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

    darkenAll() {
        this._trueArrow.dest.darkenAll();
        this.layer.draw();
    }

    highlightPath(boolList) {
        this._trueArrow.dest.highlightPath(boolList);
        this.layer.draw();
    }

    getTrueDotPosition() {
        return [this.trueCircle.x() + this.group.x(), this.trueCircle.y() + this.group.y()];
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

    get canvas() {
        return this._canvas;
    }

    set canvas(value) {
        this._canvas = value;
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
