const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
//coordinates where every new element spawns
var spawnX = 0;
var spawnY = 0;

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

        this.actionList = actionList;
        this.actionNodeText = this.createActionNodeText();
        this.createRect();
        this.createInputCircle();
        let node = this;
        this.group.on("dragmove", function () {
            node.updateArrows(stage)
        });
        let thisActionNode = this;
        this.group.on("dragend", () => {
            var touchPos = stage.getPointerPosition();
            console.log("dragend");
            console.log(this.stage.trashcanlayer.getIntersection(touchPos));
            if (this.stage.trashcanlayer.getIntersection(touchPos) != null) {
                thisActionNode.remove();
                layer.draw();
            }
        });

    }

    createActionNodeText() {
        let actionNodeString = "";
        if (this.actionList != null) {
            let actionListLength = this.actionList.length;
            this.actionList.forEach(function (action, index) {
            actionNodeString.concat(action.toString());
            if (index + 1 < actionListLength) {
                actionNodeString.concat("\n");
            }
        })
        } else {
            return null;
        }


    }

    setassetsizes() {
        //Adjust rect size
        if (this.actionNodeText.text != null) {
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
    createTextObject(actionNodeText) {
        this.actionNodeTextObj = new Konva.Text({
            x: spawnX,
            y: spawnY,
            text: actionNodeText,
            fontSize: 12,
            fill: '#FFF',
            fontFamily: 'Monospace',
            align: 'center',
            padding: 10
        });
        return this.actionNodeTextObj;
    }

    jsonify() {

        let tree = {};
        tree.actionblock = [];

        //Iterate over all actions and add its json to the actionblock
        this.actionList.forEach(function (action) {

            //case Action:
            switch (action.id) {
                // Finds shortest path to reach given object.
                case 1:
                    tree.actionblock.push({
                        "type-id": 1, "attributes": {"object": action.object},
                        "position:": this.getAbsolutePosition()
                    });

                    break;
                //Follows a pre-defined path clockwise or anticlockwise along the map
                case 2:
                    tree.actionblock.push({
                        "type-id": 2, "attributes": {},
                        "position:": this.getAbsolutePosition()
                    });
                    break;

                // Patrols in a possible eight-figure around a location.
                case 3:
                    tree.actionblock.push({
                        "type-id": 3, "attributes": {"object": action.object},
                        "position:": this.getAbsolutePosition()
                    });
                    break;


                //Keeps moving in a straight away from object, if wall is hit keeps increasing either x or y-value to increase distance
                case 4:
                    tree.actionblock.push({
                        "type-id": 4, "attributes": {"object": action.object},
                        "position:": this.getAbsolutePosition()
                    });
                    break;


                //Aims at an object. It aims according to the predicted position and bullet travel time
                case 5:
                    tree.actionblock.push({
                        "type-id": 5, "attributes": {"object": action.object},
                        "position:": this.getAbsolutePosition()
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 6:
                    tree.actionblock.push({
                        "type-id": 6, "attributes": {"dir": action.dir},
                        "position:": this.getAbsolutePosition()
                    });
                    break;


                //Aims at a certain direction based on either the tank or map
                case 7:
                    tree.actionblock.push({
                        "type-id": 7, "attributes": {"deg": action.deg},
                        "position:": this.getAbsolutePosition()
                    });
                    break;

                //Fires a bullet
                case 8:
                    tree.actionblock.push({
                        "type-id": 8, "attributes": {}, "position:": this.getAbsolutePosition()
                    });
                    break;
                //Blows up your own tank, dealing equal damage to your surroundings
                case 9:
                    tree.actionblock.push({
                        "type-id": 9, "attributes": {}, "position:": this.getAbsolutePosition()
                    });

                    break;
                //Sets a certain label to true
                case 10:
                    tree.actionblock.push({
                        "type-id": 10, "attributes": {"label": action.label}, "position:": this.getAbsolutePosition()
                    });

                    break;

                //Sets a certain label to false
                case 11:
                    tree.actionblock.push({
                        "type-id": 10, "attributes": {"label": action.label}, "position:": this.getAbsolutePosition()
                    });

                    break;

                //Sets a certain label to true for X seconds
                case 12:
                    tree.actionblock.push({
                        "type-id": 10, "attributes": {"label": action.label}, "position:": this.getAbsolutePosition()
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