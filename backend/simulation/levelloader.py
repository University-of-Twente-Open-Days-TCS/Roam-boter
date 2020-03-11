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
        this_dir = os.path.dirname(os.path.realpath(__file__))
        level_file = os.path.join(this_dir, "levels/" + path + ".png")

        im = Image.open(level_file)
        width, height = im.size

        # convert pixels to a 2d array of objects.
        return Level(path, [[ColorValues[im.getpixel((x, y))] for x in range(width)] for y in range(height)])





