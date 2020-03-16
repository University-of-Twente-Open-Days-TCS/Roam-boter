import arrow from "./arrow.js";
import popup from "./popup.js"
import condition from "./condition.js";
import object from "./object.js";
import distance from "./distance.js";
import label from "./label.js";
import health from "./health.js";
import Konva from "konva";
import AIValidationError from "../Errors/AIValidationError.js";


//TODO place all these variables somewhere nicer
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
const spawnPoint = {x: 0, y: 0};


const objectList = [
    new object(1),
    new object(2),
    new object(3),
    new object(4),
    new object(5),
    new object(6),
    new object(7),
    new object(8),
    new object(9),
    new object(10)

];

const distanceList = [
    new distance(1),
    new distance(2),
    new distance(3)
];

const healthList = [
    new health(0),
    new health(20),
    new health(40),
    new health(60),
    new health(80),

];

//LABELS DO NOT YET EXIST
const labelList = [
    new label(0),
    new label(1),
    new label(2),
    new label(3),
    new label(4),

];


export default class conditionNode {


    //The node itself
    _rect;

    //The three arrows connecting a conditionNode
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

    //The condition which is in this conditionNode
    _condition;

    //The text which corresponds to the condition
    _conditionText;

    //
    _conditionTextObj;

    //The position of the conditionNode
    _position;


//Create a new condition in a given stage and layer. If a valid ID is given it will also be filled with text
    // and if (all) its appropriate parameter(s) is given this will be included.
    constructor(stage, layer, condition, position = spawnPoint) {
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
        //TODO IF MOVING BECOMES SLOW, MAKE SURE THIS DOES NOT CHECK 24/7
        this.group.on("dragmove", () => {
            this.updateArrows(this.stage);
            let touchPos = this.stage.getPointerPosition();

            //If while moving the node is hovered over trashcan, open trashcan
            if (this.stage.staticlayer.getIntersection(touchPos) != null) {
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
            let touchPos = this.stage.getPointerPosition();

            //If node is released above trashcan, remove it and close trashcan
            if (this.stage.staticlayer.getIntersection(touchPos) != null) {
                this.remove();
                this.stage.trashcan.fire('touchend', {
                    type: 'touchend',
                    target: this.stage.trashcan

                });
                this.layer.draw();
                this.stage.staticlayer.draw();

            }
        });

        //Popup to edit the condition
        this.group.on("click tap", () => {

            //TODO could just make this by calling editCondition with object null (no condition yet) probs
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, this.generateConditionList(), this.editCondition.bind(this)).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });


        this.stage.draw();

    }

    //Edits an attibute of the condition or the condition itself.
    editCondition(attribute) {
        //check whether attribute is condition, distance, etc, then set it accordingly
        switch (attribute.constructor) {
            case (condition):
                this.condition = attribute;
                break;
            case (distance):
                this.condition.distance = attribute;
                break;
            case (object):
                this.condition.object = attribute;
                break;
            case (label):
                this.condition.label = attribute;
                break;
            case (health):
                this.condition.health = attribute;
                break;
            default:
                //Should never end up here
                return null;
        }

        //Set the new text in the conditionNode and adapt its input/false/truecircles
        if (this.condition != null) {
            this.conditionTextObj.text(this.condition.toString());
            this.conditionTextObj.moveToTop();


        }
        this.setAssetSizes();

        //make sure the text does not cover the drag&inputcircles
        this.inputCircleHitbox.moveToTop();
        this.trueDragCircle.moveToTop();
        this.falseDragCircle.moveToTop();

        //if not all necessary info is known, create a popup asking for additional info
        if (!this.condition.isValid()) {
            this.createAdditionalInfoPopup();
        }


    }


    //Creates a popup asking for additional information concerning the selected condition
    createAdditionalInfoPopup() {
        let wantedList;
        switch (this.condition.id) {
            case 1:
                //First ask for object, if not yet known
                if (this.condition.object == null) {
                    wantedList = objectList;
                } else {
                    //Otherwise prompt for object
                    wantedList = distanceList;
                }
                break;
            case 2:
                wantedList = objectList;
                break;
            case 3:
                wantedList = objectList;
                break;
            case 4:
                wantedList = objectList;
                break;
            case 5:
                //empty by design, no further prompts necessary
                break;
            case 6:
                wantedList = labelList;
                break;
            case 7:
                wantedList = healthList;
                break;
            default:
                break;
        }
        //If there is still an attribute missing, will ask for it via the popup
        if (wantedList != null) {
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, wantedList, this.editCondition.bind(this)).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        }
    }


    //sets the size of the node and its input/false/true-nodes around
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
        this.updateArrows(this.stage);

        this.stage.draw();

    }


    updateArrows(stage) {
        if (this.trueArrow != null) {
            this.trueArrow.update(stage);
        }
        if (this.falseArrow != null) {
            this.falseArrow.update(stage);
        }
        if (this.inputArrow != null) {
            this.inputArrow.update(stage);
        }
    }


    trueChild() {
        try {
            return this.trueArrow.dest;
        } catch (err) {
            if (err instanceof TypeError) {
                throw new AIValidationError("A condition is missing a 'true'-arrow!");
            }
        }
    }

    falseChild() {
        try {
            return this.falseArrow.dest;
        } catch (err) {
            if (err instanceof TypeError) {
                throw new AIValidationError("A condition is missing a 'false'-arrow!");
            }
        }
    }

    generateConditionList() {
        let conditionList = [
            new condition(1),
            new condition(2),
            new condition(3),
            new condition(4),
            new condition(5),
            new condition(6),
            new condition(7),
        ];
        return conditionList
    }

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)});

    jsonify() {
        let node = this.rect;
        let tree = {};

        try {
            //Throw error if Condition is missing an attribute, caught a few lines later
            if (!this.condition.isValid()) {
                throw new AIValidationError;
            }
        } catch (err) {
            //Catch the error where the Condition does not even exist
            if (err instanceof TypeError) {
                throw new AIValidationError("A condition is not yet defined!");
            } else {
                throw new AIValidationError("A condition misses one or more attributes!");
            }
        }

        //case Condition:
        switch (this.condition.id) {
            //distance to nearest object greater than distance
            case 1:
                tree.condition = {
                    "type_id": 1,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {
                        "distance": this.condition.distance.id,
                        "obj": this.condition.object.id
                    },
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };

                return tree;

            //object visible
            case 2:
                tree.condition = {
                    "type_id": 2,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };
                return tree;


            //aimed at object
            case 3:
                tree.condition = {
                    "type_id": 3,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };

                return tree;


            // if object exists
            case 4:
                tree.condition = {
                    "type_id": 4,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {"obj": this.condition.object.id},
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };

                return tree;

            //bullet ready
            case 5:
                tree.condition = {
                    "type_id": 5,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {},
                    "position": this.intifyPosition(node.getAbsolutePosition())

                };

                return tree;

            //if label set
            case 6:
                tree.condition = {
                    "type_id": 6,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {"label": this.condition.label.id},
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };

                return tree;

            //health greater than amount
            case 7:
                tree.condition = {
                    "type_id": 7,
                    "child_true": this.trueChild().jsonify(),
                    "child_false": this.falseChild().jsonify(),
                    "attributes": {"health": this.condition.health.id},
                    "position": this.intifyPosition(node.getAbsolutePosition())
                };


                return tree;

            default:
            //Raise error, wrong ID

        }
    }


    //circle to which connections can be made by dragging arrows on it
    createInputCircle() {
        this.inputCircle = new Konva.Circle({
            y: this.position.y,
            x: this.position.x + this.rect.width() / 2,
            radius: circle_radius,
            fill: 'white',
            stroke: 'black',
        });
        this.inputCircleHitbox = new Konva.Circle({
            y: this.position.y,
            x: this.position.x + this.rect.width() / 2,
            radius: hitboxCircleRadius,
            fill: 'white',
            stroke: 'black',
            opacity: 0
        });

        this.stage.inputDict.set(this.inputCircleHitbox, this);

        this.group.add(this.inputCircle);
        this.group.add(this.inputCircleHitbox);
    }

    //create text for in the condition
    createTextObject(conditionText) {
        this.conditionTextObj = new Konva.Text({
            x: this.position.x,
            y: this.position.y,
            text: conditionText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        this.group.add(this.conditionTextObj);
    }


    //base rectangle which contains the condition text
    createRect() {
        if (this.conditionText != null) {
            this.rect = new Konva.Rect({
                x: this.position["x"],
                y: this.position["y"],
                width: this.conditionTextObj.width(),
                height: this.conditionTextObj.height(),
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 2,
                cornerRadius: 10,
            });
        } else {
            this.rect = new Konva.Rect({
                x: this.position.x,
                y: this.position.y,
                width: blockWidth,
                height: blockHeight,
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 2,
                cornerRadius: 10,
            });
        }
        this.group.add(this.rect);
    }

    //create a circle from which the false connection is made to another node
    createFalseCircle() {
        this.falseCircle = new Konva.Circle({
            y: this.position.y + this.rect.height(),
            x: this.position.x,
            radius: circle_radius,
            fill: 'red',
            stroke: 'black',
        });
        this.group.add(this.falseCircle);
    }

    //create a circle from which the true connection is made to another node
    createTrueCircle() {
        this.trueCircle = new Konva.Circle({
            y: this.position.y + this.rect.height(),
            x: this.position.x + this.rect.width(),
            radius: circle_radius,
            fill: 'green',
            stroke: 'black',
        });
        this.group.add(this.trueCircle);

    }

    //creates an invisible circle used only for making a new connection between nodes,
    // based on condition will create one for true or for false
    createDragCircle(circle, condition) {
        let node = this;
        let dragCircle = new Konva.Circle({
            draggable: true,
            y: this.position.y + circle.y(),
            x: this.position.x + circle.x(),
            radius: hitboxCircleRadius,
            fill: 'black',
            opacity: 0
        });


        this.group.add(dragCircle);

        dragCircle.originalX = dragCircle.x();
        dragCircle.originalY = dragCircle.y();

        //when the invisible circle starts to be dragged create a new temporary arrow
        dragCircle.on("dragstart", function () {
            this.tempX = this.getAbsolutePosition().x;
            this.tempY = this.getAbsolutePosition().y;

            //it is important that the invisible circle is in a different layer
            // in order to check what is under the cursor later
            this.moveTo(node.stage.templayer);
            this.tempArrow = new Konva.Arrow({
                stroke: "black",
                fill: "black"
            });

            //delete any existing arrow
            if (condition && node.trueArrow != null) {
                node.trueArrow.delete();
            } else if (!condition && node.falseArrow != null) {
                node.falseArrow.delete();
            }

            node.stage.templayer.add(this.tempArrow);
        });

        //update the temporary arrow
        dragCircle.on("dragmove", function () {
            //this is to offset the position of the stage
            this.tempArrow.absolutePosition({x: 0, y: 0});
            var points = [this.tempX, this.tempY, this.getAbsolutePosition().x, this.getAbsolutePosition().y];
            this.tempArrow.points(points.map(function (p) {
                return p / node.stage.scale
            }));
            node.stage.templayer.batchDraw();
        });
        let g = this.group;

        //when the drag has ended, return the invisible circle to its original position, remove the temporary arrow
        // and create a new connection between nodes if applicable
        dragCircle.on("dragend", function () {
            var touchPos = node.stage.getPointerPosition();
            var intersect = node.layer.getIntersection(touchPos);
            //If arrow is dropped on another element
            if (intersect != null) {
                //If the other element is an inputnode
                if (node.stage.inputDict.has(intersect)) {
                    //If the inputnode already had an arrow, remove that one
                    if (node.stage.inputDict.get(intersect).inputArrow != null) {
                        node.stage.inputDict.get(intersect).inputArrow.delete();
                    }
                    //Create new arrw between the two nodes
                    new arrow(node, node.stage.inputDict.get(intersect), condition, node.stage, node.layer);
                }
            } else {
                //If not dropped on other element, make a popup to create either a new condition or action
                //TODO make popup to select 'new condition/new action'

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

    getTrueDotPosition() {
        let pos = this.trueCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

    getFalseDotPosition() {
        let pos = this.falseCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

    getInputDotPosition() {
        let pos = this.inputCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

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

    //Getters and setters for arrows and conditiontext
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
