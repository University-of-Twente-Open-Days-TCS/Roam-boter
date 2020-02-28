class EvaluationTree:
    leaf = True

    actions = None
    condition = None

    def __init__(self, childs=None, condition=None):
        if childs is not None:
            self.leaf = False
            self.childs = childs
            self.condition = condition
        else:
            self.childs = [None, None]

    def evaluate(self, tank, state):
        if self.leaf:
            return self.actions

        else:
            if self.condition.evaluate(tank, state):
                return self.yes().evaluate(tank, state)
            else:
                return self.no().evaluate(tank, state)

    def set_yes_child(self, child):
        self.leaf = False
        self.childs[0] = child

    def set_no_child(self, child):
        self.leaf = False
        self.childs[1] = child

    def yes(self):
        return self.childs[0]

    def no(self):
        return self.childs[1]
