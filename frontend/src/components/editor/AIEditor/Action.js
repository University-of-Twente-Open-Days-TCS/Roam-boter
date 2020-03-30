import Obj from "./Obj.js";
import RelDir from "./RelDir.js";
import WindDir from "./WindDir.js";
import Speed from "./Speed.js";
import Label from "./Label.js";
import Seconds from "./Seconds.js";

//Lists of possible attributes of an Action
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

const reldirList = [
    new RelDir(0),
    new RelDir(1),
    new RelDir(2),
    new RelDir(3)
];

const winddirList = [
    new WindDir(0),
    new WindDir(1),
    new WindDir(2),
    new WindDir(3)
];

const speedList = [
    new Speed(0),
    new Speed(1),
    new Speed(2)
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

const secondsList = [
    new Seconds(1),
    new Seconds(3),
    new Seconds(5),
    new Seconds(7),
];

/** Action, used to be displayed inside an ActionNode or Selector. Can have one or more attributes depending on the
 * Action ID **/
export default class Action {
    _id;
    _object;
    _winddir;
    _reldir;
    _label;
    _speed;
    _seconds;

    /** Construct the Action based on an ID and possible attributes**/
    constructor(id, object = null, winddir = null, reldir = null, speed = null, label = null, seconds = null) {
        this.id = id;
        this.object = object;
        this.winddir = winddir;
        this.reldir = reldir;
        this.label = label;
        this.speed = speed;
        this.seconds = seconds;
        this.setRemainingOptions();
    }

    /** Returns whether the current Action has all its necessary attributes **/
    isValid() {
        switch (this.id) {
            case 0:
                return true;
            case 1:
                return (this.object != null);
            case 2:
                return true;
            case 4:
                return (this.object != null);
            case 5:
                return (this.object != null);
            case 6:
                return (this.winddir != null);
            case 7:
                return (this.reldir != null);
            case 8:
                return (this.speed != null);
            case 9:
                return (this.speed != null);
            case 10:
                return true;
            case 11:
                return true;
            case 12:
                return (this.label != null);
            case 13:
                return (this.label != null);
            case 14:
                return (this.label != null && this.seconds != null);
            default:
                return false;
        }
    }

    /** Initialises the remaining options to be selected **/
    setRemainingOptions() {
        switch (this.id) {
            case 0:
                this.remainingOptions = [];
                break;
            case 1:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 2:
                this.remainingOptions = [];
                break;
            case 4:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 5:
                this.remainingOptions = [{
                    options: objectList, f: ((obj) => {
                        this.object = obj
                    })
                }];
                break;
            case 6:
                this.remainingOptions = [{
                    options: winddirList, f: ((dir) => {
                        this.winddir = dir
                    })
                }];
                break;
            case 7:
                this.remainingOptions = [{
                    options: reldirList, f: ((dir) => {
                        this.reldir = dir
                    })
                }];
                break;
            case 8:
                this.remainingOptions = [{
                    options: speedList, f: ((spd) => {
                        this.speed = spd
                    })
                }];
                break;
            case 9:
                this.remainingOptions = [{
                    options: speedList, f: ((spd) => {
                        this.speed = spd
                    })
                }];
                break;
            case 10:
                this.remainingOptions = [];
                break;
            case 11:
                this.remainingOptions = [];
                break;
            case 12:
                this.remainingOptions = [{
                    options: labelList, f: ((lbl) => {
                        this.label = lbl
                    })
                }];
                break;
            case 13:
                this.remainingOptions = [{
                    options: labelList, f: ((lbl) => {
                        this.label = lbl
                    })
                }];
                break;
            case 14:
                this.remainingOptions = [{
                    options: secondsList, f: ((scnds) => {
                        this.seconds = scnds
                    })
                }, {
                    options: labelList, f: ((lbl) => {
                        this.label = lbl
                    })
                }];
                break;
            default:
                this.remainingOptions = [];

        }
    }

    getRemainingOptions() {
        return this.remainingOptions;
    }


    /** ToString method of an Action, contains newlines to avoid too long lines **/
    toString() {
        switch (this.id) {
            case 0:
                return "Do nothing";
            case 1:
                if (this.object != null) {
                    return "Go to nearest\n" + this.object;
                } else {
                    return "Go to nearest \n <Object>";
                }
            case 2:
                return "Scout";
            case 4:
                if (this.object != null) {
                    return "Move away from \n nearest " + this.object;
                } else {
                    return "Move away from \n nearest <Object>"
                }
            case 5:
                if (this.object != null) {
                    return "Aim to nearest\n" + this.object;
                } else {
                    return "Aim to nearest \n <Object>"
                }
            case 6:
                if (this.winddir != null) {
                    return "Aim " + this.winddir;
                } else {
                    return "Aim <Wind Direction>";
                }
            case 7:
                if (this.reldir != null) {
                    return "Aim " + this.reldir;
                } else {
                    return "Aim <Relative Direction>";
                }

            case 8:
                if (this.speed != null) {
                    return "Aim to left \n with " + this.speed;
                } else {
                    return "Aim to left \n with <Speed>";
                }
            case 9:
                if (this.speed != null) {
                    return "Aim to right \n with " + this.speed;
                } else {
                    return "Aim to right \n with <Speed>";
                }
            case 10:
                return "Shoot!";
            case 11:
                return "Self-destruct!";
            case 12:
                if (this.label != null) {
                    return "Set Label " + this.label;
                } else {
                    return "Set Label  <Label>";
                }
            case 13:
                if (this.label != null) {
                    return "Unset Label " + this.label;
                } else {
                    return "Unset Label  <Label>";
                }
            case 14:
                if (this.label != null && this.seconds != null) {
                    return "Set Label " + this.label + "\n for " + this.seconds;
                } else {
                    return "Set Label \n <Label> \n for <Seconds>";
                }
            default:
                return null
        }
    }

    /** All getters & setters **/
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get object() {
        return this._object;
    }

    set object(value) {
        this._object = value;
    }

    get winddir() {
        return this._winddir;
    }

    set winddir(value) {
        this._winddir = value;
    }

    get reldir() {
        return this._reldir;
    }

    set reldir(value) {
        this._reldir = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }

    get seconds() {
        return this._seconds;
    }

    set seconds(value) {
        this._seconds = value;
    }

}