
export default class distance {
    _id;

    constructor(id) {
        this._id = id;
    }

    toString() {
        switch (this.id) {
            case 1:
                return "Near";
            case 2:
                return "Average";
            case 3:
                return "Far";
            default:
                return null;
        }
    }
    //TODO jsonify
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

}