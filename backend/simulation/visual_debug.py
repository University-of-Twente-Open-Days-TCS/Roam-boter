from .objects import Object, ColorValues
import time
import math

import sys, os

# Importing simulation imported this module, which resulted in the imgaes being loaded. 
VISUAL_DEBUG = False

screen = None


if VISUAL_DEBUG:
    import pygame
    this_dir = os.path.dirname(os.path.realpath(__file__))
    image_dir = os.path.join(this_dir, "debug_images/")
    tank_body = pygame.image.load(image_dir+"tank_body.png")
    tank_turret = pygame.image.load(image_dir+"tank_turret.png")
    display = pygame.display.set_mode((1920, 1080))
    screen = pygame.Surface((610, 410))


def DRAW_WORLD(state):
    if not VISUAL_DEBUG:
        return

    screen.fill((255, 255, 255))

    for obj, x, y in state.level.iterate():
        color = next(key for key, value in ColorValues.items() if value == obj)
        pygame.draw.rect(screen, color, (x * 10, y * 10, 10, 10))

    for tank in state.tanks:
        if tank.path is None:
            continue

        for i, p in enumerate(tank.path.nodes):
            x, y = p
            x, y = x - 0.5, y - 0.5
            pygame.draw.rect(screen, (min(30 * i, 255), 0, 0,), (x * 10, y * 10, 10, 10))

    for tank in state.tanks:
        # pygame.Surface.blit(tank_body, screen, (int(tank.x * 10), int(tank.y * 10), 10, 10))
        # pygame.Surface.blit(tank_turret, screen, (int(tank.x * 10), int(tank.y * 10), 10, 10))
        rotated_tank = pygame.transform.rotate(tank_body, tank.get_rotation())
        rx, ry = rotated_tank.get_size()
        draw_x = tank.x * 10 - (rx / 2)
        draw_y = tank.y * 10 - (ry / 2)
        screen.blit(rotated_tank, (int(draw_x), int(draw_y)))

        rotated_turret = pygame.transform.rotate(tank_turret, tank.get_turret_rotation() + tank.get_rotation())
        rx, ry = rotated_turret.get_size()
        draw_x = tank.x * 10 - (rx / 2)
        draw_y = tank.y * 10 - (ry / 2)
        screen.blit(rotated_turret, (int(draw_x), int(draw_y)))

    for bullet in state.bullets:
        pygame.draw.rect(screen, (0, 0, 0), (int(bullet.x * 10) - 2, int(bullet.y * 10) - 2, 4, 4))

    for tank in state.tanks:
        pygame.draw.rect(screen, (100, 100, 100), (math.floor(tank.get_pos()[0]) * 10, math.floor(tank.get_pos()[1]) * 10, 10, 10))

    new_surf = pygame.transform.scale(screen, (1920, 1080))
    display.blit(new_surf, (0, 0))
    pygame.display.flip()
    # time.sleep(0.017)
