import action from "./action.js";
import actionNode from "./actionNode.js";
import arrow from "./arrow.js";
import condition from "./condition.js";
import conditionNode from "./conditionNode.js";
import startNode from "./startNode.js";


class aiCanvas {

    blockHeight = 40;
    blockWidth = 100;
    circle_radius = 10;
    hitboxCircleRadius = 20;

    stageWidth = window.innerWidth;
    stageHeight = window.innerHeight;

    _stage;
    _layer;

    //coordinates where every new element spawns
    spawnX = 0;
    spawnY = 0;

    _startNode;

    constructor(container) {
        //Create the stage
        this.createStage(container);

        console.log("new constructor method!");
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
        var startScale = 1;

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

    treeToJson() {
        console.log(this.startNode);
        return this.startNode.trueArrow.dest.jsonify();
    }

//-----------------------------------------------------------


//BELOW THIS LINE ARE ONLY BUTTON-INTERACTION-FUNCTION DEMOS, MOST LIKELY TO BE REPLACED BY REACT
    addCondition() {
        let newCondition = new conditionNode(this.stage, this.layer);
        this.layer.add(newCondition.group);
        newCondition.group.absolutePosition({x: this.stageWidth / 2, y: this.stageHeight / 2});
        this.stage.draw();
    }

    addActionNode(stage, layer) {
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

let aiContainer = new aiCanvas('container');

//Buttons

//Add condition
document.getElementById('addCondition').addEventListener(
    'click',
    function () {
        aiContainer.addCondition()
    },
    false
);

//Add action
document.getElementById('addActionNode').addEventListener(
    'click',
    function () {
        aiContainer.addActionNode()
    },
    false
);
//Add condition
document.getElementById('printJson').addEventListener(
    'click',
    function () {
        console.log("textTreeToJson")
        console.log(JSON.stringify(aiContainer.treeToJson()));
    },
    false
);

