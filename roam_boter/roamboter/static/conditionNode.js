import arrow from "./arrow.js";
import popup from "./popup.js"


const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
//coordinates where every new element spawns
var spawnX = 0;
var spawnY = 0;

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

    //Create a new condition in a given stage and layer. If a valid ID is given it will also be filled with text
    // and if (all) its appropriate parameter(s) is given this will be included.
    constructor(stage, layer, condition) {

        this.group = new Konva.Group({
            draggable: true
        });

        this.condition = condition;
        this.stage = stage;
        this.layer = layer;

        if (this.condition != null) {
            this.conditionText = this.condition.toString();
            this.createTextObject(this.conditionText);
        }
        this.createRect();
        if (this.conditionText != null) {
            this.conditionTextObj.moveToTop();
        }

        this.createFalseCircle();
        this.createTrueCircle();
        this.trueDragCircle = this.createDragCircle(this.trueCircle, true, this.stage, layer);
        this.falseDragCircle = this.createDragCircle(this.falseCircle, false, this.stage, layer);
        this.createInputCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows(node.stage);
            console.log("dragmove");
        });

        this.group.on("dragend", function () {
            var touchPos = node.stage.getPointerPosition();
            console.log("dragend");
            console.log(node.stage.staticlayer.getIntersection(touchPos));
            if (node.stage.staticlayer.getIntersection(touchPos) != null) {
                node.remove();
            }
        });

        this.group.on("click", () => {
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });

        this.stage.draw();

    }

    //Edit the text of a condition and with that its size and location of its input/true/false circles
    editCondition(id, distance, object, label, health) {
        this.condition.editCondition(id, distance, object, label, health);
        this.conditionText = this.createTextObject(this.condition.toString());
        this.setAssetSizes()
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
        return this.trueArrow.dest;
    }

    falseChild() {
        return this.falseArrow.dest;
    }

    jsonify() {
        let node = this.rect;
        let tree = {};

        //case Condition:
        switch (this.condition.id) {
            //distance to nearest object greater than distance
            case 1:
                tree.condition = {
                    "type-id": 1,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {
                        "distance": this.condition.distance,
                        "object": this.condition.object
                    },
                    "position:": node.getAbsolutePosition()
                };

                return tree;

            //object visible
            case 2:
                tree.condition = {
                    "type-id": 2,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object},
                    "position:": node.getAbsolutePosition()

                };
                return tree;
                ;

            //aimed at object
            case 3:
                tree.condition = {
                    "type-id": 3,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object},
                    "position:": node.getAbsolutePosition()

                };

                return tree;
                ;

            // if object exists
            case 4:
                tree.condition = {
                    "type-id": 4,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object},
                    "position:": node.getAbsolutePosition()

                };

                return tree;

            //bullet ready
            case 5:
                tree.condition = {
                    "type-id": 5,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {},
                    "position:": node.getAbsolutePosition()

                };

                return tree;

            //if label set
            case 6:
                tree.condition = {
                    "type-id": 6,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"label": this.condition.label},
                    "position:": node.getAbsolutePosition()

                };

                return tree;

            //health greater than amount
            case 7:
                tree.condition = {
                    "type-id": 7,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"amount": this.condition.amount},
                    "position:": node.getAbsolutePosition()

                };


                return tree;

            default:
            //Raise error, wrong ID

        }
    }

    //circle to which connections can be made by dragging arrows on it
    createInputCircle() {
        this.inputCircle = new Konva.Circle({
            y: 0,
            x: this.rect.width() / 2,
            radius: circle_radius,
            fill: 'white',
            stroke: 'black',
        });
        this.inputCircleHitbox = new Konva.Circle({
            y: 0,
            x: this.rect.width() / 2,
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
            x: spawnX,
            y: spawnY,
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
                x: 0,
                y: 0,
                width: this.conditionTextObj.width(),
                height: this.conditionTextObj.height(),
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 2,
                cornerRadius: 10,
            });
        } else {
            this.rect = new Konva.Rect({
                x: 0,
                y: 0,
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
            y: this.rect.height(),
            x: 0,
            radius: circle_radius,
            fill: 'red',
            stroke: 'black',
        });
        this.group.add(this.falseCircle);
    }

    //create a circle from which the true connection is made to another node
    createTrueCircle() {
        this.trueCircle = new Konva.Circle({
            y: this.rect.height(),
            x: this.rect.width(),
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
            y: circle.y(),
            x: circle.x(),
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
            console.log(intersect);
            console.log(node.stage.inputDict[intersect]);
            if (node.stage.inputDict.has(intersect)) {
                if (node.stage.inputDict.get(intersect).inputArrow != null) {
                    node.stage.inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, node.stage.inputDict.get(intersect), condition, node.stage, node.layer);
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

}