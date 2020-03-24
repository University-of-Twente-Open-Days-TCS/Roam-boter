import popup from "./popup.js"
import action from "./action.js";
import Konva from "konva"
import AIValidationError from "../Errors/AIValidationError.js";
import ErrorCircle from "../Errors/ErrorCircle.js";


//TODO place all these variables somewhere nicer
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const spawnPoint = {x: 0, y: 0};


export default class actionNode {


    _actionList;
    _actionNodeText;
    _actionNodeTextObj;
    _group;
    _rect;
    _inputCircle;
    _position;

    movementActions = [1, 2, 4];
    containsMovement = false;
    aimActions = [5, 6, 7, 8, 9];
    containsAim = false;
    fireActions = [10, 11];
    containsFire = false;

    constructor(stage, layer, canvas, actionList = [], position = spawnPoint) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.trashcan = stage.trashcan;
        this.stage = stage;
        this.layer = layer;
        this.position = position;
        this.actionList = actionList;
        this.actionList.forEach(action => {
            if (this.movementActions.includes(action)) {
                this.containsMovement = true;
            } else if (this.aimActions.includes(action)) {
                this.containsAim = true;
            } else if (this.fireActions.includes(action)) {
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
        this.group.on("dragmove", () => {
            this.updateArrows();
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


        //Popup to add an action to the actionList within the node
        this.group.on("click tap", () => {

            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, this.generatePossibleActionsList(), this.addAction.bind(this), "select an action").group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });

        this.setassetsizes();
        this.remainingOptions = [{options: this.generatePossibleActionsList(), f: (actn) => this.addAction(actn)}];
        this.stage.draw();
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }

    toString() {
        return "action";
    }

    createActionNodeText() {
        let actionNodeString = "";
        let i = 0;
        if (this.actionList != null) {
            let actionListLength = this.actionList.length;
            this.actionList.forEach(element => {
                actionNodeString = actionNodeString.concat(element.toString());
                if (i + 1 < actionListLength) {
                    actionNodeString = actionNodeString.concat("\n");
                }
                i = i + 1;
            });
            return actionNodeString
        } else {
            return null;
        }

    }

    //adds a new action
    addAction(action) {
        this.actionList = this.actionList.concat(action);
        //Fill the actionNode with the newly added info
        this.actionNodeText = this.createActionNodeText();
        this.actionNodeTextObj.text(this.actionNodeText);
        //Check what type of action was added and adjust booleans accordingly
        if (this.movementActions.includes(action.id)) {
            this.containsMovement = true;
        } else if (this.fireActions.includes(action.id)) {
            this.containsFire = true;
        } else if (this.aimActions.includes(action.id)) {
            this.containsAim = true;
        }
        this.setassetsizes();
        this.inputCircle.moveToTop();
    }

    generatePossibleActionsList() {


        //Items which you may always choose from
        let possibleActionsList = [
            //Infinite amount of Do Nothing
            new action(0),
        ];

        if (!this.containsMovement) {
            this.movementActions.forEach(movement => {
                possibleActionsList.push(new action(movement));
            })
        }
        if (!this.containsAim) {
            this.aimActions.forEach(aim => {
                possibleActionsList.push(new action(aim));
            })
        }
        if (!this.containsFire) {
            this.fireActions.forEach(fire => {
                possibleActionsList.push(new action(fire));
            })
        }

        possibleActionsList.push(//Infinite labels
            new action(12),
            new action(13),
            new action(14));


        return possibleActionsList;

    }

    setassetsizes() {
        //Adjust rect size
        this.rect.width(Math.max(this.actionNodeTextObj.width(), blockWidth));
        this.rect.height(Math.max(this.actionNodeTextObj.height(), blockHeight));

        //adjust inputcircle
        this.inputCircle.y(this.rect.y());
        this.inputCircle.x(this.rect.x() + (this.rect.width() / 2));

        //adjust arrows
        this.updateArrows(this.stage);

        this.stage.draw();
    }

    //create text for in the condition
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
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        this.group.add(this.actionNodeTextObj);

    }

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)});

    jsonify() {
        let node = this.rect;
        let tree = {};
        tree.actionlist = [];

        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(item => {

            //Throw error if action is incomplete

            if (!item.isValid()) {
                new ErrorCircle(this.getRectMiddlePos(), this, this.layer);
                throw new AIValidationError("An action is missing one or more attributes!");
            }

            //case Action:
            switch (item.id) {

                //Do Nothing
                case 0:
                    tree.actionlist.push({
                        "type_id": 0, "attributes": {}
                    });
                    break;
                // Finds shortest path to reach given object.
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

                //Keeps moving in a straight away from object, if wall is hit keeps increasing either x or y-value to increase distance
                case 4:
                    tree.actionlist.push({
                        "type_id": 4, "attributes": {"obj": item.object.id}
                    });
                    break;


                //Aims at an object. It aims according to the predicted position and bullet travel time
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

                //set label
                case 12:
                    tree.actionlist.push({
                        "type_id": 12, "attributes": {"label": item.label.id}
                    });
                    break;
                //unset label
                case 13:
                    tree.actionlist.push({
                        "type_id": 13, "attributes": {"label": item.label.id}
                    });
                    break;
                //set label for X seconds
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
        tree.position = this.intifyPosition(node.getAbsolutePosition());
        let result = {};
        result.actionblock = tree;
        return result;
    }


    createRect() {
        this.rect = new Konva.Rect({
            x: this.position.x,
            y: this.position.y,
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
            y: this.position.y,
            x: this.position.x + this.rect.width() / 2,
            radius: circle_radius,
            fill: 'white',
            stroke: 'black',
        });
        this.stage.inputDict.set(this.inputCircle, this);

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
        this.layer.draw();
    }


    getRectMiddlePos() {
        let x = this.rect.x() + this.rect.width() / 2;
        let y = this.rect.y() + this.rect.height() / 2;
        return {x: x, y: y};
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


    get inputCircle() {
        return this._inputCircle;
    }

    set inputCircle(value) {
        this._inputCircle = value;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
    }
}
