/** Amount of Seconds a Label lasts **/
export default class Seconds {
    _id;

    constructor(id) {
        this.id = id;
    }

    toString() {
        switch (this.id) {
            case 1:
                return "1 second";
            case 3:
                return "3 Seconds";
            case 5:
                return "5 Seconds";
            case 7:
                return "7 Seconds";
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