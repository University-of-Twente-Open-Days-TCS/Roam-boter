//Wind direction
export default class speed {
    _id;

    constructor(id) {
        this._id = id;
    }

    toString() {
        switch (this.id) {
            case 0:
                return "Slow";
            case 1:
                return "Normal";
            case 2:
                return "Fast";
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