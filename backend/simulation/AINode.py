from .actions import Action
from .conditions import Condition

from .objects import Object

class AINode(object):
    """Represents a node in the EvaluationTree"""

    def evaluate(self, tank, state):
        raise NotImplementedError()


class ActionNode(AINode):
    """Represents an action node in the AI evaluation tree"""

    def __init__(self, actions):
        self.actions = actions

    def evaluate(self, tank, state):
        return self.actions



class ConditionNode(AINode):
    """Represents a condition in the AI evaluation tree"""

    def __init__(self, condition, true_child, false_child):
        self.condition = condition
        self.true_child = true_child
        self.false_child = false_child

    def evaluate(self, tank, state):
        # Test the condition and evaluate correct child
        if self.condition.evaluate(tank, state):
            return self.true_child.evaluate(tank, state)

        return self.false_child.evaluate(tank, state)
