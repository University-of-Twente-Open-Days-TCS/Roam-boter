from enum import Enum


class Object(Enum):
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



ColorValues = {
    (255, 255, 255): Object.EMPTY,
    (0, 0, 0): Object.WALL,
    (0, 0, 255): Object.SPAWN,
    (0, 255, 0): Object.HEAL,
    (255, 0, 0): Object.FLAG,
    (255, 255, 0): Object.HILL
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
]
