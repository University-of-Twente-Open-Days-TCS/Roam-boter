export default class health {
    constructor(id) {

        this._id = id;
    }
    toString() {
        switch (this.id) {
            case 0:
                return "0%";
            case 20:
                return "20%";
            case 40:
                return "40%";
            case 60:
                return "60%";
            case 80:
                return "80%";
            default:
                return null;
        }
    }
    //TODO jsonify()
    _id;
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}