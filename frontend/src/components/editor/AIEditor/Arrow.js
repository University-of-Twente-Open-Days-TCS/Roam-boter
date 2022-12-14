import Konva from "konva"


/** The connection between two conditions or a Condition and an Action **/
export default class Arrow {

    //The Konva Arrow Obj
    _arrowline;

    //The source/origin group of nodes (Condition)
    _src;

    //The destination group of nodes (Condition/Action)
    _dest;

    //Whether the Arrow sprouts from a true or false Condition
    _isTrue;

    //The starting coordinates on the canvas (absolute)//
    _startpos;

    //The end coordinates on the canvas (absolute)
    _endpos;

    //The stage&layer
    _layer;
    _stage;


    /** Constructor takes the source node, destination node and whether it starts at the true- or false point as input
     * Also the stage&layer to draw itself on **/
    constructor(src, dest, isTrue, stage, layer) {
        this.src = src;
        this.dest = dest;
        this.isTrue = isTrue;
        this.stage = stage;
        this.layer = layer;

        //Its startposition is based on the ConditionNode and whether it sprouts from the true- or falsecircle
        if (isTrue) {
            this.startpos = this.src.getTrueDotPosition();
            this.src.trueArrow = this;
        } else {
            this.startpos = this.src.getFalseDotPosition();
            this.src.falseArrow = this;
        }
        this.endpos = this.dest.getInputDotPosition();
        this.dest.inputArrow = this;

        this.arrowline = new Konva.Arrow({
            points: this._startpos.concat(this.endpos).map(function (p) {
                return p / stage.scale
            }),
            stroke: 'black',
            fill: 'black'
        });
        this.arrowline.absolutePosition({x: 0, y: 0});

        this.layer.add(this.arrowline);
        this.update(stage);
    }


    /** Move the Arrow and update the canvas **/
    update() {
        if (this.isTrue) {
            this.startpos = this.src.getTrueDotPosition();
        } else {
            this.startpos = this.src.getFalseDotPosition();
        }
        this.endpos = this.dest.getInputDotPosition();
        //this is to offset the possible movement of the entire stage, otherwise the arrows would not be in the correct position
        this.arrowline.points(this.startpos.concat(this.endpos));
        this.layer.batchDraw();
    }

    /** Remove the Arrow from the canvas and set the corresponding values at the src&dest nodes to null **/
    delete() {
        if (this.isTrue) {
            this.src.trueArrow = null;
        } else {
            this.src.falseArrow = null;
        }
        this.dest.inputArrow = null;
        this.arrowline.destroy();
        this.layer.draw();
    }

    /** All getters & setters **/
    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    get dest() {
        return this._dest;
    }

    set dest(value) {
        this._dest = value;
    }

    get isTrue() {
        return this._isTrue;
    }

    set isTrue(value) {
        this._isTrue = value;
    }

    get startpos() {
        return this._startpos;
    }

    set startpos(value) {
        this._startpos = value;
    }

    get endpos() {
        return this._endpos;
    }

    set endpos(value) {
        this._endpos = value;
    }

    get arrowline() {
        return this._arrowline;
    }

    set arrowline(value) {
        this._arrowline = value;
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