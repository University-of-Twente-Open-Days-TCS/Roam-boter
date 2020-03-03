# Generated from aiJson.g4 by ANTLR 4.7.2
from antlr4 import *
if __name__ is not None and "." in __name__:
    from .aiJsonParser import aiJsonParser
else:
    from aiJsonParser import aiJsonParser

# This class defines a complete generic visitor for a parse tree produced by aiJsonParser.

class aiJsonVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by aiJsonParser#startrule.
    def visitStartrule(self, ctx:aiJsonParser.StartruleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#ai.
    def visitAi(self, ctx:aiJsonParser.AiContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#info.
    def visitInfo(self, ctx:aiJsonParser.InfoContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#name.
    def visitName(self, ctx:aiJsonParser.NameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#creator_id.
    def visitCreator_id(self, ctx:aiJsonParser.Creator_idContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#root.
    def visitRoot(self, ctx:aiJsonParser.RootContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#node.
    def visitNode(self, ctx:aiJsonParser.NodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#condition.
    def visitCondition(self, ctx:aiJsonParser.ConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#conditiondata.
    def visitConditiondata(self, ctx:aiJsonParser.ConditiondataContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#childtrue.
    def visitChildtrue(self, ctx:aiJsonParser.ChildtrueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#childfalse.
    def visitChildfalse(self, ctx:aiJsonParser.ChildfalseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#actionblock.
    def visitActionblock(self, ctx:aiJsonParser.ActionblockContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#actionlist.
    def visitActionlist(self, ctx:aiJsonParser.ActionlistContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#action.
    def visitAction(self, ctx:aiJsonParser.ActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#attributes.
    def visitAttributes(self, ctx:aiJsonParser.AttributesContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#attributevalues.
    def visitAttributevalues(self, ctx:aiJsonParser.AttributevaluesContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#attributevalue.
    def visitAttributevalue(self, ctx:aiJsonParser.AttributevalueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#value.
    def visitValue(self, ctx:aiJsonParser.ValueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by aiJsonParser#type_id.
    def visitType_id(self, ctx:aiJsonParser.Type_idContext):
        return self.visitChildren(ctx)



del aiJsonParser