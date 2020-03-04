from PIL import Image
from .objects import Object, ColorValues
from .level import Level


class LevelLoader:
    current_loaded_levels = dict()

    def __init__(self):
        pass

    def load_level(self, path):
        if path in self.current_loaded_levels:
            return self.current_loaded_levels[path]
        else:
            level = LevelLoader.retrieve_from_disk(path)
            self.current_loaded_levels[path] = level
            return level

    @staticmethod
    def retrieve_from_disk(path):
        im = Image.open(path)
        width, height = im.size

        # convert pixels to a 2d array of objects.
        return Level(path, [[ColorValues[im.getpixel((x, y))] for x in range(width)] for y in range(height)])





