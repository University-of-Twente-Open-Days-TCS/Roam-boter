import pygame
from objects import Object, ColorValues

VISUAL_DEBUG = True

screen = None

if VISUAL_DEBUG:
    screen = pygame.display.set_mode((480, 270))


def DRAW_WORLD(state):
    if not VISUAL_DEBUG:
        return

    screen.fill((255, 255, 255))

    for y, row in enumerate(state.level):
        for x, cell in enumerate(row):
            color = next(key for key, value in ColorValues.items() if value == cell)
            pygame.draw.rect(screen, color, (x * 10, y * 10, 10, 10))

    for tank in state.tanks:
        pygame.draw.rect(screen, (128, 128, 128), (int(tank.x * 10), int(tank.y * 10), 10, 10))



    pygame.display.flip()
