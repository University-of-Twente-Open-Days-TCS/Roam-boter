class Block:

    def id_list(self):
        """
        Should return the list of possible id's.
        """
        raise NotImplementedError("You should override this method")

    def attributes(self, type_id):
        """
        Should return the list of tuples containing the required attribute name and type.
        """
        raise NotImplementedError("You should override this method")

class Condition(Block):
    """
    Condition Block
    """
    ATTR_DICT = {
        0: [('distance', Int), ('object', Object)],
        2: [('object', Object)],
        3: [('object', Object)],
        4: [('object', Object)],
        5: [],
        6: [('label', Int)],
        7: [('amount', Int)],
    }


    def id_list(self):
        return range(1, 8)

    def attributes(self, type_id):
        return Condition.ATTR_DICT[type_id]

class Action(Block):
    """
    Action Block
    """
    ATTR_DICT = {
        0: [],
        1: [('object', Object)],
        2: [],
        3: [('object', Object)],
        4: [('object', Object)],
        5: [('object', Object)],
        6: [('dir', Dir)],
        7: [('deg', Int)],
        8: [],
        9: [],
        10: [('label', String)],
        11: [('label', String)],
        12: [('label', String)],
    }

    def id_list(self):
        return range(0, 13)

    def attributes(self, type_id):
        return Action.ATTR_DICT[type_id]

class Attribute:

    def valid(self, value):
        """
        Should return whether the given value is legitimate for the attribute.
        """
        raise NotImplementedError("You should override this method")

    def key(self):
        """
        Should return the attributes key string used in the json.
        """

class Object(Attribute):

    def valid(self, value):
        return (value in range(1,11))

class Dir(Attribute):

    def valid(self, value):
        return (value in range(1,9))

class Int(Attribute):

    def valid(self, value):
        return isinstance(value, int)

class String(Attribute):

    def valid(self, value):
        # Only alphabetic characters allowed.
        if not isinstance(value, String):
            return False
        if not value.isalpha():
            return False
        return True

