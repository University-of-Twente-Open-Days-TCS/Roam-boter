
//Action (NOT A NODE), has zero or more attributes, by default null. DOES NOT WORK WITH LABELS YET

export default class action {
    id;
    object;
    dir;
    deg;

    // label;

    constructor(id, object = null, dir = null, deg = null) {
        this.id = id;
        this.object = object;
        this.dir = dir;
        this.deg = deg;
        //this.label = label;
    }

    editAction(id, object = null, dir = null, deg = null) {
        this.id = id;
        this.object = object;
        this.dir = dir;
        this.deg = deg;
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
                if (this.dir != null) {
                    return "Aim " + this.dir;
                } else {
                    return "Aim _dir_";
                }
            case 7:
                if (this.deg != null) {
                    return "Aim " + this.deg;
                } else {
                    return "Aim _deg_";
                }
            case 8:
                return "Shoot!";
            case 9:
                return "Self-destruct!";


        }
    }

}