//Amount of seconds a label lasts
export default class seconds {
    _id;

    constructor(id) {
        this.id = id;
    }

    toString() {
        switch (this.id) {
            case 1:
                return "1 second";
            case 3:
                return "3 seconds";
            case 5:
                return "5 seconds";
            case 7:
                return "7 seconds";
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