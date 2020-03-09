import popup from "./popup.js"
import action from "./action.js";
import object from "./object.js";
import distance from "./distance.js";
import reldir from "./reldir.js";
import winddir from "./winddir.js";
import label from "./label.js";
import health from "./health.js";
import Konva from "konva"


//TODO place all these variables somewhere nicer
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
var spawnX = 0;
var spawnY = 0;


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
    new reldir(2)
];

const winddirList = [
    new winddir(0),
    new winddir(1),
    new winddir(2)
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


    constructor(stage, layer, actionList) {
        this.group = new Konva.Group({
            draggable: true
        });
        this.stage = stage;
        this.layer = layer;

        if (actionList != null) {
            this.actionList = actionList;
        } else {
            this.actionList = [];
        }
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
            console.log("dragend");
            console.log(this.stage.staticlayer.getIntersection(touchPos));
            if (this.stage.staticlayer.getIntersection(touchPos) != null) {
                thisActionNode.remove();
                layer.draw();
            }
        });


        //Popup to add an action to the actionList within the node
        this.group.on("click", () => {

            //TODO could just make this by calling editAction with object null (no action yet) probs
            this.stage.staticlayer.add(new popup(this.stage, this.stage.staticlayer, this.generateActionsList(), this.editAction.bind(this)).group);
            this.stage.staticlayer.moveToTop();
            this.stage.draw();
        });

        this.stage.draw();

    }

    createActionNodeText() {
        let actionNodeString = "";
        let i = 0;
        if (this.actionList != null) {
            console.log(this.actionList);
            let actionListLength = this.actionList.length;
            this.actionList.forEach(element => {
                console.log(element.toString());
                actionNodeString = actionNodeString.concat(element.toString());
                if (i + 1 < actionListLength) {
                    actionNodeString = actionNodeString.concat("\n");
                }
                i = i + 1;
            });
            console.log(actionNodeString);
            return actionNodeString
        } else {
            return null;
        }

    }

    //Adds an action to the actionlist, or adds an attribute to the last action of the actionList
    editAction(attribute) {
        switch (attribute.constructor) {
            case (action):
                this.actionList = this.actionList.concat(attribute);
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
                break;
            case 9:
                break;
            case 10:
                wantedList = labelList;
                break;
            case 11:
                wantedList = labelList;
                break;
            case 12:
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


    generateActionsList() {
        let allActionsList = [
            new action(0),
            new action(1),
            new action(2),
            new action(3),
            new action(4),
            new action(5),
            new action(6),
            new action(7),
            new action(8),
            new action(9)
        ];
        return allActionsList;

    }

    setassetsizes() {
        //Adjust rect size
        if (this.actionNodeTextObj.text != null) {
            this.rect.width(this.actionNodeTextObj.width());
            this.rect.height(this.actionNodeTextObj.height());
        } else {
            this.rect.width(blockWidth);
            this.rect.height(blockHeight);
        }

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
            x: spawnX,
            y: spawnY,
            text: this.actionNodeText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        this.group.add(this.actionNodeTextObj);

    }

    intifyPosition = ({x, y}) => ({"x" : parseInt(x), "y" : parseInt(y)})

    jsonify() {
        let node = this.rect;
        let tree = {};
        tree.actionblock = [];

        console.log(this.actionList);
        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(item => {

            //case Action:
            switch (item.id) {

                //Do Nothing
                case 0:
                    tree.actionblock.push({
                        "type-id": 0, "attributes": {},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;
                // Finds shortest path to reach given object.
                case 1:
                    tree.actionblock.push({
                        "type-id": 1, "attributes": {"object": item.object},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });

                    break;
                //Follows a pre-defined path clockwise or anticlockwise along the map
                case 2:
                    tree.actionblock.push({
                        "type-id": 2, "attributes": {},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;

                // Patrols in a possible eight-figure around a location.
                case 3:
                    tree.actionblock.push({
                        "type-id": 3, "attributes": {"object": item.object},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;


                //Keeps moving in a straight away from object, if wall is hit keeps increasing either x or y-value to increase distance
                case 4:
                    tree.actionblock.push({
                        "type-id": 4, "attributes": {"object": item.object},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;


                //Aims at an object. It aims according to the predicted position and bullet travel time
                case 5:
                    tree.actionblock.push({
                        "type-id": 5, "attributes": {"object": item.object},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 6:
                    tree.actionblock.push({
                        "type-id": 6, "attributes": {"dir": item.dir},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 7:
                    tree.actionblock.push({
                        "type-id": 7, "attributes": {"deg": item.deg},
                        "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;

                //Fires a bullet
                case 8:
                    tree.actionblock.push({
                        "type-id": 8, "attributes": {}, "position:": this.intifyPosition(node.getAbsolutePosition())
                    });
                    break;
                //Blows up your own tank, dealing equal damage to your surroundings
                case 9:
                    tree.actionblock.push({
                        "type-id": 9, "attributes": {}, "position:": this.intifyPosition(node.getAbsolutePosition())
                    });

                    break;
                //Sets a certain label to true
                case 10:
                    tree.actionblock.push({
                        "type-id": 10, "attributes": {"label": item.label}, "position:": this.intifyPosition(node.getAbsolutePosition())
                    });

                    break;

                //Sets a certain label to false
                case 11:
                    tree.actionblock.push({
                        "type-id": 11, "attributes": {"label": item.label}, "position:": this.intifyPosition(node.getAbsolutePosition())
                    });

                    break;

                //Sets a certain label to true for X seconds
                case 12:
                    tree.actionblock.push({
                        "type-id": 12, "attributes": {"label": item.label}, "position:": this.intifyPosition(node.getAbsolutePosition())
                    });

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
}