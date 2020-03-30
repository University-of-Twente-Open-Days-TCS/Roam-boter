import actionNode from "./actionNode.js";
import conditionNode from "./conditionNode.js";
import startNode from "./startNode.js";
import Konva from "konva"
import distance from "./distance.js";
import object from "./object.js";
import label from "./label.js";
import health from "./health.js";
import winddir from "./winddir.js";
import reldir from "./reldir.js";
import speed from "./speed.js";
import condition from "./condition.js";
import action from "./action.js";
import arrow from "./arrow.js";
import seconds from "./seconds.js";
import AIValidationError from "../Errors/AIValidationError.js";
import ErrorCircle from "../Errors/ErrorCircle.js";
import JSONValidationError from "../Errors/JSONValidationError.js";

/** AI Canvas, the stage with which the user interacts or watches a replay on **/
export default class aiCanvas {

    //Stage dimensions

    _stage;
    _layer;
    _dragging;
    _startNode;
    _isReplay;

    /** Created a stage, multiple layers and a startNode, gets the container ID where it needs to be placed in,
     * and a boolean whether this is part of a replay next to a simulation (no interaction) **/
    constructor(container, isReplay) {
        this.isReplay = isReplay;
        //Create the stage
        this.createStage(container);

        // then create layer
        this.layer = new Konva.Layer();
        this.stage.templayer = new Konva.Layer();

        this.stage.inputDict = new Map([]);
        this.stage.staticlayer = new Konva.Layer();
        this.dragging = false;

        //Create the startnode and canvas
        this.startNode = new startNode(this.stage, this.layer, this);
        this.layer.add(this.startNode.group);
        this.stage.add(this.stage.staticlayer);
        this.stage.add(this.layer);
        this.stage.add(this.stage.templayer);
        if (isReplay) {
            this.addInteractionBlocker();
        }
        this.layer.draw();


        //add trashcan
        if (!isReplay) {
            this.addTrashcan(this.stage);
        }

        this.layer.draw();
        this.stage.staticlayer.draw();

        //Make canvas draggable
        this.makeDraggable();

    }

    /** Create the stage in the given container, with the previously defined width & height **/
    createStage(container) {
        this.stage = new Konva.Stage({
            container: container,
            width: 1,
            height: 1,
            draggable: true,
            x: 0,
            y: 0,
        });

        this.stage.scale = 1;
    }

    /** Resize stage and redraw stage */
    resizeStage(width, height) {
        this.stage.size({
            width: width,
            height: height
        });

        if (this.isReplay) {
            this.blocker.size({
                width: width,
                height: height
            })
        }
        //TODO: Move ai to the center
        this.stage.batchDraw()
    }

    /** Creates a trashcan in a staticlayer and sets its interaction handlers **/
    addTrashcan(stage) {
        let thisCanvas = this;
        this.stage.trashcan = new Konva.Image({
            x: 0,
            y: 0,
            width: 60,
            height: 60
        });

        //load image of closed trashcan
        let closedTrashcan = new Image();
        closedTrashcan.src = 'trashcan/closed.svg';
        closedTrashcan.onload = function () {
            thisCanvas.stage.trashcan.image(closedTrashcan);
            stage.staticlayer.add(thisCanvas.stage.trashcan);
            stage.staticlayer.draw();
        };

        //If trashcan is hovered over, open it
        this.stage.trashcan.on('mouseenter touchstart', () => {
            let openTrashcan = new Image();
            openTrashcan.src = 'trashcan/open.svg';
            openTrashcan.onload = function () {
                thisCanvas.stage.trashcan.image(openTrashcan);
                stage.staticlayer.draw();

            };
        });

        //If trashcan is no longer hovered over, close it
        this.stage.trashcan.on('mouseleave touchend', () => {
            let closedTrashcan = new Image();
            closedTrashcan.src = 'trashcan/closed.svg';
            closedTrashcan.onload = function () {
                thisCanvas.stage.trashcan.image(closedTrashcan);
                stage.staticlayer.draw();

            };
        });

        // when the stage is moved the trashcan should remain in the same position
        this.stage.on("dragmove", function () {
            stage.staticlayer.absolutePosition({x: 0, y: 0});
        });

    }

    /** Prevents any interaction with the elements of the canvas, effectively making kind of an image **/
    addInteractionBlocker() {
        this.blocker = new Konva.Rect({
            width: this.stage.width(),
            height: this.stage.height(),
            opacity: 0,
            fill: "black"
        });
        this.stage.staticlayer.add(this.blocker);
        this.stage.staticlayer.moveToTop();
        this.stage.staticlayer.draw();
    }


    makeDraggable() {

//-----------------------------------------------------------
// NOT OUR CODE. taken from https://konvajs.org/docs/sandbox/Multi-touch_Scale_Stage.html

// by default Konva prevent some events when node is dragging
// it improve the performance and work well for 95% of cases
// we need to enable all events on Konva, even when we are dragging a node
// so it triggers touchmove correctly
        pinchZoomWheelEvent(this.stage);

        function pinchZoomWheelEvent(stage) {
            if (stage) {
                stage.getContent().addEventListener('wheel', (wheelEvent) => {
                    wheelEvent.preventDefault();
                    const oldScale = stage.scaleX();

                    const pointer = stage.getPointerPosition();
                    const startPos = {
                        x: pointer.x / oldScale - stage.x() / oldScale,
                        y: pointer.y / oldScale - stage.y() / oldScale,
                    };

                    const deltaYBounded = !(wheelEvent.deltaY % 1) ? Math.abs(Math.min(-10, Math.max(10, wheelEvent.deltaY))) : Math.abs(wheelEvent.deltaY);
                    const scaleBy = 1.01 + deltaYBounded / 70;
                    const newScale = wheelEvent.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
                    stage.scaleX(newScale);
                    stage.scaleY(newScale);
                    stage.staticlayer.scaleX(1 / newScale);
                    stage.staticlayer.scaleY(1 / newScale);
                    const newPosition = {
                        x: (pointer.x / newScale - startPos.x) * newScale,
                        y: (pointer.y / newScale - startPos.y) * newScale,
                    };
                    stage.position(newPosition);
                    stage.staticlayer.setAbsolutePosition({x: 0, y: 0});
                    stage.batchDraw();
                });
            }
        }

        let lastDist;
        let point;
        pinchZoomTouchEvent(this.stage);

        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
        }

        function clientPointerRelativeToStage(clientX, clientY, stage) {
            return {
                x: clientX - stage.getContent().offsetLeft,
                y: clientY - stage.getContent().offsetTop,
            }
        }

        let self = this;

        function pinchZoomTouchEvent(stage) {
            if (stage) {
                stage.getContent().addEventListener('touchmove', (evt) => {
                    const t1 = evt.touches[0];
                    const t2 = evt.touches[1];
                    if (t1 && t2 && !self.dragging) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        const oldScale = stage.scaleX();

                        const dist = getDistance(
                            {x: t1.clientX, y: t1.clientY},
                            {x: t2.clientX, y: t2.clientY}
                        );
                        if (!lastDist) lastDist = dist;
                        const delta = dist - lastDist;

                        const px = (t1.clientX + t2.clientX) / 2;
                        const py = (t1.clientY + t2.clientY) / 2;
                        const pointer = point || clientPointerRelativeToStage(px, py, stage);
                        if (!point) point = pointer;

                        const startPos = {
                            x: pointer.x / oldScale - stage.x() / oldScale,
                            y: pointer.y / oldScale - stage.y() / oldScale,
                        };

                        const scaleBy = 1.01 + Math.abs(delta) / 100;
                        const newScale = delta < 0 ? oldScale / scaleBy : oldScale * scaleBy;
                        stage.scaleX(newScale);
                        stage.scaleY(newScale);
                        stage.staticlayer.scaleX(1 / newScale);
                        stage.staticlayer.scaleY(1 / newScale);
                        const newPosition = {
                            x: (pointer.x / newScale - startPos.x) * newScale,
                            y: (pointer.y / newScale - startPos.y) * newScale,
                        };
                        stage.position(newPosition);
                        stage.staticlayer.setAbsolutePosition({x: 0, y: 0});
                        stage.batchDraw();
                        lastDist = dist;
                    }
                }, false);

                stage.getContent().addEventListener('touchend', () => {
                    lastDist = 0;
                    point = undefined;
                }, false);
            }
        }
    }

//-----------------------------------------------------------


    /** Turn the tree into a json file **/
    treeToJson() {
        if (!this.startNode.trueArrow) {
            new ErrorCircle(this.startNode.trueCircle.position(), this.startNode, this.layer);
            throw new AIValidationError("The startnode is not connected!");
        } else {
            return this.startNode.trueArrow.dest.jsonify(this.intifyPosition(this.startNode.rect.getAbsolutePosition()));
        }
    }

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)});

    /** Highlights the active path through the tree in a replay **/
    highlightPath(boolList) {
        /**
         * @param boolList a boolean list that represents the AI's state. 
         * Note: this list will be cleared.
         */
        this.startNode.darkenAll();
        this.startNode.highlightPath(boolList);
    }

    /** Turn a json file into a tree **/
    jsonToTree(json) {

        //Create first child from the startnode (and therefore iteratively all their successors)
        let nodeChild = this.treeify(json, this.intifyPosition(this.startNode.rect.getAbsolutePosition()));

        //Add child to canvas
        this.layer.add(nodeChild.group);

        //Draw arrows to child
        this.drawArrowFromJson(this.startNode, nodeChild, true);
    }


    /** Add two positions **/
    addPosAAndPosB(posA, posB) {
        let posX = posB.x + posA.x;
        let posY = posB.y + posA.y;
        return {x: posX, y: posY};
    }

    /** Create a new node to which this will point. **/
    treeify(nodeJson, startNodePos) {

        //If the new childNode is a condition, create it with the given attributes and on the given position
        let newOwnNode;
        if (nodeJson.condition != null) {
            switch (nodeJson.condition.type_id) {
                case 1:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(1,
                        new distance(nodeJson.condition.attributes.distance),
                        new object(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 2:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(2,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 3:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(3,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 4:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(4,
                        null,
                        new object(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 5:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(5),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 6:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(6,
                        null, null, new label(nodeJson.condition.attributes.label)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 7:
                    newOwnNode = new conditionNode(this.stage, this.layer, this, new condition(7,
                        null, null, null, new health(nodeJson.condition.attributes.health)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                default:
                    throw new JSONValidationError("Condition has faulty ID!");
            }
        } else if (nodeJson.actionblock != null) {
            //Otherwise if new childNode is an action, first construct the actionlist
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
                        newActionList = newActionList.concat(new action(14, null, null, null, null, new label(actionItem.attributes.label), new seconds(actionItem.attributes.seconds)));
                        break;
                    default:
                        throw new JSONValidationError("Action has faulty ID!");

                }

            });
            //And then create the new ActionNode with the actionlist and on the given position
            return new actionNode(this.stage, this.layer, this, newActionList, this.addPosAAndPosB(nodeJson.actionblock.position, startNodePos));
        } else {
            throw new JSONValidationError("Did not get find action or condition in JSON!");
        }
    }

    /** Draw an arrow from the false/true-circle to the newly created node **/
    drawArrowFromJson(startNode, destNode, trueCondition) {
        new arrow(startNode, destNode, trueCondition, this.stage, this.layer);
    }

    /** Create childNodes, draw them on canvas and draw arrows to them **/
    createChildren(ownNode, conditionJson, startNodePos) {
        //create children
        let newTrueChild = this.treeify(conditionJson.child_true, startNodePos);
        let newFalseChild = this.treeify(conditionJson.child_false, startNodePos);

        //Draw them on canvas
        this.layer.add(newTrueChild.group);
        this.layer.add(newFalseChild.group);

        //Draw arrows to children
        this.drawArrowFromJson(ownNode, newTrueChild, true);
        this.drawArrowFromJson(ownNode, newFalseChild, false);
    }

    /** Add a node to this layer **/
    addNode(node) {
        this.layer.add(node.group);
        let { width, height } = this.getStageSize()
        let posx = Math.floor(width / 2)
        let posy = Math.floor(height / 2)

        node.group.absolutePosition({x: posx, y: posy});
        this.stage.draw();
        return node;
    }

    /** Add a blank ConditionNode to the canvas **/
    addCondition() {
        let newCondition = new conditionNode(this.stage, this.layer, this);
        return this.addNode(newCondition);
    }

    /** Add a blank ActionNode to the canvas **/
    addActionNode() {
        let newActionNode = new actionNode(this.stage, this.layer, this);
        return this.addNode(newActionNode);
    }

    /** All getters & setters **/
    getStageSize() {
        return this.stage.size()
    }

    set dragging(bool) {
        this._dragging = bool;
    }
    
    get dragging() {
        return this._dragging;
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

    get startNode() {
        return this._startNode;
    }

    set startNode(value) {
        this._startNode = value;
    }

    get isReplay() {
        return this._isReplay;
    }

    set isReplay(value) {
        this._isReplay = value;
    }

}


