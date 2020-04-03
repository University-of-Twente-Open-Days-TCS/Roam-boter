import Arrow from "./Arrow.js";
import Popup from "./Popup.js"
import Condition from "./Condition.js";
import Konva from "konva";
import AIValidationError from "../Errors/AIValidationError.js";
import ErrorCircle from "../Errors/ErrorCircle.js";
import ActionNode from "./ActionNode.js";

//The default dimensions of a ConditionNode
const blockHeight = 40;
const blockWidth = 100;

//The radius of the in- and outputcircles and their hitboxes
const circle_radius = 10;
const hitboxCircleRadius = 25;

//The default spawnpoint of the node
const spawnPoint = {x: 0, y: 0};


export default class ConditionNode {


    //The node itself
    _rect;

    //The three arrows connecting a ConditionNode
    _inputArrow;
    _trueArrow;
    _falseArrow;

    //The circles and their hitboxes
    _inputCircle;
    _inputCircleHitbox;
    _trueCircle;
    _trueDragCircle;
    _falseCircle;
    _falseDragCircle;


    //The stage, layer and group in which the node operates
    _stage;
    _layer;
    _group;

    //The Condition which is in this ConditionNode
    _condition;

    //The text which corresponds to the Condition and its Konva Obj
    _conditionText;
    _conditionTextObj;

    //The position of the ConditionNode
    _position;


    /** Create a new Condition in a given stage and layer. If a valid ID is given it will also be filled with text
     * and if (all) its appropriate parameter(s) is given this will be included. **/
    constructor(stage, layer, canvas, condition, position = spawnPoint) {
        this.canvas = canvas;
        this.trashcan = stage.trashcan;
        this.group = new Konva.Group({
            draggable: true
        });

        this.condition = condition;
        this.stage = stage;
        this.layer = layer;
        this.position = position;

        if (this.condition != null) {
            this.conditionText = this.condition.toString();
            this.createTextObject(this.conditionText);
        } else {
            this.createTextObject("");
        }

        this.createRect();
        if (this.conditionText != null) {
            this.conditionTextObj.moveToTop();
        }

        this.createFalseCircle();
        this.createTrueCircle();
        this.trueDragCircle = this.createDragCircle(this.trueCircle, true);
        this.falseDragCircle = this.createDragCircle(this.falseCircle, false);
        this.createInputCircle();
        this.group.on("dragstart", () => {
            this.canvas.dragging = true;
        });

        this.group.on("dragmove", () => {
            this.canvas.dragging = true;
            this.updateArrows(this.stage);
            this.updateArrows();
            let touchPos = this.stage.getPointerPosition();

            //If while moving the node is hovered over trashcan, open trashcan
            if (this.stage.staticlayer.getIntersection(touchPos) === this.trashcan) {
                this.stage.trashcan.fire('touchstart', {
                    type: 'touchstart',
                    target: this.stage.trashcan
                });
            } else {

                //If node is no longer hovered over trashcan, close trashcan
                this.stage.trashcan.fire('touchend', {
                    type: 'touchend',
                    target: this.stage.trashcan

                });
            }
        });

        this.group.on("dragend", () => {
            this.canvas.dragging = false;
            let touchPos = this.stage.getPointerPosition();

            //If node is released above trashcan, remove it and close trashcan
            if (this.stage.staticlayer.getIntersection(touchPos) === this.trashcan) {
                this.remove();
                this.stage.trashcan.fire('touchend', {
                    type: 'touchend',
                    target: this.stage.trashcan

                });
                this.layer.draw();
                this.stage.staticlayer.draw();

            }
        });

        //Popup to edit the Condition
        this.group.on("click tap", () => {
            this.stage.staticlayer.add(new Popup(this.stage, this.stage.staticlayer, this.generateConditionList(), this.setCondition.bind(this), "select a Condition").group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });
        this.remainingOptions = [{options: this.generateConditionList(), f: (cndtn) => this.setCondition(cndtn)}];
        this.stage.draw();

    }

    /** Set the new text in the ConditionNode and adapt its size and position of input/false/truecircles **/
    setCondition(cond) {
        this.condition = cond;
        this.conditionTextObj.text(this.condition.toString());
        this.conditionTextObj.moveToTop();
        this.setAssetSizes();

        //make sure the text does not cover the drag&inputcircles
        this.inputCircleHitbox.moveToTop();
        this.trueDragCircle.moveToTop();
        this.falseDragCircle.moveToTop();
    }

    /** Sets the size of the node and its input/false/true-nodes around **/
    setAssetSizes() {
        if (this.conditionTextObj.text != null) {
            this.rect.width(this.conditionTextObj.width());
            this.rect.height(this.conditionTextObj.height());
        } else {
            this.rect.width(blockWidth);
            this.rect.height(blockHeight);
        }

        //adjust inputcircles & hitbox
        this.inputCircle.y(this.rect.y());
        this.inputCircle.x(this.rect.x() + (this.rect.width() / 2));
        this.inputCircleHitbox.y(this.rect.y());
        this.inputCircleHitbox.x(this.rect.x() + this.rect.width() / 2);

        //adjust true&falsecircles & hitboxes
        this.falseCircle.y(this.rect.y() + this.rect.height());
        this.falseCircle.x(this.rect.x());
        this.trueCircle.y(this.rect.y() + this.rect.height());
        this.trueCircle.x(this.rect.x() + this.rect.width());
        this.falseDragCircle.y(this.rect.y() + this.rect.height());
        this.falseDragCircle.x(this.rect.x());
        this.trueDragCircle.y(this.rect.y() + this.rect.height());
        this.trueDragCircle.x(this.rect.x() + this.rect.width());

        this.trueDragCircle.originalX = this.trueDragCircle.x();
        this.trueDragCircle.originalY = this.trueDragCircle.y();
        this.falseDragCircle.originalX = this.falseDragCircle.x();
        this.falseDragCircle.originalY = this.falseDragCircle.y();


        //adjust arrows
        this.updateArrows();

        this.stage.draw();

    }

    /** Call its possible connected arrows to update their position **/
    updateArrows() {
        if (this.trueArrow != null) {
            this.trueArrow.update();
        }
        if (this.falseArrow != null) {
            this.falseArrow.update();
        }
        if (this.inputArrow != null) {
            this.inputArrow.update();
        }
    }

    /** Returns the node connected to its true-circle, or raises an error if none is attached, used in jsonify() **/
    trueChild() {
        try {
            return this.trueArrow.dest;
        } catch (err) {
            if (err instanceof TypeError) {
                new ErrorCircle({x: this.trueCircle.x(), y: this.trueCircle.y()}, this, this.layer);
                throw new AIValidationError("A Condition is missing a 'true'-Arrow!");
            }
        }
    }

    /** Returns the node connected to its false-circle, or raises an error if none is attached, used in jsonify() **/
    falseChild() {
        try {
            return this.falseArrow.dest;
        } catch (err) {
            if (err instanceof TypeError) {
                new ErrorCircle({x: this.falseCircle.x(), y: this.falseCircle.y()}, this, this.layer);
                throw new AIValidationError("A Condition is missing a 'false'-Arrow!");
            }
        }
    }

    /** Generate the list of possible conditions **/
    generateConditionList() {
        return [
            new Condition(1),
            new Condition(2),
            new Condition(3),
            // new Condition(4),
            new Condition(5),
            new Condition(6),
            new Condition(7),
        ]
    }

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)});

    /** Returns the json of this node and its children, and raises errors if the tree is not complete **/
    jsonify(startNodePos) {
        let node = this.rect;
        let tree = {};

        if (!this.condition) {
            new ErrorCircle(this.getRectMiddlePos(), this, this.layer);
            throw new AIValidationError("A Condition is not yet defined!");
        }

        if (!this.condition.isValid()) {
            new ErrorCircle(this.getRectMiddlePos(), this, this.layer);
            throw new AIValidationError("A Condition misses one or more attributes!");
        }

        //case Condition:
        switch (this.condition.id) {
            //Distance to nearest Obj greater than Distance
            case 1:
                tree.condition = {
                    "type_id": 1,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {
                        "distance": this.condition.distance.id,
                        "obj": this.condition.object.id
                    },
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };

                return tree;

            //Obj visible
            case 2:
                tree.condition = {
                    "type_id": 2,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };
                return tree;


            //aimed at Obj
            case 3:
                tree.condition = {
                    "type_id": 3,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };

                return tree;


            // if Obj exists
            case 4:
                tree.condition = {
                    "type_id": 4,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };

                return tree;

            //bullet ready
            case 5:
                tree.condition = {
                    "type_id": 5,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))

                };

                return tree;

            //if Label set
            case 6:
                tree.condition = {
                    "type_id": 6,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {"label": this.condition.label.id},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };

                return tree;

            //Health greater than amount
            case 7:
                tree.condition = {
                    "type_id": 7,
                    "child_true": this.trueChild().jsonify(startNodePos),
                    "child_false": this.falseChild().jsonify(startNodePos),
                    "attributes": {"health": this.condition.health.id},
                    "position": this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()))
                };


                return tree;

            default:
                new ErrorCircle(this.getRectMiddlePos());
                throw new AIValidationError("The Condition has an unknown ID!");

        }
    }

    subtractPosAFromPosB(posA, posB) {
        let posX = posB.x - posA.x;
        let posY = posB.y - posA.y;
        return {x: posX, y: posY};
    }


    /** Create circle to which connections can be made by dragging arrows on it **/
    createInputCircle() {
        this.inputCircle = new Konva.Circle({
            y: this.position.y,
            x: this.position.x + this.rect.width() / 2,
            radius: circle_radius,
            fill: this.canvas.input_circle.fill,
            stroke: this.canvas.input_circle.stroke_color,
            strokeWidth: this.canvas.input_circle.stroke_width
        });
        this.inputCircleHitbox = new Konva.Circle({
            y: this.position.y,
            x: this.position.x + this.rect.width() / 2,
            radius: hitboxCircleRadius,
            fill: this.canvas.input_circle.fill,
            stroke: this.canvas.input_circle.stroke_color,
            opacity: 0
        });

        this.stage.inputDict.set(this.inputCircleHitbox, this);

        this.group.add(this.inputCircle);
        this.group.add(this.inputCircleHitbox);
    }

    /** create Konva text for in the Condition **/
    createTextObject(conditionText) {
        this.conditionTextObj = new Konva.Text({
            x: this.position.x,
            y: this.position.y,
            text: conditionText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: '"Lucida Console", Monaco, monospace',
            align: 'left',
            padding: 13
        });
        this.group.add(this.conditionTextObj);
    }

    /** Create base rectangle which contains the Condition text **/
    createRect() {
        if (this.conditionText != null) {
            this.rect = new Konva.Rect({
                x: this.position["x"],
                y: this.position["y"],
                width: this.conditionTextObj.width(),
                height: this.conditionTextObj.height(),
                fill: this.canvas.condition_node.fill,
                stroke: this.canvas.condition_node.stroke_color,
                strokeWidth: this.canvas.condition_node.stroke_width,
                cornerRadius: this.canvas.condition_node.corner_radius,
            });
        } else {
            this.rect = new Konva.Rect({
                x: this.position.x,
                y: this.position.y,
                width: blockWidth,
                height: blockHeight,
                fill: this.canvas.condition_node.fill,
                stroke: this.canvas.condition_node.stroke_color,
                strokeWidth: this.canvas.condition_node.stroke_width,
                cornerRadius: this.canvas.condition_node.corner_radius,
            });
        }
        this.group.add(this.rect);
    }

    /** create a circle from which the false connection is made to another node **/
    createFalseCircle() {
        this.falseCircle = new Konva.Circle({
            y: this.position.y + this.rect.height(),
            x: this.position.x,
            radius: circle_radius,
            fill: this.canvas.false_circle.fill,
            stroke: this.canvas.false_circle.stroke_color,
            strokeWidth: this.canvas.false_circle.stroke_width
        });
        this.group.add(this.falseCircle);
    }

    /** create a circle from which the true connection is made to another node **/
    createTrueCircle() {
        this.trueCircle = new Konva.Circle({
            y: this.position.y + this.rect.height(),
            x: this.position.x + this.rect.width(),
            radius: circle_radius,
            fill: this.canvas.true_circle.fill,
            stroke: this.canvas.true_circle.stroke_color,
            strokeWidth: this.canvas.true_circle.stroke_width
        });
        this.group.add(this.trueCircle);

    }

    /** Creates an invisible circle used only for making a new connection between nodes,
     * based on Condition will create one for true or for false **/
    createDragCircle(circle, condition) {

        let node = this;
        let dragCircle = new Konva.Circle({
            draggable: true,
            y: circle.y(),
            x: circle.x(),
            radius: hitboxCircleRadius,
            fill: 'black',
            opacity: 0
        });


        this.group.add(dragCircle);

        dragCircle.originalX = dragCircle.x();
        dragCircle.originalY = dragCircle.y();
        let canvas = this.canvas;

        //when the invisible circle starts to be dragged create a new temporary Arrow
        dragCircle.on("dragstart", function () {
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
            if (condition && node.trueArrow != null) {
                node.trueArrow.delete();
            } else if (!condition && node.falseArrow != null) {
                node.falseArrow.delete();
            }

            node.layer.add(this.tempArrow);
        });

        //update the temporary Arrow
        dragCircle.on("dragmove", function () {
            //this is to offset the position of the stage
            canvas.dragging = true;
            let points = [this.tempX, this.tempY, this.x(), this.y()];
            this.tempArrow.points(points);
            node.layer.batchDraw();
        });
        let g = this.group;

        //when the drag has ended, return the invisible circle to its original position, remove the temporary Arrow
        // and create a new connection between nodes if applicable
        dragCircle.on("dragend", function () {
            let touchPos = node.stage.getPointerPosition();
            let intersect = node.layer.getIntersection(touchPos);
            canvas.dragging = false;

            //If Arrow is dropped on another element
            if (intersect != null) {
                //If the other element is an inputnode
                if (node.stage.inputDict.has(intersect)) {

                    //If the inputnode already had an Arrow, remove that one
                    if (node.stage.inputDict.get(intersect).inputArrow != null) {
                        node.stage.inputDict.get(intersect).inputArrow.delete();
                    }

                    //Create new Arrow between the two nodes
                    new Arrow(node, node.stage.inputDict.get(intersect), condition, node.stage, node.layer);
                }
            } else {
                //If not dropped on other element, make a Popup to create either a new Condition or Action
                node.stage.staticlayer.add(new Popup(node.stage, node.stage.staticlayer, [new ConditionNode(node.stage, node.layer, node.canvas), new ActionNode(node.stage, node.layer, node.canvas)], (selection) => {
                    let newNode = null;
                    newNode = node.canvas.addNode(selection);
                    new Arrow(node, newNode, condition, node.stage, node.layer);
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
            node.layer.draw();
            node.stage.templayer.draw();
        });
        return dragCircle;
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }

    toString() {
        return "Condition"
    }

    getTrueDotPosition() {
        return [this.trueCircle.x() + this.group.x(), this.trueCircle.y() + this.group.y()];
    }

    getFalseDotPosition() {
        return [this.falseCircle.x() + this.group.x(), this.falseCircle.y() + this.group.y()];
    }

    getInputDotPosition() {
        return [this.inputCircle.x() + this.group.x(), this.inputCircle.y() + this.group.y()];
    }

    /** Remove this node and its in/outgoing arrows **/
    remove() {
        if (this.trueArrow != null) {
            this.trueArrow.delete();
        }
        if (this.falseArrow != null) {
            this.falseArrow.delete();
        }
        if (this.inputArrow != null) {
            this.inputArrow.delete();
        }
        this.group.destroy();
        this.layer.draw();
    }

    /** Get the middle position of the node, used in showing an ErrorRing **/
    getRectMiddlePos() {
        let x = this.rect.x() + this.rect.width() / 2;
        let y = this.rect.y() + this.rect.height() / 2;
        return {x: x, y: y};
    }

    /** Darken this node and its children, used in a replay **/
    darkenAll() {
        this.group.filters([Konva.Filters.Brighten]);
        this.group.brightness(-0.5);
        this.trueArrow.dest.darkenAll();
        this.falseArrow.dest.darkenAll();
        this.trueArrow.arrowline.fill("black");
        this.falseArrow.arrowline.fill("black");
        this.trueArrow.arrowline.strokeWidth(2);
        this.falseArrow.arrowline.strokeWidth(2);
        this.falseCircle.cache();
        this.falseCircle.filters([Konva.Filters.Brighten]);
        this.falseCircle.brightness(0);
        this.trueCircle.cache();
        this.trueCircle.filters([Konva.Filters.Brighten]);
        this.trueCircle.brightness(0);
        this.group.cache();
    }

    /** Highlight this node and one of their children, used in a replay **/
    highlightPath(boolList) {
        this.group.brightness(0);
        if (boolList.shift()) {
            this.trueArrow.dest.highlightPath(boolList);
            this.trueArrow.arrowline.stroke("green");
            this.trueArrow.arrowline.strokeWidth(4);
            this.falseCircle.cache();
            this.falseCircle.filters([Konva.Filters.Brighten]);
            this.falseCircle.brightness(-0.5);
            this.group.cache();
        } else {
            this.falseArrow.dest.highlightPath(boolList);
            this.falseArrow.arrowline.stroke("red");
            this.falseArrow.arrowline.strokeWidth(4);
            this.trueCircle.cache();
            this.trueCircle.filters([Konva.Filters.Brighten]);
            this.trueCircle.brightness(-0.5);
            this.group.cache();
        }
    }

    /** All getters & setters **/
    get inputArrow() {
        return this._inputArrow;
    }

    set inputArrow(value) {
        this._inputArrow = value;
    }

    get trueArrow() {
        return this._trueArrow;
    }

    set trueArrow(value) {
        this._trueArrow = value;
    }

    get falseArrow() {
        return this._falseArrow;
    }

    set falseArrow(value) {
        this._falseArrow = value;
    }

    get conditionText() {
        return this._conditionText;
    }

    set conditionText(value) {
        this._conditionText = value;
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

    get group() {
        return this._group;
    }

    set group(value) {
        this._group = value;
    }


    get condition() {
        return this._condition;
    }

    set condition(value) {
        this._condition = value;
    }

    get inputCircle() {
        return this._inputCircle;
    }

    set inputCircle(value) {
        this._inputCircle = value;
    }

    get inputCircleHitbox() {
        return this._inputCircleHitbox;
    }

    set inputCircleHitbox(value) {
        this._inputCircleHitbox = value;
    }

    get trueCircle() {
        return this._trueCircle;
    }

    set trueCircle(value) {
        this._trueCircle = value;
    }

    get trueDragCircle() {
        return this._trueDragCircle;
    }

    set trueDragCircle(value) {
        this._trueDragCircle = value;
    }

    get falseCircle() {
        return this._falseCircle;
    }

    set falseCircle(value) {
        this._falseCircle = value;
    }

    get falseDragCircle() {
        return this._falseDragCircle;
    }

    set falseDragCircle(value) {
        this._falseDragCircle = value;
    }

    get rect() {
        return this._rect;
    }

    set rect(value) {
        this._rect = value;
    }

    get conditionTextObj() {
        return this._conditionTextObj;
    }

    set conditionTextObj(value) {
        this._conditionTextObj = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }

}
