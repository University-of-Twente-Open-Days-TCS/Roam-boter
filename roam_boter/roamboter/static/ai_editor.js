import action from "./action.js";
import actionNode from "./actionNode.js";
import arrow from "./arrow.js";
import condition from "./condition.js";
import conditionNode from "./conditionNode.js";
import startNode from "./startNode.js";


let aiContainer = new aiCanvas('container');

//Buttons

//Add condition
document.getElementById('addCondition').addEventListener(
    'click',
    function () {
        aiContainer.addCondition(stage, layer)
    },
    false
);

//Add action
document.getElementById('addActionNode').addEventListener(
    'click',
    function () {
        aiContainer.addActionNode(stage, layer)
    },
    false
);
//Add condition
document.getElementById('printJson').addEventListener(
    'click',
    function () {
        console.log("textTreeToJson")
        console.log(JSON.stringify(aiContainer.treeToJson(s)));
    },
    false
);


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


    constructor(container) {
        //Create the stage
        this.createStage(container);

        // then create layer
        this.layer = new Konva.Layer();
        this.stage.templayer = new Konva.Layer();

        this.stage.inputDict = new Map([]);
        this.stage.staticlayer = new Konva.Layer();

        //Create the canvas
        var s = new startNode(this.stage, this.layer);
        this.layer.add(s.group);
        this.stage.add(stage.staticlayer);
        this.stage.add(layer);
        this.stage.add(stage.templayer);
        this.layer.draw();


        //add trashcan
        this.addTrashcan(stage);
        this.layer.draw();
        this.stage.staticlayer.draw();

        //Make canvas draggable
        this.makeDraggable();

    }

    createStage(container) {
        this.stage = new Konva.Stage({
            container: container,
            width: stageWidth,
            height: stageHeight,
            draggable: true,
            x: 0,
            y: 0,
        });
        stage.scale = 1;
    }


    //make trashcan
    addTrashcan() {
        var imageObj = new Image();
        //TODO: FIX NORMAL IMAGE
        imageObj.src = 'https://cdn0.iconfinder.com/data/icons/shopping-359/512/Bin_bin_delete_trashcan_garbage_dust-512.png';
        imageObj.onload = function () {
            let trashcan = new Konva.Image({
                x: stageWidth - 60,
                y: 100,
                image: imageObj,
                width: 60,
                height: 60
            });

            this.stage.staticlayer.add(trashcan);
            this.stage.staticlayer.draw();
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

                var scale = (this.stage.scaleX() * dist) / lastDist;

                this.stage.scaleX(scale);
                this.stage.scaleY(scale);
                //the trashcan is the only thing which should not scale with the rest of the stage
                this.stage.staticlayer.scaleX(1 / scale);
                this.stage.staticlayer.scaleY(1 / scale);
                this.stage.scale = scale;
                this.stage.batchDraw();
                lastDist = dist;
            }
        });

        this.stage.on('touchend', function () {
            lastDist = 0;
        });


        this.stage.on("dragmove", function () {
            // when the stage is moved the trashcan should remain in the same position
            this.stage.staticlayer.absolutePosition({x: 0, y: 0});
        });
    }

    treeToJson(startnode) {
        console.log(startnode);
        return startnode.trueArrow.dest.jsonify();
    }


//BELOW THIS LINE ARE ONLY BUTTON-INTERACTION-FUNCTION DEMOS, MOST LIKELY TO BE REPLACED BY REACT
    addCondition(stage, layer) {
        let newCondition = new conditionNode(stage, layer, new condition(3, null, "tank"));
        layer.add(newCondition.group);
        newCondition.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
        stage.draw();
    }

    addActionNode(stage, layer) {
        let newActionNode = new actionNode(stage, layer, [new action(0), new action(2)]);
        layer.add(newActionNode.group);
        newActionNode.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
        stage.draw();

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

}

