from PIL import Image
from .objects import Object, ColorValues
from .level import Level

import os


class LevelLoader:
    current_loaded_levels = dict()

    def __init__(self):
        pass

    # Search whether the level exists in cache or not.
    def load_level(self, path):
        if path in self.current_loaded_levels:
            return self.current_loaded_levels[path]
        else:
            level = LevelLoader.retrieve_from_disk(path)
            self.current_loaded_levels[path] = level
            return level

    @staticmethod
    def retrieve_from_disk(path):
        # Opening the file correlated with the level given.
        this_dir = os.path.dirname(os.path.realpath(__file__))
        level_file = os.path.join(this_dir, "levels/" + path + ".png")

        im = Image.open(level_file)
        width, height = im.size

        level = Level(path, [[LevelLoader.color_to_object(im.getpixel((x, y))) for x in range(width)] for y in range(height)])

        # Awkward loading of scout nodes since their blue value tells the order, thus should be determined here.
        scout_nodes = []
        for obj, x, y in level.iterate():
            if obj == Object.SCOUT_NODE:
                # Appending the scout node found on the current pixel, selecting blue to be the order.
                scout_nodes.append((x + 0.5, y + 0.5, im.getpixel((x, y))[2]))

        # Reorder scout nodes on the order according to blue value.
        indexed_scout_nodes = [None] * len(scout_nodes)
        for x, y, index in scout_nodes:
            indexed_scout_nodes[index] = (x, y)

        # Set the scout nodes on the level.
        level.set_scout_nodes(indexed_scout_nodes)

        return level

    @staticmethod
    def color_to_object(color_values):
        r, g, b = color_values
        if r == 100 and g == 100:
            return Object.SCOUT_NODE
        return ColorValues[color_values]






