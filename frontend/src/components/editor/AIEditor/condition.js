import Konva from "konva"

export default class condition {

    //The attributes of a condition

    _id = null;
    _distance = null;
    _object = null;
    _label = null;
    _health = null;

    //Create a condition with the given parameters, can be partly, however for a toString will need at least an ID
    constructor(id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
    }

    //Edits the condition, resets everything to null and creates a condition with the given parameters
    editCondition(id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
    }

    //Returns whether the condition has all the necessary parameters
    isValid() {
        switch (this.id) {
            case 1:
                return (this.distance != null && this.object != null);
            case 2:
                return (this.object != null);
            case 3:
                return (this.object != null);
            case 4:
                return (this.object != null);
            case 5:
                return true;
            case 6:
                return (this.label != null);
            case 7:
                return (this.health != null);
            default:
                return false;
        }
    }

    //Converts the condition into a string, with pre-given enters for readibility #TODO: variable (not hardcoded) newlines
    toString() {
        switch (this.id) {
            case 1:
                // provide both distance and object, otherwise both will be ignored
                if (this.distance == null || this.object == null) {
                    return "If distance to nearest \n _object_ is greater \n than _distance_";
                } else {
                    return "If distance to nearest \n" + this.object + " is greater \n than " + this.distance;
                }
            case 2:
                if (this.object == null) {
                    return "If <b>object</b>_ \n is visible";
                } else {
                    return "If " + this.object + " \n is  visible";
                }
            case 3:
                if (this.object == null) {
                    return "If aimed at _object_";
                } else {
                    return "If aimed at \n" + this.object;
                }
            case 4:
                if (this.object == null) {
                    return "If _object_ exists";
                } else {
                    return "If " + this.object + "\n exists";
                }
            case 5:
                return "Bullet ready";
            case 6:
                if (this.label == null) {
                    return "If _label_ set";
                } else {
                    return "If " + this.label + " set";
                }
            case 7:
                if (this.health == null) {
                    return "If health is \n greater than _amount_";
                } else {
                    return "If health is \n greater than " + this.health;
                }
            default:
                return null;
            //No or invalid ID
        }
    }

    //All this class' getters and setters
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get distance() {
        return this._distance;
    }

    set distance(value) {
        this._distance = value;
    }

    get object() {
        return this._object;
    }

    set object(value) {
        this._object = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = value;
    }
}
