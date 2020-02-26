import pygame
from objects import Object, ColorValues

VISUAL_DEBUG = True

screen = None

tank_body = None
tank_turret = None

if VISUAL_DEBUG:
    screen = pygame.display.set_mode((480, 270))
    tank_body = pygame.image.load("debug_images/tank_body.png")
    tank_turret = pygame.image.load("debug_images/tank_turret.png")


def DRAW_WORLD(state):
    if not VISUAL_DEBUG:
        return

    screen.fill((255, 255, 255))

    for y, row in enumerate(state.level):
        for x, cell in enumerate(row):
            color = next(key for key, value in ColorValues.items() if value == cell)
            pygame.draw.rect(screen, color, (x * 10, y * 10, 10, 10))

    for tank in state.tanks:
        pygame.Surface.blit(tank_body, screen, (int(tank.x * 10), int(tank.y * 10), 10, 10))
        pygame.Surface.blit(tank_turret, screen, (int(tank.x * 10), int(tank.y * 10), 10, 10))

    for bullet in state.bullets:
        pygame.draw.rect(screen, (0, 0, 0), (int(bullet.x * 10), int(bullet.y * 10), 4, 4))

    pygame.display.flip()
