//Wind direction
export default class speed {
    _id;

    constructor(id) {
        this.id = id;
    }

    toString() {
        switch (this.id) {
            case 0:
                return "Slow speed";
            case 1:
                return "Normal speed";
            case 2:
                return "Fast speed";
            default:
                return null;

        }
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}