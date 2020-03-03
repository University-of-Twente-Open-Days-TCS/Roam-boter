// first we need to create a stage
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 500,
    height: 500
});

// then create layer
var layer = new Konva.Layer();
var templayer = new Konva.Layer();
var trashcanlayer = new Konva.Layer();
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
var inputDict = new Map([]);


//coordinates where every new element spawns
var spawnX = 0;
var spawnY = 0;

// var startnode = new startNode();

class condition {

    _inputArrow = null;
    _trueArrow = null;
    _falseArrow = null;
    _conditiontext = null;
    _id = null;
    _distance = null;
    _object = null;
    _label = null;
    _health = null;
    _stage = null;
    _layer = null;

    //Create a new condition in a given stage and layer. If a valid ID is given it will also be filled with text
    // and if (all) its appropriate parameter(s) is given this will be included.
    constructor(stage, layer, id = null, distance = null, object = null, label = null, health = null) {
        this.group = new Konva.Group({
            draggable: true
        });

        this.conditiontext = this.setConditionText(id, distance, object, label, health);
        if (this.conditiontext != null) {
            this.createText(this.conditiontext);
        }
        this.createRect();
        if (this.conditiontext != null) {
            this.conditiontext.moveToTop();
        }
        this.createFalseCircle();
        this.createTrueCircle();
        this.createDragCircle(this.trueCircle, true, stage, layer);
        this.createDragCircle(this.falseCircle, false, stage, layer);
        this.createInputCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows();
            console.log("dragmove");
        });
        var conditionNode = this;
        this.group.on("dragend", function () {
            var touchPos = stage.getPointerPosition();
            console.log("dragend");
            console.log(trashcanlayer.getIntersection(touchPos));
            if (trashcanlayer.getIntersection(touchPos) != null) {
                conditionNode.remove();
            }
        });
        this.id = id;
        this.stage = stage;
        this.layer = layer;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
        stage.draw();

    }

    //Edit the text of a condition and with that its size
    editCondition(stage, layer, id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
        this.conditiontext.text(this.setConditionText(id, distance, object, label, health));

        //TODO make 'setsize()' method which sets the size of the blue obj and all its input/false/truedots around
        if (this.conditiontext.text != null) {
            this.rect.width(this.conditiontext.width());
            this.rect.height(this.conditiontext.height());
        } else {
            this.rect.width(blockWidth);
            this.rect.height(blockHeight);
        }

        stage.draw();


    }


    //Returns the entire next of the condition, based on its ID and possible parameters.
    setConditionText(id, distance, object, label, health) {
        switch (id) {
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

    //create text for in the condition
    createText(conditionText) {
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

        // this.rect.on('click', function () {
        //     alert('xss!');
        // })
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
    createDragCircle(circle, condition, stage, layer) {
        let node = this;
        let dragCircle = new Konva.Circle({
            draggable: true,
            y: circle.y(),
            x: circle.x(),
            radius: circle_radius,
            fill: 'black',
            opacity: 0.5
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
            this.tempArrow.points([this.tempX, this.tempY, stage.getPointerPosition().x, stage.getPointerPosition().y]);
            templayer.draw();
        });
        let g = this.group;

        //when the drag has ended, return the invisible circle to its original position, remove the temporary arrow
        // and create a new connection between nodes if applicable
        dragCircle.on("dragend", function () {
            var touchPos = stage.getPointerPosition();
            var intersect = layer.getIntersection(touchPos);
            // console.log(intersect);
            // console.log(inputDict[intersect]);
            if (inputDict.has(intersect)) {
                if (inputDict.get(intersect).inputArrow != null) {
                    inputDict.get(intersect).inputArrow.delete();
                }
                new arrow(node, inputDict.get(intersect), condition);
            }
            this.moveTo(g);
            this.x(this.originalX);
            this.y(this.originalY);
            this.tempArrow.destroy();
            this.tempArrow = null;
            layer.draw();
            templayer.draw();
        });
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
        layer.draw();
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

    get conditiontext() {
        return this._conditiontext;
    }

    set conditiontext(value) {
        this._conditiontext = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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

//The connection between two conditions or a condition and an action
class arrow {

    //The Konva arrow object
    arrowline;

    //The source/origin group of nodes (condition)
    src;

    //The destination group of nodes (condition/action)
    dest;

    //Whether the arrow sprouts from a true or false condition
    isTrue;

    //The starting coordinates on the canvas (absolute)//
    startpos;

    //The end coordinates on the canvas (absolute)
    endpos;

    //Constructor takes the source node, destination node and whether it starts at the true- or false point as input/
    constructor(src, dest, isTrue) {
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
            x: 0,
            y: 0,
            points: this.startpos.concat(this.endpos),
            stroke: 'black'
        });
        layer.add(this.arrowline);
        layer.draw();

    }


    //Move the arrow and update the canvas
    update() {
        if (this.isTrue) {
            this.startpos = this.src.getTrueDotPosition();
        } else {
            this.startpos = this.src.getFalseDotPosition();
        }
        this.endpos = this.dest.getInputDotPosition();

        this.arrowline.points(this.startpos.concat(this.endpos));
        layer.draw();

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

}

class actionNode {

    constructor(stage, layer) {
        this.createGroup(stage, layer);
    }

    //creates the group which represents a condition
    createGroup(stage, layer) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.createRect();
        this.createInputCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows()
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
        })
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

    updateArrows() {
        if (this.inputArrow != null) {
            this.inputArrow.update();
        }
    }

    remove() {
        if (this.inputArrow != null) {
            this.inputArrow.delete();
        }
        this.group.destroy();
        layer.draw();
    }
}

class startNode {
    arrow;

    constructor() {
        //    bla insert shape and a point which can be dragged to a condition/action
    }
}

function treeToJson(startnode) {
    return jsonify(startnode.arrow.dest);
}


//assumptions: condition node class = condition, action node class = actionNode, within an actionNode are zero or more actions in a list called actionList. the action object class is called action, has an id and possible parameters.
function jsonify(node) {
    // Check if the current node is a condition, otherwise it is an actionNode
    if (node instanceof condition) {

        let tree = {};
        tree.condition = {};

        //case Condition:
        switch (node.id) {
            //distance to nearest object greater than distance
            case 1:
                tree.condition.push({
                    "type-id": 1,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {
                        "distance": node.distance,
                        "object": node.object
                    }
                });

                break;

            //object visible
            case 2:
                tree.condition.push({
                    "type-id": 2,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {"object": node.object}
                });
                break;

            //aimed at object
            case 3:
                tree.condition.push({
                    "type-id": 3,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {"object": node.object}
                });

                break;

            // if object exists
            case 4:
                tree.condition.push({
                    "type-id": 4,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {"object": node.object}
                });

                break;

            //bullet ready
            case 5:
                tree.condition.push({
                    "type-id": 5,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {}
                });

                break;

            //if label set
            case 6:
                tree.condition.push({
                    "type-id": 6,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {"label": node.label}
                });

                break;

            //health greater than amount
            case 7:
                tree.condition.push({
                    "type-id": 7,
                    "child-true": jsonify(node.trueArrow.dest),
                    "child-false": jsonify(node.falseArrow.dest),
                    "attributes": {"amount": node.amount}
                });


                break;

            default:
            //Raise error, wrong ID

        }

    } else if (node instanceof actionNode) {

        let tree = {};
        tree.actionblock = [];

        //Iterate over all actions and add its json to the actionblock
        node.actionList.forEach(function (action) {

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
    } else {
        //Raise error, is not cond or act
    }
}

var newCondition = null;

function addCondition(stage, layer, id, distance, object, label, health) {
    newCondition = new condition(stage, layer, id, distance, object, label, health);
    layer.add(newCondition.group)

    stage.draw();
}

function addActionNode(stage, layer) {
    let newActionNode = new actionNode(stage, layer);
    layer.add(newActionNode.group);
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
        addCondition(stage, layer, id = 1, "5", "tank");
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


//make trashcan
function addTrashcan(stage, trashcanlayer) {
    var imageObj = new Image();
    //TODO: FIX NORMAL IMAGE
    imageObj.src = 'https://cdn0.iconfinder.com/data/icons/shopping-359/512/Bin_bin_delete_trashcan_garbage_dust-512.png';
    imageObj.onload = function () {
        let trashcan = new Konva.Image({
            x: 420,
            y: 50,
            image: imageObj,
            width: 60,
            height: 60
        });

        trashcanlayer.add(trashcan);
        trashcanlayer.draw();
    }


}

stage.add(trashcanlayer);
stage.add(layer);
stage.add(templayer);

layer.draw();


//add trashcan

addTrashcan(stage, trashcanlayer);
layer.draw();
trashcanlayer.draw();
