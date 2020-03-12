import actionNode from "./actionNode.js";
import conditionNode from "./conditionNode.js";
import startNode from "./startNode.js";
import Konva from "konva"
import distance from "./distance";
import object from "./object";
import label from "./label";
import health from "./health";
import winddir from "./winddir";
import reldir from "./reldir";
import speed from "./speed";
import arrow from "./arrow";
import action from "./action";
import condition from "./condition";


class aiCanvas {

    blockHeight = 40;
    blockWidth = 100;
    circle_radius = 10;
    hitboxCircleRadius = 20;

    stageWidth = window.innerWidth;
    stageHeight = window.innerHeight / 1.5;

    _stage;
    _layer;

    //coordinates where every new element spawns
    spawnX = 0;
    spawnY = 0;

    _startNode;

    constructor(container) {
        //Create the stage
        this.createStage(container);

        // then create layer
        this.layer = new Konva.Layer();
        this.stage.templayer = new Konva.Layer();

        this.stage.inputDict = new Map([]);
        this.stage.staticlayer = new Konva.Layer();

        //Create the canvas
        this.startNode = new startNode(this.stage, this.layer);
        this.layer.add(this.startNode.group);
        this.stage.add(this.stage.staticlayer);
        this.stage.add(this.layer);
        this.stage.add(this.stage.templayer);
        this.layer.draw();

        //add trashcan
        this.addTrashcan(this.stage);
        this.layer.draw();
        this.stage.staticlayer.draw();

        //Make canvas draggable
        this.makeDraggable();


    }

    createStage(container) {
        this.stage = new Konva.Stage({
            container: container,
            width: this.stageWidth,
            height: this.stageHeight,
            draggable: true,
            x: 0,
            y: 0,
        });

        this.stage.scale = 1;
    }


    //TODO quickfix this.stagewidth, and make it use correct state without giving it as a parameter
    //make trashcan
    addTrashcan(stage) {
        var imageObj = new Image();
        //TODO: FIX NORMAL IMAGE
        imageObj.src = 'https://cdn0.iconfinder.com/data/icons/shopping-359/512/Bin_bin_delete_trashcan_garbage_dust-512.png';
        imageObj.onload = function () {
            let trashcan = new Konva.Image({
                x: this.stageWidth - 60,
                y: 100,
                image: imageObj,
                width: 60,
                height: 60
            });

            stage.staticlayer.add(trashcan);
            stage.staticlayer.draw();
        }

    }

    makeDraggable() {

//-----------------------------------------------------------
// NOT OUR CODE. taken from https://konvajs.org/docs/sandbox/Multi-touch_Scale_Stage.html

// by default Konva prevent some events when node is dragging
// it improve the performance and work well for 95% of cases
// we need to enable all events on Konva, even when we are dragging a node
// so it triggers touchmove correctly
        Konva.hitOnDragEnabled = true;
        var lastDist = 0;

        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

        let thisStage = this.stage;
        this.stage.on('touchmove', function (e) {
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

                var scale = (thisStage.scaleX() * dist) / lastDist;

                thisStage.scaleX(scale);
                thisStage.scaleY(scale);
                //the trashcan is the only thing which should not scale with the rest of the stage
                thisStage.staticlayer.scaleX(1 / scale);
                thisStage.staticlayer.scaleY(1 / scale);
                thisStage.scale = scale;
                thisStage.batchDraw();
                lastDist = dist;
            }
        });

        this.stage.on('touchend', function () {
            lastDist = 0;
        });


        this.stage.on("dragmove", function () {
            // when the stage is moved the trashcan should remain in the same position
            thisStage.staticlayer.absolutePosition({x: 0, y: 0});
        });
    }

//-----------------------------------------------------------

    //Turn the tree into a json file
    treeToJson() {
        return this.startNode.trueArrow.dest.jsonify();
    }

    //Turn a json file into a tree
    jsonToTree(jsonFile) {
        //Parse JSON to JS format
        let parsedJson = JSON.parse(jsonFile);

        //Create first child from the startnode (and therefore iteratively all their successors)
        let nodeChild = this.treeify(parsedJson);

        //Add child to canvas
        this.layer.add(nodeChild.group);

        //Draw arrows to child
        this.drawArrowFromJson(this.startNode, nodeChild, true);

    }

    //Create a new node to which this will point.
    treeify(nodeJson) {

        //If the new childNode is a condition
        let newOwnNode;
        if (nodeJson.condition != null) {
            switch (nodeJson.condition.type_id) {
                case 1:
                    //Create own node
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(1,
                        new distance(nodeJson.condition.attributes.distance),
                        new object(nodeJson.condition.attributes.obj)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 2:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(2,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 3:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(3,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 4:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(4,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 5:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(5),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 6:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(6,
                        null, null, new label(nodeJson.condition.label)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                case 7:
                    newOwnNode = new conditionNode(this.stage, this.layer, new condition(6,
                        null, null, null, new health(nodeJson.condition.health)),
                        nodeJson.condition.position);

                    this.createChildren(newOwnNode, nodeJson.condition);

                    return newOwnNode;
                default:
                //TODO throw exception, incorrect type_id in JSON
            }
        } else if (nodeJson.actionblock != null) {
            //Otherwise if new childNode is an action
            let newActionList = [];
            nodeJson.actionblock.actionlist.forEach(actionItem => {
                switch (actionItem.type_id) {
                    case 1:
                        newActionList = newActionList.concat(new action(1, new object(actionItem.attributes.obj)));
                        break;
                    case 2:
                        newActionList = newActionList.concat(new action(2));
                        break;
                    case 3:
                        newActionList = newActionList.concat(new action(3, new object(actionItem.attributes.obj)));
                        break;
                    case 4:
                        newActionList = newActionList.concat(new action(4, new object(actionItem.attributes.obj)));
                        break;
                    case 5:
                        newActionList = newActionList.concat(new action(5, new object(actionItem.attributes.obj)));
                        break;
                    case 6:
                        newActionList = newActionList.concat(new action(6, null, new winddir(actionItem.attributes.winddir)));
                        break;
                    case 7:
                        newActionList = newActionList.concat(new action(7, null, null, new reldir(actionItem.attributes.reldir)));
                        break;
                    case 8:
                        newActionList = newActionList.concat(new action(8, null, null, null, new speed(actionItem.attributes.speed)));
                        break;
                    case 9:
                        newActionList = newActionList.concat(new action(9, null, null, null, new speed(actionItem.attributes.speed)));
                        break;
                    case 10:
                        newActionList = newActionList.concat(new action(10));
                        break;
                    case 11:
                        newActionList = newActionList.concat(new action(11));
                        break;
                    case 12:
                        newActionList = newActionList.concat(new action(12, null, null, null, null, new label(actionItem.attributes.label)));
                        break;
                    case 13:
                        newActionList = newActionList.concat(new action(13, null, null, null, null, new label(actionItem.attributes.label)));
                        break;
                    case 14:
                        newActionList = newActionList.concat(new action(14, null, null, null, null, new label(actionItem.attributes.label)));
                        break;

                }

            });
            let newActionNode = new actionNode(this.stage, this.layer, newActionList, nodeJson.actionblock.position);
            return newActionNode;
        } else {
            //TODO throw exception, json incorrect!
        }
    }

    //Draw an arrow from the false/true-circle to the newly created node
    drawArrowFromJson(startNode, destNode, trueCondition) {
        let newArrow = new arrow(startNode, destNode, trueCondition, this.stage, this.layer);
    }

    //Create childNodes, draw them on canvas and draw arrows to them
    createChildren(ownNode, conditionJson) {
        //create children
        let newTrueChild = this.treeify(conditionJson.child_true);
        let newFalseChild = this.treeify(conditionJson.child_false);

        //Draw them on canvas
        this.layer.add(newTrueChild.group);
        this.layer.add(newFalseChild.group);

        //Draw arrows to children
        this.drawArrowFromJson(ownNode, newTrueChild, true);
        this.drawArrowFromJson(ownNode, newFalseChild, false);
    }


    addCondition() {
        let newCondition = new conditionNode(this.stage, this.layer);
        this.layer.add(newCondition.group);
        newCondition.group.absolutePosition({x: this.stageWidth / 2, y: this.stageHeight / 2});
        this.stage.draw();
    }

    addActionNode() {
        let newActionNode = new actionNode(this.stage, this.layer);
        this.layer.add(newActionNode.group);
        newActionNode.group.absolutePosition({x: this.stageWidth / 2, y: this.stageHeight / 2});
        this.stage.draw();

    }

    //getters&setters
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

    get startNode() {
        return this._startNode;
    }

    set startNode(value) {
        this._startNode = value;
    }


}

export default aiCanvas
