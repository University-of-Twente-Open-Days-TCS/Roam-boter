import Konva from "konva"

export function DefaultText(options) {
    let defaultOptions = {
        fontFamily: "Arial",
        padding: 10,
        fill: "#FFF"
    };

    Object.assign(defaultOptions, options);
    return new Konva.Text(defaultOptions);
}