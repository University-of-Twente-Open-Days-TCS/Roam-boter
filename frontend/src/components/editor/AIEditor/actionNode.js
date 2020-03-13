import popup from "./popup.js"
import action from "./action.js";
import object from "./object.js";
import reldir from "./reldir.js";
import winddir from "./winddir.js";
import label from "./label.js";
import Konva from "konva"

import speed from "./speed.js";

//TODO place all these variables somewhere nicer
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const spawnPoint = {x: 0, y: 0};


const objectList = [
    new object(1),
    new object(2),
    new object(3),
    new object(4),
    new object(5),
    new object(6),
    new object(7),
    new object(8),
    new object(9),
    new object(10)

];

const reldirList = [
    new reldir(0),
    new reldir(1),
    new reldir(2),
    new reldir(3)
];

const winddirList = [
    new winddir(0),
    new winddir(1),
    new winddir(2),
    new winddir(3)
];

const speedList = [
    new speed(0),
    new speed(1),
    new speed(2)
];


//LABELS DO NOT YET EXIST
const labelList = [
    new label(0),
    new label(1),
    new label(2),
    new label(3),
    new label(4),

];
export default class actionNode {


    _actionList;
    _actionNodeText;
    _actionNodeTextObj;
    _group;
    _rect;
    _inputCircle;
    _position;

    movementActions = [1, 2, 3, 4];
    containsMovement = false;
    aimActions = [5, 6, 7, 8, 9];
    containsAim = false;
    fireActions = [10, 11];
    containsFire = false;

    constructor(stage, layer, actionList = [], position = spawnPoint) {
        this.group = new Konva.Group({
            draggable: true
        });
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
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows(stage)
        });
        let thisActionNode = this;
        this.group.on("dragend", () => {
            var touchPos = stage.getPointerPosition();
            if (this.stage.staticlayer.getIntersection(touchPos) != null) {
                thisActionNode.remove();
                layer.draw();
            }
        });


        //Popup to add an action to the actionList within the node
        this.group.on("click tap", () => {

            //TODO could just make this by calling editAction with object null (no action yet) probs
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, this.generatePossibleActionsList(), this.editAction.bind(this)).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });

        this.setassetsizes();

        this.stage.draw();

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

    //Adds an action to the actionlist, or adds an attribute to the last action of the actionList
    editAction(attribute) {
        switch (attribute.constructor) {
            case (action):
                this.actionList.push(attribute);
                if (this.movementActions.includes(attribute.id)) {
                    this.containsMovement = true;
                } else if (this.aimActions.includes(attribute.id)) {
                    this.containsAim = true;
                } else if (this.fireActions.includes(attribute.id)) {
                    this.containsFire = true;
                }

                break;
            case(object):
                this.actionList[this.actionList.length - 1].object = attribute;
                break;
            case(winddir):
                this.actionList[this.actionList.length - 1].winddir = attribute;
                break;
            case(reldir):
                this.actionList[this.actionList.length - 1].reldir = attribute;
                break;
            case(speed):
                this.actionList[this.actionList.length - 1].speed = attribute;
                break;
            case(label):
                this.actionList[this.actionList.length - 1].label = attribute;
                break;
            default:
                //Empty by design, should not arrive here
                break;
        }


        //Check if the last added action still misses an attribute
        if (!this.actionList[this.actionList.length - 1].isValid()) {
            this.createAdditionalInfoPopup();
        } else {
            //Fill the actionNode with the newly added info
            this.actionNodeText = this.createActionNodeText();
            this.actionNodeTextObj.text(this.actionNodeText);
            this.setassetsizes();
            this.inputCircle.moveToTop();
        }

    }

    createAdditionalInfoPopup() {
        let wantedList;
        switch (this.actionList[this.actionList.length - 1].id) {
            case 0:
                break;
            case 1:
                wantedList = objectList;
                break;
            case 2:
                break;
            case 3:
                wantedList = objectList;
                break;
            case 4:
                wantedList = objectList;
                break;
            case 5:
                wantedList = objectList;
                break;
            case 6:
                wantedList = winddirList;
                break;
            case 7:
                wantedList = reldirList;
                break;
            case 8:
                wantedList = speedList;
                break;
            case 9:
                wantedList = speedList;
                break;
            case 10:
                break;
            case 11:
                break;
            case 12:
                wantedList = labelList;
                break;
            case 13:
                wantedList = labelList;
                break;
            case 14:
                wantedList = labelList;
                break;
            default:
            //Empty by design, should not come here
        }

        //If there is still an attribute missing, will ask for it via the popup
        if (wantedList != null) {
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, wantedList, this.editAction.bind(this)).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        }
    }


    generatePossibleActionsList() {


        //Items which you may always choose from
        let possibleActionsList = [
            //Infinite amount of Do Nothing
            new action(0),

            //Infinite labels TODO enable when labels get enabled
            // new action(12),
            // new action(13),
            // new action(14)
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

    intifyPosition = ({x, y}) => ({"x": parseInt(x), "y": parseInt(y)})

    jsonify() {
        let node = this.rect;
        let tree = {};
        tree.actionlist = [];

        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(item => {

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

                // Patrols in a possible eight-figure around a location.
                case 3:
                    tree.actionlist.push({
                        "type_id": 3, "attributes": {"obj": item.object.id}
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

                //Fires a bullet
                case 10:
                    tree.actionlist.push({
                        "type_id": 10, "attributes": {}
                    });
                    break;
                case 11:
                    tree.actionlist.push({
                        "type_id": 11, "attributes": {}
                    });

                    break;

                default:
                //Raise error, wrong ID TODO:
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
        this.layer.draw();
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
