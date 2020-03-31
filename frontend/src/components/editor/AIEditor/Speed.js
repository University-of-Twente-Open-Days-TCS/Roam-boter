/** Speed with which a turret turns**/
export default class Speed {
    _id;

    constructor(id) {
        this.id = id;
    }

    toString() {
        switch (this.id) {
            case 0:
                return "Slow Speed";
            case 1:
                return "Normal Speed";
            case 2:
                return "Fast Speed";
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