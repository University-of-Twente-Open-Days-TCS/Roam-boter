/** Distance from one Object to another on the map **/
export default class Distance {
    _id;

    constructor(id) {
        this._id = id;
    }

    toString() {
        switch (this.id) {
            case 1:
                return "5 squares";
            case 2:
                return "10 squares";
            case 3:
                return "15 squares";
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