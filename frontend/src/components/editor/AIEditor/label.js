export default class label {
    _id;


    constructor(id) {

        this.id = id;
    }

    toString() {
        switch (this.id) {
            case 0:
                return "'red'";
            case 1:
                return "'yellow'";
            case 2:
                return "'blue'";
            case 3:
                return "'green'";
            case 4:
                return "'purple'";
            case 5:
                return "'white'";
            case 6:
                return "'pink'";
            case 7:
                return "'orange'";
            case 8:
                return "'black'";
            default:
            //TODO raise error, wrong label

        }
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}