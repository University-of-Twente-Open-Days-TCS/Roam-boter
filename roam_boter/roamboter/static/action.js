//Action (NOT A NODE), has zero or more attributes, by default null. DOES NOT WORK WITH LABELS YET

export default class action {
    _id;
    _object;
    _winddir;
    _reldir;
    _label;
    _speed;


    constructor(id, object = null, winddir = null, reldir = null, speed = null, label = null) {
        this.id = id;
        this.object = object;
        this.winddir = winddir;
        this.reldir = reldir;
        this.label = label;
        this.speed = speed;
    }

    //Returns whether the current action has all its necessary attributes
    isValid() {
        switch (this.id) {
            case 0:
                return true;
            case 1:
                return (this.object != null);
            case 2:
                return true;
            case 3:
                return (this.object != null);
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
            //TODO this only works for 1 label, may need to encorporate multiple
            case 12:
                return (this.label != null);
            case 13:
                return (this.label != null);
            case 14:
                return (this.label != null);

        }
    }

    editAction(id, object = null, dir = null, deg = null) {
        this.id = id;
        this.object = object;
        this.winddir = dir;
        this.reldir = deg;
    }

    //ToString method of an Action, currently hardcoded enters to avoid too long lines #TODO insert variable newlines
    toString() {
        switch (this.id) {
            case 0:
                return "Do nothing";
            case 1:
                if (this.object != null) {
                    return "Go to nearest\n" + this.object;
                } else {
                    return "Go to nearest \n _object_";
                }
            case 2:
                return "Scout";
            case 3:
                if (this.object != null) {
                    return "Patrol " + this.object;
                } else {
                    return "Patrol _object_";
                }
            case 4:
                if (this.object != null) {
                    return "Move away from \n nearest " + this.object;
                } else {
                    return "Move away from \n nearest _object_"
                }
            case 5:
                if (this.object != null) {
                    return "Aim to nearest\n" + this.object;
                } else {
                    return "Aim to nearest \n _object_"
                }
            case 6:
                if (this.winddir != null) {
                    return "Aim " + this.winddir;
                } else {
                    return "Aim _winddir_";
                }
            case 7:
                if (this.reldir != null) {
                    return "Aim " + this.reldir;
                } else {
                    return "Aim _reldir_";
                }

            case 8:
                if (this.speed != null) {
                    return "Aim to left \n with " + this.speed;
                } else {
                    return "Aim to left \n with _speed_";
                }
            case 9:
                if (this.speed != null) {
                    return "Aim to right \n with " + this.speed;
                } else {
                    return "Aim to right \n with _speed_";
                }
            case 10:
                return "Shoot!";
            case 11:
                return "Self-destruct!";
            //TODO encorporate labels


        }
    }

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

}