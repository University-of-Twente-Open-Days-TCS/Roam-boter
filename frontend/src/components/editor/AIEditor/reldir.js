/** Relative direction **/
export default class reldir {
        _id;

    constructor(id) {
        this.id = id;
    }

    toString(){
        switch (this.id) {
            case 0:
                return "Forward";
            case 1:
                return "Backward";
            case 2:
                return "Left";
            case 3:
                return "Right";
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