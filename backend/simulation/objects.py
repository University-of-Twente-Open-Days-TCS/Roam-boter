from enum import IntEnum


class Object(IntEnum):
    EMPTY = 0
    FRIENDLY_TANK = 1
    ENEMY_TANK = 2
    FRIENDLY_BULLET = 3
    ENEMY_BULLET = 4
    WALL = 5
    FRIENDLY_SPAWN = 6
    ENEMY_SPAWN = 7
    HEAL = 8
    FLAG = 9
    HILL = 10
    SPAWN = 11
    TANK = 12
    BULLET = 13
    SCOUT_NODE = 14

    def isTank(self):
        return self == Object.TANK or self == Object.FRIENDLY_TANK or self == Object.ENEMY_TANK

    def isBullet(self):
        return self == Object.BULLET or self == Object.FRIENDLY_BULLET or self == Object.ENEMY_BULLET

    def isSpawn(self):
        return self == Object.SPAWN or self == Object.ENEMY_SPAWN or self == Object.FRIENDLY_SPAWN


class RelDir(IntEnum):
    FORWARD = 0
    BACKWARD = 1
    LEFT = 2
    RIGHT = 3

    def angle(self):
        if self == RelDir.FORWARD:
            return 0
        if self == RelDir.BACKWARD:
            return 180
        if self == RelDir.LEFT:
            return 90
        if self == RelDir.RIGHT:
            return 270


class WindDir(IntEnum):
    North = 0
    East = 1
    South = 2
    West = 3

    def angle(self):
        if self == WindDir.North:
            return 0
        if self == WindDir.East:
            return 270
        if self == WindDir.South:
            return 180
        if self == WindDir.West:
            return 90


ColorValues = {
    (255, 255, 255): Object.EMPTY,
    (0, 0, 0): Object.WALL,
    (0, 0, 255): Object.SPAWN,
    (0, 255, 0): Object.HEAL,
    (255, 0, 0): Object.FLAG,
    (255, 255, 0): Object.HILL,
    (100, 100, 0): Object.SCOUT_NODE
}


ALL_OBJECTS = [
    Object.WALL,
    Object.SPAWN,
    Object.HEAL,
    Object.FLAG,
    Object.HEAL,
    Object.TANK,
    Object.BULLET,
    Object.HILL,
    Object.SCOUT_NODE,
]
