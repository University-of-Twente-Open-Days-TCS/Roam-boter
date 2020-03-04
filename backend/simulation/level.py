from .objects import Object, ALL_OBJECTS

import pickle
import math

import os

class Level:


    def __init__(self, path, objects):
        self.objects = objects
        self.nearest_objects = self.cache_or_prepare_nearest_objects()
        self.nearest_paths = self.cache_or_prepare_nearest_paths()


    def cache_or_prepare_nearest_objects(self):
        nearest_objects = None
        pickle_path = os.path.join(self.get_caching_directory(), "nearest_objects.p")
        print(pickle_path)
        try:
            with open(pickle_path, 'rb') as f:
                nearest_objects = pickle.load(f)
        except FileNotFoundError:
            nearest_objects = self.prepare_nearest_objects()
            with open(pickle_path, 'wb') as f:
                pickle.dump(nearest_objects, f)

        print(nearest_objects)
        return nearest_objects

    def get_caching_directory(self):
        this_dir = os.path.dirname(os.path.realpath(__file__))
        return os.path.join(this_dir, "caching")

    def prepare_nearest_objects(self):
        # for y, for x, for object collect nearest of obj from x, y
        return [[{obj: self.find_nearest_object(obj, x, y) for obj in ALL_OBJECTS} for x, cell in enumerate(row)]for y, row in enumerate(self.objects)]

    def find_nearest_object(self, obj, x, y):
        print(x, y)
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

    def cache_or_prepare_nearest_paths(self):
        nearest_paths = None
        pickle_path = os.path.join(self.get_caching_directory(), "nearest_paths.p")
        print(pickle_path)
        try:
            with open(pickle_path, 'rb') as f:
                nearest_paths = pickle.load(f)
        except FileNotFoundError:
            nearest_paths = self.prepare_nearest_paths()
            with open(pickle_path, 'wb') as f:
                pickle.dump(nearest_paths, f)

        return nearest_paths

    def prepare_nearest_paths(self):
        return [[{obj: self.find_nearest_path(obj, x, y) for obj in ALL_OBJECTS} for x, cell in enumerate(row)] for y, row in enumerate(self.objects)]

    def find_nearest_path(self, obj, x, y):
        # A tank can always walk straight towards the nearest wall
        if obj == Object.WALL:
            return [self.find_nearest_object(obj, x, y)]

        queue = [(None, x, y)]
        visited = dict()
        goal = None

        first_node = True

        while len(queue) > 0:
            node = queue.pop(0)
            p, a, b = node
            pos = a, b
            if self.get_object(a, b) == obj:
                goal = node

                break

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

            if pos not in visited:

                visited[pos] = node

                if a + 1 < len(self.objects):
                    queue.append((pos, a + 1, b))
                if a - 1 >= 0:
                    queue.append((pos, a - 1, b))
                if b + 1 < len(self.objects):
                    queue.append((pos, a, b + 1))
                if b - 1 >= 0:
                    queue.append((pos, a, b - 1))

        # backtrack the path
        path = []
        while goal is not None:
            parent, x, y = goal
            path.append((x + 0.5, y + 0.5))

            if parent is None:
                break

            goal = visited[parent]

        # decrease path based on line of sight smoothing
        i = 0
        while i < len(path) - 2:
            while i < len(path) - 2 and self.line_of_sight(path[i], path[i + 2]):
                del path[i + 1]
            i += 1

        return path

    def get_path_to_object(self, tank, obj):
        x, y = tank.get_pos()
        x, y = math.floor(x), math.floor(y)
        path = []

        if 0 < x < self.get_width() - 1:
            if 0 < y < self.get_height() - 1:
                path = self.nearest_paths[y][x][obj]

        tank.path = path
        if len(path) >= 2:
            return path[-2]
        else:
            return None

    def line_of_sight(self, pos1, pos2):
        points = self.points(pos1, pos2)
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

        return list(points)

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
