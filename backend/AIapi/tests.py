import sys

from django.test import TestCase

from simulation.AINode import AINode

from .converter import convert_aijson


# Create your tests here.
class ConverterTest(TestCase):
    """Converter Test. Tests whether AI Json can be converted.
    It also tests for exceptions, because invalid user input should not be evaluated"""

    TEST_CORRECT_JSON_PATH = "./AIapi/testjson/correct.json"
    TEST_INCORRECT_JSON_PATH = "./AIapi/testjson/incorrect.json"

    def setUp(self):

        correct_json_file = open(ConverterTest.TEST_CORRECT_JSON_PATH, "r")
        incorrect_json_file = open(ConverterTest.TEST_INCORRECT_JSON_PATH, "r")
        self.correct_json = correct_json_file.read()
        self.incorrect_json = incorrect_json_file.read()

    def test_correct_json(self):
        # Should not fail
        eval_tree = convert_aijson(self.correct_json)
        self.assertIsInstance(eval_tree, AINode)

    def test_incorrect_json(self):
        # Should throw an error
        with self.assertRaises(Exception):
            eval_tree = convert_aijson(self.incorrect_json)
            # Test that no tree has returned
            self.assertEquals(None, eval_tree)




