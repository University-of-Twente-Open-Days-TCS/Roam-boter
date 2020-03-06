import math


# Return the squared distance between points, this saves an expensive sqrt call and will
# still work for comparing distances.
def distance_squared(pos1: (float, float), pos2: (float, float)):
    x1, y1 = pos1
    x2, y2 = pos2

    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2)


# Return the nearest visible tank.
def get_nearest_tank(state, tank):
    closest = None
    closest_distance = 999999999

    for other in tank.visible_tanks(state):
        dist = distance_squared((tank.x, tank.y), (other.x, other.y))
        if dist < closest_distance and within_turret_cone(tank, other.x, other.y):
            closest = other
            closest_distance = dist
    return closest


# Return the nearest visible bullet.
def get_nearest_bullet(state, tank):
    closest = None
    closest_distance = 999999999
    for bullet in tank.visible_bullets(state):
        dist = distance_squared(tank.get_pos(), bullet.get_pos())
        if dist < closest_distance and within_turret_cone(tank, *bullet.get_pos()):
            closest_distance = dist
            closest = bullet
    return closest


# Returns the position of the nearest level object, this equals the position of the tank itself.
def get_nearest_level_object(state, tank, obj):
    return tank.get_pos()


# Rotate and move towards a given point. (This does not hold into account walls)
def move_to_position(state, tank, goal):
    x1, y1 = tank.get_pos()
    x2, y2 = goal

    distance = math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

    dx, dy = 0, 0

    if distance > 0:
        dx = (x2 - x1) / distance * tank.speed
        dy = (y2 - y1) / distance * tank.speed

    ndx, ndy = dx, dy

    # if not tank.check_collision(state, dx=dx):
    #     ndx = dx
    #
    # if not tank.check_collision(state, dx=ndx, dy=dy):
    #     ndy = dy

    goal_angle = angle_tank_towards_position(state, tank, (ndx, ndy))
    angle_difference = ((goal_angle % 360) - (tank.get_rotation() % 360)) % 360
    if angle_difference < 90 or angle_difference > 270:
        tank.move_forward(state)


# Move straight away from a position.
def move_from_position(state, tank, goal):
    move_to_position(state, tank, -goal)


# Calculate the angle towards the goal and let the tank rotate slowly towards this angle.
def angle_tank_towards_position(state, tank, goal):
    dx, dy = goal

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

    tank.rotate_tank_towards(angle_towards_goal)
    return angle_towards_goal


# Ain the turret slowly to a certain position.
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
