import Popup from "./Popup.js"
import Action from "./Action.js";
import Konva from "konva"
import AIValidationError from "../Errors/AIValidationError.js";
import ErrorCircle from "../Errors/ErrorCircle.js";

//The default block size of an ActionNode
const blockHeight = 40;
const blockWidth = 100;

//The circle radius of the inputcircle, and the hitbox (where the Arrow will snap to this ActionNode)
const circle_radius = 10;
const hitboxCircleRadius = 25;

//The default spawnpoint of a new ActionNode
const spawnPoint = {x: 0, y: 0};


/** ActionNode, the Obj on the canvas which can contain one or more actions **/
export default class ActionNode {


    _actionList;
    _actionNodeText;
    _actionNodeTextObj;
    _group;
    _canvas;
    _rect;
    _inputCircle;
    _inputCircleHitbox;
    _position;

    //The ID's of which actions are in a certain category
    movementActions = [1, 2, 4];
    containsMovement = false;
    aimActions = [5, 8, 9];
    containsAim = false;
    fireActions = [10, 11];
    containsFire = false;

    /** Constructor, takes at least the Konva stage, layer and canvas (ai_editor) it is positioned in.
     * Possible arguments are an actionList to fill the node with actions upon construction, and a position
     * other than the default spawnPoint **/
    constructor(stage, layer, canvas, actionList = [], position = spawnPoint) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.trashcan = stage.trashcan;
        this.stage = stage;
        this.layer = layer;
        this.canvas = canvas;
        this.position = position;
        this.actionList = actionList;

        //Check every Action in the list to flag which are still possible to add
        this.actionList.forEach(action => {
            if (this.movementActions.includes(action.id)) {
                this.containsMovement = true;
            } else if (this.aimActions.includes(action.id)) {
                this.containsAim = true;
            } else if (this.fireActions.includes(action.id)) {
                this.containsFire = true;
            }
        });

        this.actionNodeText = this.createActionNodeText();
        this.createTextObject();
        this.createRect();
        if (this.actionNodeText != null) {
            this.actionNodeTextObj.moveToTop();
        }
        this.createInputCircle();

        this.group.on("dragstart", () => {
            this.canvas.dragging = true;
        });


        this.group.on("dragmove", () => {
            this.updateArrows();
            this.canvas.dragging = true;
            this.updateArrows(this.stage);
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
                this.layer.draw();
                this.stage.trashcan.fire('touchend', {
                    type: 'touchend',
                    target: this.stage.trashcan

                });
                this.stage.staticlayer.draw();
            }
        });


        //Popup to add an Action to the actionList within the node
        this.group.on("click tap", () => {
            this.stage.staticlayer.add(new Popup(this.stage, this.stage.staticlayer, this.generatePossibleActionsList(), this.addAction.bind(this), "select an Action").group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });

        //Set the dimensions and hitboxes of this node according to its text contents
        this.setassetsizes();

        //Helper for Popup, bind every Action to a method which adds it to this node
        this.remainingOptions = [{options: this.generatePossibleActionsList(), f: (actn) => this.addAction(actn)}];

        this.stage.draw();
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }

    toString() {
        return "Action";
    }

    /** Loop over the ActionList, create the text  including newlines for the Node **/
    createActionNodeText() {
        let actionNodeString = "";
        let i = 0;
        if (this.actionList != null) {
            let actionListLength = this.actionList.length;
            actionNodeString = "> "
            this.actionList.forEach(element => {
                actionNodeString = actionNodeString.concat(element.toString());
                if (i + 1 < actionListLength) {
                    actionNodeString = actionNodeString.concat("\n> ");
                }
                i = i + 1;
            });
            return actionNodeString
        } else {
            return null;
        }

    }

    /** Adds new Action **/
    addAction(action) {
        this.actionList = this.actionList.concat(action);

        //Fill the ActionNode with the newly added info
        this.actionNodeText = this.createActionNodeText();
        this.actionNodeTextObj.text(this.actionNodeText);

        //Check what type of Action was added and adjust booleans accordingly
        if (this.movementActions.includes(action.id)) {
            this.containsMovement = true;
        } else if (this.fireActions.includes(action.id)) {
            this.containsFire = true;
        } else if (this.aimActions.includes(action.id)) {
            this.containsAim = true;
        }
        //Correct the assetsizes and move hitbox to the top layer
        this.setassetsizes();
        this.inputCircleHitbox.moveToTop();
    }

    /** Returns the actions which can still be added to this ActionNode **/
    generatePossibleActionsList() {


        //Items which you may always choose from
        let possibleActionsList = [

            //Do Nothing may be added indefinitely
            new Action(0),
        ];

        if (!this.containsMovement) {
            this.movementActions.forEach(movement => {
                possibleActionsList.push(new Action(movement));
            })
        }
        if (!this.containsAim) {
            this.aimActions.forEach(aim => {
                possibleActionsList.push(new Action(aim));
            })
        }
        if (!this.containsFire) {
            this.fireActions.forEach(fire => {
                possibleActionsList.push(new Action(fire));
            })
        }

        //labels may be added indefinitely
        possibleActionsList.push(
            new Action(12),
            new Action(13),
            new Action(14));


        return possibleActionsList;

    }

    /** Fix the size of the node and its hitboxes/arrows based on its current text contents**/
    setassetsizes() {
        //Adjust rect size
        this.rect.width(Math.max(this.actionNodeTextObj.width(), blockWidth));
        this.rect.height(Math.max(this.actionNodeTextObj.height(), blockHeight));

        //adjust inputcircle and hitbox
        this.inputCircle.y(this.rect.y());
        this.inputCircle.x(this.rect.x() + (this.rect.width() / 2));
        this.inputCircleHitbox.y(this.rect.y());
        this.inputCircleHitbox.x(this.rect.x() + (this.rect.width() / 2));

        //adjust arrows
        this.updateArrows(this.stage);

        this.stage.draw();
    }

    // TODO: lettertype etc.
    /** create text Obj for in the Condition**/
    createTextObject() {
        if (this.actionNodeText == null) {
            this.actionNodeText = "";
        }
        this.actionNodeTextObj = new Konva.Text({
            x: this.position.x,
            y: this.position.y,
            text: this.actionNodeText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: '"Lucida Console", Monaco, monospace',
            align: 'left',
            padding: 13
        });
        this.group.add(this.actionNodeTextObj);

    }

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)});


    /** Returns the json of its Action contents and position relative to the startnode, raises an error if node is
     * not valid **/
    jsonify(startNodePos) {
        let node = this.rect;
        let tree = {};
        tree.actionlist = [];

        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(item => {

            //Throw error if Action is incomplete

            if (!item.isValid()) {
                new ErrorCircle(this.getRectMiddlePos(), this, this.layer);
                throw new AIValidationError("An Action is missing one or more attributes!");
            }

            //case Action:
            switch (item.id) {

                //Do Nothing
                case 0:
                    tree.actionlist.push({
                        "type_id": 0, "attributes": {}
                    });
                    break;
                // Finds shortest path to reach given Obj.
                case 1:
                    tree.actionlist.push({
                        "type_id": 1, "attributes": {"obj": item.object.id}
                    });

                    break;
                //Follows a pre-defined path clockwise or anticlockwise along the map
                case 2:
                    tree.actionlist.push({
                        "type_id": 2, "attributes": {}
                    });
                    break;

                //Keeps moving in a straight away from Obj, if wall is hit keeps increasing either x or y-value to increase Distance
                case 4:
                    tree.actionlist.push({
                        "type_id": 4, "attributes": {"obj": item.object.id}
                    });
                    break;


                //Aims at an Obj. It aims according to the predicted position and bullet travel time
                case 5:
                    tree.actionlist.push({
                        "type_id": 5, "attributes": {"obj": item.object.id}
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 6:
                    tree.actionlist.push({
                        "type_id": 6, "attributes": {"winddir": item.winddir.id}
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 7:
                    tree.actionlist.push({
                        "type_id": 7, "attributes": {"reldir": item.reldir.id}
                    });
                    break;

                //Aim to left with Speed
                case 8:
                    tree.actionlist.push({
                        "type_id": 8, "attributes": {"speed": item.speed.id}
                    });
                    break;

                //Aim to right with Speed
                case 9:
                    tree.actionlist.push({
                        "type_id": 9, "attributes": {"speed": item.speed.id}
                    });
                    break;

                //Shoot
                case 10:
                    tree.actionlist.push({
                        "type_id": 10, "attributes": {}
                    });
                    break;

                //Self-destruct
                case 11:
                    tree.actionlist.push({
                        "type_id": 11, "attributes": {}
                    });
                    break;

                //set Label
                case 12:
                    tree.actionlist.push({
                        "type_id": 12, "attributes": {"label": item.label.id}
                    });
                    break;
                //unset Label
                case 13:
                    tree.actionlist.push({
                        "type_id": 13, "attributes": {"label": item.label.id}
                    });
                    break;
                //set Label for Seconds
                case 14:
                    tree.actionlist.push({
                        "type_id": 14, "attributes": {"label": item.label.id, "seconds": item.seconds.id}
                    });
                    break;

                default:
                    new ErrorCircle(this.getRectMiddlePos(), this, this.layer);
                    throw new AIValidationError("Tried to parse non-defined Action");
            }


        });
        tree.position = this.subtractPosAFromPosB(startNodePos, this.intifyPosition(node.getAbsolutePosition()));
        let result = {};
        result.actionblock = tree;
        return result;
    }

    subtractPosAFromPosB(posA, posB) {
        let posX = posB.x - posA.x;
        let posY = posB.y - posA.y;
        return {x: posX, y: posY};
    }

    /** Create the rect Obj for the node **/
    createRect() {
        this.rect = new Konva.Rect({
            x: this.position.x,
            y: this.position.y,
            width: blockWidth,
            height: blockHeight,
            fill: this.canvas.action_node.fill,
            stroke: this.canvas.action_node.stroke_color,
            strokeWidth: this.canvas.action_node.stroke_width,
            cornerRadius: this.canvas.action_node.corner_radius
        });
        this.group.add(this.rect);
    }

    /** Create circle and hitbox to which connections can be made by dragging arrows on it **/
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

    /** Get position of the inputdot, to draw an Arrow to **/
    getInputDotPosition() {
        return [this.inputCircle.x() + this.group.x(), this.inputCircle.y() + this.group.y()];
    }

    /** Update the arrows, for example if the node is being moved**/
    updateArrows() {
        if (this.inputArrow != null) {
            this.inputArrow.update();
        }
    }

    /** Remove node and its ingoing Arrow **/
    remove() {
        if (this.inputArrow != null) {
            this.inputArrow.delete();
        }
        this.group.destroy();
        this.layer.draw();
    }


    /** Get the middle position of the node, for an errorRing**/
    getRectMiddlePos() {
        let x = this.rect.x() + this.rect.width() / 2;
        let y = this.rect.y() + this.rect.height() / 2;
        return {x: x, y: y};
    }

    /** Darken the node, for when it is shown next to a simulation but is not active **/
    unhighlightAll() {
        this.unhighlight()
    }

    unhighlightPath(){
        this.unhighlight();
    }

    unhighlight(){
        this.rect.fill(this.canvas.action_node.fill_unselected);
        this.rect.strokeWidth(this.canvas.action_node.stroke_width);
    }

    /** Highlight the node, for when it is shown next to a simulation and is active **/
    highlightPath(boolList) {
        this.rect.fill(this.canvas.action_node.fill);
        this.rect.strokeWidth(3);
    }

    /** All getters & setters **/
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

    get actionNodeTextObj() {
        return this._actionNodeTextObj;
    }

    set actionNodeTextObj(value) {
        this._actionNodeTextObj = value;
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

    get rect() {
        return this._rect;
    }

    set rect(value) {
        this._rect = value;
    }

    get canvas() {
        return this._canvas;
    }

    set canvas(value) {
        this._canvas = value;
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

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }
}
