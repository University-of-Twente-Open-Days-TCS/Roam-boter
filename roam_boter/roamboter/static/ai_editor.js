    // first we need to create a stage
    var stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 500,
        height: 500
    });

    // then create layer
    var layer = new Konva.Layer();
    var templayer = new Konva.Layer();
    spacing = 40;
    line_height = 10;
    const circle_radius = 10;
    var inputDict = new Map([]);

    var startnode = new startNode();

    class condition {
        constructor() {
            this.height = spacing;

            //TODO: change
            this.width = 100;
            this.createGroup();
        }

        //creates the group which represents a condition
        createGroup() {
            this.group = new Konva.Group({
                draggable: true
            });
            this.createRect();
            this.createFalseCircle();
            this.createTrueCircle();
            this.createDragCircle(this.trueCircle, true);
            this.createDragCircle(this.falseCircle, false);
            this.createInputCircle();
            let node = this;
            this.group.on("dragmove", function(){
               node.updateArrows()
            });
        }

        updateArrows(){
            if(this.trueArrow != null){
                this.trueArrow.update();
            }
            if(this.falseArrow != null){
                this.falseArrow.update();
            }
            if(this.inputArrow != null){
                this.inputArrow.update();
            }
        }

        //circle to which connections can be made by dragging arrows on it
        createInputCircle(){
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
        createRect(){
            this.rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 2,
                cornerRadius: 10,
            });
            this.group.add(this.rect);
        }

        //create a circle from which the false connection is made to another node
        createFalseCircle(){
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
        createTrueCircle(){
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
        createDragCircle(circle, condition){
            let node = this;
            let dragCircle = new Konva.Circle({
                draggable: true,
                y: circle.y(),
                x: circle.x(),
                radius: circle_radius,
                fill: 'black',
                opacity: 0.5
            });
            if (condition) {
                this.trueDragCircle = dragCircle;
            } else {
                this.falseDragCircle = dragCircle;
            }

            this.group.add(dragCircle);

            dragCircle.originalX = dragCircle.x();
            dragCircle.originalY = dragCircle.y();

             //when the invisible circle starts to be dragged create a new temporary arrow
            dragCircle.on("dragstart", function(){
                this.tempX = this.getAbsolutePosition().x;
                this.tempY = this.getAbsolutePosition().y;
                //it is important that the invisible circle is in a different layer in order to check what is under the cursor it later
                this.moveTo(templayer);
                this.tempArrow = new Konva.Arrow({
                    stroke: "black",
                    fill: "black"
                });

                //deleten any existing arrow
                if (condition && node.trueArrow != null){
                    node.trueArrow.delete();
                } else if(!condition && node.falseArrow != null){
                    node.falseArrow.delete();
                }

                templayer.add(this.tempArrow);
            });

            //update the temporary arrow
            dragCircle.on("dragmove", function(){
                this.tempArrow.points([this.tempX, this.tempY, stage.getPointerPosition().x, stage.getPointerPosition().y]);
                templayer.draw();
            });
            let g = this.group;
            //when the drag is enden return the invisible circle to its original position, remove the temporary arrow and create a new connection between nodes if applicable
            dragCircle.on("dragend", function(){
                var touchPos = stage.getPointerPosition();
                var intersect = layer.getIntersection(touchPos);
                console.log(intersect);
                console.log(inputDict[intersect]);
                //TODO: shit doen hier
                if (inputDict.has(intersect) && inputDict.get(intersect).inputArrow == null){
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

        getTrueDotPosition(){
            let pos = this.trueCircle.getAbsolutePosition();
            return [pos.x, pos.y];
        }

        getFalseDotPosition(){
            let pos = this.falseCircle.getAbsolutePosition();
            return [pos.x, pos.y];
        }

        getInputDotPosition(){
            let pos = this.inputCircle.getAbsolutePosition();
            return [pos.x, pos.y];
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
            if(isTrue) {
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
            if(this.isTrue) {
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
            if(this.isTrue) {
                this.src.trueArrow = null;
            } else {
                this.src.falseArrow = null;
            }
            this.dest.inputArrow = null;
            this.arrowline.destroy();
            layer.draw();
        }
    }

    //Action (NOT A NODE), has zero or more attributes, by default null
    class action {
        id;
        object;
        dir;
        deg;
        label;

        constructor(id, object  = null, dir = null, deg = null, label = null) {
           this.id = id;
           this.object = object;
           this.dir = dir;
           this.deg = deg;
           this.label = label;
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
        if(node instanceof condition) {

            let tree = {};
            tree.condition = {};

            //case Condition:
            switch(node.id) {
                //distance to nearest object greater than distance
                case 1:
                    tree.condition.push({"type-id": 1,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"distance": node.distance,
                                                        "object": node.object}
                                    });

                    break;

                //object visible
                case 2:
                    tree.condition.push({"type-id": 2,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"object": node.object}
                                    });
                    break;

                //aimed at object
                case 3:
                    tree.condition.push({"type-id": 3,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"object": node.object}
                                    });

                    break;

                // if object exists
                case 4:
                    tree.condition.push({"type-id": 4,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"object": node.object}
                                    });

                    break;

                //bullet ready
                case 5:
                    tree.condition.push({"type-id": 5,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {}
                                    });

                    break;

                //if label set
                case 6:
                    tree.condition.push({"type-id": 6,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"label": node.label}
                                    });

                    break;

                //health greater than amount
                case 7:
                    tree.condition.push({"type-id": 7,
                                        "child-true": jsonify(node.trueArrow.dest),
                                        "child-false": jsonify(node.falseArrow.dest),
                                        "attributes": {"amount": node.amount}
                                    });


                    break;

                default:
                //Raise error, wrong ID

            }

        } else if(node instanceof actionNode) {

            let tree = {};
            tree.actionblock = [];

            //Iterate over all actions and add its json to the actionblock
            node.actionList.forEach(function(action){

            //case Action:
            switch(action.id) {
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
            }});

            return tree;
        } else {
            //Raise error, is not cond or act
        }
    }




    var node1 = new condition();
    var node2 = new condition();
    var node3 = new condition();
    var node4 = new condition();
    var node5 = new condition();


    layer.add(node1.group);
    layer.add(node2.group);
    layer.add(node3.group);
    layer.add(node4.group);
    layer.add(node5.group);

    stage.add(layer);
    stage.add(templayer);

    layer.draw();
