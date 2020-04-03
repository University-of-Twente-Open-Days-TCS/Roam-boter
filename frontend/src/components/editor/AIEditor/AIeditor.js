import ActionNode from "./ActionNode.js";
import ConditionNode from "./ConditionNode.js";
import StartNode from "./StartNode.js";
import Konva from "konva"
import Distance from "./Distance.js";
import Obj from "./Obj.js";
import Label from "./Label.js";
import Health from "./Health.js";
import WindDir from "./WindDir.js";
import RelDir from "./RelDir.js";
import Speed from "./Speed.js";
import Condition from "./Condition.js";
import Action from "./Action.js";
import Arrow from "./Arrow.js";
import Seconds from "./Seconds.js";
import AIValidationError from "../Errors/AIValidationError.js";
import ErrorCircle from "../Errors/ErrorCircle.js";
import JSONValidationError from "../Errors/JSONValidationError.js";
import {
    amber,
    blue, cyan,
    deepOrange,
    deepPurple,
    green,
    grey,
    indigo,
    lightBlue,
    pink,
    red, teal,
    yellow
} from '@material-ui/core/colors';
import {black, white} from "color-name";

/** AI Canvas, the stage with which the user interacts or watches a replay on **/
export default class AiCanvas {

    //Stage dimensions

    _stage;
    _layer;
    _dragging;
    _startNode;
    _isReplay;

    // styling of the editor

    circle = {
        stroke_width: 1,
        stroke_color: grey['800'],
    }

    input_circle = {
        ...this.circle,
        fill: 'white'
    }

    true_circle = {
        ...this.circle,
        stroke_width: 0,
        fill: green['500']
    }

    false_circle = {
        ...this.circle,
        stroke_width: 0,
        fill: pink['A400']
    }

    node = {
        corner_radius: 5,
        stroke_width: 0,
        stroke_color: grey['800']
    }

    start_node = {
        ...this.node,
        fill: black,
    }

    condition_node = {
        ...this.node,
        fill: blue['900']
    }

    action_node = {
        ...this.node,
        fill: blue['700']
    }

    arrow = {
        stroke_width: 2,
        stroke_color: 'red',
        fill: 'black'
    }

    /** Created a stage, multiple layers and a StartNode, gets the container ID where it needs to be placed in,
     * and a boolean whether this is part of a replay next to a simulation (no interaction) **/
    constructor(container, isReplay) {
        console.log(blue['700'])
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
        this.startNode = new StartNode(this.stage, this.layer, this);
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

        //If the new childNode is a Condition, create it with the given attributes and on the given position
        let newOwnNode;
        if (nodeJson.condition != null) {
            switch (nodeJson.condition.type_id) {
                case 1:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(1,
                        new Distance(nodeJson.condition.attributes.distance),
                        new Obj(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 2:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(2,
                        null,
                        new Obj(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 3:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(3,
                        null,
                        new Obj(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 4:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(4,
                        null,
                        new Obj(nodeJson.condition.attributes.obj)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 5:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(5),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 6:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(6,
                        null, null, new Label(nodeJson.condition.attributes.label)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                case 7:
                    newOwnNode = new ConditionNode(this.stage, this.layer, this, new Condition(7,
                        null, null, null, new Health(nodeJson.condition.attributes.health)),
                        this.addPosAAndPosB(nodeJson.condition.position, startNodePos));

                    this.createChildren(newOwnNode, nodeJson.condition, startNodePos);

                    return newOwnNode;
                default:
                    throw new JSONValidationError("Condition has faulty ID!");
            }
        } else if (nodeJson.actionblock != null) {
            //Otherwise if new childNode is an Action, first construct the actionlist
            let newActionList = [];
            nodeJson.actionblock.actionlist.forEach(actionItem => {
                switch (actionItem.type_id) {
                    case 0:
                        newActionList = newActionList.concat(new Action(0));
                        break;
                    case 1:
                        newActionList = newActionList.concat(new Action(1, new Obj(actionItem.attributes.obj)));
                        break;
                    case 2:
                        newActionList = newActionList.concat(new Action(2));
                        break;
                    case 3:
                        newActionList = newActionList.concat(new Action(3, new Obj(actionItem.attributes.obj)));
                        break;
                    case 4:
                        newActionList = newActionList.concat(new Action(4, new Obj(actionItem.attributes.obj)));
                        break;
                    case 5:
                        newActionList = newActionList.concat(new Action(5, new Obj(actionItem.attributes.obj)));
                        break;
                    case 6:
                        newActionList = newActionList.concat(new Action(6, null, new WindDir(actionItem.attributes.winddir)));
                        break;
                    case 7:
                        newActionList = newActionList.concat(new Action(7, null, null, new RelDir(actionItem.attributes.reldir)));
                        break;
                    case 8:
                        newActionList = newActionList.concat(new Action(8, null, null, null, new Speed(actionItem.attributes.speed)));
                        break;
                    case 9:
                        newActionList = newActionList.concat(new Action(9, null, null, null, new Speed(actionItem.attributes.speed)));
                        break;
                    case 10:
                        newActionList = newActionList.concat(new Action(10));
                        break;
                    case 11:
                        newActionList = newActionList.concat(new Action(11));
                        break;
                    case 12:
                        newActionList = newActionList.concat(new Action(12, null, null, null, null, new Label(actionItem.attributes.label)));
                        break;
                    case 13:
                        newActionList = newActionList.concat(new Action(13, null, null, null, null, new Label(actionItem.attributes.label)));
                        break;
                    case 14:
                        newActionList = newActionList.concat(new Action(14, null, null, null, null, new Label(actionItem.attributes.label), new Seconds(actionItem.attributes.seconds)));
                        break;
                    default:
                        throw new JSONValidationError("Action has faulty ID!");

                }

            });
            //And then create the new ActionNode with the actionlist and on the given position
            return new ActionNode(this.stage, this.layer, this, newActionList, this.addPosAAndPosB(nodeJson.actionblock.position, startNodePos));
        } else {
            throw new JSONValidationError("Did not find Action or Condition in JSON!");
        }
    }

    /** Draw an Arrow from the false/true-circle to the newly created node **/
    drawArrowFromJson(startNode, destNode, trueCondition) {
        new Arrow(startNode, destNode, trueCondition, this.stage, this.layer);
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
        let newCondition = new ConditionNode(this.stage, this.layer, this);
        return this.addNode(newCondition);
    }

    /** Add a blank ActionNode to the canvas **/
    addActionNode() {
        let newActionNode = new ActionNode(this.stage, this.layer, this);
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


