#!/usr/bin/env python3
"""Script that prepares chaches for given level"""
import os, sys

currentdir = os.path.dirname(os.path.abspath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)

from simulation.simulation import prepare_caches

def main():
    for level in sys.argv[1:]:
        print("preparing cache for level: "+level)
        prepare_caches([level])


if __name__ == '__main__':
    main()
