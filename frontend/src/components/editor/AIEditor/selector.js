import Konva from "konva"

export default class selector {

    _stage;
    _layer;
    _items;
    _f;
    _group;

    blockHeight = 39;


    constructor(stage, layer, items, f) {
        this.dim = 3;
        this.stage = stage;
        this.layer = layer;
        this.items = items;
        this.f = f;
        let thisDropdown = this;
        this.group = new Konva.Group({x: 10, y: 30});
        this.list = this.generateTable();
        this.group.add(this.list);
    }

    getPos(blocksize, index) {
        let yIndex = Math.floor(index / this.dim);
        let xIndex = index % this.dim;
        return {x: xIndex * blocksize.width, y: yIndex * blocksize.height};
    }

    getBlockSize(textObjects) {
        //find the maximum height and width of all text objects in order to make all blocks equally big
        let min = this.blockHeight;
        let maxWidth = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.width()
        })))) + 20;

        let maxHeight = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.height()
        })))) + 10;
        return {width: maxWidth, height: maxHeight}
    }

    //generates the table of options
    generateTable() {
        let thisDropdown = this;
        let list = new Konva.Group();
        let textObjects = this.items.map((item) => {
            return new Konva.Text({text: item.toString(), padding: 10})
        });
        let blockSize = this.getBlockSize(textObjects);
        for (let i = 0; i < textObjects.length; i++) {
            let pos = this.getPos(blockSize, i);
            let g = new Konva.Group();
            let rect = this.createBlock(blockSize.height, blockSize.width, pos);
            let txt = textObjects[i];
            let obj = this.items[i];
            g.on("click tap", () => {
                this.f(obj);
            });
            txt.y(pos.y);
            txt.x(pos.x);
            g.add(rect);
            g.add(textObjects[i]);
            list.add(g);
        }
        this.width = blockSize.width * this.dim;
        if (this.items.length % this.dim === 0) {
            this.height = blockSize.height * (this.items.length / this.dim);
        } else {
            this.height = blockSize.height * Math.ceil(this.items.length / this.dim);
        }
        return list;
    }

    //creates the conva block in the menu
    createBlock(maxHeight, maxWidth, pos) {
        return new Konva.Rect({
            y: pos.y,
            x: pos.x,
            height: maxHeight,
            width: maxWidth,
            fill: "white",
            stroke: 'black',
            strokeWidth: 1,
        });

    }

    //Getters&setters
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

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }

    get f() {
        return this._f;
    }

    set f(value) {
        this._f = value;
    }

    get group() {
        return this._group;
    }

    set group(value) {
        this._group = value;
    }

}

