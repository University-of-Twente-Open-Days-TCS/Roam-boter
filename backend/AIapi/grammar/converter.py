import sys

from antlr4 import *
from antlr4.error.ErrorListener import ErrorListener

from .aijson.aiJsonLexer import aiJsonLexer
from .aijson.aiJsonParser import aiJsonParser


from simulation.actions import Action
from simulation.conditions import Condition
from simulation.AINode import ActionNode, ConditionNode


class EvaluationTreeConverter(ParseTreeVisitor):
    """ParseTreeVisitor that converts a parsed AI json to an AINode tree."""

    # Visit a parse tree produced by aiJsonParser#startrule.
    def visitStartrule(self, ctx:aiJsonParser.StartruleContext):
        return self.visitNode(ctx.node())

    # Visit a parse tree produced by aiJsonParser#node.
    def visitNode(self, ctx:aiJsonParser.NodeContext):
        if ctx.condition() is not None:
            return self.visitCondition(ctx.condition())
        else:
            return self.visitActionblock(ctx.actionblock())


    # Visit a parse tree produced by aiJsonParser#condition.
    def visitCondition(self, ctx:aiJsonParser.ConditionContext):
        return self.visitConditiondata(ctx.conditiondata())


    # Visit a parse tree produced by aiJsonParser#conditiondata.
    def visitConditiondata(self, ctx:aiJsonParser.ConditiondataContext):
        condition_id = self.visitType_id(ctx.type_id())
        condition_attributes = self.visitAttributes(ctx.attributes())
        condition = Condition(condition_id, condition_attributes)

        true_child = self.visitChildtrue(ctx.childtrue())
        false_child = self.visitChildfalse(ctx.childfalse())

        return ConditionNode(condition, true_child, false_child)



    # Visit a parse tree produced by aiJsonParser#childtrue.
    def visitChildtrue(self, ctx:aiJsonParser.ChildtrueContext):
        return self.visit(ctx.node())


    # Visit a parse tree produced by aiJsonParser#childfalse.
    def visitChildfalse(self, ctx:aiJsonParser.ChildfalseContext):
        return self.visit(ctx.node())


    # Visit a parse tree produced by aiJsonParser#actionblock.
    def visitActionblock(self, ctx:aiJsonParser.ActionblockContext):
        actions = self.visitActiondata(ctx.actiondata())
        return ActionNode(actions)

    # Visit a parse tree produced by aiJsonParser#actiondata.
    def visitActiondata(self, ctx:aiJsonParser.ActiondataContext):
        return self.visitActionlist(ctx.actionlist())

    # Visit a parse tree produced by aiJsonParser#actionlist.
    def visitActionlist(self, ctx:aiJsonParser.ActionlistContext):
        """Creates a list of actions"""
        action_list = []

        for action_ctx in ctx.action():
            action = self.visitAction(action_ctx)
            action_list.append(action)

        return action_list



    # Visit a parse tree produced by aiJsonParser#action.
    def visitAction(self, ctx:aiJsonParser.ActionContext):
        type_id = self.visitType_id(ctx.type_id())
        attributes = self.visitAttributes(ctx.attributes())
        action = Action(type_id, attributes)
        return action


    # Visit a parse tree produced by aiJsonParser#attributes.
    def visitAttributes(self, ctx:aiJsonParser.AttributesContext):
        return self.visitAttributevalues(ctx.attributevalues())


    # Visit a parse tree produced by aiJsonParser#attributevalues.
    def visitAttributevalues(self, ctx:aiJsonParser.AttributevaluesContext):
        attributes = {}
        for attributeValue in ctx.attributevalue():
            (key, value) = self.visitAttributevalue(attributeValue)
            attributes[key] = value
        return attributes


    # Visit a parse tree produced by aiJsonParser#attributevalue.
    def visitAttributevalue(self, ctx:aiJsonParser.AttributevalueContext):
        key = self.visitAphstring(ctx.APHSTRING())
        value = self.visitValue(ctx.value())
        return (key, value)



    # Visit a parse tree produced by aiJsonParser#value.
    def visitValue(self, ctx:aiJsonParser.ValueContext):
        """Return int if it is and integer and a string if it is a string"""
        if ctx.INTEGER() is not None:
            value = int(ctx.INTEGER().getText())
            return value
        else:
            value = self.visitAphstring(ctx.APHSTRING())
            return value


    # Visit a parse tree produced by aiJsonParser#type_id.
    def visitType_id(self, ctx:aiJsonParser.Type_idContext):
        type_id = int(ctx.INTEGER().getText())
        return type_id


    #Visit a APHSTRING
    def visitAphstring(self, aphstring):
        """Remove quotes from text"""
        string = aphstring.getText()
        return string.replace('"', '')

#====================================================================
class ConverterErrorListener(ErrorListener):
    """Error Listener. To prevent parser from continuing after errors."""

    def syntaxError(self, recognizer, offendingSymbol, line, solumn, msg, e):
        raise Exception(msg+" "+str(recognizer)+" offending: "+str(offendingSymbol)+" line: "+str(line))

    def reportAmbiguity(self, recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs):
        raise Exception("Ambiguity Error")

    def reportAttemptingFullContext(self, recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs):
        raise Exception("Attempting Full Context Error")

    def reportContextSensitivity(self, recognizer, dfa, startIndex, stopIndex, prediction, configs):
        raise Exception("Context Sensitivity Error")
#=====================================================================


def convert_aijson(json):
    """Converts a string of json to an AINode tree."""
    eval_tree = None

    input_stream = InputStream(json)
    lexer = aiJsonLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = aiJsonParser(stream)
    parser._listeners = [ConverterErrorListener()]

    # Try to parse the input
    root_node = parser.startrule()
    converter = EvaluationTreeConverter()
    eval_tree = converter.visit(root_node)


    return eval_tree

def is_valid_aijson(json):
    """Checks whether a given json string is valid"""
    input_stream = InputStream(json)
    lexer = aiJsonLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = aiJsonParser(stream)
    parser._listeners = [ConverterErrorListener()]

    try:
        root_node = parser.startrule()
        # no exception has occurred. 
        return True
    except Exception as e:
        return False


