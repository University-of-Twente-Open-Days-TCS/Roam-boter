# Generated from aiJson.g4 by ANTLR 4.7.2
# encoding: utf-8
from antlr4 import *
from io import StringIO
from typing.io import TextIO
import sys

def serializedATN():
    with StringIO() as buf:
        buf.write("\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\27")
        buf.write("p\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b")
        buf.write("\t\b\4\t\t\t\4\n\t\n\4\13\t\13\4\f\t\f\4\r\t\r\4\16\t")
        buf.write("\16\4\17\t\17\3\2\3\2\3\2\3\3\3\3\5\3$\n\3\3\4\3\4\3\4")
        buf.write("\3\4\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3")
        buf.write("\6\3\6\3\6\3\6\3\7\3\7\3\7\3\7\3\b\3\b\3\b\3\b\3\b\3\b")
        buf.write("\3\t\3\t\3\t\3\t\7\tH\n\t\f\t\16\tK\13\t\3\t\3\t\3\n\3")
        buf.write("\n\3\n\3\n\3\n\3\n\3\13\3\13\3\13\3\13\3\f\3\f\3\f\3\f")
        buf.write("\7\f]\n\f\f\f\16\f`\13\f\5\fb\n\f\3\f\3\f\3\r\3\r\3\r")
        buf.write("\3\r\3\16\3\16\3\17\3\17\3\17\3\17\3\17\2\2\20\2\4\6\b")
        buf.write("\n\f\16\20\22\24\26\30\32\34\2\3\3\2\n\13\2e\2\36\3\2")
        buf.write("\2\2\4#\3\2\2\2\6%\3\2\2\2\b+\3\2\2\2\n\65\3\2\2\2\f9")
        buf.write("\3\2\2\2\16=\3\2\2\2\20C\3\2\2\2\22N\3\2\2\2\24T\3\2\2")
        buf.write("\2\26X\3\2\2\2\30e\3\2\2\2\32i\3\2\2\2\34k\3\2\2\2\36")
        buf.write("\37\5\4\3\2\37 \7\2\2\3 \3\3\2\2\2!$\5\6\4\2\"$\5\16\b")
        buf.write("\2#!\3\2\2\2#\"\3\2\2\2$\5\3\2\2\2%&\7\23\2\2&\'\7\4\2")
        buf.write("\2\'(\7\22\2\2()\5\b\5\2)*\7\24\2\2*\7\3\2\2\2+,\7\23")
        buf.write("\2\2,-\5\34\17\2-.\7\21\2\2./\5\n\6\2/\60\7\21\2\2\60")
        buf.write("\61\5\f\7\2\61\62\7\21\2\2\62\63\5\24\13\2\63\64\7\24")
        buf.write("\2\2\64\t\3\2\2\2\65\66\7\5\2\2\66\67\7\22\2\2\678\5\4")
        buf.write("\3\28\13\3\2\2\29:\7\6\2\2:;\7\22\2\2;<\5\4\3\2<\r\3\2")
        buf.write("\2\2=>\7\23\2\2>?\7\7\2\2?@\7\22\2\2@A\5\20\t\2AB\7\24")
        buf.write("\2\2B\17\3\2\2\2CD\7\25\2\2DI\5\22\n\2EF\7\21\2\2FH\5")
        buf.write("\22\n\2GE\3\2\2\2HK\3\2\2\2IG\3\2\2\2IJ\3\2\2\2JL\3\2")
        buf.write("\2\2KI\3\2\2\2LM\7\26\2\2M\21\3\2\2\2NO\7\23\2\2OP\5\34")
        buf.write("\17\2PQ\7\21\2\2QR\5\24\13\2RS\7\24\2\2S\23\3\2\2\2TU")
        buf.write("\7\t\2\2UV\7\22\2\2VW\5\26\f\2W\25\3\2\2\2Xa\7\23\2\2")
        buf.write("Y^\5\30\r\2Z[\7\21\2\2[]\5\30\r\2\\Z\3\2\2\2]`\3\2\2\2")
        buf.write("^\\\3\2\2\2^_\3\2\2\2_b\3\2\2\2`^\3\2\2\2aY\3\2\2\2ab")
        buf.write("\3\2\2\2bc\3\2\2\2cd\7\24\2\2d\27\3\2\2\2ef\7\n\2\2fg")
        buf.write("\7\22\2\2gh\5\32\16\2h\31\3\2\2\2ij\t\2\2\2j\33\3\2\2")
        buf.write("\2kl\7\b\2\2lm\7\22\2\2mn\7\13\2\2n\35\3\2\2\2\6#I^a")
        return buf.getvalue()


class aiJsonParser ( Parser ):

    grammarFileName = "aiJson.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "<INVALID>", "<INVALID>", "<INVALID>", 
                     "<INVALID>", "<INVALID>", "<INVALID>", "<INVALID>", 
                     "<INVALID>", "<INVALID>", "<INVALID>", "<INVALID>", 
                     "<INVALID>", "<INVALID>", "'\"'", "','", "':'", "'{'", 
                     "'}'", "'['", "']'" ]

    symbolicNames = [ "<INVALID>", "ROOT", "CONDITION", "CHILDTRUE", "CHILDFALSE", 
                      "ACTIONBLOCK", "TYPE_ID", "ATTRIBUTES", "APHSTRING", 
                      "INTEGER", "STRING", "ALPHANUMERIC", "CHAR", "DIGIT", 
                      "APH", "COM", "SC", "LBR", "RBR", "LB", "RB", "WS" ]

    RULE_startrule = 0
    RULE_node = 1
    RULE_condition = 2
    RULE_conditiondata = 3
    RULE_childtrue = 4
    RULE_childfalse = 5
    RULE_actionblock = 6
    RULE_actionlist = 7
    RULE_action = 8
    RULE_attributes = 9
    RULE_attributevalues = 10
    RULE_attributevalue = 11
    RULE_value = 12
    RULE_type_id = 13

    ruleNames =  [ "startrule", "node", "condition", "conditiondata", "childtrue", 
                   "childfalse", "actionblock", "actionlist", "action", 
                   "attributes", "attributevalues", "attributevalue", "value", 
                   "type_id" ]

    EOF = Token.EOF
    ROOT=1
    CONDITION=2
    CHILDTRUE=3
    CHILDFALSE=4
    ACTIONBLOCK=5
    TYPE_ID=6
    ATTRIBUTES=7
    APHSTRING=8
    INTEGER=9
    STRING=10
    ALPHANUMERIC=11
    CHAR=12
    DIGIT=13
    APH=14
    COM=15
    SC=16
    LBR=17
    RBR=18
    LB=19
    RB=20
    WS=21

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.7.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None



    class StartruleContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def node(self):
            return self.getTypedRuleContext(aiJsonParser.NodeContext,0)


        def EOF(self):
            return self.getToken(aiJsonParser.EOF, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_startrule

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterStartrule" ):
                listener.enterStartrule(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitStartrule" ):
                listener.exitStartrule(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitStartrule" ):
                return visitor.visitStartrule(self)
            else:
                return visitor.visitChildren(self)




    def startrule(self):

        localctx = aiJsonParser.StartruleContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_startrule)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 28
            self.node()
            self.state = 29
            self.match(aiJsonParser.EOF)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class NodeContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def condition(self):
            return self.getTypedRuleContext(aiJsonParser.ConditionContext,0)


        def actionblock(self):
            return self.getTypedRuleContext(aiJsonParser.ActionblockContext,0)


        def getRuleIndex(self):
            return aiJsonParser.RULE_node

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterNode" ):
                listener.enterNode(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitNode" ):
                listener.exitNode(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitNode" ):
                return visitor.visitNode(self)
            else:
                return visitor.visitChildren(self)




    def node(self):

        localctx = aiJsonParser.NodeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_node)
        try:
            self.state = 33
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,0,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 31
                self.condition()
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 32
                self.actionblock()
                pass


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ConditionContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LBR(self):
            return self.getToken(aiJsonParser.LBR, 0)

        def CONDITION(self):
            return self.getToken(aiJsonParser.CONDITION, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def conditiondata(self):
            return self.getTypedRuleContext(aiJsonParser.ConditiondataContext,0)


        def RBR(self):
            return self.getToken(aiJsonParser.RBR, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_condition

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterCondition" ):
                listener.enterCondition(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitCondition" ):
                listener.exitCondition(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitCondition" ):
                return visitor.visitCondition(self)
            else:
                return visitor.visitChildren(self)




    def condition(self):

        localctx = aiJsonParser.ConditionContext(self, self._ctx, self.state)
        self.enterRule(localctx, 4, self.RULE_condition)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 35
            self.match(aiJsonParser.LBR)
            self.state = 36
            self.match(aiJsonParser.CONDITION)
            self.state = 37
            self.match(aiJsonParser.SC)
            self.state = 38
            self.conditiondata()
            self.state = 39
            self.match(aiJsonParser.RBR)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ConditiondataContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LBR(self):
            return self.getToken(aiJsonParser.LBR, 0)

        def type_id(self):
            return self.getTypedRuleContext(aiJsonParser.Type_idContext,0)


        def COM(self, i:int=None):
            if i is None:
                return self.getTokens(aiJsonParser.COM)
            else:
                return self.getToken(aiJsonParser.COM, i)

        def childtrue(self):
            return self.getTypedRuleContext(aiJsonParser.ChildtrueContext,0)


        def childfalse(self):
            return self.getTypedRuleContext(aiJsonParser.ChildfalseContext,0)


        def attributes(self):
            return self.getTypedRuleContext(aiJsonParser.AttributesContext,0)


        def RBR(self):
            return self.getToken(aiJsonParser.RBR, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_conditiondata

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterConditiondata" ):
                listener.enterConditiondata(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitConditiondata" ):
                listener.exitConditiondata(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitConditiondata" ):
                return visitor.visitConditiondata(self)
            else:
                return visitor.visitChildren(self)




    def conditiondata(self):

        localctx = aiJsonParser.ConditiondataContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_conditiondata)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 41
            self.match(aiJsonParser.LBR)
            self.state = 42
            self.type_id()
            self.state = 43
            self.match(aiJsonParser.COM)
            self.state = 44
            self.childtrue()
            self.state = 45
            self.match(aiJsonParser.COM)
            self.state = 46
            self.childfalse()
            self.state = 47
            self.match(aiJsonParser.COM)
            self.state = 48
            self.attributes()
            self.state = 49
            self.match(aiJsonParser.RBR)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ChildtrueContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CHILDTRUE(self):
            return self.getToken(aiJsonParser.CHILDTRUE, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def node(self):
            return self.getTypedRuleContext(aiJsonParser.NodeContext,0)


        def getRuleIndex(self):
            return aiJsonParser.RULE_childtrue

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterChildtrue" ):
                listener.enterChildtrue(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitChildtrue" ):
                listener.exitChildtrue(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitChildtrue" ):
                return visitor.visitChildtrue(self)
            else:
                return visitor.visitChildren(self)




    def childtrue(self):

        localctx = aiJsonParser.ChildtrueContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_childtrue)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 51
            self.match(aiJsonParser.CHILDTRUE)
            self.state = 52
            self.match(aiJsonParser.SC)
            self.state = 53
            self.node()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ChildfalseContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def CHILDFALSE(self):
            return self.getToken(aiJsonParser.CHILDFALSE, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def node(self):
            return self.getTypedRuleContext(aiJsonParser.NodeContext,0)


        def getRuleIndex(self):
            return aiJsonParser.RULE_childfalse

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterChildfalse" ):
                listener.enterChildfalse(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitChildfalse" ):
                listener.exitChildfalse(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitChildfalse" ):
                return visitor.visitChildfalse(self)
            else:
                return visitor.visitChildren(self)




    def childfalse(self):

        localctx = aiJsonParser.ChildfalseContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_childfalse)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 55
            self.match(aiJsonParser.CHILDFALSE)
            self.state = 56
            self.match(aiJsonParser.SC)
            self.state = 57
            self.node()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ActionblockContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LBR(self):
            return self.getToken(aiJsonParser.LBR, 0)

        def ACTIONBLOCK(self):
            return self.getToken(aiJsonParser.ACTIONBLOCK, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def actionlist(self):
            return self.getTypedRuleContext(aiJsonParser.ActionlistContext,0)


        def RBR(self):
            return self.getToken(aiJsonParser.RBR, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_actionblock

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterActionblock" ):
                listener.enterActionblock(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitActionblock" ):
                listener.exitActionblock(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitActionblock" ):
                return visitor.visitActionblock(self)
            else:
                return visitor.visitChildren(self)




    def actionblock(self):

        localctx = aiJsonParser.ActionblockContext(self, self._ctx, self.state)
        self.enterRule(localctx, 12, self.RULE_actionblock)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 59
            self.match(aiJsonParser.LBR)
            self.state = 60
            self.match(aiJsonParser.ACTIONBLOCK)
            self.state = 61
            self.match(aiJsonParser.SC)
            self.state = 62
            self.actionlist()
            self.state = 63
            self.match(aiJsonParser.RBR)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ActionlistContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LB(self):
            return self.getToken(aiJsonParser.LB, 0)

        def action(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(aiJsonParser.ActionContext)
            else:
                return self.getTypedRuleContext(aiJsonParser.ActionContext,i)


        def RB(self):
            return self.getToken(aiJsonParser.RB, 0)

        def COM(self, i:int=None):
            if i is None:
                return self.getTokens(aiJsonParser.COM)
            else:
                return self.getToken(aiJsonParser.COM, i)

        def getRuleIndex(self):
            return aiJsonParser.RULE_actionlist

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterActionlist" ):
                listener.enterActionlist(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitActionlist" ):
                listener.exitActionlist(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitActionlist" ):
                return visitor.visitActionlist(self)
            else:
                return visitor.visitChildren(self)




    def actionlist(self):

        localctx = aiJsonParser.ActionlistContext(self, self._ctx, self.state)
        self.enterRule(localctx, 14, self.RULE_actionlist)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 65
            self.match(aiJsonParser.LB)
            self.state = 66
            self.action()
            self.state = 71
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while _la==aiJsonParser.COM:
                self.state = 67
                self.match(aiJsonParser.COM)
                self.state = 68
                self.action()
                self.state = 73
                self._errHandler.sync(self)
                _la = self._input.LA(1)

            self.state = 74
            self.match(aiJsonParser.RB)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ActionContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LBR(self):
            return self.getToken(aiJsonParser.LBR, 0)

        def type_id(self):
            return self.getTypedRuleContext(aiJsonParser.Type_idContext,0)


        def COM(self):
            return self.getToken(aiJsonParser.COM, 0)

        def attributes(self):
            return self.getTypedRuleContext(aiJsonParser.AttributesContext,0)


        def RBR(self):
            return self.getToken(aiJsonParser.RBR, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_action

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAction" ):
                listener.enterAction(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAction" ):
                listener.exitAction(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitAction" ):
                return visitor.visitAction(self)
            else:
                return visitor.visitChildren(self)




    def action(self):

        localctx = aiJsonParser.ActionContext(self, self._ctx, self.state)
        self.enterRule(localctx, 16, self.RULE_action)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 76
            self.match(aiJsonParser.LBR)
            self.state = 77
            self.type_id()
            self.state = 78
            self.match(aiJsonParser.COM)
            self.state = 79
            self.attributes()
            self.state = 80
            self.match(aiJsonParser.RBR)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class AttributesContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def ATTRIBUTES(self):
            return self.getToken(aiJsonParser.ATTRIBUTES, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def attributevalues(self):
            return self.getTypedRuleContext(aiJsonParser.AttributevaluesContext,0)


        def getRuleIndex(self):
            return aiJsonParser.RULE_attributes

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAttributes" ):
                listener.enterAttributes(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAttributes" ):
                listener.exitAttributes(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitAttributes" ):
                return visitor.visitAttributes(self)
            else:
                return visitor.visitChildren(self)




    def attributes(self):

        localctx = aiJsonParser.AttributesContext(self, self._ctx, self.state)
        self.enterRule(localctx, 18, self.RULE_attributes)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 82
            self.match(aiJsonParser.ATTRIBUTES)
            self.state = 83
            self.match(aiJsonParser.SC)
            self.state = 84
            self.attributevalues()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class AttributevaluesContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def LBR(self):
            return self.getToken(aiJsonParser.LBR, 0)

        def RBR(self):
            return self.getToken(aiJsonParser.RBR, 0)

        def attributevalue(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(aiJsonParser.AttributevalueContext)
            else:
                return self.getTypedRuleContext(aiJsonParser.AttributevalueContext,i)


        def COM(self, i:int=None):
            if i is None:
                return self.getTokens(aiJsonParser.COM)
            else:
                return self.getToken(aiJsonParser.COM, i)

        def getRuleIndex(self):
            return aiJsonParser.RULE_attributevalues

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAttributevalues" ):
                listener.enterAttributevalues(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAttributevalues" ):
                listener.exitAttributevalues(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitAttributevalues" ):
                return visitor.visitAttributevalues(self)
            else:
                return visitor.visitChildren(self)




    def attributevalues(self):

        localctx = aiJsonParser.AttributevaluesContext(self, self._ctx, self.state)
        self.enterRule(localctx, 20, self.RULE_attributevalues)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 86
            self.match(aiJsonParser.LBR)
            self.state = 95
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==aiJsonParser.APHSTRING:
                self.state = 87
                self.attributevalue()
                self.state = 92
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                while _la==aiJsonParser.COM:
                    self.state = 88
                    self.match(aiJsonParser.COM)
                    self.state = 89
                    self.attributevalue()
                    self.state = 94
                    self._errHandler.sync(self)
                    _la = self._input.LA(1)



            self.state = 97
            self.match(aiJsonParser.RBR)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class AttributevalueContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def APHSTRING(self):
            return self.getToken(aiJsonParser.APHSTRING, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def value(self):
            return self.getTypedRuleContext(aiJsonParser.ValueContext,0)


        def getRuleIndex(self):
            return aiJsonParser.RULE_attributevalue

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterAttributevalue" ):
                listener.enterAttributevalue(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitAttributevalue" ):
                listener.exitAttributevalue(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitAttributevalue" ):
                return visitor.visitAttributevalue(self)
            else:
                return visitor.visitChildren(self)




    def attributevalue(self):

        localctx = aiJsonParser.AttributevalueContext(self, self._ctx, self.state)
        self.enterRule(localctx, 22, self.RULE_attributevalue)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 99
            self.match(aiJsonParser.APHSTRING)
            self.state = 100
            self.match(aiJsonParser.SC)
            self.state = 101
            self.value()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class ValueContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def APHSTRING(self):
            return self.getToken(aiJsonParser.APHSTRING, 0)

        def INTEGER(self):
            return self.getToken(aiJsonParser.INTEGER, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_value

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterValue" ):
                listener.enterValue(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitValue" ):
                listener.exitValue(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitValue" ):
                return visitor.visitValue(self)
            else:
                return visitor.visitChildren(self)




    def value(self):

        localctx = aiJsonParser.ValueContext(self, self._ctx, self.state)
        self.enterRule(localctx, 24, self.RULE_value)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 103
            _la = self._input.LA(1)
            if not(_la==aiJsonParser.APHSTRING or _la==aiJsonParser.INTEGER):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx

    class Type_idContext(ParserRuleContext):

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def TYPE_ID(self):
            return self.getToken(aiJsonParser.TYPE_ID, 0)

        def SC(self):
            return self.getToken(aiJsonParser.SC, 0)

        def INTEGER(self):
            return self.getToken(aiJsonParser.INTEGER, 0)

        def getRuleIndex(self):
            return aiJsonParser.RULE_type_id

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterType_id" ):
                listener.enterType_id(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitType_id" ):
                listener.exitType_id(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitType_id" ):
                return visitor.visitType_id(self)
            else:
                return visitor.visitChildren(self)




    def type_id(self):

        localctx = aiJsonParser.Type_idContext(self, self._ctx, self.state)
        self.enterRule(localctx, 26, self.RULE_type_id)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 105
            self.match(aiJsonParser.TYPE_ID)
            self.state = 106
            self.match(aiJsonParser.SC)
            self.state = 107
            self.match(aiJsonParser.INTEGER)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx





