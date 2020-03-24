from .objects import Object, ALL_OBJECTS

import pickle
import math

import os

HEALTH_PACK_COOLDOWN = 9999999

class Level:

    def __init__(self, path, checksum, objects):
        self.objects = objects
        self.path = path
        self.nearest_objects = self.cache_or_prepare_nearest_objects()
        self.nearest_paths = self.cache_or_prepare_all_paths(checksum)
        self.health_packs = self.collect_health_packs()
        self.scout_nodes = []

    def set_scout_nodes(self, scout_nodes):
        self.scout_nodes = scout_nodes

    def collect_health_packs(self):
        packs = dict()
        for y, row in enumerate(self.objects):
            for x, obj in enumerate(row):
                if obj == Object.HEAL:
                    packs[(x, y)] = 0
        return packs

    def health_pack_ready(self, state, pos):
        x, y = pos
        pos = math.floor(x), math.floor(y)
        if pos in self.health_packs:
            if self.health_packs[pos] <= state.frames_passed:
                return True
        return False

    def pickup_health_pack(self, state, pos):
        x, y = pos
        pos = math.floor(x), math.floor(y)
        if self.health_pack_ready(state, pos):
            self.health_packs[pos] = state.frames_passed + HEALTH_PACK_COOLDOWN
            return True
        return False

    def cache_or_prepare_nearest_objects(self):

        nearest_objects = None
        pickle_path = os.path.join(self.get_caching_directory(), "nearest_objects_" + self.path + ".p")
        try:
            with open(pickle_path, 'rb') as f:
                nearest_objects = pickle.load(f)
        except FileNotFoundError:
            nearest_objects = self.prepare_nearest_objects()
            with open(pickle_path, 'wb') as f:
                pickle.dump(nearest_objects, f)

        return nearest_objects

    def get_caching_directory(self):
        this_dir = os.path.dirname(os.path.realpath(__file__))
        caching_dir = os.path.join(this_dir, "caching")

        if not os.path.exists(caching_dir):
            os.makedirs(caching_dir)
        return caching_dir

    def prepare_nearest_objects(self):
        # for y, for x, for object collect nearest of obj from x, y
        return [] # return [[{obj: self.find_nearest_object(obj, x, y) for obj in ALL_OBJECTS} for x, cell in enumerate(row)]for y, row in enumerate(self.objects)]

    def find_nearest_object(self, obj, x, y):
        queue = [(x, y)]
        visited = set()

        while len(queue) > 0:
            node = queue.pop(0)
            if self.objects[node[1]][node[0]] == obj:
                return node
            elif node not in visited:
                visited.add(node)

                a, b = node

                if a + 1 < len(self.objects):
                    queue.append((a + 1, b))
                if a - 1 >= 0:
                    queue.append((a - 1, b))
                if b + 1 < len(self.objects):
                    queue.append((a, b + 1))
                if b - 1 >= 0:
                    queue.append((a, b - 1))
        return None

    def get_object(self, x, y):
        return self.objects[y][x]

    def get_width(self):
        return len(self.objects[0])

    def get_height(self):
        return len(self.objects)

    def iterate(self):
        for y in range(len(self.objects)):
            for x in range(len(self.objects[0])):
                yield self.get_object(x, y), x, y

    def cache_or_prepare_all_paths(self, checksum):
        nearest_paths = None
        pickle_path = os.path.join(self.get_caching_directory(), "nearest_paths_" + self.path + ".p")
        try:
            with open(pickle_path, 'rb') as f:
                file_checksum, nearest_paths = pickle.load(f)

                if file_checksum != checksum:
                    raise FileNotFoundError

        except FileNotFoundError:
            nearest_paths = self.prepare_all_paths()
            with open(pickle_path, 'wb') as f:
                pickle.dump((checksum, nearest_paths), f)

        return nearest_paths

    def prepare_all_paths(self):
        return [[{obj: self.find_all_paths(obj, x, y) for obj in ALL_OBJECTS} for x, cell in enumerate(row)] for y, row in enumerate(self.objects)]

    def find_all_paths(self, obj, x, y):
        if x == 0:
            print(y)
        # A tank can always walk straight towards the nearest wall
        if obj == Object.WALL:
            return [self.find_nearest_object(obj, x, y)]

        queue = [(None, x, y)]
        visited = dict()
        goal = []

        first_node = True

        while len(queue) > 0:
            node = queue.pop(0)
            p, a, b = node
            pos = a, b

            if pos not in visited:
                visited[pos] = node

                # Append goal
                if self.get_object(a, b) == obj:
                    goal.append(node)

                # Check for possible collisions:
                collision = False
                if first_node:
                    if self.get_object(a, b) == Object.WALL:
                        first_node = False
                        continue
                else:
                    for wa in range(a - 1, a + 2):
                        for wb in range(b - 1, b + 2):
                            try:
                                if self.get_object(wa, wb) == Object.WALL:
                                    collision = True
                                    break
                            except Exception:
                                collision = True
                                break
                    if collision:
                        continue

                first_node = False

                if a + 1 < len(self.objects[0]):
                    queue.append((pos, a + 1, b))
                if a - 1 >= 0:
                    queue.append((pos, a - 1, b))
                if b + 1 < len(self.objects):
                    queue.append((pos, a, b + 1))
                if b - 1 >= 0:
                    queue.append((pos, a, b - 1))

        # backtrack the path
        paths = [self.backtrack_path(n, visited) for n in goal]

        # decrease path based on line of sight smoothing
        return [self.smooth_path(p) for p in paths]

    def backtrack_path(self, node, visited):
        parent, x, y = node
        if parent is not None:
            return self.backtrack_path(visited[parent], visited) + [(x + 0.5, y + 0.5)]
        else:
            return [(x + 0.5, y + 0.5)]

    def smooth_path(self, path):
        i = 0
        while i <len(path) - 2:
            while i < len(path) - 2 and self.line_of_sight(path[i], path[i + 2]):
                del path[i + 1]
            i += 1

        # we want to remove the first element since this is the starting element, except for the case where
        # the start and end of the path are the same
        # This only happens when the goal location is the same as the starting location.
        if len(path) > 1:
            return path[1:]
        else:
            return path


    def get_paths_to_object(self, tank, obj):
        x, y = tank.get_pos()
        x, y = math.floor(x), math.floor(y)
        paths = []

        if 0 < x < self.get_width() - 1:
            if 0 < y < self.get_height() - 1:
                paths = self.nearest_paths[y][x][obj]

        return paths

    # Line of sight without padded walls.
    def direct_line_of_sight(self, pos1, pos2):
        points = list(self.points(pos1, pos2))
        if len(points) <= 2:
            return True

        for p in points:
            x, y = p
            try:
                if self.get_object(x, y) == Object.WALL:
                    return False
            except Exception:
                return False
        return True

    # Line of sight with extra padding at walls to generate good paths.
    def line_of_sight(self, pos1, pos2):
        # x1, y1 = pos1
        # x2, y2 = pos2
        #
        # inproduct = ((x1 + x2) * (y1 + y2)) / (math.sqrt(x1 * x1 + y1 * y1) * math.sqrt(x2 * x2 + y2 * y2))
        # angle = math.degrees(math.acos(inproduct))
        #
        # points = self.points((x1 - 0.5, y1 - 0.5), (x2 - 0, y2 - 0.5)) + self.points((x1 + 0.5, y1 + 0.5), (x2 + 0, y2 + 0.5))

        points = list(self.points(pos1, pos2))
        if len(points) <= 2:
            return True

        for p in points:
            x, y = p
            for wx in range(x - 1, x + 2):
                for wy in range(y - 1, y + 2):
                    try:
                        if self.get_object(wx, wy) == Object.WALL:
                            return False
                    except Exception:
                        return False
        return True

    @staticmethod
    def points(pos1, pos2):
        x0, y0 = pos1
        x1, y1 = pos2

        dx = x1 - x0
        dy = y1 - y0

        dx /= 200
        dy /= 200

        cx, cy = x0, y0

        points = set()
        for i in range(0, 200):
            points.add((int(math.floor(cx)), int(math.floor(cy))))
            cx += dx
            cy += dy

        return points

    # https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    @staticmethod
    def bresenham(pos1, pos2):
        x0, y0 = pos1
        x1, y1 = pos2

        if abs(y1 - y0) < abs(x1 - x0):
            if x0 > x1:
                return Level.plotLineLow(x1, y1, x0, y0)
            else:
                return Level.plotLineLow(x0, y0, x1, y1)
        else:
            if y0 > y1:
                return Level.plotLineHigh(x1, y1, x0, y0)
            else:
                return Level.plotLineHigh(x0, y0, x1, y1)


    @staticmethod
    def plotLineLow(x0, y0, x1, y1):
        dx = x1 - x0
        dy = y1 - y0
        yi = 1
        if dy < 0:
            yi = -1
            dy = -dy
        D = 2 * dy - dx
