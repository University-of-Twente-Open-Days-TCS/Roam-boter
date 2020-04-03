import Arrow from "./Arrow.js";
import Konva from "konva"
import Popup from "./Popup.js";
import ActionNode from "./ActionNode.js";
import ConditionNode from "./ConditionNode.js";

//The default dimensions of this node
const blockHeight = 40;
const blockWidth = 100;

//The size if its outgoing circle and its hitbox
const circle_radius = 10;
const hitboxCircleRadius = 25;

/** Startnode, the top of the decision tree, has one outgoing circle **/
export default class StartNode {

    arrow;

    _trueArrow;
    _layer;
    _stage;
    _canvas;
    _group;
    _rect;
    _trueCircle;
    _dragCircle;

    /** Create the startnode on the given stage, layer and canvas **/
    constructor(stage, layer, canvas) {
        this.canvas = canvas;
        this.stage = stage;
        this.layer = layer;
        this.createGroup(stage);
        this.canvas = canvas;

    }

    /** Create the group with the node, text and its (drag)circle **/
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

    /** Create the rect Obj for the node **/
    createRect() {
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: blockWidth,
            height: blockHeight,
            fill: 'black',
            stroke: this.canvas.start_node.stroke_color,
            strokeWidth: this.canvas.start_node.stroke_width,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
    }

    // TODO: lettertype etc
    /** Create the text Obj for the node with contents 'Start' **/
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

    /** Create a circle from which the true connection is made to another node **/
    createTrueCircle() {
        this.trueCircle = new Konva.Circle({
            y: this.rect.height(),
            x: this.rect.width() / 2,
            radius: circle_radius,
            fill: this.canvas.true_circle.fill,
            stroke: this.canvas.true_circle.stroke_color,
            strokeWidth: this.canvas.true_circle.stroke_width
        });
        this.group.add(this.trueCircle);

    }


    /** Create an invisible circle used only for making a new connection between nodes **/
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

        //when the invisible circle starts to be dragged create a new temporary Arrow
        this.dragCircle.on("dragstart", function () {
            this.tempX = this.x() + node.group.x();
            this.tempY = this.y() + node.group.y();
            canvas.dragging = true;

            //it is important that the invisible circle is in a different layer
            // in order to check what is under the cursor later
            this.moveTo(node.stage.templayer);
            this.tempArrow = new Konva.Arrow({
                stroke: 'black',
                fill: 'black'
            });

            //delete any existing Arrow
            if (node.trueArrow != null) {
                node.trueArrow.delete();
            }

            node.layer.add(this.tempArrow);
        });

        //update the temporary Arrow
        this.dragCircle.on("dragmove", function () {
            canvas.dragging = true;
            //this is to offset the position of the stage
            var points = [this.tempX, this.tempY, this.x(), this.y()];
            this.tempArrow.points(points);
            node.layer.batchDraw();
        });
        let g = this.group;

        //when the drag has ended return the invisible circle to its original position, remove the temporary Arrow and create a new connection between nodes if applicable
        this.dragCircle.on("dragend", function () {
            let touchPos = node.stage.getPointerPosition();
            let intersect = node.layer.getIntersection(touchPos);
            canvas.dragging = false;
            if (node.stage.inputDict.has(intersect)) {
                if (node.stage.inputDict.get(intersect).inputArrow != null) {
                    node.stage.inputDict.get(intersect).inputArrow.delete();
                }
                new Arrow(node, node.stage.inputDict.get(intersect), true, node.stage, node.layer);
            } else {

                //If not dropped on other element, make a Popup to create either a new Condition or Action
                node.stage.staticlayer.add(new Popup(node.stage, node.stage.staticlayer, [new ConditionNode(node.stage, node.layer, node.canvas), new ActionNode(node.stage, node.layer, node.canvas)], (selection) => {
                    let newNode = null;
                    newNode = node.canvas.addNode(selection);
                    new Arrow(node, newNode, true, node.stage, node.layer);
                    if (newNode !== null) {
                        newNode.group.absolutePosition(touchPos);
                        newNode.updateArrows();
                    }
                }, "select a new Condition or Action").group);
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

    /** Recursively darkens its childnodes, used in a replay **/
    darkenAll() {
        this.trueArrow.dest.darkenAll();
        this.layer.draw();
    }

    /** Highlight its childnode according to the active path, used in a replay **/
    highlightPath(boolList) {
        this.trueArrow.dest.highlightPath(boolList);
        this.trueArrow.arrowline.stroke("green");
        this.trueArrow.arrowline.strokeWidth(4);
        this.layer.draw();
    }

    getTrueDotPosition() {
        return [this.trueCircle.x() + this.group.x(), this.trueCircle.y() + this.group.y()];
    }

    /** Calls its Arrow to update their position**/
    updateArrows() {
        if (this.trueArrow != null) {
            this.trueArrow.update();
        }
    }

    /** All getters & setters **/
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
