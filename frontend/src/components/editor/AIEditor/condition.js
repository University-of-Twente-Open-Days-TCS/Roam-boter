import object from "./object.js";
import distance from "./distance.js";
import health from "./health.js";
import label from "./label.js";

const objectList = [
    new object(1),
    new object(2),
    new object(3),
    new object(4),
    new object(5),
    new object(6),
    new object(7),
    new object(8),
    new object(9),
    new object(10)

];

const distanceList = [
    new distance(1),
    new distance(2),
    new distance(3)
];

const healthList = [
    new health(0),
    new health(20),
    new health(40),
    new health(60),
    new health(80),

];

const labelList = [
    new label(0),
    new label(1),
    new label(2),
    new label(3),
    new label(4),
    new label(5),
    new label(6),
    new label(7),
    new label(8)
];


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
        this.setRemainingOptions();
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

    //initialises the remaining options to be selected
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
        }
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }


    //Converts the condition into a string, with pre-given enters for readibility
    toString() {
        switch (this.id) {
            case 1:
                // provide both distance and object, otherwise both will be ignored
                if (this.distance == null || this.object == null) {
                    return "If distance to nearest \n <object> is greater \n than <distance>";
                } else {
                    return "If distance to nearest \n" + this.object + " is greater \n than " + this.distance;
                }
            case 2:
                if (this.object == null) {
                    return "If <object> \n is visible";
                } else {
                    return "If " + this.object + " \n is  visible";
                }
            case 3:
                if (this.object == null) {
                    return "If aimed at <object>";
                } else {
                    return "If aimed at \n" + this.object;
                }
            case 4:
                if (this.object == null) {
                    return "If <object> exists";
                } else {
                    return "If " + this.object + "\n exists";
                }
            case 5:
                return "Bullet ready";
            case 6:
                if (this.label == null) {
                    return "If label <label> set";
                } else {
                    return "If label " + this.label + " set";
                }
            case 7:
                if (this.health == null) {
                    return "If health is \n greater than <amount>";
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
