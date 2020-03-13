import math
from .objects import Object


# Return the squared distance between points, this saves an expensive sqrt call and will
# still work for comparing distances.
def distance_squared(pos1: (float, float), pos2: (float, float)):
    x1, y1 = pos1
    x2, y2 = pos2

    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2)


def distance(pos1, pos2):
    return math.sqrt(distance_squared(pos1, pos2))


# Return the paths to objects.
def filter_objects(tank, state, obj):
    paths = []

    if obj.isTank():
        for t in filter_tanks(tank, obj, tank.visible_tanks(state)):
            paths.append([t.get_pos()])

    elif obj.isBullet():
        for b in filter_bullets(tank, obj, tank.visible_bullets(state)):
            paths.append([b.get_pos()])

    elif obj.isSpawn():
        for s in state.level.get_path_to_object(tank, Object.SPAWN):
            paths.append(s)
    else:
        for p in state.level.get_paths_to_object(tank, obj):
            # Only show paths to ready health packs.
            if obj == Object.HEAL:
                if state.level.health_pack_ready(state, p[-1]):
                    paths.append(p)
            else:
                paths.append(p)
    return paths


# Closest object based on path lengths.
def closest_object_in_paths(tank, paths):
    closest = None
    closest_dist = float('inf')
    for p in paths:
        d = path_length(p)
        if d < closest_dist:
            closest_dist = d
            closest = p
    return closest


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
    if angle_difference < 80 or angle_difference > 280:
        tank.move_forward(state, distance * 0.99)


# Move straight away from a position.
def move_from_position(state, tank, goal):
    x, y = goal
    tx, ty = tank.get_pos()

    relative_x, relative_y = x - tx, y - ty

    tank.path = [(tx - relative_x, ty - relative_y)]
    move_to_position(state, tank, (tx - relative_x, ty - relative_y))


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


# Calculate the length of a given path
def path_length(path):
    if len(path) <= 1:
        return 0.0

    total = 0.0
    for i in range(1, len(path)):
        total += math.sqrt(distance_squared(path[i-1], path[i]))
    return total


# filter between friendly, enemy and all tanks.
def filter_tanks(tank, obj, tanks):
    if obj == Object.FRIENDLY_TANK:
        return list(filter(lambda x: x.team_id == tank.team_id, tanks))

    if obj == Object.ENEMY_TANK:
        return list(filter(lambda x: x.team_id != tank.team_id, tanks))

    return tanks


def filter_bullets(tank, obj, bullets):
    if obj == Object.FRIENDLY_BULLET:
        return list(filter(lambda x: x.team_id == tank.team_id, bullets))

    if obj == Object.ENEMY_BULLET:
        return list(filter(lambda x: x.team_id != tank.team_id, bullets))

    return bullets


# Returns angle between 0 and 360 degrees
def vector_angle(pos1, pos2):
    x1, y1 = pos1
    x2, y2 = pos2

    inproduct = ((x1 * x2 + y1 * y2) / (math.sqrt(distance_squared((0, 0), pos1)) * math.sqrt(distance_squared((0, 0), pos2))))
    return math.degrees(math.acos(inproduct)) % 360
