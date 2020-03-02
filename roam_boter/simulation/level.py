import objects
import pickle


class Level:

    def __init__(self, path, objects):
        self.objects = objects
        self.nearest_objects = self.cache_or_prepare_nearest_objects(path)

    def cache_or_prepare_nearest_objects(self, path):
        nearest_objects = None
        pickle_path = 'caching/nearest_objects.p'
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

    def prepare_nearest_objects(self):
        # for y, for x, for object collect nearest of obj from x, y
        return [[{obj: self.find_nearest_object(obj, x, y) for obj in objects.ALL_OBJECTS} for x, cell in enumerate(row)]for y, row in enumerate(self.objects)]

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