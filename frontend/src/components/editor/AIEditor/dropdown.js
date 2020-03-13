import Konva from "konva"

export default class dropdown {

    _stage;
    _layer;
    _items;
    _f;
    _group;

    blockHeight = 39;


    constructor(stage, layer, items, f) {

        this.stage = stage;
        this.layer = layer;
        this.items = items;
        this.f = f;
        let thisDropdown = this;
        this.group = new Konva.Group({x: 10, y: 30});

        this.topBoxGroup = new Konva.Group();

        this.topBoxText = new Konva.Text({text: "select an item", padding: 10});

        this.topBoxRect = new Konva.Rect({
            height: thisDropdown.blockHeight,
            fill: "white",
            stroke: 'black',
            strokeWidth: 1,
        });

        this.group.add(this.topBoxGroup);

        this.list = this.generateTable();
        this.group.add(this.list);
    }

    //generates the table of options
    generateTable() {
        let thisDropdown = this;
        let list = new Konva.Group();
        let textObjects = this.items.map((item) => {
            return new Konva.Text({text: item.toString(), padding: 10})
        });

        //find the maximum height and width of all text objects in order to make all blocks equally big
        let min = this.blockHeight;
        let maxWidth = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.width()
        })))) + 20;

        let maxHeight = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.height()
        })))) + 10;

        let dim = 3;
        let i;
        let j;
        for (i = 0; i < dim; i++) {
            //store the height of the table in order to determine the size of the total popup
            if (j != null) {
                var jheight = (j + 1);
            }
            j = 0;
            while (typeof textObjects[i + j * dim] !== 'undefined') {
                let g = new Konva.Group();
                let rect = this.createBlock(maxHeight, maxWidth, i, j);
                let txt = textObjects[i + j * dim];
                let obj = this.items[i + j * dim];
                g.on("click tap", () => {
                    this.topBoxText.text(txt.text());
                    thisDropdown.layer.draw();
                    this.f(obj);
                });

                txt.y(maxHeight * (j));
                txt.x(i * maxWidth);
                g.add(rect);
                g.add(textObjects[i + j * dim]);
                list.add(g);
                j++;
            }
        }
        this.width = maxWidth * dim;
        this.height = maxHeight * jheight;
        return list;
    }

    //creates the conva block in the menu
    createBlock(maxHeight, maxWidth, i, j) {
        return new Konva.Rect({
            y: maxHeight * (j),
            x: i * maxWidth,
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

