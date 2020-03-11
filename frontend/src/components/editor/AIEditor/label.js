//TODO implement
export default class label {
    _id;
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    constructor(id) {

        this._id = id;
    }
    toString() {
        return null
    }

}