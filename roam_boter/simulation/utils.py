

def distance_squared(pos1: (float, float), pos2: (float, float)):
    x1, y1 = pos1
    x2, y2 = pos2

    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2)


def get_nearest_tank(state, tank):
    closest = None
    closest_distance = 999999999

    for other in state.tanks:
        dist = distance_squared((tank.x, tank.y), (other.x, other.y))
        if dist < closest_distance and within_turret_cone(tank, other.x, other.y):
            closest = other
            closest_distance = dist
    return closest


def get_nearest_bullet(state, tank):
    closest = None
    closest_distance = 999999999
    for bullet in state.bullets:
        dist = distance_squared(tank.get_pos(), bullet.get_pos())
        if dist < closest_distance and within_turret_cone(tank, *bullet.get_pos()):
            closest_distance = dist
            closest = bullet
    return closest


def get_nearest_level_object(state, tank, obj):
    return tank.get_pos()


def move_to_position(state, tank, goal):
    x1, y1 = tank.get_pos()
    x2, y2 = goal

    dx = min(max(abs(x2 - x1), -0.1), 0.1)
    dy = min(max(abs(y2 - y1), -0.1), 0.1)

    tank.set_pos(x1 + dx, y1 + dy)


def move_from_position(state, tank, goal):
    x1, y1 = tank.get_pos()
    x2, y2 = goal

    dx = min(max(abs(x2 - x1), -0.1), 0.1)
    dy = min(max(abs(y2 - y1), -0.1), 0.1)

    tank.set_pos(x1 - dx, y1 - dy)


# returns whether an object is located within the vision cone of the tank turret.
def within_turret_cone(tank, x, y):
    # TODO: implement this.

    return True
