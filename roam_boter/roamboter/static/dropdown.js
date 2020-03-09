export default class dropdown {
    constructor(stage, layer, items, f) {
        this.group = new Konva.Group();
        this.blockHeight = 30;
        this.f = f;
        this.topBoxGroup = new Konva.Group();
        this.topBoxText = new Konva.Text({text: "select an item", padding: 10});
        this.topBoxRect = new Konva.Rect({
            height: this.blockHeight,
            width: 100,
            fill: "white",
            stroke: 'black',
            strokeWidth: 1,
        });
        this.topBoxGroup.add(this.topBoxRect);
        this.topBoxGroup.add(this.topBoxText);
        this.group.add(this.topBoxGroup);
        this.list = this.generateList(items, layer);
        this.topBoxGroup.on("click", () => {
            this.group.add(this.list);
            stage.draw()
        });
        window.addEventListener('click', () => {
            // hide menu
            this.list.remove();
        })
    }

    generateList(items, layer) {
        let list = new Konva.Group();
        let textObjects = items.map((item) => {
            return new Konva.Text({text: item.toString(), padding: 10})
        });
        let min = this.topBoxText.width();
        let max = Math.max(min, Math.max(...(textObjects.map((obj) => {
            return obj.width()
        })))) + 20;
        console.log("max: " + max);
        let i;
        for (i = 0; i < textObjects.length; i++) {
            let rect = new Konva.Rect({
                y: this.blockHeight * (i + 1),
                height: this.blockHeight,
                width: max,
                fill: "white",
                stroke: 'black',
                strokeWidth: 1,
            });
            let txt = textObjects[i];
            let obj = items[i];
            rect.on("click", () => {
                this.topBoxText.text(txt.text());
                layer.draw();
                this.f(obj);
            });

            textObjects[i].y(this.blockHeight * (i + 1));
            list.add(rect);
            list.add(textObjects[i]);
        }
        this.topBoxRect.width(max);
        return list;
    }
}

