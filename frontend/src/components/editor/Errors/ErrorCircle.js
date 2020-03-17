import Konva from "konva";


export default class ErrorCircle {

    constructor(position, node, layer) {
        let errorRing = new Konva.Ring({
            x: position.x,
            y: position.y,
            innerRadius: 40,
            outerRadius: 70,
            fill: 'red'
        });

        node.group.add(errorRing);
        errorRing.moveToTop();

        let ringThickness = 20;
        let period = 2000; // in ms

        let anim = new Konva.Animation(function (frame) {
            if (frame.time < 2000) {
                errorRing.innerRadius(
                    (frame.time * 30) / period
                );
                errorRing.outerRadius(
                    (frame.time * 20) / period + ringThickness / 2
                );
            } else {
                anim.stop();
                errorRing.destroy();
                layer.draw();
            }
        }, layer);
        anim.start();
    }
}