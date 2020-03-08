import action from "./action.js";
import actionNode from "./actionNode.js";
import arrow from "./arrow.js";
import condition from "./condition.js";
import conditionNode from "./conditionNode.js";
import startNode from "./startNode.js";



// first we need to create a stage
var stageWidth = window.innerWidth;
var stageHeight = window.innerHeight;
// var stageWidth = 1000;
// var stageHeight = 1000;

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

var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight,
    draggable: true,
    x: 0,
    y: 0,
});
stage.scale = 1;

stage.on('touchmove', function (e) {
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

        var scale = (stage.scaleX() * dist) / lastDist;

        stage.scaleX(scale);
        stage.scaleY(scale);
        //the trashcan is the only thing which should not scale with the rest of the stage
        stage.staticlayer.scaleX(1 / scale);
        stage.staticlayer.scaleY(1 / scale);
        stage.scale = scale;
        stage.batchDraw();
        lastDist = dist;
    }
});

stage.on('touchend', function () {
    lastDist = 0;
});

//-----------------------------------------------------------


// then create layer
var layer = new Konva.Layer();
stage.templayer = new Konva.Layer();
const blockHeight = 40;
const blockWidth = 100;
const circle_radius = 10;
const hitboxCircleRadius = 20;
stage.inputDict = new Map([]);
stage.staticlayer = new Konva.Layer();


//coordinates where every new element spawns
var spawnX = 0;
var spawnY = 0;

stage.on("dragmove", function () {
    // when the stage is moved the trashcan should remain in the same position
    stage.staticlayer.absolutePosition({x: 0, y: 0});
});

// var startnode = new startNode();


function treeToJson(startnode) {
    console.log(startnode);
    return startnode.trueArrow.dest.jsonify();
}


//make trashcan
function addTrashcan(stage) {
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

        stage.staticlayer.add(trashcan);
        stage.staticlayer.draw();
    }


}

//Create the canvas
var s = new startNode(stage, layer);
layer.add(s.group);
stage.add(stage.staticlayer);
stage.add(layer);
stage.add(stage.templayer);
layer.draw();


//add trashcan
addTrashcan(stage);
layer.draw();
stage.staticlayer.draw();


//BELOW THIS LINE ARE ONLY BUTTON-INTERACTION-FUNCTION DEMOS, MOST LIKELY TO BE REPLACED BY REACT
function addCondition(stage, layer) {
    let newCondition = new conditionNode(stage, layer, new condition(3, null, "tank"));
    layer.add(newCondition.group);
    newCondition.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
    stage.draw();
}

function addActionNode(stage, layer) {
    let newActionNode = new actionNode(stage, layer, [new action(0), new action(2)]);
    layer.add(newActionNode.group);
    newActionNode.group.absolutePosition({x: stageWidth / 2, y: stageHeight / 2});
    stage.draw();

}

// //on click, toggle between hiding and showing dropdown content
// function spawnActionNode() {
//     document.getElementById("actionNodeList").classList.toggle("show");
// }
//
// // Close the dropdown menu if the user clicks outside of it
// window.onclick = function (event) {
//     if (!event.target.matches('.dropbtn')) {
//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//             var openDropdown = dropdowns[i];
//             if (openDropdown.classList.contains('show')) {
//                 openDropdown.classList.remove('show');
//             }
//         }
//     }
// }

//Buttons

//Add condition
document.getElementById('addCondition').addEventListener(
    'click',
    function () {
        addCondition(stage, layer)
    },
    false
);

//Add action
document.getElementById('addActionNode').addEventListener(
    'click',
    function () {
        addActionNode(stage, layer)
    },
    false
);
//Add condition
document.getElementById('printJson').addEventListener(
    'click',
    function () {
        console.log("textTreeToJson")
        console.log(JSON.stringify(treeToJson(s)));
    },
    false
);

