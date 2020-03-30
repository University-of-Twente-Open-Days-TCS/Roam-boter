import Obj from "./Obj.js";
import Distance from "./Distance.js";
import Health from "./Health.js";
import Label from "./Label.js";

//The attributes which a Condition can contain
const objectList = [
    new Obj(1),
    new Obj(2),
    new Obj(3),
    new Obj(4),
    new Obj(5),
    new Obj(6),
    new Obj(7),
    new Obj(8),
    new Obj(9),
    new Obj(10)
];

const distanceList = [
    new Distance(1),
    new Distance(2),
    new Distance(3)
];

const healthList = [
    new Health(0),
    new Health(20),
    new Health(40),
    new Health(60),
    new Health(80)
];

const labelList = [
    new Label(0),
    new Label(1),
    new Label(2),
    new Label(3),
    new Label(4),
    new Label(5),
    new Label(6),
    new Label(7),
    new Label(8)
];

/** A Condition, has an ID and possible extra attributes **/
export default class Condition {

    //The attributes of a Condition
    _id = null;
    _distance = null;
    _object = null;
    _label = null;
    _health = null;

    /** Create a Condition with the given parameters, can be partly, however for a toString will need at least an ID **/
    constructor(id = null, distance = null, object = null, label = null, health = null) {
        this.id = id;
        this.distance = distance;
        this.object = object;
        this.label = label;
        this.health = health;
        this.setRemainingOptions();
    }

    /** Returns whether the Condition has all the necessary parameters **/
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

    /** Initialises the remaining options to be selected **/
    setRemainingOptions() {
        switch (this.id) {
            case 1:
                this.remainingOptions = [{
                    options: distanceList, f: ((dist) => {
                        this.distance = dist
                    })
                }, {
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 2:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 3:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 4:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 5:
                this.remainingOptions = [];
                break;
            case 6:
                this.remainingOptions = [{
                    options: labelList, f: ((lbl) => {
                        this.label = lbl
                    })
                }];
                break;
            case 7:
                this.remainingOptions = [{
                    options: healthList, f: ((hlth) => {
                        this.health = hlth
                    })
                }];
                break;
            default:

        }
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }


    /** Converts the Condition into a string, with pre-given enters for readability **/
    toString() {
        switch (this.id) {
            case 1:
                // provide both Distance and Obj, otherwise both will be ignored
                if (this.distance == null || this.object == null) {
                    return "If Distance to nearest \n <Object> is greater \n than <Distance>";
                } else {
                    return "If Distance to nearest \n" + this.object + " is greater \n than " + this.distance;
                }
            case 2:
                if (this.object == null) {
                    return "If <Object> \n is visible";
                } else {
                    return "If " + this.object + " \n is  visible";
                }
            case 3:
                if (this.object == null) {
                    return "If aimed at <Object>";
                } else {
                    return "If aimed at \n" + this.object;
                }
            case 4:
                if (this.object == null) {
                    return "If <Object> exists";
                } else {
                    return "If " + this.object + "\n exists";
                }
            case 5:
                return "Bullet ready";
            case 6:
                if (this.label == null) {
                    return "If Label <Label> set";
                } else {
                    return "If Label " + this.label + " set";
                }
            case 7:
                if (this.health == null) {
                    return "If Health is \n greater than <Amount>";
                } else {
                    return "If Health is \n greater than " + this.health;
                }
            default:
                return null;
            //No or invalid ID
        }
    }

    /** All getters & setters **/
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
