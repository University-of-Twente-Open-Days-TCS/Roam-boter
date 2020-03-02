import sys
from antlr4 import *

from grammar.aijson.aiJsonLexer import aiJsonLexer
from grammar.aijson.aiJsonParser import aiJsonParser

from AITreeConverter import AITreeConverter

def create_ai_evaluation_tree(parseTree):
    converter = AITreeConverter()
    walker = ParseTreeWalker()
    evalTree = walker.walk(converter, parseTree)
    return evalTree



def main(argv):
    input_stream = FileStream(argv[1])
    lexer = aiJsonLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = aiJsonParser(stream)
    tree = parser.startrule()

    #Test conversion
    eval_tree = create_ai_evaluation_tree(tree)


# DEBUGGING TODO: REMOVE IN PRODUCTION
if __name__ == "__main__":
    main(sys.argv)
