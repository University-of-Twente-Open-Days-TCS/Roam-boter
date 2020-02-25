from enum import Enum


class Object(Enum):
    EMPTY = 0
    WALL = 1
    SPAWN = 2
    HEAL = 3
    FLAG = 4
    HILL = 5


ColorValues = {
    (255, 255, 255): Object.EMPTY,
    (0, 0, 0): Object.WALL,
    (0, 0, 255): Object.SPAWN,
    (0, 255, 0): Object.HEAL,
    (255, 0, 0): Object.FLAG,
    (255, 255, 0): Object.HILL
}
