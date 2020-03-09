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
        this.group = new Konva.Group();

        this.topBoxGroup = new Konva.Group();

        this.topBoxText = new Konva.Text({text: "select an item", padding: 10});

        this.topBoxRect = new Konva.Rect({
            height: thisDropdown.blockHeight,
            fill: "white",
            stroke: 'black',
            strokeWidth: 1,
        });

        this.topBoxGroup.add(this.topBoxRect);

        this.topBoxGroup.add(this.topBoxText);

        this.group.add(this.topBoxGroup);

        this.list = this.generateList();

        this.topBoxGroup.on("click", () => {
            this.group.add(this.list);
            thisDropdown.stage.draw()
        });

        window.addEventListener('click', () => {
            // hide menu
            this.list.remove();
        });
    }

    generateList() {
        let thisDropdown = this;
        let list = new Konva.Group();
        let textObjects = this.items.map((item) => {
            return new Konva.Text({text: item.toString(), padding: 10})
        });

        let min = this.topBoxText.width();
        let max = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.width()
        })))) + 20;

        let i;

        for (i = 0; i < textObjects.length; i++) {
            let g = new Konva.Group();
            let rect = new Konva.Rect({
                y: this.blockHeight * (i + 1),
                height: this.blockHeight,
                width: max,
                fill: "white",
                stroke: 'black',
                strokeWidth: 1,
            });

            let txt = textObjects[i];
            let obj = this.items[i];
            g.on("click", () => {
                this.topBoxText.text(txt.text());
                thisDropdown.layer.draw();
                this.f(obj);
            });

            textObjects[i].y(this.blockHeight * (i + 1));
            g.add(rect);
            g.add(textObjects[i]);
            list.add(g);
        }
        this.topBoxRect.width(max);

        return list;
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

