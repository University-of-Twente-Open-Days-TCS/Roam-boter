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

      stage.on('touchmove', function(e) {
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
          stage.scale = scale;
          stage.batchDraw();
          lastDist = dist;
        }
      });

      stage.on('touchend', function() {
        lastDist = 0;
      });

//-----------------------------------------------------------





// then create layer
var layer = new Konva.Layer();
var templayer = new Konva.Layer();
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
var inputDict = new Map([]);
var trashcanlayer = new Konva.Layer();

// var startnode = new startNode();

class condition {


    _inputArrow = null;
    _trueArrow = null;
    _falseArrow = null;


    constructor(stage, layer) {

        this.createGroup(stage, layer);
    }

    //Getters and setters for arrows
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

    //creates the group which represents a condition
    createGroup(stage, layer) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.createRect();
        this.createFalseCircle();
        this.createTrueCircle();
        this.createDragCircle(this.trueCircle, true, stage, layer);
        this.createDragCircle(this.falseCircle, false, stage, layer);
        this.createInputCircle();
        let node = this;
        var conditionNode = this;
        this.group.on("dragend", function () {
            var touchPos = stage.getPointerPosition();
            console.log("dragend");
            console.log(trashcanlayer.getIntersection(touchPos));
            if (trashcanlayer.getIntersection(touchPos) != null) {
                conditionNode.remove();
            }
        })
        this.group.on("dragmove", function(){
               node.updateArrows(stage)
        });
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

    //base rectangle which contains the condition text
    createRect() {
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

    //creates an invisible circle used only for making a new connection between nodes, based on condition will create one for true or for false
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
                this.tempArrow.absolutePosition({x:0, y:0});
                var points = [this.tempX, this.tempY, this.getAbsolutePosition().x, this.getAbsolutePosition().y];
                this.tempArrow.points(points.map(function(p){return p / stage.scale}));
                console.log(this.tempArrow.x());
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
                new arrow(node, inputDict.get(intersect), condition, stage);
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
            console.log("Delete arrow!!")
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
            points: this.startpos.concat(this.endpos).map(function(p){return p / stage.scale}),
            stroke: 'black'
        });
        this.arrowline.absolutePosition({x:0, y:0});
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
        this.arrowline.absolutePosition({x:0, y:0});
        this.arrowline.points(this.startpos.concat(this.endpos).map(function(p){return p / stage.scale}));
        layer.batchDraw();

    }

    //Remove the arrow from the canvas and set the corresponding values at the src&dest nodes to null
    delete() {
        console.log("delete arrow!");
        if (this.isTrue) {
            this.src.trueArrow = null;
        } else {
            this.src.falseArrow = null;
        }
        this.dest.inputArrow = null;
        this.arrowline.destroy();
        layer.batchDraw();
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
            node.updateArrows(stage)
        });
        let thisActionNode  = this;
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
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
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
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
                    "attributes": {"object": node.object}
                });
                break;

            //aimed at object
            case 3:
                tree.condition.push({
                    "type-id": 3,
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
                    "attributes": {"object": node.object}
                });

                break;

            // if object exists
            case 4:
                tree.condition.push({
                    "type-id": 4,
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
                    "attributes": {"object": node.object}
                });

                break;

            //bullet ready
            case 5:
                tree.condition.push({
                    "type-id": 5,
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
                    "attributes": {}
                });

                break;

            //if label set
            case 6:
                tree.condition.push({
                    "type-id": 6,
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
                    "attributes": {"label": node.label}
                });

                break;

            //health greater than amount
            case 7:
                tree.condition.push({
                    "type-id": 7,
                    "child-true": jsonify(node.trueArrow().dest),
                    "child-false": jsonify(node.falseArrow().dest),
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


function addCondition(stage, layer) {
    let newCondition = new condition(stage, layer);
    layer.add(newCondition.group);
    stage.draw();
}

function addActionNode(stage, layer) {
    let newActionNode = new actionNode(stage, layer);
    layer.add(newActionNode.group);
    stage.draw();
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
    console.log("hey, hoi, hallo");

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
