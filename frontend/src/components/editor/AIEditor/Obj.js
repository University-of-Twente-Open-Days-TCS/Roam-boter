/** Object on the map **/
export default class Obj {
    _id;

    constructor(id) {
        this.id = id;
    }

    toString(){
        switch(this.id) {
            case 1:
                return "Friendly Tank";
            case 2:
                return "Enemy Tank";
            case 3:
                return "Friendly Bullet";
            case 4:
                return "Enemy Bullet";
            case 5:
                return "Wall";
            case 6:
                return "Friendly Spawn";
            case 7:
                return "Enemy Spawn";
            case 8:
                return "Health pack";
            case 9:
                return "Flag";
            case 10:
                return "King of the Hill";
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