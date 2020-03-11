//Wind direction
export default class winddir {
    _id;

    constructor(id) {
        this._id = id;
    }

    toString() {
        switch (this.id) {
            case 0:
                return "North";
            case 1:
                return "East";
            case 2:
                return "South";
            case 3:
                return "West";
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