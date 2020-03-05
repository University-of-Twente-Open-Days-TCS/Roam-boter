// first we need to create a stage
var stageWidth = window.innerWidth;
var stageHeight = window.innerHeight;
// var stageWidth = 1000;
// var stageHeight = 1000;
//-----------------------------------------------------------
// NOT OUR CODE. taken from https://konvajs.org/docs/sandbox/Multi-touch_Scale_Stage.html

// by default Konva prevent some events when node is dragging
// it improve the performance and work well for 95% of cases
// we need to enable all events on Konva, even when we are dragging a node
// so it triggers touchmove correctly
Konva.hitOnDragEnabled = true;
var lastDist = 0;
var startScale = 1;

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight,
    draggable: true,
    x: 0,
    y: 0,
});
stage.scale = 1;

stage.on('touchmove', function (e) {
    e.evt.preventDefault();
    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
        var dist = getDistance(
            {
                x: touch1.clientX,
                y: touch1.clientY
            },
            {
                x: touch2.clientX,
                y: touch2.clientY
            }
        );

        if (!lastDist) {
            lastDist = dist;
        }

        var scale = (stage.scaleX() * dist) / lastDist;

        stage.scaleX(scale);
        stage.scaleY(scale);
        //the trashcan is the only thing which should not scale with the rest of the stage
        trashcanlayer.scaleX(1 / scale);
        trashcanlayer.scaleY(1 / scale);
        stage.scale = scale;
        stage.batchDraw();
        lastDist = dist;
    }
});

stage.on('touchend', function () {
    lastDist = 0;
});

//-----------------------------------------------------------


// then create layer
var layer = new Konva.Layer();
var templayer = new Konva.Layer();
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
var inputDict = new Map([]);
var trashcanlayer = new Konva.Layer();


//coordinates where every new element spawns
var spawnX = 0;
var spawnY = 0;

stage.on("dragmove", function () {
    // when the stage is moved the trashcan should remain in the same position
    trashcanlayer.absolutePosition({x: 0, y: 0});
});

// var startnode = new startNode();

class condition {

    //The attributes of a condition

    _id = null;
    _distance = null;
    _object = null;
    _label = null;
    _health = null;

    //Create a condition with the given parameters, can be partly, however for a toString will need at least an ID
    constructor(id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
    }

    //Edits the condition, resets everything to null and creates a condition with the given parameters
    editCondition(id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
    }

    //Returns whether the condition has all the necessary parameters
    isValid() {
        switch (this.id) {
            case 1:
                return (this.distance != null && this.object != null);
            case 2:
                return (this.object != null);
            case 3:
                return (this.object != null);
            case 4:
                return (this.object != null);
            case 5:
                return true;
            case 6:
                return (this.label != null);
            case 7:
                return (this.health != null);
        }
    }

    //Converts the condition into a string, with pre-given enters for readibility #TODO: variable (not hardcoded) newlines
    toString() {
        switch (this.id) {
            case 1:
                // provide both distance and object, otherwise both will be ignored
                if (distance == null || object == null) {
                    return "If distance to nearest \n _object_ is greater \n than _distance_";
                } else {
                    return "If distance to nearest \n" + object + " is greater \n than " + distance;
                }
            case 2:
                if (object == null) {
                    return "If _object_ \n is visible";
                } else {
                    return "If " + object + " \n is  visible";
                }
            case 3:
                if (object == null) {
                    return "If aimed at _object_";
                } else {
                    return "If aimed at \n" + object;
                }
            case 4:
                if (object == null) {
                    return "If _object_ exists";
                } else {
                    return "If " + object + "\n exists";
                }
            case 5:
                return "Bullet ready";
            case 6:
                if (label == null) {
                    return "If _label_ set";
                } else {
                    return "If " + label + " set";
                }
            case 7:
                if (health == null) {
                    return "If health is \n greater than _amount_";
                } else {
                    return "If health is \n greater than " + health;
                }
            default:
                return null;
            //No or invalid ID
        }
    }

    //All this class' getters and setters
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
    }

    get object() {
        return this._object;
    }

    set object(value) {
        this._object = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = value;
    }
}

class conditionNode {

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
            this.conditionText.moveToTop();
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
            console.log(trashcanlayer.getIntersection(touchPos));
            if (trashcanlayer.getIntersection(touchPos) != null) {
                node.remove();
            }
        });

        this.stage.draw();

    }

    //Edit the text of a condition and with that its size and location of its input/true/false circles
    editCondition(id, distance, object, label, health) {
        this.condition.editCondition(id, distance, object, label, health);
        this.conditionText = this.createTextObject(this.condition.toString());
        this.setAssetSizes()
    }

    //TODO make 'setsize()' method which sets the size of the blue obj and all its input/false/truedots around

    //sets the size of the node and its input/false/true-nodes around
    setAssetSizes() {
        if (this.conditiontext.text != null) {
            this.rect.width(this.conditiontext.width());
            this.rect.height(this.conditiontext.height());
        } else {
            this.rect.width(blockWidth);
            this.rect.height(blockHeight);
        }

        //TODO @LEO check if this is the correct way to adjust the locations
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
        return this.condition.trueArrow.dest;
    }

    falseChild() {
        return this.condition.falseArrow.dest;
    }

    jsonify() {
        let tree = {};
        tree.condition = {};

        //case Condition:
        switch (this.condition.id) {
            //distance to nearest object greater than distance
            case 1:
                tree.condition.push({
                    "type-id": 1,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {
                        "distance": this.condition.distance,
                        "object": this.condition.object
                    }
                });

                break;

            //object visible
            case 2:
                tree.condition.push({
                    "type-id": 2,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object}
                });
                break;

            //aimed at object
            case 3:
                tree.condition.push({
                    "type-id": 3,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object}
                });

                break;

            // if object exists
            case 4:
                tree.condition.push({
                    "type-id": 4,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"object": this.condition.object}
                });

                break;

            //bullet ready
            case 5:
                tree.condition.push({
                    "type-id": 5,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {}
                });

                break;

            //if label set
            case 6:
                tree.condition.push({
                    "type-id": 6,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"label": this.condition.label}
                });

                break;

            //health greater than amount
            case 7:
                tree.condition.push({
                    "type-id": 7,
                    "child-true": this.trueChild().jsonify(),
                    "child-false": this.falseChild().jsonify(),
                    "attributes": {"amount": this.condition.amount}
                });


                break;

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

        inputDict.set(this.inputCircleHitbox, this);

        this.group.add(this.inputCircle);
        this.group.add(this.inputCircleHitbox);
    }

    //create text for in the condition
    createTextObject(conditionText) {
        this.conditiontext = new Konva.Text({
            x: spawnX,
            y: spawnY,
            text: conditionText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        this.group.add(this.conditiontext);
    }


    //base rectangle which contains the condition text
    createRect() {
        if (this.conditiontext != null) {
            this.rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.conditiontext.width(),
                height: this.conditiontext.height(),
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
            this.moveTo(templayer);
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

            templayer.add(this.tempArrow);
        });

        //update the temporary arrow
        dragCircle.on("dragmove", function () {
            //this is to offset the position of the stage
            this.tempArrow.absolutePosition({x: 0, y: 0});
            var points = [this.tempX, this.tempY, this.getAbsolutePosition().x, this.getAbsolutePosition().y];
            this.tempArrow.points(points.map(function (p) {
                return p / node.stage.scale
            }));
            templayer.batchDraw();
        });
        let g = this.group;

        //when the drag has ended, return the invisible circle to its original position, remove the temporary arrow
        // and create a new connection between nodes if applicable
        dragCircle.on("dragend", function () {
            var touchPos = node.stage.getPointerPosition();
            var intersect = node.layer.getIntersection(touchPos);
            console.log(intersect);
            console.log(inputDict[intersect]);
            if (inputDict.has(intersect)) {
                if (inputDict.get(intersect).inputArrow != null) {
                    inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, inputDict.get(intersect), condition, stage);
            }
            this.moveTo(g);
            this.x(this.originalX);
            this.y(this.originalY);
            this.tempArrow.destroy();
            this.tempArrow = null;
            node.layer.draw();
            templayer.draw();
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

}

//The connection between two conditions or a condition and an action
class arrow {

    //The Konva arrow object
    _arrowline;

    //The source/origin group of nodes (condition)
    _src;

    //The destination group of nodes (condition/action)
    _dest;

    //Whether the arrow sprouts from a true or false condition
    _isTrue;

    //The starting coordinates on the canvas (absolute)//
    _startpos;

    //The end coordinates on the canvas (absolute)
    _endpos;

    //Constructor takes the source node, destination node and whether it starts at the true- or false point as input/
    constructor(src, dest, isTrue, stage) {
        this.src = src;
        this.dest = dest;
        this.isTrue = isTrue;

        if (isTrue) {
            this.startpos = this.src.getTrueDotPosition();
            this.src.trueArrow = this;
        } else {
            this.startpos = this.src.getFalseDotPosition();
            this.src.falseArrow = this;
        }
        this.endpos = this.dest.getInputDotPosition();
        this.dest.inputArrow = this;

        this.arrowline = new Konva.Arrow({
            points: this._startpos.concat(this.endpos).map(function (p) {
                return p / stage.scale
            }),
            stroke: 'black'
        });
        this.arrowline.absolutePosition({x: 0, y: 0});
        //TODO MAKE ARROW USE GIVEN LAYER, NOT GLOBAL VAR
        layer.add(this.arrowline);
        this.update(stage);
    }


    //Move the arrow and update the canvas
    update(stage) {
        if (this.isTrue) {
            this.startpos = this.src.getTrueDotPosition();
        } else {
            this.startpos = this.src.getFalseDotPosition();
        }
        this.endpos = this.dest.getInputDotPosition();
        //this is to offset the possible movement of the entire stage, otherwise the arrows would not be in the correct position
        this.arrowline.absolutePosition({x: 0, y: 0});
        this.arrowline.points(this.startpos.concat(this.endpos).map(function (p) {
            return p / stage.scale
        }));
        layer.batchDraw();

    }

    //Remove the arrow from the canvas and set the corresponding values at the src&dest nodes to null
    delete() {
        if (this.isTrue) {
            this.src.trueArrow = null;
        } else {
            this.src.falseArrow = null;
        }
        this.dest.inputArrow = null;
        this.arrowline.destroy();
        layer.draw();
    }

    //All getters&setters
    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    get dest() {
        return this._dest;
    }

    set dest(value) {
        this._dest = value;
    }

    get isTrue() {
        return this._isTrue;
    }

    set isTrue(value) {
        this._isTrue = value;
    }

    get startpos() {
        return this._startpos;
    }

    set startpos(value) {
        this._startpos = value;
    }

    get endpos() {
        return this._endpos;
    }

    set endpos(value) {
        this._endpos = value;
    }

    get arrowline() {
        return this._arrowline;
    }

    set arrowline(value) {
        this._arrowline = value;
    }
}

//Action (NOT A NODE), has zero or more attributes, by default null. DOES NOT WORK WITH LABELS YET
class action {
    id;
    object;
    dir;
    deg;

    // label;

    constructor(id, object = null, dir = null, deg = null) {
        this.id = id;
        this.object = object;
        this.dir = dir;
        this.deg = deg;
        //this.label = label;
    }

    editAction(id, object = null, dir = null, deg = null) {
        this.id = id;
        this.object = object;
        this.dir = dir;
        this.deg = deg;
    }

    //ToString method of an Action, currently hardcoded enters to avoid too long lines #TODO insert variable newlines
    toString() {
        switch (this.id) {
            case 0:
                return "Do nothing";
            case 1:
                if (this.object != null) {
                    return "Go to nearest\n" + this.object;
                } else {
                    return "Go to nearest \n _object_";
                }
            case 2:
                return "Scout";
            case 3:
                if (this.object != null) {
                    return "Patrol " + this.object;
                } else {
                    return "Patrol _object_";
                }
            case 4:
                if (this.object != null) {
                    return "Move away from \n nearest " + this.object;
                } else {
                    return "Move away from \n nearest _object_"
                }
            case 5:
                if (this.object != null) {
                    return "Aim to nearest\n" + this.object;
                } else {
                    return "Aim to nearest \n _object_"
                }
            case 6:
                if (this.dir != null) {
                    return "Aim " + this.dir;
                } else {
                    return "Aim _dir_";
                }
            case 7:
                if (this.deg != null) {
                    return "Aim " + this.deg;
                } else {
                    return "Aim _deg_";
                }
            case 8:
                return "Shoot!";
            case 9:
                return "Self-destruct!";


        }
    }

}

class actionNode {


    _actionList;
    _actionNodeText;

    constructor(stage, layer, actionList) {
        this.group = new Konva.Group({
            draggable: true
        });

        this.actionList = actionList;
        this.actionNodeText = this.createActionNodeText();
        this.createRect();
        this.createInputCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows(stage)
        });
        let thisActionNode = this;
        this.group.on("dragend", function () {
            var touchPos = stage.getPointerPosition();
            console.log("dragend");
            console.log(trashcanlayer.getIntersection(touchPos));
            if (trashcanlayer.getIntersection(touchPos) != null) {
                thisActionNode.remove();
                layer.draw();
            }
        });
    }

    //TODO FIX METHOD WHICH TOSTRINGS ALL ACTIONS, ADDS NEWLINES AND A METHOD WHICH FIXES THE NODE-SIZE (SEE CONDITIONNODE setassetsizes())
    createActionNodeText() {

    }

    jsonify() {

        let tree = {};
        tree.actionblock = [];

        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(function (action) {

            //case Action:
            switch (action.id) {
                // Finds shortest path to reach given object.
                case 1:
                    tree.actionblock.push({"type-id": 1, "attributes": {"object": action.object}});

                    break;
                //Follows a pre-defined path clockwise or anticlockwise along the map
                case 2:
                    tree.actionblock.push({"type-id": 2, "attributes": {}});
                    break;

                // Patrols in a possible eight-figure around a location.
                case 3:
                    tree.actionblock.push({"type-id": 3, "attributes": {"object": action.object}});
                    break;


                //Keeps moving in a straight away from object, if wall is hit keeps increasing either x or y-value to increase distance
                case 4:
                    tree.actionblock.push({"type-id": 4, "attributes": {"object": action.object}});
                    break;


                //Aims at an object. It aims according to the predicted position and bullet travel time
                case 5:
                    tree.actionblock.push({"type-id": 5, "attributes": {"object": action.object}});
                    break;


                //Aims at a certain direction based on either the tank or map
                case 6:
                    tree.actionblock.push({"type-id": 6, "attributes": {"dir": action.dir}});
                    break;


                //Aims at a certain direction based on either the tank or map
                case 7:
                    tree.actionblock.push({"type-id": 7, "attributes": {"deg": action.deg}});
                    break;

                //Fires a bullet
                case 8:
                    tree.actionblock.push({"type-id": 8, "attributes": {}});
                    break;
                //Blows up your own tank, dealing equal damage to your surroundings
                case 9:
                    tree.actionblock.push({"type-id": 9, "attributes": {}});

                    break;
                //Sets a certain label to true
                case 10:
                    tree.actionblock.push({"type-id": 10, "attributes": {"label": action.label}});

                    break;

                //Sets a certain label to false
                case 11:
                    tree.actionblock.push({"type-id": 10, "attributes": {"label": action.label}});

                    break;

                //Sets a certain label to true for X seconds
                case 12:
                    tree.actionblock.push({"type-id": 10, "attributes": {"label": action.label}});

                    break;

                default:
                //Raise error, wrong ID
            }
        });

        return tree;
    }


    createRect() {
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: blockWidth,
            height: blockHeight,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
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
        inputDict.set(this.inputCircle, this);

        this.group.add(this.inputCircle);
    }

    getInputDotPosition() {
        let pos = this.inputCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

    updateArrows(stage) {
        if (this.inputArrow != null) {
            this.inputArrow.update(stage);
        }
    }

    remove() {
        if (this.inputArrow != null) {
            this.inputArrow.delete();
        }
        this.group.destroy();
        layer.draw();
    }

    get actionList() {
        return this._actionList;
    }

    set actionList(value) {
        this._actionList = value;
    }

    get actionNodeText() {
        return this._actionNodeText;
    }

    set actionNodeText(value) {
        this._actionNodeText = value;
    }

}

class startNode {
    arrow;

    _trueArrow = null;

    get trueArrow() {
        return this._trueArrow;
    }

    set trueArrow(value) {
        this._trueArrow = value;
    }

    constructor(stage, layer) {
        //    bla insert shape and a point which can be dragged to a condition/action
        this.createGroup(stage, layer);
    }

    createGroup(stage, layer) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.createRect();
        this.createTrueCircle();
        this.createDragCircle(this.trueCircle, stage, layer);
        let node = this;
        var conditionNode = this;
        this.group.on("dragmove", function () {
            node.updateArrows(stage)
        });
    }

    createRect() {
        this.rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: blockWidth,
            height: blockHeight,
            fill: 'green',
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 10,
        });
        this.group.add(this.rect);
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
    createDragCircle(circle, stage, layer) {
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
            //it is important that the invisible circle is in a different layer in order to check what is under the cursor it later
            this.moveTo(templayer);
            this.tempArrow = new Konva.Arrow({
                stroke: "black",
                fill: "black"
            });

            //deleten any existing arrow
            if (condition && node.trueArrow != null) {
                node.trueArrow.delete();
            } else if (!condition && node.falseArrow != null) {
                node.falseArrow.delete();
            }

            templayer.add(this.tempArrow);
        });

        //update the temporary arrow
        dragCircle.on("dragmove", function () {
            //this is to offset the position of the stage
            this.tempArrow.absolutePosition({x: 0, y: 0});
            var points = [this.tempX, this.tempY, this.getAbsolutePosition().x, this.getAbsolutePosition().y];
            this.tempArrow.points(points.map(function (p) {
                return p / stage.scale
            }));
            templayer.batchDraw();
        });
        let g = this.group;
        //when the drag has ended return the invisible circle to its original position, remove the temporary arrow and create a new connection between nodes if applicable
        dragCircle.on("dragend", function () {
            var touchPos = stage.getPointerPosition();
            var intersect = layer.getIntersection(touchPos);
            console.log(intersect);
            console.log(inputDict[intersect]);
            if (inputDict.has(intersect)) {
                if (inputDict.get(intersect).inputArrow != null) {
                    inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, inputDict.get(intersect), true, stage);
            }
            this.moveTo(g);
            this.x(this.originalX);
            this.y(this.originalY);
            this.tempArrow.destroy();
            this.tempArrow = null;
            layer.batchDraw();
            templayer.batchDraw();
        });
    }

    getTrueDotPosition() {
        let pos = this.trueCircle.getAbsolutePosition();
        return [pos.x, pos.y];
    }

    updateArrows(stage) {
        if (this.trueArrow != null) {
            this.trueArrow.update(stage);
        }
    }

}

function treeToJson(startnode) {
    return startnode.trueArrow.dest.jsonify();
}

//make trashcan
function addTrashcan(stage, trashcanlayer) {
    var imageObj = new Image();
    //TODO: FIX NORMAL IMAGE
    imageObj.src = 'https://cdn0.iconfinder.com/data/icons/shopping-359/512/Bin_bin_delete_trashcan_garbage_dust-512.png';
    imageObj.onload = function () {
        let trashcan = new Konva.Image({
            x: stageWidth - 60,
            y: 100,
            image: imageObj,
            width: 60,
            height: 60
        });

        trashcanlayer.add(trashcan);
        trashcanlayer.draw();
    }


}

//Create the canvas
var s = new startNode(stage, layer);
layer.add(s.group);
stage.add(trashcanlayer);
stage.add(layer);
stage.add(templayer);
layer.draw();


//add trashcan
addTrashcan(stage, trashcanlayer);
layer.draw();
trashcanlayer.draw();


//BELOW THIS LINE ARE ONLY BUTTON-INTERACTION-FUNCTION DEMOS, MOST LIKELY TO BE REPLACED BY REACT
function addCondition(stage, layer) {
    let newCondition = new conditionNode(stage, layer);
    layer.add(newCondition.group);
    newCondition.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
    stage.draw();
}

function addActionNode(stage, layer) {
    let newActionNode = new actionNode(stage, layer);
    layer.add(newActionNode.group);
    newActionNode.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
    stage.draw();

}

//on click, toggle between hiding and showing dropdown content
function spawnActionNode() {
    document.getElementById("actionNodeList").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//Buttons

//Add condition
document.getElementById('addCondition').addEventListener(
    'click',
    function () {
        addCondition(stage, layer)
    },
    false
);

//Add condition
document.getElementById('addActionNode').addEventListener(
    'click',
    function () {
        addActionNode(stage, layer)
    },
    false
);
