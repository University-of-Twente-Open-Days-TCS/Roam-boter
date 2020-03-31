import math


def distance_squared(pos1: (float, float), pos2: (float, float)):
    x1, y1 = pos1
    x2, y2 = pos2

    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2)


class Path:

    def __init__(self, nodes):
        self.nodes = nodes

    def goal(self):
        return self.nodes[-1]

    # Get the next node in the path
    def next_node(self, pos):
        # Remove nodes that have been reached already based on distance between them and current pos

        while len(self.nodes) > 1 and distance_squared(pos, self.nodes[0]) < 0.5:
            del self.nodes[0]

        return self.nodes[0]

    def length(self, initial_position):
        if len(self.nodes) <= 0:
            return 0.0

        total = 0.0
        previous_pos = initial_position
        for i in range(0, len(self.nodes)):
            total += math.sqrt(distance_squared(previous_pos, self.nodes[i]))
            previous_pos = self.nodes[i]
        return total

