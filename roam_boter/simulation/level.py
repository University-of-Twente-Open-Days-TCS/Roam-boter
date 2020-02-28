import objects


class Level:

    def __init__(self, objects):
        self.objects = objects
        self.nearest_objects = self.prepare_nearest_objects()

    def prepare_nearest_objects(self):
        # for y, for x, for object collect nearest of obj from x, y
        return [[{obj: self.find_nearest_object(obj, x, y) for obj in objects.ALL_OBJECTS} for x, cell in enumerate(row)]for y, row in enumerate(self.objects)]

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

                queue.append((a + 1, b))
                queue.append((a - 1, b))
                queue.append((a, b + 1))
                queue.append((a, b - 1))
        return None

    def get_object(self, x, y):
        return self.objects[y][x]
