import math

def distance_squared(pos1: (float, float), pos2: (float, float)):
    x1, y1 = pos1
    x2, y2 = pos2

    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2)


def get_nearest_tank(state, tank):
    closest = None
    closest_distance = 999999999

    for other in state.tanks:
        if other == tank:
            continue
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

    dx = min(max(x2 - x1, -tank.speed), tank.speed)
    dy = min(max(y2 - y1, -tank.speed), tank.speed)

    if not tank.check_collision(state, dx=dx):
        tank.move(dx, 0)

    if not tank.check_collision(state, dy=dy):
        tank.move(0, dy)

    angle_tank_towards_position(state, tank, (tank.get_pos()[0] - x1, tank.get_pos()[1] - y1))


def move_from_position(state, tank, goal):
    x1, y1 = tank.get_pos()
    x2, y2 = goal

    dx = min(max(x2 - x1, -tank.speed), tank.speed)
    dy = min(max(y2 - y1, -tank.speed), tank.speed)

    angle_tank_towards_position(state, tank, (dx, dy))
    tank.set_pos(x1 - dx, y1 - dy)


def angle_tank_towards_position(state, tank, goal):
    dx, dy = goal

    print(dx, dy)

    if abs(dy) < 0.00001:
        if abs(dx) < 0.00001:
            angle_towards_goal = tank.get_rotation()
        elif dx > 0:
            angle_towards_goal = 270
        else:
            angle_towards_goal = 90
    else:
        if abs(dx) < 0.00001:
            if dy > 0:
                angle_towards_goal = 180
            else:
                angle_towards_goal = 0
        else:
            angle_towards_goal = math.degrees(math.atan2(-dx, -dy))

    tank.set_rotation(angle_towards_goal)

def aim_to_position(state, tank, goal):
    gx, gy = goal
    tx, ty = tank.get_pos()

    dx = gx - tx
    dy = gy - ty

    angle_towards_goal = 0
    if abs(dy) < 0.00001:
        if dx > 0:
            angle_towards_goal = 270
        else:
            angle_towards_goal = 90
    else:
        angle_towards_goal = math.degrees(math.atan2(-dx, -dy))
    tank.rotate_turret_towards(angle_towards_goal - tank.get_rotation())


# returns whether an object is located within the vision cone of the tank turret.
def within_turret_cone(tank, x, y):
    # TODO: implement this.

    return True
