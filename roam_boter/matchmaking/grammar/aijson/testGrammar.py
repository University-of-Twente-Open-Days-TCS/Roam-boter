import sys
from antlr4 import *

from aiJsonLexer import aiJsonLexer
from aiJsonParser import aiJsonParser

def main(argv):
    input_stream = FileStream(argv[1])
    lexer = aiJsonLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = aiJsonParser(stream)
    tree = parser.startrule()
    author = tree.ai().info().name().APHSTRING();
    print(author)

if __name__ == '__main__':
    main(sys.argv)
